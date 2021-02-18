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
        company_data_json = get_company_data_by_id(result['id'])
        return company_data_json
    else:
        return "ERROR"  # TODO change the error handling to route back to /Home


def get_company_data_by_id(id):
    """
    Gets an id and finds corresponding Person and their data from database
    :return: returns person and their data as json
    """
    graphdb = GraphDatabase.driver(uri='neo4j://localhost:7687', auth=("neo4j", "test"), database="neo4j")
    # company session
    session_company = graphdb.session()
    result_company = session_company.run(
        """
        MATCH (company:LinkedinCompany)
        WHERE company.id = $company_id
        RETURN company""",
        company_id=id)
    record_company = result_company.single()
    # people session
    session_people = graphdb.session()
    result_people = session_people.run(
        """
        MATCH (company:LinkedinCompany {id:$company_id})-[:ROLE]->(job:Job)<-[:OCCUPATION]-(person:Person)
        RETURN person,job""",
        company_id=id)
    record_people = result_people.values()
    return jsonify({"company": refine_company_data(record_company[0]), "people": refine_people_data(record_people)})


def refine_company_data(record):
    return {
        "id": record["id"],
        "name": record["name"],
        "linkedin_url": record["linkedin_url"]
    }


def refine_people_data(record):
    return([{"name": record[i][0]["full_name"],
             "id": record[i][0]["id"],
             "linkedin_url": record[i][0]["linkedin_url"],
             "title": record[i][1]["title"]} for i in range(len(record))])
