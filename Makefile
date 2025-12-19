db-connect:
	docker compose exec mysql mysql -u gmbh -p gmbh


define set-cups-server
  @if [ "$(shell uname)" = "Darwin" ]; then \
    export CUPS_SERVER=host.docker.internal:631; \
  else \
    export CUPS_SERVER=/var/run/cups/cups.sock; \
  fi; \
  
endef

compose:
	$(set-cups-server) docker compose up --build

composed:
	$(set-cups-server) docker compose up -d --build