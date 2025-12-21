# API

Disclaimer: This project is based on the original idea of g.m.b.h. and its original source code, enhanced and extended with AI.

Node/Express API for orders, items, categories, tables, users, events, and printing.

## Requirements
- Node.js
- MySQL

## Local setup
```bash
npm install
```

Copy `.env.example` to `.env` and adjust DB settings.

Start dev server:
```bash
npm run dev
```

## Migrations
Migrations run on startup by default. Disable with:
```
GMBH_DB_AUTO_MIGRATE=false
```

Run manually:
```bash
npm run migrate
```

## OpenAPI / Swagger
- Swagger UI: `http://localhost:8080/docs`
- JSON spec: `http://localhost:8080/openapi.json`
- Source: `openapi/openapi.yaml`

## Printing
This service proxies printing via the Go printer API.

Env:
```
PRINTER_API_URL=http://localhost:8761
```

## Tests
```bash
npm run test
```

## Default credentials
- Admin: `admin` / `bierh0len!`
- Waiter: `waiter` / `gehmal25`
