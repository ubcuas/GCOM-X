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
if [ ! -x "$(command -v npm)" ]; then
    echo "npm is not installed. Installing..."
    pacman -S nodejs npm --noconfirm 
    echo "npm installed"
fi

if [ ! -x "$(command -v git)" ]; then
    echo "Git is not installed. Installing..."
    pacman -S git --noconfirm 
    echo "Git installed"
fi
if [ ! -x "$(command -v pyenv)" ]; then
    echo "Pyenv is not installed. Installing..."
    pacman -S pyenv --noconfirm
    echo "Pyenv installed"
fi
eval "$(pyenv init -)"
if [ ! -x "$(command -v python3.6)" ]; then
    echo "Python 3.6 is not installed. Installing..."
    pyenv install 3.6.6
    pyenv local 3.6.6
    eval "$(pyenv init -)" 
    echo "Python 3.6 installed"
fi
if [ ! -x "$(command -v pip3)" ]; then
    echo "Python3-pip is not installed. Installing..."
    pacman -S python-pip --noconfirm
    echo "Python3-pip installed"
fi
if [ ! -x "$(command -v python-pipenv)" ]; then
    echo "Pipenv is not installed. Installing..."
    pacman -S python-pipenv --noconfirm
    echo "Pipenv installed"
fi
if [ ! -x "$(command -v npm)" ]; then
    echo "npm not installed. Installing..."
    pacman -S curl software-properties-common --noconfirm
    sudo -u "${USER}" curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
    pacman -S nodejs --noconfirm
    echo "Nodejs installed"
fi
pacman -S python-dev --noconfirm
pacman -S libpq-dev --noconfirm
pacman -S postgresql --noconfirm
pacman -S postgresql-contrib --noconfirm

su - postgres -c "initdb --locale en_US.UTF-8 -D '/var/lib/postgres/data'"

# Get root directory of project
CWD="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null && cd .. && pwd)"
echo "Project directory is ${CWD}"

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
sudo -u "${USER}" pipenv install --python 3.6.6 --dev
sudo -u "${USER}" pipenv install
echo "Checking JavaScript dependencies..."
sudo -u "${USER}" npm install

# Start postgres and check user/database
systemctl start postgresql
sudo "${CWD}"/tools/create_db.sh

# Make migrations if necessary
echo "Checking migrations..."
yes | sudo -u "${USER}" pipenv --python 3.6.6 run python manage.py makemigrations
sudo -u "${USER}" pipenv --python 3.6.6 run python manage.py migrate

# Load database with some data
echo "Loading database..."
sudo -u "${USER}" pipenv --python 3.6.6 run python manage.py loaddata "${CWD}"/mavlink/fixtures/mavlinks.json

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
if [ ! -d "${MEDIA_FILES}" ]; then
    echo "Creating media files directory..."
    sudo -u "${USER}" mkdir -p ""${MEDIA_FILES}"/images"
    sudo -u "${USER}" mkdir -p ""${MEDIA_FILES}"/thumbnails"
    echo ""${MEDIA_FILES}"/images created"
    echo ""${MEDIA_FILES}"/thumbnails created"
fi
