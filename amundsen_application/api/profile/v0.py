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
     :return: Profile info as a json {"Job1":{"Title":"XXXXX", "Company":"YYYYY"}, "Job2":{"Title":"XXXXX", "Company":"YYYYY"}, ...,"Name":"Full Name"}
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
    Gets an id and finds corresponding Person and their occupations and LinkedinCompanies
    :return: returns person and their occupations and LinkedinCompany as json
    """
    graphdb = GraphDatabase.driver(uri='neo4j://localhost:7687', auth=("neo4j", "test"), database="test")
    session = graphdb.session()
    #The query shows now all Companies person ever worked. Can be reduced to current by adding WHERE end_date = NaN ?
    result = session.run('MATCH (n:Person { id: $person_id })-[:OCCUPATION]-(m:Job)-[:ROLE]-(x:LinkedinCompany) RETURN n,m,x', person_id=id)
    record = result.values()
    profile_data = jsonify(refine_data(record))
    return profile_data

def refine_data(record):
    """
    Gets a record of a Person profile and refines it into a simplified dictionary.
    Collecting only 'full_name', 'company_name' and 'job_title' (for now)
    TODO Refine data already in the neo4j query
    :return: refined data {Name, Job1, Job2,...}
    """
    refined_dict = {}
    profile_name = record[0][0].get("full_name")
    refined_dict["Name"] = profile_name
    for i in range(len(record)):
        job_title = record[i][1].get("title")
        company_name = record[i][2].get("name")
        temp_dict = {}
        temp_dict["Title"] = job_title
        temp_dict["Company"] = company_name
        job = "Job" + str(i+1)
        refined_dict[job] = temp_dict
    return refined_dict

