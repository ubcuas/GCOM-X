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
if [ ! -x "$(command -v python3.6)" ]; then
    echo "Python 3.6 is not installed. Installing..."
    apt install python3.6 -y
    echo "Python 3.6 installed"
fi
if [ ! -x "$(command -v pip3)" ]; then
    echo "Python3-pip is not installed. Installing..."
    apt install python3-pip -y
    echo "Python3-pip installed"
fi
if [ ! -x "$(command -v pipenv)" ]; then
    echo "Pipenv is not installed. Installing..."
    pip3 install pipenv
    echo "Pipenv installed"
fi
if [ ! -x "$(command -v npm)" ]; then
    echo "npm not installed. Installing..."
    apt install curl software-properties-common -y
    sudo -u "${USER}" curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
    apt install nodejs -y
    echo "Nodejs installed"
fi
if [ ! -x "$(command -v redis-server)" ]; then
    echo "Redis is not installed. Installing..."
    apt install redis -y
    echo "Redis installed"
fi

apt install python-dev libpq-dev postgresql postgresql-contrib -y

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
    sudo -u "${USER}" cp "${SETTINGS_FILE}".example "${SETTINGS_FILE}"
    echo "Created "${SETTINGS_FILE}""
fi
ENV_FILE="${CWD}"/.env
if [ ! -f "${ENV_FILE}" ]; then
    echo "Creating env file..."
    sudo -u "${USER}" cp "${ENV_FILE}".example "${ENV_FILE}"
    echo "Created "${ENV_FILE}""
fi

# Install dependences
echo "Checking Python dependencies..."
sudo -u "${USER}" pipenv install --dev --three
sudo -u "${USER}" pipenv install
echo "Checking JavaScript dependencies..."
sudo -u "${USER}" npm install

# Start postgres and check user/database
service postgresql start
"${CWD}"/tools/create_db.sh

# Make migrations if necessary
echo "Checking migrations..."
yes | sudo -u "${USER}" pipenv run python manage.py makemigrations
sudo -u "${USER}" pipenv run python manage.py migrate

# Load database with some data
echo "Loading database..."
echo "No fixtures to load"

# Create symlink for gcom-run use
GCOM_RUN_BIN=/usr/local/bin/gcom-run

echo "Creating symlink for gcom-run..."
if [ -h "${GCOM_RUN_BIN}" ]; then
    echo "Symlink already exists, replacing..."
    rm "${GCOM_RUN_BIN}"
fi

ln -s "${PWD}"/tools/gcom-run.sh "${GCOM_RUN_BIN}"
echo "Created symlink in "${GCOM_RUN_BIN}" for "${PWD}"/tools/gcom-run.sh"

# Generate staticfiles/mediafiles directories
STATIC_FILES="${PWD}"/staticfiles
if [ ! -d "${STATIC_FILES}" ]; then
    echo "Creating static files directory..."
    sudo -u "${USER}" mkdir "${STATIC_FILES}"
    echo ""${STATIC_FILES}" created"
fi
MEDIA_FILES="${PWD}"/mediafiles
if [ ! -d ""${MEDIA_FILES}"/images" ] || [ ! -d ""${MEDIA_FILES}"/objects" ]; then
    echo "Creating media files directory..."
    sudo -u "${USER}" mkdir -p ""${MEDIA_FILES}"/images"
    sudo -u "${USER}" mkdir -p ""${MEDIA_FILES}"/objects"
    echo ""${MEDIA_FILES}"/images created"
    echo ""${MEDIA_FILES}"/objects created"
fi
