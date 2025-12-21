db-connect:
	docker compose exec mysql mysql -u gmbh -p gmbh


define set-cups-server
  @if [ "$(shell uname)" = "Darwin" ]; then \
    export CUPS_SERVER=host.docker.internal:631; \
    export PRINTER_API_URL=http://host.docker.internal:8761; \
  else \
    export CUPS_SERVER=/var/run/cups/cups.sock; \
  fi; \
  
endef

compose:
	$(set-cups-server) docker compose up --build

composed:
	$(set-cups-server) docker compose up -d --build

up:
	$(set-cups-server) docker compose up --build

up-d:
	$(set-cups-server) docker compose up -d --build

up-mac:
	$(set-cups-server) docker compose up --build api mysql admin waiter reverse-proxy fake-printer dozzle

up-mac-d:
	$(set-cups-server) docker compose up -d --build api mysql admin waiter reverse-proxy fake-printer dozzle

up-prod:
	$(set-cups-server) docker compose -f docker-compose.prod.yml up -d --build

up-prod-mac:
	$(set-cups-server) docker compose -f docker-compose.prod.yml up -d --build

test-api:
	$(set-cups-server) GMBH_DB_TEST=gmbh_test GMBH_DB_HOST=localhost GMBH_DB_PORT=3306 npm --prefix api test

test-api-docker:
	$(set-cups-server) COMPOSE_PROJECT_NAME=gmbh_test docker compose -f docker-compose.test.yml up --build --abort-on-container-exit --exit-code-from api

clean:
	@echo "This will remove Docker volumes (mysql_data, mysql_test_data) and destroy all database data and shut down the containers."
	@read -p "Are you sure? Type 'yes' to continue: " confirm; \
	if [ "$$confirm" = "yes" ]; then \
		docker compose down --remove-orphans -v; \
		echo "Docker volumes removed."; \
	else \
	  echo "Aborted."; \
	fi
