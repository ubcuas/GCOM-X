# GCOM-X
`GCOM-X` is our central GCS and web based control UI.


## Connections
```
[Interop]----<http/s>----[GCOM-X]----<http/s>----[Smurfette]
                            |
                    <http/s><websocket>
                            |
                         [WebUI]
```


## Dependencies
- Docker
- Docker Compose


## Installation
Navigate into your local repository for GCOM-X in the command line and then run the following command to pull the image directly from DockerHub:
```
docker-compose pull
```

The images can also be built locally:

Navigate to frontend folder (`cd frontend`) and run:
```
npm install --legacy-peer-deps
```

In case of the webpack json command in the frontend Dockerfile not running, run the following commands and comment out the command in the frontend Dockerfile:
```
npm install webpack -g --legacy-peer-deps
npm install webpack-cli -g --legacy-peer-deps
webpack-cli --json > webpack-stats.json
```

Change back to the main folder (`cd ..`):
```
docker-compose build --parallel
```

**After installing:** Run the following commands to setup database migrations:
```
docker-compose run backend python manage.py migrate
docker-compose run interop-server bash -c "./healthcheck.py --postgres_host interop-db && ./manage.py migrate && ./config/load_test_data.py"
```

**Updating running containers**
Copying a new frontend build to backend's frontend serve folder
```
# Create build
cd frontend
npm run build

# Copy build to backend
docker cp ./build gcomx-backend:/uas/gcomx/api/frontend
```

## Usage
General usage is as follows:
```
docker-compose up
```

**Key URLS**
- Go to the frontend webpage: [http://127.0.0.1:8080/](http://127.0.0.1:8080/)
- Go to the admin webpage: [http://127.0.0.1:8080/admin/](http://127.0.0.1:8080/admin/)
- Go to the interop admin webpage: [http://127.0.0.1:8000/](http://127.0.0.1:8000/)


#### Testing
[Frontend] Run tests:
```
docker-compose run frontend npm test
```

[Frontend] Create a coverage report:
```
docker-compose run frontend npm run coverage
```

[Frontend] Go to `coverage/lcov-report/index.html` to view the coverage.

[Backend] Run tests:
```
docker-compose run backend coverage run --source='.' manage.py test
```

[Backend] Create a coverage report:
```
docker-compose run backend coverage html
```

[Backend] Go to `htmlcov/index.html` to view the coverage.

Adding new python packages:
```
echo <lib> >> requirements.txt
docker-compose build backend
```

Adding new JS (npm) packages
```
docker-compose run frontend npm install <lib>
```

## Django Accounts
To create a new admin user:
```
docker-compose run interop-server bash -c “./manage.py createsuperuser”
```

## Troubleshooting
----
`Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?` or similar.
> You need to run the `docker` commands as root. Use sudo: `sudo docker <command>`. Or add yourself to the docker group.

----
Various Errors
> Try doing `docker-compose down` to cleanup any created services. This will delete any changes and bring all the components down.
> You will need to do the "After Install" steps again.