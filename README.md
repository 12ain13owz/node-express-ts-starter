# Node Starter (Express + TypeScript)

A production-ready template for building REST APIs with Node.js, Express, and TypeScript. It ships with a clean, feature-based architecture, structured logging, centralized error handling, rate limiting, and ready-to-use OpenAPI documentation.

> Building a new feature with an AI assistant? Read [`AGENTS.md`](./AGENTS.md) first — it documents the conventions and provides a step-by-step recipe for adding features consistently.

## Tech Stack

- Node.js (ESM)
- Express 5
- TypeScript 6
- Zod (environment validation)
- Winston + winston-daily-rotate-file (logging)
- ESLint 10 + Prettier
- Stoplight Elements (API docs)
- Docker / Docker Compose

## Requirements

- Node.js >= 20
- npm >= 10
- Docker (optional)

## Getting Started

1. Install dependencies

```bash
npm install
```

2. Create the environment files

```bash
npm run setup-env
```

3. Start the development server

```bash
npm run dev
```

The server starts at http://localhost:3000

## Environment Variables

Environment files are loaded based on `NODE_ENV`:

- `NODE_ENV=development` -> `.env.development`
- `NODE_ENV=production` -> `.env.production`

Values are validated at startup with Zod (see `src/core/config/config.ts`); the process exits if any variable is missing or invalid.

Example values from `.env.example`:

```env
PORT="3000"
NODE_ENV="development"
BASE_URL="http://localhost:"
LOG_LEVEL_CONSOLE="debug"
LOG_LEVEL_FILE="info"
LOG_LEVEL_ERROR_FILE="error"
```

## Available Scripts

- `npm run dev`: run with `tsx --watch` using `.env.development`
- `npm run build`: clean `dist`, compile TypeScript, then rewrite path aliases (`tsc-alias`)
- `npm start`: run the compiled build using `.env.production`
- `npm run fix`: auto-fix ESLint issues and format with Prettier
- `npm run clean`: remove the `dist` directory
- `npm run setup-env`: generate `.env.development` and `.env.production` from `.env.example`

## API Endpoints

- `GET /`: basic API smoke test
  - response: `{ "message": "Hello World!" }`
- `GET /health`: health check (success)
- `GET /health/error`: health check that simulates an error
- `GET /docs`: API documentation page

The standard response envelope is:

```json
{
  "message": "...",
  "timestamp": "ISO-8601",
  "data": {}
}
```

## API Documentation

- UI: `docs/index.html`
- OpenAPI spec: `docs/openapi.yaml`
- Schemas: `docs/components/schemas`
- Responses: `docs/components/responses`
- Paths: `docs/paths`

Open the docs in the browser at:

http://localhost:3000/docs

## Logging

- Console and file logging via Winston
- Daily-rotated files organized by year/month
- Log location: `logs/YYYY/MM`
- Separate general (`.log`) and error (`.error.log`) files

## Docker

Run with Docker Compose:

```bash
docker compose up -d --build
```

Stop the container:

```bash
docker compose down
```

Note: the current `Dockerfile` runs `npm run dev`.

## Project Structure

```text
.
|- docs/                      # OpenAPI spec + Stoplight Elements UI
|  |- components/
|  |  |- responses/
|  |  \- schemas/
|  |- paths/
|  |  \- health/
|  |- index.html
|  \- openapi.yaml
|- scripts/
|  \- setup-env.mjs
|- src/
|  |- core/                   # App infrastructure (not feature-specific)
|  |  |- config/              # Env loading + Zod validation
|  |  |- error/               # AppError, error logger, error middleware
|  |  |- logger/              # Winston logger setup
|  |  |- middleware/          # Global middleware (e.g. rate limit)
|  |  \- server/              # Server bootstrap + graceful shutdown
|  |- features/               # Feature modules (one folder per feature)
|  |  |- docs/
|  |  |- health/
|  |  \- test/
|  |- shared/                 # Cross-cutting building blocks
|  |  |- constants/           # HttpStatus, messages, app constants
|  |  |- types/               # Shared types + Express augmentation
|  |  \- utils/               # Helpers (e.g. createResponse)
|  |- main.ts                 # App entry point + middleware wiring
|  \- routes.ts               # Root router (mounts every feature router)
|- docker-compose.yml
|- Dockerfile
|- eslint.config.mjs
|- package.json
\- tsconfig.json
```

## Contributing / Adding Features

This project follows a strict, consistent structure. Before adding or changing a feature, read [`AGENTS.md`](./AGENTS.md) for the conventions and the feature-creation recipe (with an `auth/login` example). Always run `npm run fix` and `npm run build` before committing.

## License

MIT
