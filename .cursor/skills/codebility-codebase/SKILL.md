---
name: codebility-codebase
description: >-
  Maps the Codebility monorepo (Next.js 15, Supabase, marketing static data patterns).
  Use when adding features, debugging auth/middleware, applicant pipeline, projects,
  /services marketing page, kanban, or when the user mentions Codebility or codebility-plus.
---

# Codebility codebase (LLM reference)

Compressed map for a **fresh start**. Full Obsidian graph: `C:/Project Sentry/Codebility/` → start at `00 - Codebility Home.md` and `LLM Guide - How to Traverse Codebility.md`.

**Monorepo root:** `C:/Users/Programming/Desktop/Projects/Compile/Work/codebility-plus`  
**Main app:** `apps/codebility`  
**Package manager:** pnpm from monorepo root (`pnpm codebility` for dev)

## Repository layout

| Area | Path |
|------|------|
| Routes | `apps/codebility/app/` |
| Shared UI | `components/` |
| Server logic | `lib/server/` |
| Validations | `lib/validations/` |
| Zustand | `store/` |
| Supabase clients | `utils/supabase/` |
| Types | `types/` |
| Config | `config/app.config.ts`, `config/paths.config.ts` |
| Migrations | `supabase/migrations/` (never `migration-scripts/`) |
| Shared UI pkg | `packages/ui` (`@codevs/ui`) |

## Route groups

| Group | Path | Audience |
|-------|------|----------|
| Marketing | `app/(marketing)/` | Public — keep static |
| Auth | `app/auth/` | Sign-in/up, verify |
| Applicant | `app/applicant/` | Pre-acceptance pipeline |
| Home | `app/home/` | Accepted codevs + admins |
| API | `app/api/` | Thin JSON for client fetch |

## Layering (feature folder)

```
page.tsx (RSC) → _components/ → actions.ts (mutations)
              → lib/server/*.service.ts or *-cached.ts
              → utils/supabase/*
```

## Auth and middleware

- `middleware.ts` — route protection, `application_status` workflow, RBAC
- `lib/server/auth-guard.ts` — server action guards
- Applicant statuses: `applying` → `testing` → `onboarding` → `waitlist` → `passed` | `denied`
- Marketing routes must **not** call `cookies()` or session in page tree

## Marketing static data (critical)

Load skill **`nextjs-static-public-data`** before any marketing public data work.

| Pattern | Example | SSR default | Client |
|---------|---------|-------------|--------|
| A | LandingAdmins | full section in SC | motion only |
| B | Landing interns | page 1 in SC | page 2+ via API, `useState` pager |
| C | `/services` | `all` page 1 in SC | `?category=`, `?project=`, `useState` pager |

Hard rules:
- No `await searchParams` on marketing `page.tsx`
- List page index: **`useState` only** — never `?page=`
- Public reads: `createClientAnon()` + `unstable_cache` in `lib/server/*-cached.ts`
- Mutations only via Server Actions; `revalidateTag("services-projects")` on project changes
- No comments in edited files

Key files:
- `lib/server/services-projects-cached.ts`
- `app/api/services-projects/route.ts`
- `app/(marketing)/services/`

## Landing motion

Load skill **`landing-scroll-motion`** for `app/(marketing)/_components/landing/*`.
Prefer `whileInView` + `viewport.once`; avoid `useEffect` for scroll/load/data.

## Major domains

| Domain | UI | Server |
|--------|-----|--------|
| Applicant onboarding | `app/applicant/onboarding/`, `waiting/` | applicant table, video progress |
| Admin applicants | `app/home/applicants/` | accept/deny actions |
| Projects (internal) | `app/home/projects/` | `project.service.ts`, `actions.ts` |
| Public services | `app/(marketing)/services/` | Pattern C cache + API |
| Kanban | `app/home/kanban/` | `store/kanban-store.ts`, dnd-kit |
| Tasks | `app/home/tasks/` | task modals, TipTap |

## State and cache

| Layer | Tech |
|-------|------|
| Postgres | Supabase |
| Public marketing lists | `unstable_cache` + tags |
| App cache | Redis (ioredis, graceful fallback) |
| Client server-state | TanStack Query |
| Client UI | Zustand |

## Adding a feature (checklist)

1. Identify route group (marketing vs home vs applicant).
2. Mirror nearest feature folder colocation (`page.tsx`, `actions.ts`, `_components/`).
3. Marketing public data → pick pattern A/B/C; never dynamize `page.tsx`.
4. DB changes → new migration in `supabase/migrations/`.
5. Mutations → Server Actions + appropriate `revalidateTag`.
6. Read `CLAUDE.md` and `database-schema.md` for table names.

## Commands

```bash
pnpm i                    # root
pnpm codebility           # dev
pnpm codebility:build     # build
cd apps/codebility && pnpm typecheck
```

## Project skills (always load when relevant)

| Skill | When |
|-------|------|
| `nextjs-static-public-data` | Marketing data, pagination, `/services` |
| `landing-scroll-motion` | Landing animations, scroll effects |
| `codebility-codebase` | General orientation (this file) |

Vault path: `C:/Project Sentry/Cursor/Skills/Projects/codebility-plus/`
