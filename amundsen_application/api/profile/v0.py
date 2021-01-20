# Copyright Contributors to the Amundsen project.
# SPDX-License-Identifier: Apache-2.0

import logging
import json

from http import HTTPStatus

from typing import Any, Dict  # noqa: F401

from flask import Response, jsonify, make_response, request
from flask import current_app as app
from flask.blueprints import Blueprint

from amundsen_application.log.action_log import action_logging
from amundsen_application.api.utils.metadata_utils import marshall_dashboard_partial
from amundsen_application.api.utils.request_utils import get_query_param, request_search
from amundsen_application.api.utils.search_utils import generate_query_json, has_filters, \
    map_table_result, transform_filters, map_post_comment_result, map_person_result
from amundsen_application.models.user import load_user, dump_user

from neo4j import GraphDatabase

LOGGER = logging.getLogger(__name__)

REQUEST_SESSION_TIMEOUT_SEC = 3

profile_blueprint = Blueprint('profile', __name__, url_prefix='/api/profile/v0')


@profile_blueprint.route('/person_details', methods=['POST'])
def profile_person_details() -> Response:
    """
     Receives the id of a person in json format {"id":"XXXXXX"} and finds corresponding data from database
     :return: Profile info as a json 
    """
    if request.method == "POST":
        result = request.json
        profile_json = get_profile_by_id(result['id'])
        return profile_json
    else:
        #TODO change the error handling to route back to /Home
        return "ERROR"

@profile_blueprint.route('/influencerlist', methods=['POST'])
def influencer_list() -> Response:
    """
    """
    if request.method == "POST":
        result = request.json
        influencer_list_json = get_influencer_list(result['id'])
        return influencer_list_json
    else:
        #TODO change the error handling to route back to /Home
        return "ERROR"



def get_profile_by_id(id):
    """
    Gets an id and finds corresponding Person and their data from database
    :return: returns person and their data as json
    """
    graphdb = GraphDatabase.driver(uri='neo4j://localhost:7687', auth=("neo4j", "test"), database="neo4j")
    session = graphdb.session()
    result = session.run("""
        MATCH (person:Person)
        WHERE person.id = $person_id
        OPTIONAL MATCH (person)-[:OCCUPATION]->(job:Job)<-[:ROLE]-(company:LinkedinCompany)
        WHERE job.end_date IS NULL
        RETURN DISTINCT person.id AS id,
        person.full_name AS name,
        person.linkedin_url AS profile_url,
        person.headline AS headline,
        COLLECT(job.title) AS job_titles,
        COLLECT(company.name) AS company_names,
        COLLECT(company.linkedin_url) AS company_urls,
        person.description AS description,
        person.location AS location""",
        person_id=id)
    record = result.single()
    profile_data = jsonify(refine_profile_data(record))
    return profile_data

def refine_profile_data(record):
    """
    refines given database data into dictionary
    :return: dictionary
    """
    return {    
        "id": record["id"],
        "name": record["name"],
        "profile_url": record["profile_url"],
        "headline": record["headline"],
        "description": record["description"],
        "location": record["location"],
        "jobs": [{
            "title": record["job_titles"][i],
            "company_name": record["company_names"][i],
            "company_url": record["company_urls"][i]
        } for i in range(len(record["job_titles"]))]
    }

def refine_influencer_data(influencers):
    influencer_list = []
    for i in range(len(influencers)):
        if len(influencers[i][5])== 0:
            jobs = []
        else:
            jobs = [{
                'title': influencers[i][5][j],
                'company_name': influencers[i][6][j],
                'company_url': influencers[i][7][j]
                } for j in range(len(influencers[i][5]))]
        influencer_list.append({
            "id": influencers[i][0],
            "influence_score": influencers[i][1],
            "name": influencers[i][2],
            "profile_url": influencers[i][4],
            "headline": influencers[i][3],
            "jobs": jobs
        })

    return influencer_list
    
def get_influencer_list(id):
    graphdb = GraphDatabase.driver(uri='neo4j://localhost:7687', auth=("neo4j", "test"), database="neo4j")
    session = graphdb.session()
    result1 = session.run("""
        MATCH (person:Person{id: $person_id})
        OPTIONAL MATCH (person)-[:POSTED]->(:Post)<-[l:LIKED]-(liker:Person)
        WHERE NOT(liker.id=person.id) AND TOSTRING(liker.full_name) = liker.full_name
        WITH DISTINCT liker, COUNT(l) as liked_posts
        OPTIONAL MATCH (liker)-[:OCCUPATION]->(job:Job)<-[:ROLE]-(company:LinkedinCompany)
        RETURN DISTINCT liker.id AS id, liked_posts, liker.full_name AS name, liker.headline AS headline, liker.linkedin_url AS profile_url, COLLECT(job.title) AS job_title, COLLECT(company.name) AS company_name, COLLECT(company.linkedin_url) AS company_url
        ORDER BY liked_posts DESC
        LIMIT 20
        """, person_id=id)
    result2 = session.run("""
        MATCH (person:Person{id: $person_id})
        OPTIONAL MATCH (person)-[:POSTED]->(:Post)<-[c:COMMENTED_ON]-(commentor:Person)
        WHERE NOT(commentor.id=person.id) AND TOSTRING(commentor.full_name) = commentor.full_name
        WITH DISTINCT commentor, COUNT(c) as commented_posts
        OPTIONAL MATCH (commentor)-[:OCCUPATION]->(job:Job)<-[:ROLE]-(company:LinkedinCompany)
        RETURN DISTINCT commentor.id AS id, commented_posts, commentor.full_name AS name, commentor.headline AS headline, commentor.linkedin_url AS profile_url, COLLECT(job.title) AS job_title, COLLECT(company.name) AS company_name, COLLECT(company.linkedin_url) AS company_url
        ORDER BY commented_posts DESC
        LIMIT 20
        """, person_id=id)
    likes = result1.values()
    comments = result2.values()
    comments_list = [comments_multiply(item) for item in comments] #add comment factor to comment influence
    likes_list = [likes_multiply(item) for item in likes] #add likes factor to likes influence
    combined_list = combine(comments_list,likes_list) #combine likes and comments influences
    sort_results(combined_list) #sort list from highest influence number to lowest
    #return max 5 influencers
    if len(combined_list) < 5:
        return jsonify({"influencers":(refine_influencer_data(combined_list[0:len(combined_list)]))})
    else:
        return jsonify({"influencers":(refine_influencer_data(combined_list[0:5]))})

#Functions for influencer list 
def likes_multiply(a):
    likes_factor = 0.2
    a[1] *= likes_factor
    return a

def comments_multiply(a):
    comments_factor = 0.5
    a[1] *= comments_factor
    return a

def combine(a,b):
    a_len = len(a)
    b_len = len(b)
    for i in range(a_len):
        for j in range(b_len):
            if a[i][0] == b[j][0]:
                b[j][1] += a[i][1]
                break

            if j+1 == b_len:
                b.append(a[i])
    return b

def sort_results(sub_li): 
    sub_li.sort(key = lambda x: x[1], reverse=True) 
    return sub_li