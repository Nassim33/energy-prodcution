# react-starter-2026

An opinionated React starter built around the current (2026) fast-tooling stack.

## Stack

| Concern             | Tool                                                                                          |
| ------------------- | --------------------------------------------------------------------------------------------- |
| Build / dev server  | **Vite 6** + `@vitejs/plugin-react-swc`                                                       |
| UI kit              | **antd 5**                                                                                    |
| Routing             | **TanStack Router** (file-based, fully type-safe)                                             |
| Server state        | **TanStack Query 5**                                                                          |
| Client state        | **Zustand** (persist + devtools middleware)                                                   |
| Schema validation   | **Zod** (form + API response validation)                                                      |
| API code generation | **Kubb** (OpenAPI → typed Zod schemas + Query hooks)                                          |
| HTTP client         | Hand-written `fetch` client (`src/lib/api-client.ts`) — retries, timeouts, abort, CSRF header |
| Linting             | **oxlint** (oxc's Rust-based linter, ~50-100x ESLint)                                         |
| Formatting          | **oxfmt** (oxc's Rust-based formatter, Prettier-compatible)                                  |
| Testing             | **Vitest** + **Testing Library** + **MSW**                                                    |
| Git hooks           | **husky** + **lint-staged**                                                                   |
| CI                  | GitHub Actions (typecheck → lint → format → test → build)                                     |

## Getting started

```bash
pnpm install
cp .env.example .env
pnpm dev
```

The first `pnpm dev` (or `pnpm build`) run generates `src/routeTree.gen.ts` automatically via
the TanStack Router Vite plugin — don't hand-edit that file.

Mock Service Worker needs its browser worker file once:

```bash
pnpm dlx msw init public/ --save
```

## API codegen with Kubb

`openapi.yaml` at the repo root is the source of truth for the API. `src/api/posts.ts` is a
hand-written stand-in that mirrors what Kubb will produce, so the app runs before you connect a
real backend. Once your spec is ready:

```bash
pnpm generate
```

This regenerates `src/api/gen/**` with:

- `types/` — TypeScript types from the OpenAPI schemas
- `zod/` — Zod schemas (validate requests/responses at runtime)
- `clients/fetch/` — typed request functions built on `src/lib/api-client.ts`
- `hooks/` — typed `useQuery` / `useMutation` hooks per operation

Nothing under `src/api/gen` should be edited by hand; re-run `pnpm generate` whenever the spec
changes, then swap imports in components from `src/api/posts.ts` to `src/api/gen/hooks`.

## Scripts

| Script                         | What it does                                      |
| ------------------------------ | ------------------------------------------------- |
| `pnpm dev`                     | Start Vite dev server                             |
| `pnpm build`                   | Typecheck + production build                      |
| `pnpm test` / `test:watch`     | Run Vitest once / in watch mode                   |
| `pnpm test:ui`                 | Vitest's browser UI runner                        |
| `pnpm coverage`                | Test run with V8 coverage                         |
| `pnpm lint` / `lint:fix`       | oxlint                                            |
| `pnpm format` / `format:check` | oxfmt                                              |
| `pnpm typecheck`               | `tsc -b --noEmit`                                 |
| `pnpm generate`                | Regenerate API layer from `openapi.yaml` via Kubb |
| `pnpm check`                   | Everything CI runs, locally                       |

## Project layout

```
src/
  routes/            # TanStack Router file-based routes (__root, index, posts/...)
  components/         # UI components (+ colocated *.test.tsx)
  api/                # posts.ts (hand-written) + gen/ (Kubb output, gitignored)
  schemas/            # Zod schemas
  store/              # Zustand stores
  lib/                # fetch api-client, query client, antd theme
  config/              # app.config.ts (api base URL, cookie name)
  shared/utils/         # web.ts (getCookie, used for CSRF header)
  mocks/              # MSW handlers (shared by dev worker + Vitest server)
  test/               # Vitest setup + render helpers
```

## Notes

- `noUncheckedIndexedAccess` and `strict` are on in `tsconfig.app.json` — expect to handle
  `undefined` from array/object indexing.
- oxlint replaces ESLint for speed; **oxfmt** (also part of the oxc toolchain) replaces Prettier —
  it's Prettier-compatible and ~30x faster. Config lives in `.oxfmtrc.jsonc`. If you were on
  Prettier before, `pnpm dlx oxfmt --migrate prettier` converts an existing config.
- Swap the antd theme tokens in `src/lib/theme.ts` for your brand.
