# Admin UI

Disclaimer: This project is based on the original idea of g.m.b.h. and its original source code, enhanced and extended with AI.

Admin UI for managing items, categories, areas, tables, users, printers, and events.

## Requirements
- Node.js
- API running on `http://localhost:8080`

## Dev
```bash
npm install
npm run dev
```

The dev server runs on `http://localhost:3000` and proxies:
- `/api` -> `http://localhost:8080`
- `/authenticate` -> `http://localhost:8080`
- `/socket.io` -> `http://localhost:8080`

## Build
```bash
npm run build
npm run preview
```

## Notes
- Event selection is stored in localStorage.
- Live updates are delivered via Socket.IO.
