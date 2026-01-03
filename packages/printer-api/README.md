# Printer API

Disclaimer: This project is based on the original idea of g.m.b.h. and its original source code, enhanced and extended with AI.

Stateless discovery + print + status API for ESC/POS printers. Design goal: run without CUPS for POS thermal printers.

## API docs

- OpenAPI spec: `packages/printer-api/api/spec/openapi.yaml`
- Generated server/types: `packages/printer-api/api/gen/openapi.gen.go`
- Swagger UI: `http://localhost:8761/docs`
- Raw spec: `http://localhost:8761/openapi.yaml`
- Metrics (Prometheus text): `http://localhost:8761/metrics`

Printer IDs:
- `id` is now the stable ID (derived from MAC or USB serial when possible).
- `stableId` is also included for clarity; it matches `id` when available.

Host filter for discovery (last octet list/ranges):

```
GET /v1/printers/discover?hosts=1,5,10,10-120
```

## Observability

- Logging: `internal/qlog` (zap-backed JSON logger)

To regenerate the code from the OpenAPI spec:

```sh
make generate
```

To run tests:

```sh
make test
```

To build and push the Docker image:

```sh
make docker-build
make docker-push
```

## Run locally

```sh
make run
```

Local defaults live in `.env`.

Print throttling:
- `PRINT_THROTTLE_MS` adds a minimum delay between jobs per printer (0 to disable).

Print queue:
- In-memory per-printer queue with retry (200ms, 500ms, 1s).
- `PRINT_QUEUE_SIZE` sets max jobs per printer (default 100).
- Queue status: `GET /v1/printers/{id}/queue`.
- `EXTRA_PRINTER_HOSTS` adds comma-separated hostnames/IPs (optionally `host:port`) to check alongside subnet scanning.
- `DISCOVERY_REFRESH_MS` refreshes discovery cache on an interval (default 300000ms).

## Docker

Build and run:

```sh
docker build -t mutefire/gmbh-v2-printer-api:latest .
docker run -p 8761:8761 mutefire/gmbh-v2-printer-api:latest
```

Or with Makefile helpers:

```sh
make docker-build
make run-docker
```

Or use docker compose:

```sh
docker compose up --build
```

Compose uses `.env` for defaults; the USB profile only overrides `ENABLE_USB`.

USB discovery/printing on Linux:

```sh
docker compose --profile usb up --build
```

Note: The USB profile runs with `privileged: true` and `/dev/bus/usb` mounted.

macOS USB discovery/printing uses libusb via gousb and should work on the host (not in Docker Desktop). You may need to install libusb (e.g., `brew install libusb`).
If macOS claims the printer, detach it temporarily:
- System Settings > Printers & Scanners: remove the printer queue for the device
- Unplug and replug the USB cable
- If it is still claimed, stop CUPS temporarily:
  - `sudo launchctl bootout system /System/Library/LaunchDaemons/org.cups.cupsd.plist`
  - restart later with `sudo launchctl bootstrap system /System/Library/LaunchDaemons/org.cups.cupsd.plist`

## CI/CD

GitHub Actions:
- runs tests on every push/PR
- builds and pushes `mutefire/gmbh-v2-printer-api` on `main`

Required repository secrets:
- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`
