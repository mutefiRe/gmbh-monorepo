COMPOSE_FILE?=docker-compose.yml

.PHONY: up up-d down logs
up:
	docker compose -f $(COMPOSE_FILE) up --build

up-d:
	docker compose -f $(COMPOSE_FILE) up -d

down:
	docker compose -f $(COMPOSE_FILE) down

logs:
	docker compose -f $(COMPOSE_FILE) logs --tail=50 -f
