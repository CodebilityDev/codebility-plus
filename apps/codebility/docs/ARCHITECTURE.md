# Codebility app file layout

Top-level folders under `apps/codebility/` are the buckets. Group by feature inside each bucket (one level only).

## Buckets

| Folder | Purpose |
|--------|---------|
| `app/` | Routes only: pages, layouts, API route handlers. Route-local `_components/` for UI used by that subtree only. |
| `actions/` | `"use server"` entry points, grouped by feature (`actions/kanban/`, etc.). |
| `lib/` | Server mutations and RSC data fetches only. Name files by consumer (`lib/careers/`, `lib/kanban/`). |
| `utils/` | Pure helpers and Zod validation schemas (`utils/validations/`). |
| `types/` | Shared TypeScript types. Zod config schemas live in `types/zod/`. |
| `constants/` | Static constants by feature. |
| `hooks/` | React hooks by feature. |
| `components/` | Shared UI (2+ route trees). `components/ui/` stays shadcn. |
| `store/` | Zustand stores and client providers (`store/providers/`). |

## Rules

- **lib vs utils**: `lib/` = server I/O (DB, caches, RSC fetches). `utils/` = client-safe pure functions and Zod validators.
- **types**: Inferred Zod types go in `types/` (e.g. `types/auth.ts`), not next to validators.
- **Components**: Shared → `components/`. Single-page → `app/<route>/_components/`. Dedupe near-identical components into shared.
- **No route `_lib`, `_service`, `_hooks`**: Move to root buckets.
- **API routes**: Stay in `app/api/`. Shared handler logic → `lib/server/`.

## Kanban example

```
actions/kanban/board.ts      # moveTask, syncBoardSnapshot
actions/kanban/tasks.ts        # task CRUD
actions/kanban/columns.ts      # column CRUD
actions/kanban/drafts.ts       # draft cards
actions/kanban/queries.ts      # paginated fetches
actions/kanban/boards-list.ts  # create board
actions/kanban/sprints.ts      # sprint CRUD
lib/kanban/action-helpers.ts   # shared auth + position helpers
```

Legacy re-exports under `app/home/kanban/**/actions.ts` point at `@/actions/kanban` for compatibility.

## Migrated features (Phase 2)

```
actions/auth/                  # session, password-reset, declined, onboarding-team
actions/applicants/            # admin applicant actions + email
actions/applicant-onboarding/  # applicant onboarding flow
actions/applicant-waiting/     # applicant test/waiting flow
actions/feeds/post.ts          # feed mutations
actions/home/codev-promote.ts

lib/applicants/query.ts        # RSC: applicant list
lib/applicants/process-timeline.ts
lib/feeds/query.ts
lib/feeds/notification-service.ts
lib/kanban/sprints-query.ts
lib/dashboard/theme.ts
lib/time-tracker/dummy-data.ts

types/applicants.ts
types/applicant-onboarding.ts
types/applicant-waiting.ts
types/feeds.ts                 # PostType, UserMention, etc.

utils/auth/declined.ts
utils/applicant-waiting.ts
utils/validations/feeds.ts
utils/validations/clients.ts
utils/clients/utils.ts
utils/dashboard/time-format.ts
utils/in-house/utils.ts
utils/tasks/time-conversion.ts

constants/feeds/
hooks/home/                    # use-user, use-fetch-enum
hooks/kanban/                  # board sync, column tasks, modals
hooks/in-house/                # use-codev-form

store/providers/               # ThemeProvider, ToasterProvider (from context/)
types/zod/                     # app.config, paths.config (from config/)
```

## Still to migrate

Route-level `actions.ts` under `app/home/*` (projects, hire, overflow, settings, etc.), marketing profile `_service`, kanban `[id]/_services/query.ts`, and deduping shared marketing components (CodevsRoadmap, CodevsNavbar).
