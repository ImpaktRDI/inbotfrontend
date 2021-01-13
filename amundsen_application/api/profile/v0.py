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


@profile_blueprint.route('/person_details', methods=['GET'])
def profile_person_details() -> Response:
    """
    Parse the request arguments and call the helper method to execute a table search
    :return: a Response created with the results from the helper method
    """
    graphdb = GraphDatabase.driver(uri='neo4j://localhost:7687', auth=("neo4j", "test"), database="test")
    session = graphdb.session()
    result = session.run('MATCH (n {id:"8f65b345-fb66-4a2c-a52c-1cfaca2a9d56"})-[:OCCUPATION]-(m:Job)-[:ROLE]-(x:LinkedinCompany) RETURN n,m,x')
    record = result.values()
    refined_data = jsonify(refineData(record))
    return refined_data

def refineData(record):
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

