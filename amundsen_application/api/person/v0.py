# Copyright Contributors to the Amundsen project.
# SPDX-License-Identifier: Apache-2.0

import logging
from flask import Response, jsonify, request, make_response
from flask.blueprints import Blueprint
from amundsen_application.proxy import get_neo4j_client

LOGGER = logging.getLogger(__name__)
person_blueprint = Blueprint('person', __name__, url_prefix='/api/person/v0')


@person_blueprint.route('/person', methods=['POST'])
def person() -> Response:
    """
    Receives the id of a person in json format {"id":"XXXXXX"} and finds corresponding data from database
    :return: Person info as a json
    """
    if request.method == "POST":
        result = request.json
        person_details = get_person_by_id(result['id'])
        influence = get_influence_scores(result['id'])
        return make_response(jsonify(person_details=person_details, influence=influence), 200)
    else:
        # TODO change the error handling to route back to /Home
        return "ERROR"


def get_person_by_id(person_id):
    """
    Gets an id and finds corresponding Person and their data from database
    :return: returns person and their data as json
    """
    client = get_neo4j_client()
    person_record = client.get_person_by_id(person_id)
    return refine_person_data(person_record)


def refine_person_data(record):
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


def get_influence(likes, comments):
    weighted_comments = [comments_multiply(item) for item in comments]  # add comment factor to comment influence
    weighted_likes = [likes_multiply(item) for item in likes]  # add likes factor to likes influence
    combined_influence = combine(weighted_comments, weighted_likes)  # combine likes and comments influences
    combined_influence_sorted = sort_results(combined_influence)  # sort list from highest influence number to lowest
    combined_influence_sorted.pop()  # Removes null data
    return refine_influencer_data(combined_influence_sorted[:5])


def get_influence_scores(person_id):
    client = get_neo4j_client()

    # 'Influences' data (people who's posts person has liked or commented)
    likers = client.get_person_likers(person_id)
    commentors = client.get_person_commentors(person_id)
    influences = get_influence(likers, commentors)

    # 'Influencer' data (people who have liked or commented on person's posts)
    likees = client.get_person_likees(person_id)
    commentees = client.get_person_commentees(person_id)
    influencers = get_influence(likees, commentees)

    # return max 5 influencers
    return {
        "influencers": influencers,
        "influences": influences
    }


# Functions for influencer list
def likes_multiply(a):
    likes_factor = 0.1
    a[1] *= likes_factor
    return a


def comments_multiply(a):
    comments_factor = 0.8
    a[1] *= comments_factor
    return a


def combine(a, b):
    a_len = len(a)
    b_len = len(b)
    for i in range(a_len):
        for j in range(b_len):
            if a[i][0] == b[j][0]:
                b[j][1] += a[i][1]
                break

            if j + 1 == b_len:
                b.append(a[i])
    return b


def sort_results(sub_li):
    sub_li.sort(key=lambda x: x[1], reverse=True)
    return sub_li
