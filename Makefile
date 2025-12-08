db-connect:
	docker compose exec mysql mysql -u gmbh -p gmbh

compose:
	docker compose up -d --build