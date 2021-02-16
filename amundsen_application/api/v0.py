# Copyright Contributors to the Amundsen project.
# SPDX-License-Identifier: Apache-2.0

import logging

from http import HTTPStatus

from flask import Response, jsonify, make_response, session
from flask import current_app as app
from flask.blueprints import Blueprint

from amundsen_application.proxy.mysql_proxy import MySQLProxy
from amundsen_application.api.metadata.v0 import USER_ENDPOINT
from amundsen_application.api.utils.request_utils import request_metadata
from amundsen_application.models.user import load_user, dump_user
from inbot_common.models.user import User


LOGGER = logging.getLogger(__name__)

blueprint = Blueprint('main', __name__, url_prefix='/api')


@blueprint.route('/auth_user', methods=['GET'])
def current_user() -> Response:
    try:
        if app.config['AUTH_USER_METHOD']:
            session_user = app.config['AUTH_USER_METHOD'](app)
            login_type = session['login_type']
        else:
            raise Exception('AUTH_USER_METHOD is not configured')

        client = MySQLProxy(host=app.config['MYSQL_HOST'],
                            port=app.config['MYSQL_PORT'],
                            database=app.config['MYSQL_DATABASE'],
                            user=app.config['MYSQL_USER'],
                            password=app.config['MYSQL_PASSWORD'],
                            ssl_ca=app.config['MYSQL_SSL_CA'])

        mysql_user = client.get_user_by_email(email=session_user.email)
        mysql_user = mysql_user or load_user({"email": session_user.email})
        new_mysql_user = update_mysql_user(client, mysql_user, session_user)

        payload = {
            'msg': 'Success',
            'user': dump_user(new_mysql_user)
        }
        return make_response(jsonify(payload), HTTPStatus.OK)
    except Exception as e:
        message = 'Encountered exception: ' + str(e)
        logging.exception(message)
        payload = jsonify({'msg': message})
        return make_response(payload, HTTPStatus.INTERNAL_SERVER_ERROR)

def update_mysql_user(client: MySQLProxy, mysql_user: User, session_user: User):
    updated_mysql_user = update_mysql_user_obj(mysql_user, session_user)
    if mysql_user != updated_mysql_user:
        client.insert_or_update_ms_user(user=updated_mysql_user)
    return updated_mysql_user

def update_mysql_user_obj(mysql_user: User, session_user: User):
    new_user_dict = dump_user(mysql_user)
    for key, val in dump_user(session_user).items():
        if val is not None:
            new_user_dict[key] = val
    return load_user(new_user_dict)
