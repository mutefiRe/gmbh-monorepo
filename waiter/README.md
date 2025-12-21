# Waiter UI

Disclaimer: This project is based on the original idea of g.m.b.h. and its original source code, enhanced and extended with AI.

Waiter-facing order interface (PWA) for creating and paying orders.

## Requirements
- Node.js
- API running on `http://localhost:8080`

## Dev
```bash
npm install
npm run dev
```

The dev server runs on `https://localhost:5173` and proxies:
- `/api` -> `http://localhost:8080`
- `/authenticate` -> `http://localhost:8080`
- `/socket.io` -> `http://localhost:8080`

## Build
```bash
npm run build
npm run preview
```

## Notes
- Offline orders and payments are queued in localStorage.
- Printing is disabled when offline.

## PWA setup (HTTPS cert)
Install the local HTTPS certificate once to enable fullscreen PWA mode.

- Open `http://gmbh.local/cert-install`
- Android: install as CA certificate
- iOS/iPadOS: install profile and enable trust
- Then add the app to the home screen
