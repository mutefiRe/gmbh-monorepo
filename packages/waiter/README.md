# Waiter UI

Disclaimer: This project is based on the original idea of g.m.b.h. and its original source code, enhanced and extended with AI.

Waiter-facing order interface for creating and paying orders.

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

## Legacy devices (Chrome 81 / Android 5)
We added compatibility handling for older WebViews (e.g., Lenovo Tab 2 A7).

What we do:
- Tailwind v3 + `autoprefixer` (v4 CSS relies on newer features).
- Polyfills: `core-js`, `regenerator-runtime`, `abortcontroller-polyfill`.
- `index.html` detects missing flex-gap / inset and adds `.legacy` to `<html>`.
- `src/index.css` includes `.legacy`-scoped fallbacks:
  - flex/inline-flex gap spacing
  - missing `inset` shorthand
  - legacy scroll sizing for order main + order detail

If you adjust layout/spacing, prefer updating the `.legacy` rules in `src/index.css`.
