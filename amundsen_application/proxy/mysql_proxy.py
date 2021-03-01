# Copyright Contributors to the Amundsen project.
# SPDX-License-Identifier: Apache-2.0

import pymysql

from inbot_common.models.user import User
from amundsen_application.models.user import load_user
from amundsen_application.queries.sql import insert_or_update_ms_user_query, get_user_by_email_query


class MySQLProxy:
    """
    A proxy to Neo4j (Gateway to Neo4j)
    """

    def __init__(self, *,
                 host: str,
                 user: str,
                 password: str,
                 port: int = 3306,
                 database: str = 'brain',
                 **kwargs) -> None:
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
        self._connection = pymysql.connect(host=host,
                                           port=port,
                                           user=user,
                                           password=password,
                                           database=database,
                                           cursorclass=pymysql.cursors.DictCursor,
                                           **kwargs)
        self._cursor = self._connection.cursor()

    def insert_or_update_ms_user(self, *, user: User) -> None:
        """
        :param user: User object
        :return:  A Table object
        """
        with self._connection.cursor() as cursor:
            cursor.execute(insert_or_update_ms_user_query, (
                user.email, user.first_name, user.last_name, user.full_name, user.tenant_id))
        self._connection.commit()

    def get_user_by_email(self, *, email: str) -> User:
        with self._connection.cursor() as cursor:
            cursor.execute(get_user_by_email_query, email)
            user_data = cursor.fetchone()
            return load_user(user_data) if user_data else None
