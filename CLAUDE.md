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
docker-compose up     # Start PostgreSQL, Redis, and app (hot-reload)
docker-compose down      # Stop containers
```

Package manager is **Yarn** (not npm). The Dockerfile uses npm, which is a known inconsistency — prefer Yarn for dependency management.

## Architecture

NestJS monolith with **code-first GraphQL** (Apollo Server, `@nestjs/graphql`), **Prisma ORM** (PostgreSQL via `@prisma/adapter-pg`), and **Redis** (ioredis).

### Project structure

```
src/
  main.ts                     # Entry point — NestFactory, listens on PORT (default 3000)
  app.module.ts               # Root module — ConfigModule (global) + CoreModule + feature modules
  prisma.service.ts           # Shared PrismaClient (singleton, injected with PG adapter)
  common/
    config/                   # Per-domain config factories (registerAs), validated via class-validator
    entities/                 # BaseEntity GraphQL type (id, createdAt, updatedAt, deletedAt)
    exceptions/               # Custom exceptions (e.g., TooManyRequestsException)
  core/                       # Cross-cutting infrastructure modules
    core.module.ts            # Aggregates and re-exports Core, GQL, JWT, Redis modules
    gql/                      # GraphQL config (GqlOptionsFactory)
    jwt/                      # JWT module setup (JwtModule.registerAsync)
    redis/                    # Redis module (@Global), extends ioredis Redis class, uses ConfigurableModuleClass
  modules/                    # Feature modules
    auth/                     # signIn, signUp, refreshToken, signOut, forgot/reset password, change password, verify user (OTP), Google OAuth
    email/                    # Nodemailer-based email service (Gmail transporter)
    employee/                 # Employee CRUD (resolver + service)
    user-account/             # User account CRUD (resolver + service), depends on EmployeeModule
    user-token/               # Manages accessToken/refreshToken records for user accounts
  guards/                     # Passport-based GraphQL guards
    jwt-auth/                 # JwtAuthGuard — validates JWT, skips if @Public() decorator present
    jwt-refresh-auth/         # JwtRefreshAuthGuard — validates refresh token from cookie
    local-auth/               # LocalAuthGuard — validates username/password
    user-verified-auth/       # UserVerifyAuthGuard — blocks unverified accounts
    strategies/               # JwtStrategy, JwtRefreshStrategy, LocalStrategy
    gql-throttler/            # GraphQL-specific throttler guard
  decorators/                 # Custom param decorators and metadata decorators
    user.decorator            # @CurrentUser() — extracts user (or specific field) from request
    token.decorator           # @Token() — extracts Bearer token from Authorization header
    public.decorator          # @Public() — marks a resolver/query as public (skips JWT guard)
    skip-verify.decorator     # @SkipVerify() — skips verified-user guard
  helpers/                    # Utilities: hashPassword, validateConfig, generateSecureOTP, render emails, messages
  constants/                  # App-wide constants (SALT_OR_ROUNDS = 10, FIVE_MINUTES, ONE_MINUTES)
  types/                      # Shared TypeScript types
  generated/prisma/           # Auto-generated Prisma client + model types (do not edit manually)
```

### Path alias

`@/*` → `src/*` (defined in `tsconfig.json`). Import example: `import { PrismaService } from '@/prisma.service'`.

### Configuration pattern

Each config domain uses `registerAs('namespace', factory)`. The factory calls `validateConfig(process.env, ValidatorClass)` which validates env vars via `class-validator` decorators at startup. Config is accessed with typed `ConfigService<AppConfig>`.

Config namespaces currently registered: `server`, `database`, `graphql`, `prisma`, `jwt`, `redis`, `email`, `googleOauth`.

### GraphQL: code-first

`GqlConfigService` in `src/core/gql/` sets `autoSchemaFile: true` so the schema is generated from decorators on resolver methods and entity classes. Playground is disabled; uses Apollo landing page plugins (local in dev, production in prod). Resolvers use `@nestjs/graphql` decorators (`@Resolver`, `@Query`, `@Mutation`, `@Args`).

### Prisma: multi-file schema

The Prisma schema is split across `prisma/models/*.prisma` files:

- `employee.prisma` — Employee model (String id, firstName, lastName, isActive)
- `user-account.prisma` — UserAccount model (Int id autoincrement, employeeId, username, email, password, verified)
- `user-token.prisma` — userToken model (Int id autoincrement, employeeId, refreshToken, accessToken, expiresAt)

The schema file path is configured to point at the `prisma/` directory (not a single file). Models are auto-generated into `src/generated/prisma/`.

**Database relationships:** Employee (1-to-1) → UserAccount (via `employeeId` unique) → userToken (1-to-many, via `employeeId`). Employee.id is a String (not auto-generated), UserAccount.employeeId is a unique String referencing it. The userToken model relates to UserAccount via `employeeId`.

### Auth flow

- **Passport strategies:** local (username/password), JWT (Bearer token), JWT refresh (cookie)
- `AuthService` uses `JwtService` for access + refresh tokens; refresh tokens are stored as httpOnly cookies (`secure` in production)
- **Guards:** `JwtAuthGuard` (enforces JWT globally), `JwtRefreshAuthGuard` (validates refresh cookie), `LocalAuthGuard` (username/password), `UserVerifyAuthGuard` (blocks unverified accounts)
- `@Public()` decorator skips JWT auth; `@SkipVerify()` skips the verified-user check
- Password reset tokens (hashed, 10-min TTL) and OTP verification codes (hashed, 3-min TTL) are stored in Redis
- Passwords hashed with `bcryptjs` at `SALT_OR_ROUNDS = 10`
- Google OAuth is supported via `passport-google-oauth20`
- Email service uses Gmail SMTP (nodemailer) for reset password and user verification emails

### Environment variables

`.env.exaple` (note: filename has a typo, missing 'm') is the env template. Required environment variables:

| Variable                                                                              | Config namespace | Purpose                                      |
| ------------------------------------------------------------------------------------- | ---------------- | -------------------------------------------- |
| `APP_PORT`                                                                            | `server`         | App listen port (default 3000)               |
| `NODE_ENV`                                                                            | `server`         | Mode (`production` or development)           |
| `FE_HOST`                                                                             | `server`         | Frontend host URL (for reset password links) |
| `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` | `database`       | PostgreSQL connection                        |
| `DATABASE_URL`                                                                        | `prisma`         | Prisma connection string                     |
| `REDIS_HOST`, `REDIS_PORT`                                                            | `redis`          | Redis connection                             |
| `JWT_TOKEN_SECRET`, `JWT_TOKEN_EXPIRATION_TIME`                                       | `jwt`            | Access token signing                         |
| `JWT_REFRESH_TOKEN_SECRET`, `JWT_REFRESH_TOKEN_EXPIRATION_TIME`                       | `jwt`            | Refresh token signing                        |
| `SMTP_USERNAME`, `SMTP_PASSWORD`                                                      | `email`          | Gmail SMTP credentials                       |
| `GOOGLE_CLIENT_ID`, `GOOGLE_SECRET`, `GOOGLE_CALLBACK_URL`                            | `googleOauth`    | Google OAuth                                 |

### Code quality

- **ESLint** with TypeScript strict typed checking + Prettier plugin
- **Prettier** with import sorting (`@trivago/prettier-plugin-sort-imports`)
- **Husky** + **commitlint** (conventional commits) + **lint-staged** (auto-fix on staged `.ts` files)
- `strictNullChecks: true`; `noImplicitAny: false`
- `isolatedModules: true`; `moduleResolution: nodenext`; `target: ES2023`
