#!/bin/bash

# Catch keyboard interrupt
trap bashtrap INT
bashtrap()
{
    echo "Keyboard interrupt detected. Aborting..."
    exit 1
}

# Make sure script is run as root
if [ "${EUID}" -ne 0 ]; then
    echo "Error: Please run with root."
    exit 1
fi

# Check programs are installed
if [ ! -x "$(command -v git)" ]; then
    echo "Git is not installed. Installing..."
    apt install git -y
    echo "Git installed"
fi
if [ ! -x "$(command -v docker-compose)" ]; then
    echo "docker-compose is not installed. Installing..."
    apt install docker-compose -y
    echo "docker-compose installed"
fi

# Get root directory of project
CWD="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null && cd .. && pwd)"

# Start setup
echo "Checking submodules..."
cd "${CWD}"
sudo -u "${USER}" git submodule update --init --recursive
echo "Submodules updated"

# Create settings and env file if not existent
SETTINGS_FILE="${CWD}"/gcom_v2/settings/local.py
if [ ! -f "${SETTINGS_FILE}" ]; then
    echo "Creating settings file..."
    sudo -u "${USER}" cp "${SETTINGS_FILE}".docker_example "${SETTINGS_FILE}"
    echo "Created "${SETTINGS_FILE}""
fi
ENV_FILE="${CWD}"/.env
if [ ! -f "${ENV_FILE}" ]; then
    echo "Creating env file..."
    sudo -u "${USER}" cp "${ENV_FILE}".example "${ENV_FILE}"
    echo "Created "${ENV_FILE}""
fi

# Generate staticfiles/mediafiles directories
STATIC_FILES="${PWD}"/staticfiles
if [ ! -d "${STATIC_FILES}" ]; then
    echo "Creating static files directory..."
    sudo -u "${USER}" mkdir "${STATIC_FILES}"
    echo ""${STATIC_FILES}" created"
fi
MEDIA_FILES="${PWD}"/mediafiles
if [ ! -d ""${MEDIA_FILES}"/images" ] || [ ! -d ""${MEDIA_FILES}"/objects" ] ||
    [ ! -d ""${MEDIA_FILES}"/tmp_images" ]; then
    echo "Creating media files directory..."
    sudo -u "${USER}" mkdir -p ""${MEDIA_FILES}"/images"
    sudo -u "${USER}" mkdir -p ""${MEDIA_FILES}"/objects"
    sudo -u "${USER}" mkdir -p ""${MEDIA_FILES}"/tmp_images"
    echo ""${MEDIA_FILES}"/images created"
    echo ""${MEDIA_FILES}"/objects created"
    echo ""${MEDIA_FILES}"/tmp_images created"
fi

# Create docker images
sudo -u "${USER}" docker-compose build --parallel

# Make migrations if necessary
echo "Checking migrations..."
sudo -u "${USER}" docker-compose run django python manage.py makemigrations
sudo -u "${USER}" docker-compose run django python manage.py migrate
