# gmbh Load Test (Black Box)

This is a black-box load test that targets a running gmbh API. It creates data, spawns multiple waiter users, and sends concurrent orders. It does **not** assert anything; you manually verify results (e.g., print output).

## Requirements

- A reachable gmbh API (e.g. `https://<ip>` or `http://<ip>:8080`)
- Admin credentials

## Environment Variables

Required:
- `BASE_URL` (e.g. `http://192.168.1.10:8080`)
- `ADMIN_USER`
- `ADMIN_PASS`

Optional:
- `EVENT_ID` (use a specific event; otherwise the active one is used)
- `SEED` (`true`/`false`, default `true`)
- `WAITERS` (default `5`)
- `AREAS` (default `2`)
- `TABLES_PER_AREA` (default `8`)
- `UNITS` (default `6`)
- `CATEGORIES` (default `6`)
- `ITEMS` (default `25`)
- `ORDERS_PER_WAITER` (default `20`)
- `CONCURRENCY` (default `10`)
- `DURATION_SECONDS` (default `60`)
- `RATE_PER_SEC` (default `5`)
- `CUSTOM_TABLE_RATE` (default `0.2`) (probability of custom table name instead of tableId)
- `EXTRAS_RATE` (default `0.35`) (probability of extras per order item)

## Run with Node

```bash
npm --prefix loadtest install
BASE_URL=http://192.168.1.10:8080 \
ADMIN_USER=admin \
ADMIN_PASS=bierh0len! \
npm --prefix loadtest run start
```

## Run with Docker

Build:
```bash
docker build -t gmbh-loadtest ./loadtest
```

Run (same network, direct IP):
```bash
docker run --rm \
  -e BASE_URL=http://192.168.1.10:8080 \
  -e ADMIN_USER=admin \
  -e ADMIN_PASS=bierh0len! \
  gmbh-loadtest
```

If the API is on the Docker host (Linux):
```bash
docker run --rm --network host \
  -e BASE_URL=http://127.0.0.1:8080 \
  -e ADMIN_USER=admin \
  -e ADMIN_PASS=bierh0len! \
  gmbh-loadtest
```

If you need to reach `host.docker.internal` (macOS/Windows):
```bash
docker run --rm \
  -e BASE_URL=http://host.docker.internal:8080 \
  -e ADMIN_USER=admin \
  -e ADMIN_PASS=bierh0len! \
  gmbh-loadtest
```

## Run with Docker Compose (official image)

```bash
BASE_URL=http://192.168.1.10:8080 \
ADMIN_USER=admin \
ADMIN_PASS=bierh0len! \
docker compose -f loadtest/docker-compose.yml up --abort-on-container-exit
```

## Notes

- The script logs counts and error summaries only.
- It does not validate responses beyond HTTP status.
- If you want **pure load only** without seeding, set `SEED=false`.
