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


@profile_blueprint.route('/person_details', methods=['GET', 'POST'])
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
    profile_data = jsonify(refine_data(record))
    return profile_data

def refine_data(record):
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
