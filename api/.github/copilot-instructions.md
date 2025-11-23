# Copilot Instructions for GmBh Backend

## Project Overview
- **Purpose:** Real-time festival order system (Node.js, Express, Sequelize, Socket.IO)
- **Main entry:** `server.js` (Express app, Socket.IO, JWT auth, API routing)
- **API routes:** Defined in `router/api/` (RESTful endpoints for areas, categories, items, orders, etc.)
- **Authentication:** JWT-based, handled in `router/authenticate.js` and via `socketio-jwt` for sockets
- **Database:** MySQL (dev/test), PostgreSQL (production); config in `config/DBconfig.js`, models in `models/`
- **Docs:** API docs generated with `npm run docs` (uses apidoc, output to `docs/`)

## Developer Workflows
- **Install:** `npm install` (requires `libcups2-dev` for printer support)
- **Start (dev):** `npm start` (uses nodemon, port 8080 by default)
- **Start (prod):** `npm run production`
- **Test:** `npm test` (Mocha, Chai, test files in `test/`)
- **Lint/fix:** `npm run lint` / `npm run fix-style` (ESLint, custom config)
- **API docs:** `npm run docs` (regenerate docs after API changes)

## Key Patterns & Conventions
- **Models:** Auto-loaded in `models/index.js` (Sequelize import, capitalized names)
- **Routes:** API endpoints grouped by resource in `router/api/`
- **Socket events:** JWT-authenticated, basic connection/disconnect events in `server.js`
- **Config:** Environment-driven via `process.env` (see `config/DBconfig.js` and `config/config.js`)
- **Commit messages:** Conventional format (`feat:`, `fix:`, `docs:`, etc.)
- **Branching:** Use [git-flow](https://github.com/nvie/gitflow/wiki/Installation)
- **Testing:** All major components have corresponding tests in `test/` (mirrors source structure)

## Integration Points
- **Printer:** Custom logic in `printer/` (requires CUPS dev libs)
- **ACL:** Access control via `config/acl.json` and `express-acl`
- **Socket.IO:** Real-time updates, JWT-secured
- **External:** MySQL/PostgreSQL, CUPS, API docs (apidoc)

## Examples
- **Add new API resource:** Create model in `models/`, route in `router/api/`, test in `test/`
- **Update DB config:** Edit `config/DBconfig.js` (supports multiple environments)
- **Regenerate docs:** `npm run docs` after changing API routes

## References
- `server.js` (app entry, routing, sockets)
- `models/` (Sequelize models)
- `router/api/` (API endpoints)
- `test/` (tests)
- `config/DBconfig.js` (DB config)
- `printer/` (printer logic)
- `README.md` (setup, conventions)

---
For questions or unclear patterns, review `README.md` or ask for clarification.
