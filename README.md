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
- Scalar API Reference (OpenAPI docs UI)
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

- `NODE_ENV=development` -> `.env.dev`
- `NODE_ENV=production` -> `.env.prod`

Values are validated at startup with Zod (see `src/core/config/env/env.schema.ts`); the process exits if any variable is missing or invalid.

Example values from `.env.example`:

```env
PORT="3000"
NODE_ENV="development"
BASE_URL="http://localhost:3000"
CORS_ORIGINS="http://localhost:3000,http://localhost:4000,http://localhost:4200"
LOG_LEVEL_CONSOLE="debug"
LOG_LEVEL_FILE="info"
LOG_LEVEL_ERROR_FILE="error"
LOG_SILENT="false"
SHUTDOWN_TIMEOUT_MS="10000"
```

`LOG_SILENT="true"` turns off every log transport (console and files, so no `logs/` folder is created). It defaults to `false`; `vitest.config.ts` sets it to `true` so test runs stay quiet.

## Available Scripts

- `npm run dev`: run with `tsx --watch` using `.env.dev`
- `npm run build`: clean `dist`, compile TypeScript, then rewrite path aliases (`tsc-alias`)
- `npm start`: run the compiled build using `.env.prod`
- `npm run fix`: auto-fix ESLint issues and format with Prettier
- `npm run lint`: check with ESLint without changing files
- `npm run typecheck`: type-check with `tsc --noEmit`
- `npm run clean`: remove the `dist` directory
- `npm run setup-env`: generate `.env.dev` and `.env.prod` from `.env.example`
- `npm test`: run the test suite once (Vitest)
- `npm run test:watch`: run the test suite in watch mode

## API Endpoints

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

Served by the `docs` feature (`src/features/docs/`) using [Scalar](https://github.com/scalar/scalar) as the UI, with the OpenAPI spec bundled at runtime (`@apidevtools/swagger-parser`):

- UI: `GET /docs`
- Bundled OpenAPI JSON: `GET /docs/openapi.json`
- Spec entry point: `src/features/docs/spec/openapi.yaml`
- Schemas: `src/features/docs/spec/components/models`
- Responses: `src/features/docs/spec/components/responses`
- Paths: `src/features/docs/spec/paths`

Open the docs in the browser at:

http://localhost:3000/docs

## Logging

- Console and file logging via Winston
- Daily-rotated files organized by year/month
- Log location: `logs/YYYY/MM`
- Separate general (`.log`) and error (`.error.log`) files
- Set `LOG_SILENT="true"` to turn off all logging (used by tests)

## Continuous Integration

`.github/workflows/ci.yml` runs on every pull request to `main`: `npm ci` -> `npm run lint` -> `npm run typecheck` -> `npm run setup-env` -> `npm test`. Run the same commands locally before opening a PR.

## Testing

Tests run on [Vitest](https://vitest.dev/) and live next to the code they cover as `<name>.test.ts` (e.g. `src/core/error/app-error.test.ts`), mirroring the `src/` layout — no separate `test/` folder.

```bash
npm test          # run once
npm run test:watch  # watch mode
```

## Docker

The app service is behind the `prod` Compose profile, so a plain `docker compose up` won't start it. That leaves room to add dev-only services (database, mail catcher, …) that start without the app. Run it with:

```bash
docker compose --profile prod up -d --build
```

Stop the container:

```bash
docker compose --profile prod down
```

The image compiles TypeScript at build time and runs the compiled output (`npm start`), with `NODE_ENV=production` by default. Run `npm run setup-env` first so `.env.prod` exists — `docker-compose.yml` loads it via `env_file` (it is not copied into the image).

## Project Structure

```text
.
|- .github/workflows/ci.yml  # PR checks: lint, typecheck, test
|- scripts/
|  |- setup-env.ts
|  \- tsconfig.json
|- src/
|  |- core/                   # App infrastructure (not feature-specific)
|  |  |- config/              # Env loading + Zod validation + runtime options (cors/helmet/rate-limit)
|  |  |  \- env/              # EnvConfig type, Zod schema, loader, barrel
|  |  |- error/               # AppError, error logger, error middleware, wrapUnexpected
|  |  |- logger/              # Winston logger setup
|  |  |- middleware/          # Custom middleware (validate: Zod for params/query/body)
|  |  \- server/              # Server bootstrap + graceful shutdown (onShutdown hooks)
|  |- features/               # Feature modules (one folder per feature)
|  |  |- docs/                # OpenAPI spec + Scalar API reference UI
|  |  \- health/              # Health check (success + simulated error)
|  |- shared/                 # Cross-cutting building blocks
|  |  |- constants/           # HttpStatus, messages (SUCCESS/ERRORS/LOG), app constants
|  |  |- types/               # Shared types
|  |  \- utils/               # Helpers (createResponse, asHandler, parseDuration)
|  |- app.ts                  # createApp(): global middleware + routes + error handler
|  |- main.ts                 # App entry point (startServer + onShutdown registrations)
|  \- routes.ts               # Root router (mounts every feature router)
|- docker-compose.yml
|- Dockerfile
|- eslint.config.mjs
|- package.json
\- tsconfig.json
```

## Contributing / Adding Features

This project follows a strict, consistent structure. Before adding or changing a feature, read [`AGENTS.md`](./AGENTS.md) for the conventions and the feature-creation recipe (with an `auth/login` example). Always run `npm run fix`, `npm run typecheck`, and `npm test` before committing (CI runs the same checks).

## License

MIT
