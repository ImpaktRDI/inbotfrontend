# Copyright Contributors to the Amundsen project.
# SPDX-License-Identifier: Apache-2.0

import logging
import textwrap
import time
from random import randint
from typing import (Any, Dict, List, Optional, Tuple, Union,  # noqa: F401
                    no_type_check)
import neo4j
from neo4j import GraphDatabase  # noqa: F401
from neo4j.exceptions import ServiceUnavailable
from amundsen_application.queries.cql import (person_details_query, person_likers_query,
                                              person_commentors_query, person_likees_query,
                                              person_commentees_query)

LOGGER = logging.getLogger(__name__)


class Neo4jProxy:
    """
    A proxy to Neo4j (Gateway to Neo4j)
    """

    def __init__(self, *,
                 host: str,
                 port: int,
                 user: str = 'neo4j',
                 password: str = '',
                 scheme: str = 'neo4j',
                 num_conns: int = 50,
                 max_connection_lifetime_sec: int = 100,
                 encrypted: bool = False,
                 validate_ssl: bool = False) -> None:
        """
        There's currently no request timeout from client side where server
        side can be enforced via "dbms.transaction.timeout"
        By default, it will set max number of connections to 50 and connection time out to 10 seconds.
        :param endpoint: neo4j endpoint
        :param num_conns: number of connections
        :param max_connection_lifetime_sec: max life time the connection can have when it comes to reuse. In other
        words, connection life time longer than this value won't be reused and closed on garbage collection. This
        value needs to be smaller than surrounding network environment's timeout.
        """
        endpoint = f'{scheme}://{host}:{port}'
        LOGGER.info('NEO4J endpoint: {}'.format(endpoint))
        trust = neo4j.TRUST_SYSTEM_CA_SIGNED_CERTIFICATES if validate_ssl else neo4j.TRUST_ALL_CERTIFICATES
        self._driver = GraphDatabase.driver(endpoint, max_connection_pool_size=num_conns,
                                            connection_timeout=10,
                                            max_connection_lifetime=max_connection_lifetime_sec,
                                            auth=(user, password),
                                            encrypted=encrypted,
                                            trust=trust)

    def close(self):
        # Don't forget to close the driver connection when you are finished with it
        self._driver.close()

    @staticmethod
    def _run_query(session, query, **kwargs):
        result = session.run(query, **kwargs)
        try:
            return result
        # Capture any errors along with the query and data for traceability
        except ServiceUnavailable as exception:
            LOGGER.error("{query} raised an error: \n {exception}".format(
                query=query, exception=exception))
            raise

    def is_healthy(self) -> None:
        # throws if cluster unhealthy or can't connect.  An alternative would be to use one of
        # the HTTP status endpoints, which might be more specific, but don't implicitly test
        # our configuration.
        with self._driver.session() as session:
            session.read_transaction(self._execute_cypher_query,
                                     statement='CALL dbms.cluster.overview()', param_dict={})

    def get_person_by_id(self, person_id: str):
        with self._driver.session() as session:
            result = self._run_query(session, person_details_query, person_id=person_id)
            return result.single()

    def get_person_likees(self, person_id: str):
        with self._driver.session() as session:
            result = self._run_query(session, person_likees_query, person_id=person_id)
            return result.values()

    def get_person_commentees(self, person_id: str):
        with self._driver.session() as session:
            result = self._run_query(session, person_commentees_query, person_id=person_id)
            return result.values()

    def get_person_likers(self, person_id: str):
        with self._driver.session() as session:
            result = self._run_query(session, person_likers_query, person_id=person_id)
            return result.values()

    def get_person_commentors(self, person_id: str):
        with self._driver.session() as session:
            result = self._run_query(session, person_commentors_query, person_id=person_id)
            return result.values()
