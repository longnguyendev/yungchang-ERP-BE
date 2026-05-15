# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn install          # Install dependencies
yarn start:dev        # Run in watch mode (development)
yarn start:debug      # Run with debugger attached
yarn start:prod       # Run compiled output
yarn build            # Compile TypeScript
yarn lint             # ESLint with auto-fix
yarn format           # Prettier format
yarn test             # Unit tests (Jest)
yarn test:watch       # Jest in watch mode
yarn test:cov         # Jest with coverage
yarn test:e2e         # E2E tests
```

Prisma:
```bash
npx prisma generate   # Regenerate the Prisma client after schema changes
npx prisma migrate dev --name <name>  # Create and apply a migration
```

Run a single test:
```bash
yarn test -- --testPathPattern="src/app.controller.spec.ts"
```

### Docker

```bash
docker-compose up -d     # Start PostgreSQL + app (hot-reload)
docker-compose down      # Stop containers
```

Package manager is **Yarn** (not npm). The Dockerfile uses npm, which is a known inconsistency — prefer Yarn for dependency management.

## Architecture

NestJS monolith with **code-first GraphQL** (Apollo Server, `@nestjs/graphql`), **Prisma ORM** (PostgreSQL via `@prisma/adapter-pg`), and **Redis** (ioredis).

### Project structure

```
src/
  main.ts                  # Entry point — creates NestFactory, listens on APP_PORT
  app.module.ts            # Root module — imports all feature modules + global config
  prisma.service.ts        # Shared PrismaClient (singleton, injected with PG adapter)
  gql-config.service.ts    # GraphQL driver config (autoSchemaFile, playground)
  jwt-config.service.ts    # JWT module options factory
  common/
    config/                # Per-domain config factories (registerAs), validated via class-validator
    entities/              # BaseEntity with id/createdAt/updatedAt/deletedAt fields
  lib/                     # Utilities — hashPassword, validateConfig
  constants/               # App-wide constants (e.g., SALT_OR_ROUNDS = 10)
  auth/                    # Auth module — signIn, signUp, refreshToken, forgot/reset password
  employee/                # Employee CRUD (resolver + service)
  user-account/            # User account CRUD (resolver + service), depends on EmployeeModule
  user-token/              # Maps accessToken/refreshToken to user accounts
  redis/                   # Global Redis module (@Global), extends ioredis Redis class
  generated/prisma/        # Auto-generated Prisma client + model types (do not edit manually)
```

### Path alias

`@/*` → `src/*` (defined in `tsconfig.json`). Import example: `import { PrismaService } from '@/prisma.service'`.

### Configuration pattern

Each config domain (database, jwt, graphql, redis, server) uses `registerAs('namespace', factory)`. The factory calls `validateConfig(process.env, ValidatorClass)` which validates env vars via `class-validator` decorators at startup. Config is accessed with typed `ConfigService<AppConfig>`.

### GraphQL: code-first

`GqlConfigService` sets `autoSchemaFile: true` so the schema is generated from decorators on resolver methods and entity classes. Playground is disabled in production (uses Apollo landing page plugins instead). Resolvers use `@nestjs/graphql` decorators (`@Resolver`, `@Query`, `@Mutation`, `@Args`).

### Prisma: multi-file schema

The Prisma schema is split across `prisma/models/*.prisma` files (currently: `employee.prisma`, `user-account.prisma`, `user-token.prisma`). The `prisma.config.ts` points `schema` to `prisma/` directory, not a single file. Models are auto-generated into `src/generated/prisma/`.

The database relationship: **Employee** (1-to-1) → **UserAccount** (1-to-many) → **UserToken**. Employees have a unique `code`, UserAccount references it via `employeeCode`.

### Auth flow

- `AuthService` uses `JwtService` to issue access + refresh tokens
- Refresh token is stored as an httpOnly cookie
- Password reset tokens and OTP verification codes are stored in Redis (cache-manager) with TTLs
- Passwords hashed with `bcryptjs` at SALT_OR_ROUNDS = 10

### Environment variables

`.env.exaple` (note: filename has a typo, missing 'm') is the env template. Required vars not yet in the template:

| Variable | Used by |
|---|---|
| `REDIS_HOST`, `REDIS_PORT` | `redis.config.ts` |
| `JWT_TOKEN_SECRET`, `JWT_TOKEN_EXPIRATION_TIME` | `jwt.config.ts` |
| `JWT_REFRESH_TOKEN_SECRET`, `JWT_REFRESH_TOKEN_EXPIRATION_TIME` | `jwt.config.ts` |

### Code quality

- **ESLint** with TypeScript strict typed checking + Prettier plugin
- **Prettier** with import sorting (`@trivago/prettier-plugin-sort-imports`)
- **Husky** + **commitlint** (conventional commits) + **lint-staged** (auto-fix on staged `.ts` files)
- StrictNullChecks enabled; `noImplicitAny` is off
