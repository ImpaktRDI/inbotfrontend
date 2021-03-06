FROM node:12-slim as node-stage
WORKDIR /app/amundsen_application/static

COPY amundsen_application/static/package.json /app/amundsen_application/static/package.json
COPY amundsen_application/static/package-lock.json /app/amundsen_application/static/package-lock.json
RUN npm install

COPY amundsen_application/static /app/amundsen_application/static
RUN npm run build

FROM python:3.7-slim as base
WORKDIR /app
RUN pip3 install gunicorn

COPY requirements.txt /app/requirements.txt
RUN pip3 install -r requirements.txt

COPY --from=node-stage /app /app
COPY . /app
RUN python3 setup.py install

CMD [ "python3",  "amundsen_application/wsgi.py" ]

FROM base as oidc-release

ENV FRONTEND_SVC_CONFIG_MODULE_CLASS amundsen_application.oidc_config.OidcConfig
ENV APP_WRAPPER inbotauth
ENV APP_WRAPPER_CLASS FlaskOIDC

# You will need to set these environment variables in order to use the oidc image
# OIDC_CLIENT_SECRETS - a path to a client_secrets.json file
# You will also need to mount a volume for the clients_secrets.json file.

FROM base as release
