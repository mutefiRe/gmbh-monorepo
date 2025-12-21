# g.m.b.h. v2

Disclaimer: This project is based on the original idea of g.m.b.h. and its original source code, enhanced and extended with AI.

## Overview
A local-network, web-based order system for small events and venues. The stack is split into:
- API (Node/Express + MySQL)
- Admin UI (React)
- Waiter UI (React, PWA)
- Printer API (Go, ESC/POS)
- Fake printer (ESC/POS simulator)
- Nginx + CUPS configs

## Subprojects
- API: `api/README.md`
- Admin UI: `admin/README.md`
- Waiter UI: `waiter/README.md`
- Printer API: `printer-api/README.md`
- Fake printer: `fake-printer/README.md`
- Nginx config: `nginx/README.md`
- CUPS config: `cups/README.md`

## Quickstart (Docker)
Use the Makefile to start the local stack.

- Full stack (api + mysql + nginx + printer-api + fake-printer + dozzle)
  - `make up`
- Mac-friendly stack (api + mysql + nginx + fake-printer + dozzle)
  - `make up-mac`
  - Note: `make up-mac` points the API to `http://host.docker.internal:8761` for the printer API.

Stop containers:
- `docker compose down`

Reset data volumes (destructive):
- `make clean`

## Certificate & PWA (Android/iOS)
For fullscreen PWA mode, install the local HTTPS certificate once.

1) Download the certificate (local Wi‑Fi):
   - `http://gmbh.local/cert-install`
2) Android (Chrome):
   - Open `myCA.pem` → install as CA certificate
   - Settings → Security → Install certificate (path varies by device)
3) iOS/iPadOS (Safari):
   - Install profile: Settings → Profile Downloaded → Install
   - Enable trust: Settings → General → About → Certificate Trust Settings
4) Install the PWA:
   - Android: Chrome → Add to Home screen
   - iOS: Share → Add to Home Screen

Note: The app works without internet, but server and devices must be on the same Wi‑Fi.

## Local dev (without Docker)
Run each service in its folder:
- API: `npm --prefix api install` then `npm --prefix api run dev`
- Admin: `npm --prefix admin install` then `npm --prefix admin run dev`
- Waiter: `npm --prefix waiter install` then `npm --prefix waiter run dev`
- Printer API: `make -C printer-api run`
- Fake printer: `npm --prefix fake-printer install` then `npm --prefix fake-printer run dev`

## Default credentials
- Admin: `admin` / `bierh0len!`
- Waiter: `waiter` / `gehmal25`

## Ports
- API: `http://localhost:8080`
- Admin (dev): `http://localhost:3000`
- Waiter (dev): `https://localhost:5173`
- Nginx (waiter): `http://localhost` / `https://localhost`
- Nginx (admin): `http://localhost/admin` / `https://localhost/admin`
- Printer API: `http://localhost:8761`
- Fake printer UI: `http://localhost:9101`
- Fake printer TCP: `localhost:9100`
- Dozzle: `http://localhost:9999` (if enabled)

## Testing
- API tests (local MySQL): `make test-api`
- API tests (Docker): `make test-api-docker`

## Production
- Build Waiter UI: `npm --prefix waiter run build`
- Start production stack: `make up-prod`

The production compose mounts `waiter/dist` into Nginx.

## Makefile targets
- `make up`, `make up-d`: full stack
- `make up-mac`, `make up-mac-d`: Mac-friendly stack
- `make up-prod`: production compose
- `make test-api`, `make test-api-docker`: API tests
- `make clean`: remove docker volumes
