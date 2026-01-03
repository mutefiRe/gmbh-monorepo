# Fake Printer (ESC/POS)

Disclaimer: This project is based on the original idea of g.m.b.h. and its original source code, enhanced and extended with AI.

Tiny TypeScript fake network printer that listens on TCP 9100, parses ESC/POS into structured receipts, and streams them to a web UI.

## Quick start
```bash
npm install
npm run dev
```

Open `http://localhost:9101` for the UI.

## Docker
```bash
docker compose up --build fake-printer
```

## Configuration
- `PRINT_PORT` (default `9100`): raw TCP ESC/POS input
- `UI_PORT` (default `9101`): HTTP UI
- `HOST` (default `0.0.0.0`)
- `PRINT_QUEUE_SIZE` (default `200`)

## Send a test print
```bash
printf '\x1b@Hello\nWorld\n\x1dV\x00' | nc 127.0.0.1 9100
```
