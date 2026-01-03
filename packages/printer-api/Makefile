test:
	go test ./...

run:
	set -a; . ./.env; set +a; go run ./cmd/printer-api

docker-build:
	docker build -t mutefire/gmbh-v2-printer-api:latest .

run-docker:
	docker compose up --build

docker-push:
	docker push mutefire/gmbh-v2-printer-api:latest

generate:
	go generate ./...

.PHONY: test run docker-build run-docker docker-push generate
