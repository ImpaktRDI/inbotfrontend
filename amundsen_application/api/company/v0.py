# Copyright Contributors to the Amundsen project.
# SPDX-License-Identifier: Apache-2.0

import logging

from typing import Any, Dict  # noqa: F401

from flask import Response, jsonify, request
from flask.blueprints import Blueprint

from neo4j import GraphDatabase

LOGGER = logging.getLogger(__name__)

REQUEST_SESSION_TIMEOUT_SEC = 3

company_blueprint = Blueprint('company', __name__, url_prefix='/api/company/v0')


@company_blueprint.route('/company_details', methods=['POST'])
def company_details() -> Response:
    """
     Receives the id of a company in json format {"id":"XXXXXX"} and finds corresponding data from database
     :return: Company info as a json.
    """
    if request.method == "POST":
        result = request.json
        company_json = get_company_by_id(result['id'])
        return company_json
    else:
        return "ERROR"  # TODO change the error handling to route back to /Home


""" @people_blueprint.route('/peoplelist', methods=['POST'])
def people_list() -> Response:
"""
"""
if request.method == "POST":
    result = request.json
    people_list_json = get_people_list(result['id'])
    return people_list_json
else:
    #TODO change the error handling to route back to /Home
    return "ERROR" """


def get_company_by_id(id):
    """
    Gets an id and finds corresponding Person and their data from database
    :return: returns person and their data as json
    """
    graphdb = GraphDatabase.driver(uri='neo4j://localhost:7687', auth=("neo4j", "test"), database="neo4j")
    session = graphdb.session()
    result = session.run(
        """
        MATCH (company:LinkedinCompany)
        WHERE company.id = $company_id
        RETURN company""",
        company_id=id)
    record = result.single()
    print(record)
    company_data = jsonify(refine_company_data(record[0]))
    print(company_data)
    return company_data


def refine_company_data(record):
    """
    refines given database data into dictionary
    :return: dictionary
    """
    return {
        "id": record["id"],
        "name": record["name"],
        "linkedin_url": record["linkedin_url"],
    }
