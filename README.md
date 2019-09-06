[![License: MIT](https://img.shields.io/github/license/vintasoftware/django-react-boilerplate.svg)](LICENSE.txt)

# UBC UAS GCOM-X

## About
This project is UBC UAS' GCOM web application.

See the full documentation on UAS confluence [here](http://confluence.ubcuas.com/display/GCOM/Software+Systems+Documentation+2019) (Note: You have to be using ubcsecure or the UBC VPN in order to access.)

## Setup
**Using docker container environment:**
- Using the script

```shell
    $ sudo ./tools/setup_docker.sh
```

## Running - docker
**Start the server using docker-compose**

```shell
    $ sudo docker-compose up
```

**Key URLS**

- Go to the [frontend](http://127.0.0.1:8080/) webpage.
- Go to the [nginx frontend](http://127.0.0.1:8089/) webpage.
- Go to the [admin](http://127.0.0.1:8089/admin/) webpage.
- Go to the [interop](http://127.0.0.1:8000/) webpage.
- More details on [confluence](http://confluence.ubcuas.com/display/GCOM/Software+Systems+Documentation+2019)


## Testing
### Frontend
- Run tests for the whole project:
    - `sudo docker-compose run npm npm test`
- or a single component:
    - `sudo docker-compose run npm npm run test -t <Component>`
- Create a coverage report:
    - `sudo docker-compose run npm npm run coverage`
- Go to `coverage/lcov-report/index.html` to view the coverage

### Backend
- Run tests for the whole backend:
    - `sudo docker-compose run django coverage run --source='.' manage.py test`
- or testing app only (or folder)
    - `sudo docker-compose run django coverage run manage.py test <app-name>`
- To read the coverage report from terminal see:
    - `sudo docker-compose run django coverage report`
- Or to get a full coverage review:
    - `sudo docker-compose run django coverage html`
- Then go to `htmlcov/` and open `index.html`, select the file to see the code coverage by lines.

## Adding new pypi libs
```shell
    $ echo <lib> >> requirements.txt
    $ sudo docker-compose build --parallel
  ```
