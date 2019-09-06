#!/bin/bash

# install docker-compose if required
if [ ! -x "$(command -v docker-compose)" ]; then
    echo "docker-compose is not installed. Installing..."
    apk add --no-cache py-pip
    pip install docker-compose
    echo "docker-compose installed"
fi

# Get root directory of project
CWD="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null && cd .. && pwd)"

# Create settings and env file if not existent
SETTINGS_FILE="${CWD}"/gcom_v2/settings/local.py
if [ ! -f "${SETTINGS_FILE}" ]; then
    echo "Creating settings file..."
    cp "${SETTINGS_FILE}".docker_example "${SETTINGS_FILE}"
    echo "Created "${SETTINGS_FILE}""
fi
ENV_FILE="${CWD}"/.env
if [ ! -f "${ENV_FILE}" ]; then
    echo "Creating env file..."
    cp "${ENV_FILE}".example "${ENV_FILE}"
    echo "Created "${ENV_FILE}""
fi

# Generate staticfiles/mediafiles directories
STATIC_FILES="${PWD}"/staticfiles
if [ ! -d "${STATIC_FILES}" ]; then
    echo "Creating static files directory..."
    mkdir "${STATIC_FILES}"
    echo ""${STATIC_FILES}" created"
fi
MEDIA_FILES="${PWD}"/mediafiles
if [ ! -d ""${MEDIA_FILES}"/images" ] || [ ! -d ""${MEDIA_FILES}"/objects" ]; then
    echo "Creating media files directory..."
    mkdir -p ""${MEDIA_FILES}"/images"
    mkdir -p ""${MEDIA_FILES}"/objects"
    echo ""${MEDIA_FILES}"/images created"
    echo ""${MEDIA_FILES}"/objects created"
fi
