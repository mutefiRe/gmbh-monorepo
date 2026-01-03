# gmbh Load Test (Black Box)

This is a black-box load test that targets a running gmbh API. It uses the **current event** and existing waiter users to send concurrent orders for a fixed duration. It does **not** assert anything; you manually verify results (e.g., print output).

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
- `INSECURE_TLS` (set to `1` to ignore self-signed certs)
- `WAITERS` (default `5`)
- `WAITERS_PASSWORD` (default `gehmal25`, used to login the waiter users returned by `/api/users`)
- `WAITERS_LIST` (comma list of `username[:password]`; overrides `/api/users`)
- `MIN_ORDERS` (default `100`, keeps sending until reached)
- `CONCURRENCY` (default `10`)
- `DURATION_SECONDS` (default `30`)
- `RATE_PER_SEC` (default `5`)
- `PRINT_RATE` (default `0`, probability of triggering a print after each order)
- `CUSTOM_TABLE_RATE` (default `0.2`) (probability of custom table name instead of tableId)
- `EXTRAS_RATE` (default `0.35`) (probability of extras per order item)

## Run with Node

```bash
npm --prefix packages/loadtest install
BASE_URL=http://192.168.1.10:8080 \
ADMIN_USER=admin \
ADMIN_PASS=bierh0len! \
npm --prefix packages/loadtest run start
```

## Run with Docker

Build:
```bash
docker build -t gmbh-loadtest ./packages/loadtest
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

If you hit a self-signed certificate:
```bash
INSECURE_TLS=1 BASE_URL=https://192.168.1.10 \
ADMIN_USER=admin ADMIN_PASS=bierh0len! \
npm --prefix packages/loadtest run start
```

## Run with Docker Compose (official image)

```bash
BASE_URL=http://192.168.1.10:8080 \
ADMIN_USER=admin \
ADMIN_PASS=bierh0len! \
WAITERS_LIST=t1:geh1,t2:geh2,t3:geh3,t4:geh4,t5:geh5,t6:geh6,t7:geh7,t8:geh8 \
docker compose -f packages/loadtest/docker-compose.yml up --abort-on-container-exit
```

## Notes

- The script logs counts and error summaries only.
- It does not validate responses beyond HTTP status.
- `WAITERS_LIST` is useful when passwords are not the default.
