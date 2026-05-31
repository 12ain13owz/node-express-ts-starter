# AGENTS.md

Guidance for AI assistants (and humans) working in this repository. Read this **before** creating or modifying a feature so changes stay consistent without re-reading the whole codebase every time.

If anything here conflicts with the actual code, the code wins — update this file in the same change.

---

## 1. What this project is

A feature-based REST API starter: **Node.js (ESM) + Express 5 + TypeScript 6**. Environment is validated with Zod, logging uses Winston, and errors flow through a single error middleware. There is no database, no auth, and no test runner wired up yet — add them inside the existing structure when needed.

## 2. Architecture & layering

```
src/
  core/      # Infrastructure, app-wide. Knows nothing about specific features.
  features/  # Business features. One folder per feature. May import core + shared.
  shared/    # Pure building blocks (constants, types, utils). No feature/business logic.
  main.ts    # Entry point: middleware wiring + startServer
  routes.ts  # Root router: mounts every feature router
```

Dependency direction (never break this):

```
features  ->  core  ->  shared
features  ->  shared
```

- `shared/` must not import from `core/` or `features/`.
- `core/` must not import from `features/`.
- Features must not import from other features. If two features need the same logic, lift it into `core/` or `shared/`.

## 3. Hard conventions (do not deviate)

### Imports & module system

- ESM only. Use the `@/` path alias for anything under `src/` (configured in `tsconfig.json`). Use relative imports only for files inside the same feature/folder.
- Import groups are enforced by ESLint (`import/order`), separated by blank lines, in this order:
  1. builtin + external (e.g. `node:path`, `express`)
  2. internal `@/...`
  3. relative `./...`
  4. `type` imports (always last group)
- Type-only imports must use `import type { ... }` (auto-fixed on save / `npm run fix`).

### Formatting (Prettier)

- 2-space indent, single quotes, **no semicolons**, trailing commas `es5`, print width 100, arrow parens always, LF line endings.

### TypeScript

- `strict` is on, plus `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`.
- `any` is banned (`@typescript-eslint/no-explicit-any`). Use `unknown` + narrowing.
- Prefix intentionally unused params with `_` (e.g. `_req`, `_next`).
- Every Promise must be awaited or handled (`no-floating-promises`).

### Logging & env

- Never use `console.*` for app logging — use the Winston `logger` from `@/core/logger` (`console.warn`/`console.error` are only tolerated inside `core/config`).
- Never read `process.env` directly outside `core/config`. Import the validated `env` from `@/core/config`.

### File naming (kebab-case + role suffix)

| Role             | Pattern                   | Example                       |
| ---------------- | ------------------------- | ----------------------------- |
| Routes           | `<feature>.routes.ts`     | `auth.routes.ts`              |
| Controller       | `<feature>.controller.ts` | `auth.controller.ts`          |
| Service          | `<feature>.service.ts`    | `auth.service.ts`             |
| Validation (Zod) | `<feature>.schema.ts`     | `auth.schema.ts`              |
| Types            | `<feature>.type.ts`       | `auth.type.ts`                |
| Middleware       | `<name>.middleware.ts`    | `authenticate.middleware.ts`  |
| Constants        | `<name>.const.ts`         | `message.const.ts`            |
| Barrel           | `index.ts`                | re-exports the public surface |

## 4. The response & error contract

**Every** success response is built with `createResponse` (`@/shared/utils`) so the envelope stays uniform:

```ts
{ message: string, timestamp: string, data?: T }
```

- Success messages come from `SUCCESS` in `@/shared/constants` (extend it, don't hardcode strings).
- HTTP codes come from the `HttpStatus` enum, never magic numbers.
- To raise an error, `throw new AppError(message, status, severity)` and chain context, then call `next(error)`. The global `errorHandler` in `main.ts` formats it (full details in development, message-only in production).

`AppError` builder methods:

```ts
throw new AppError(ERRORS.GENERIC.UNAUTHORIZED, HttpStatus.UNAUTHORIZED, ErrorSeverity.WARN)
  .withOperation('login') // logical operation name
  .withEndpoint(req) // method, url, params, query, body
  .withMetadata({ email }) // extra structured context (no secrets/passwords)
```

## 5. Controller pattern (copy this shape)

Controllers are thin: validate input, call a service, return via `createResponse`. Always `async`, return `Promise<void>`, wrap in `try/catch`, and forward errors with `next(error)`.

```ts
import { HttpStatus, SUCCESS } from '@/shared/constants'
import { createResponse } from '@/shared/utils'

import * as authService from './auth.service'
import { loginSchema } from './auth.schema'

import type { NextFunction, Request, Response } from 'express'

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const credentials = loginSchema.parse(req.body)
    const result = await authService.login(credentials)
    res.status(HttpStatus.OK).json(createResponse(SUCCESS.AUTH.LOGIN, result))
  } catch (error) {
    next(error)
  }
}
```

Routers create a `Router()` and export it as `<feature>Router`:

```ts
import { Router } from 'express'

import * as authController from './auth.controller'

const router = Router()

router.post('/login', authController.login)

export const authRouter = router
```

## 6. Recipe — add a new feature (example: `auth` / login)

Follow these steps in order. Skip files you genuinely don't need (e.g. a read-only feature may not need a service), but keep the naming.

1. **Create the folder** `src/features/auth/`.

2. **Validation** — `auth.schema.ts` (use Zod, the same validator already used for env):

```ts
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export type LoginInput = z.infer<typeof loginSchema>
```

3. **Service** — `auth.service.ts`. Put business logic here, not in the controller. Throw `AppError` for expected failures:

```ts
import { AppError } from '@/core/error'
import { ERRORS, ErrorSeverity, HttpStatus } from '@/shared/constants'

import type { LoginInput } from './auth.schema'

export const login = async ({ email, password }: LoginInput) => {
  const user = await findUserByEmail(email) // replace with real lookup
  if (!user || !verifyPassword(user, password)) {
    throw new AppError(ERRORS.GENERIC.UNAUTHORIZED, HttpStatus.UNAUTHORIZED, ErrorSeverity.WARN)
      .withOperation('login')
      .withMetadata({ email }) // never log the password
  }
  return { token: issueToken(user) }
}
```

4. **Controller** — `auth.controller.ts` (see the pattern in section 5).

5. **Routes** — `auth.routes.ts` (see section 5). Export `authRouter`.

6. **Barrel** — `auth/index.ts`:

```ts
export * from './auth.routes'
```

7. **Add messages** to `src/shared/constants/message.const.ts` instead of inline strings:

```ts
export const SUCCESS = {
  // ...existing...
  AUTH: {
    LOGIN: 'Logged in successfully',
    LOGOUT: 'Logged out successfully',
  },
}
```

8. **Register the router** in `src/routes.ts`:

```ts
import { authRouter } from '@/features/auth'
// ...
router.use('/auth', authRouter)
```

9. **Document the endpoint** under `docs/` (OpenAPI): add a path file under `docs/paths/auth/`, reference it from `docs/openapi.yaml`, and reuse shared schemas/responses where possible.

10. **Verify** (section 8).

## 7. Shared middleware

Cross-feature middleware (auth guard, request validation, etc.) goes in `src/core/middleware/` and is exported from its `index.ts`. Feature-specific middleware can live in the feature folder. Follow the `rate-limit.middleware.ts` style and wire global middleware in `main.ts`.

## 8. Definition of done — always run before finishing

```bash
npm run fix     # ESLint --fix + Prettier
npm run build   # type-check + compile (must pass with no errors)
```

A change is complete only when both succeed and the new feature router is mounted in `src/routes.ts`.

## 9. Quick do / don't

- DO keep controllers thin; push logic into services.
- DO use `createResponse`, `HttpStatus`, `AppError`, and the message constants.
- DO add new env vars to the Zod schema in `core/config`, `AppConfig` type, and `.env.example`.
- DON'T import across features, hardcode response strings, throw raw `Error`, use `any`, read `process.env` directly, or use `console.log`.
- DON'T put secrets (passwords, tokens) into `AppError` metadata or logs.
