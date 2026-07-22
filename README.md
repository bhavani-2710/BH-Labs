# BH Labs — Next.js

Virtual programming laboratory (Monaco editor, client-side JS/Python/C execution
via WebWorkers + `@wasmer/sdk`/Pyodide, AI explain/chat, practical tests, viva Q&A).

Migrated from the Vite React client + Express server into a single **Next.js 15
App Router** app. All former Express endpoints are now Next API route handlers
under `app/api/*`; Mongoose models live in `lib/models`.

## Run

```bash
npm install
cp .env.example .env.local   # fill in MONGODB_URI + OPENROUTER_API_KEY
npm run dev                  # http://localhost:5050
npm run build && npm start   # production
```

## Environment

| Var | Purpose |
|-----|---------|
| `NEXT_PUBLIC_API_URL` | Client API base (default `/api`, same-origin) |
| `MONGODB_URI` | MongoDB connection (bh-labs database) |
| `OPENROUTER_API_KEY` | OpenRouter key for AI explain/chat/test/viva |

## Notes
- Cross-origin isolation (COOP + COEP `credentialless`) is set in `next.config.mjs`
  so `SharedArrayBuffer` (Wasmer/Pyodide) works while still allowing CDN resources.
- All interactive screens render client-side (`ssr: false`) — this is a SPA-style
  client app; the server layer is the API routes only.
