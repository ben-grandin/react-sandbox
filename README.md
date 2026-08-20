# react-sandbox

Full-stack sandbox: a React front and an API Platform backend, each organized as a set of
isolated, self-contained experiments.

- **`react/`** — Vite 6 / React 19 / TypeScript / Tailwind 4 front. Every UI experiment lives
  under `react/src/pages/`.
- **`api-platform/`** — Symfony 7.4 / API Platform 4 backend. Every API experiment lives under
  `api-platform/src/Domain/<Feature>/`.

## Getting started

```bash
make dev          # Postgres + API in Docker, Vite on the host — recommended
# or
make dev-docker   # everything in Docker, including Vite
```

Front on `http://localhost:5173`, API on `http://localhost:8000/api`
(`http://localhost:8000/api/docs` for the Swagger UI). `make help` lists every target.

## Adding an experiment

**Front** — create `react/src/pages/<name>/<Component>.tsx` and a colocated
`<Component>.meta.ts` next to it exporting a `SandboxMeta` (see
`react/src/sandbox-registry.ts`). The home page and the route are generated from every
`*.meta.ts` found under `src/pages/` — no other file changes.

**Backend** — create `api-platform/src/Domain/<Feature>/` with an `Entity/` (or `Dto/` +
`State/` for a non-persisted resource), optionally `DataFixtures/` and `Tests/`. Doctrine's
attribute mapping and API Platform's resource discovery both recurse `src/Domain` automatically
— no config file changes. See `api-platform/src/Domain/Pagination/` for the reference shape.

## Stack

React 19 · TypeScript · Vite 6 · Tailwind CSS 4 · React Router 7 · TanStack Query/Router ·
Symfony 7.4 · API Platform 4.3 · Doctrine ORM · PostgreSQL 16 · FrankenPHP · Docker Compose.
