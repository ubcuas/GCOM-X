## Util ##
list:
	@$(MAKE) -pRrq -f $(lastword $(MAKEFILE_LIST)) : 2>/dev/null | awk -v RS= -F: '/^# File/,/^# Finished Make data base/ {if ($$1 !~ "^[#.]") {print $$1}}' | sort | egrep -v -e '^[^[:alnum:]]' -e '^$@$$'

## Dependencies ##
deps:
	git submodule update --init --recursive
	docker-compose build --parallel
	docker-compose run django python manage.py migrate
	docker-compose run interop_server bash -c "./healthcheck.py --postgres_host interop-db && ./manage.py migrate && ./config/load_test_data.py"

## Build ##
build:
	docker-compose build --parallel

## Run ##
up:
	docker-compose up

## Cleanup ##
down:
	docker-compose down

## Test ##
test-fe:
	docker-compose run npm npm test

test-be:
	docker-compose run django coverage run --source='.' manage.py test

test: test-fe test-be
