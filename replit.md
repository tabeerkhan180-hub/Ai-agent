# AI Sales OS

A demo-first sales operations workspace for discovering local businesses, understanding website opportunities, and guiding thoughtful outreach without autonomous closing.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/ai-sales-os run build` — build the web app (workflow supplies `PORT` and `BASE_PATH`)
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- Required env for the API: `PORT`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/ai-sales-os/src/pages/` — dashboard, leads, lead detail, outreach, reports, and settings screens
- `artifacts/ai-sales-os/src/components/shell.tsx` — shared navigation and page chrome
- `artifacts/api-server/src/routes/sales.ts` — demo-first sales API and in-memory workspace state
- `lib/api-spec/openapi.yaml` — source of truth for API contracts
- `artifacts/ai-sales-os/src/index.css` — shared theme tokens and application styling

## Architecture decisions

- The first release runs in DEMO mode with safe, clearly-labelled synthetic leads and no real email sending.
- The frontend uses generated React Query hooks from the OpenAPI contract rather than hand-written fetch calls.
- Live providers are represented as explicit integration readiness states; connecting them is a later opt-in step.
- The API keeps the initial demo state in memory so the product can be previewed without database provisioning or credentials.

## Product

- Dashboard with pipeline summary, funnel pulse, integration readiness, and recent activity
- Lead discovery, search, tier filtering, qualification, website audit evidence, and lead detail
- Outreach queue with message review and safe demo-send flow
- Reports with funnel breakdown and activity timeline
- Settings for approval mode, send limits, and targeting rules

## User preferences

- Keep the product demo-first and human-in-the-loop.

## Gotchas

- Keep `info.title: Api` unchanged in `lib/api-spec/openapi.yaml`; generated import paths depend on it.
- The generated Zod client currently uses Zod 4 APIs such as `z.int()`, so the workspace catalog must stay on Zod 4.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
