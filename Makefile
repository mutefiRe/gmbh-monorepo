db-connect:
	docker compose exec mysql mysql -u gmbh -p gmbh


ifeq ($(shell uname),Darwin)
PRINTER_API_URL_ENV=PRINTER_API_URL=http://host.docker.internal:8761
else
PRINTER_API_URL_ENV=
endif

compose:
	$(PRINTER_API_URL_ENV) docker compose up --build

composed:
	$(PRINTER_API_URL_ENV) docker compose up -d --build

up:
	$(PRINTER_API_URL_ENV) docker compose up --build

up-d:
	$(PRINTER_API_URL_ENV) docker compose up -d --build

up-mac:
	$(PRINTER_API_URL_ENV) docker compose up --build api mysql admin waiter reverse-proxy fake-printer dozzle

up-mac-d:
	$(PRINTER_API_URL_ENV) docker compose up -d --build api mysql admin waiter reverse-proxy fake-printer dozzle

up-prod:
	$(PRINTER_API_URL_ENV) docker compose -f docker-compose.prod.yml up -d --build

up-prod-mac:
	$(PRINTER_API_URL_ENV) docker compose -f docker-compose.prod.yml up -d --build

chaos-api:
	COMPOSE_PROJECT_NAME=gmbh_chaos docker compose -f docker-compose.chaos.yml up --build --abort-on-container-exit --exit-code-from chaos

certs:
	CERT_HOSTS="${CERT_HOSTS:-gmbh.local,localhost}" CERT_IPS="${CERT_IPS:-127.0.0.1}" CERT_CN="${CERT_CN:-gmbh.local}" bash nginx/certs/scripts/generate_certs.sh

test-api:
	$(PRINTER_API_URL_ENV) GMBH_DB_TEST=gmbh_test GMBH_DB_HOST=localhost GMBH_DB_PORT=3306 npm --prefix api test

test-api-docker:
	$(PRINTER_API_URL_ENV) COMPOSE_PROJECT_NAME=gmbh_test docker compose -f docker-compose.test.yml up --build --abort-on-container-exit --exit-code-from api

clean:
	@echo "This will remove Docker volumes (mysql_data, mysql_test_data) and destroy all database data and shut down the containers."
	@read -p "Are you sure? Type 'yes' to continue: " confirm; \
	if [ "$$confirm" = "yes" ]; then \
		docker compose down --remove-orphans -v; \
		echo "Docker volumes removed."; \
	else \
	  echo "Aborted."; \
	fi

stop:
	docker compose down --remove-orphans

stop-prod:
	docker compose -f docker-compose.prod.yml down --remove-orphans
