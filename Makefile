db-connect:
	docker compose exec mysql mysql -u gmbh -p gmbh

ifneq (,$(wildcard .env.dockerhub))
	include .env.dockerhub
	export
endif

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
	$(PRINTER_API_URL_ENV) docker compose -f docker-compose.yml up --build

up-d:
	$(PRINTER_API_URL_ENV) docker compose -f docker-compose.yml up -d --build

up-mac:
	$(PRINTER_API_URL_ENV) docker compose -f docker-compose.yml up --build api mysql admin waiter reverse-proxy fake-printer dozzle

up-mac-d:
	$(PRINTER_API_URL_ENV) docker compose -f docker-compose.yml up -d --build api mysql admin waiter reverse-proxy fake-printer dozzle

up-dev:
	$(PRINTER_API_URL_ENV) docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build api mysql reverse-proxy fake-printer printer-api dozzle

up-dev-d:
	$(PRINTER_API_URL_ENV) docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build api mysql reverse-proxy fake-printer printer-api dozzle

up-dev-mac:
	$(PRINTER_API_URL_ENV) docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build api mysql reverse-proxy fake-printer printer-api dozzle

up-dev-mac-d:
	$(PRINTER_API_URL_ENV) docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build api mysql reverse-proxy fake-printer printer-api dozzle

chaos-api:
	COMPOSE_FILE= COMPOSE_PROJECT_NAME=gmbh_chaos MYSQL_DATABASE=gmbh_chaos GMBH_DB_NAME=gmbh_chaos $(PRINTER_API_URL_ENV) docker compose -f docker-compose.yml -f docker-compose.chaos.yml up --build --abort-on-container-exit --exit-code-from chaos

certs:
	CERT_HOSTS="${CERT_HOSTS:-gmbh,gmbh.local,localhost}" CERT_IPS="${CERT_IPS:-127.0.0.1}" CERT_CN="${CERT_CN:-gmbh.local}" bash nginx/certs/scripts/generate_certs.sh

test-api:
	$(PRINTER_API_URL_ENV) GMBH_DB_TEST=gmbh_test GMBH_DB_HOST=localhost GMBH_DB_PORT=3306 npm --prefix api test

test-api-docker:
	COMPOSE_FILE= COMPOSE_PROJECT_NAME=gmbh_test MYSQL_DATABASE=gmbh_test GMBH_DB_NAME=gmbh_test GMBH_DB_TEST=gmbh_test $(PRINTER_API_URL_ENV) docker compose -f docker-compose.yml -f docker-compose.test.yml up --build --abort-on-container-exit --exit-code-from api

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

RELEASE_TAG ?= latest
RELEASE_REGISTRY ?= docker.io
RELEASE_REPO ?=mutefire
DOCKERHUB_USERNAME ?=
DOCKERHUB_TOKEN ?=
FORCE_LATEST ?=0
RELEASE_SERVICE ?=

.PHONY: release-login
release-login:
ifndef DOCKERHUB_USERNAME
	$(error DOCKERHUB_USERNAME must be set for release login)
endif
ifndef DOCKERHUB_TOKEN
	$(error DOCKERHUB_TOKEN must be set for release login)
endif
	@printf '%s\n' "$(DOCKERHUB_TOKEN)" | docker login "$(RELEASE_REGISTRY)" -u "$(DOCKERHUB_USERNAME)" --password-stdin

.PHONY: release-images
release-images:
	DOCKER_DEFAULT_PLATFORM=linux/amd64 DOCKER_REGISTRY=$(RELEASE_REGISTRY) DOCKER_REPO=$(RELEASE_REPO) FORCE_LATEST=$(FORCE_LATEST) RELEASE_SERVICE=$(RELEASE_SERVICE) node scripts/release-images.js --tag "$(RELEASE_TAG)"
