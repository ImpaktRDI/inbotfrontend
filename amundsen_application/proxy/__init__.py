# Copyright Contributors to the Amundsen project.
# SPDX-License-Identifier: Apache-2.0

from threading import Lock
from flask import current_app as app
from .neo4j_proxy import Neo4jProxy

_neo4j_client = None
_neo4j_client_lock = Lock()


def get_neo4j_client():
    """
    Provides singleton proxy client based on the config
    :return: Proxy instance of any subclass of BaseProxy
    """
    global _neo4j_client

    if _neo4j_client:
        return _neo4j_client

    with _neo4j_client_lock:
        if _neo4j_client:
            return _neo4j_client
        else:
            _neo4j_client = Neo4jProxy(host=app.config['NEO4J_HOST'],
                                       port=app.config['NEO4J_PORT'],
                                       user=app.config['NEO4J_USER'],
                                       password=app.config['NEO4J_PASSWORD'],
                                       scheme=app.config['NEO4J_SCHEME'],
                                       encrypted=app.config['NEO4J_ENCRYPTED'],
                                       validate_ssl=app.config['NEO4J_VALIDATE_SSL'])

    return _neo4j_client
