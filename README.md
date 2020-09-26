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
The images can be directly pulled from DockerHub:
```
docker-compose pull
```
The images can also be built locally:
```
docker-compose build --parallel
```
**After installing:** Run the following commands to setup database migrations:
```
docker-compose run django python manage.py migrate
docker-compose run interop_server bash -c "./healthcheck.py --postgres_host interop-db && ./manage.py migrate && ./config/load_test_data.py"
```

## Usage
General usage is as follows:
```
docker-compose up
```

**Key URLS**
- Go to the [frontend](http://127.0.0.1:8080/) webpage.
- Go to the [admin](http://127.0.0.1:8089/admin/) webpage.
- Go to the [interop admin](http://127.0.0.1:8000/) webpage.

#### Testing
[Frontend] Run tests:
```
docker-compose run npm npm test
```
[Frontend] Create a coverage report:
```
docker-compose run npm npm run coverage
```
[Frontend] Go to `coverage/lcov-report/index.html` to view the coverage.

[Backend] Run tests:
```
docker-compose run django coverage run --source='.' manage.py test
```
[Backend] Create a coverage report:
```
docker-compose run django coverage html
```
[Backend] Go to `htmlcov/index.html` to view the coverage.

Adding new python packages:
```
echo <lib> >> requirements.txt
docker-compose build django
```

Adding new JS (npm) packages
```
docker-compose run npm npm install <lib>
```

## Troubleshooting
Contact `Eric Mikulin`
