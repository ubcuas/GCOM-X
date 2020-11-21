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
docker-compose run backend python manage.py migrate
docker-compose run interop-server bash -c "./healthcheck.py --postgres_host interop-db && ./manage.py migrate && ./config/load_test_data.py"
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


## Troubleshooting
----
`Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?` or similar.
> You need to run the `docker` commands as root. Use sudo: `sudo docker <command>`. Or add yourself to the docker group.

----
Various Errors
> Try doing `docker-compose down` to cleanup any created services. This will delete any changes and bring all the components down.
> You will need to do the "After Install" steps again.

----
`Anything Else`
> Contact `Eric Mikulin`
