
# Order React Migration

This project is the new React 19 implementation for the `/order` app, migrated from Ember 2. It uses Vite for fast development and modern tooling.

## Migration Plan

- Incrementally port features, routes, and components from `/order` (Ember) to `/order-react` (React).
- Start with shared models, main UI components, and routing structure.
- Copy assets and styles as needed, refactoring to fit React conventions.
- Integrate with backend APIs as in the original app.

## Getting Started

1. Install dependencies:

 ```sh
 npm install
 ```

2. Start the dev server:

 ```sh
 npm run dev
 ```

3. Begin porting features from `/order` to `/order-react/src`.

## Folder Structure

- `src/` — Main React source code
- `public/` — Static assets
- `README.md` — Migration guide and usage

## Status

✅ React 19 project scaffolded and running with Vite
✅ Build and dev server verified

## Next Steps

- Identify key models, components, and routes in Ember `/order` to migrate first
- Create matching React components and pages in `src/`
- Set up API integration and state management
- Migrate styles and assets

---
For questions or unclear migration steps, review the original `/order` codebase or ask for clarification.
