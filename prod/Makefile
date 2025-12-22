COMPOSE_FILE?=docker-compose.yml

.PHONY: up up-d down logs certs
up:
	docker compose -f $(COMPOSE_FILE) up --build

up-d:
	docker compose -f $(COMPOSE_FILE) up -d

down:
	docker compose -f $(COMPOSE_FILE) down

logs:
	docker compose -f $(COMPOSE_FILE) logs --tail=50 -f

certs:
	CERT_HOSTS="${CERT_HOSTS:-gmbh,gmbh.local,localhost}" CERT_IPS="${CERT_IPS:-127.0.0.1}" CERT_CN="${CERT_CN:-gmbh.local}" bash nginx/certs/scripts/generate_certs.sh
