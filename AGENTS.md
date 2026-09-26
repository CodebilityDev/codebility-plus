# AGENTS.md

How to add code to `apps/codebility` without breaking its structure. This applies to people and AI agents alike. The other apps in `apps/` are not covered here.

## What the app contains

After the September 2026 reset, the app has four parts:

| Part | Routes | Notes |
|---|---|---|
| Auth | `/auth/*` | Sign-in, sign-up, email verification, password reset, 2FA, waiting and declined pages |
| Applicant flow | `/applicant/*` | Onboarding videos, quiz, commitment, waiting page, profile, account settings |
| Member area | `/home`, `/home/applicants`, `/home/account-settings` | `/home` is a placeholder. Applicant review is the only feature. |
| Public site | `/(marketing)/*`, `/nda-signing/*`, `/proposal` | Maintained separately; see `.cursor/skills/` |

Every other `/home` feature was deleted so it can be rebuilt. The database tables for those features still exist (see `apps/codebility/database-schema.md`). The old code is in git history at the last `dev` commit before the reset: `git show 51d9eb1e:apps/codebility/<path>`.

## Folder map

All paths are relative to `apps/codebility/`.

| Folder | Put here | Example |
|---|---|---|
| `app/<route>/` | `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx` only | `app/home/applicants/page.tsx` |
| `app/<route>/_components/` | UI used only by that route | `app/home/applicants/_components/` |
| `actions/<feature>/` | `"use server"` functions. Reads go in `queries.ts`. | `actions/applicants/applicant.ts`, `actions/applicants/queries.ts` |
| `lib/server/` | Server-only services: Redis, cached fetches, the current user | `lib/server/current-codev.ts` |
| `components/` | UI used by two or more route trees | `components/account-settings/` (used by `/home` and `/applicant`) |
| `components/ui/` | Local UI primitives. Check `@codevs/ui` (`packages/ui`) first. | `components/ui/button.tsx` |
| `hooks/<feature>/` | Client hooks | `hooks/query/use-profile-points.ts` |
| `constants/<feature>/` | Static data and config | `constants/applicants/pipeline-stages.ts` |
| `types/<feature>.ts` | Shared TypeScript types | `types/applicants.ts` |
| `utils/` | Pure helpers with no I/O | `utils/applicants/process-timeline.ts` |
| `utils/validations/` | Zod schemas | `utils/validations/auth.ts` |
| `utils/supabase/` | Supabase clients. Don't add new client factories. | `utils/supabase/server.ts` |
| `store/` | Zustand stores | `store/codev-store.ts` |
| `supabase/migrations/` | SQL migrations named `YYYYMMDD_description.sql` | `supabase/migrations/20260219_schema_fixes.sql` |

Import with the `@/` alias (`@/actions/applicants`), not long `../../` chains.

## Rules

1. A route folder never imports from a sibling route folder, and a `/home` feature never imports from another `/home` feature. A feature may use `app/home/_components/`. ESLint enforces this.
2. Nothing outside `app/` imports from `app/`. ESLint enforces this too.
3. Code starts in its route's `_components/`. Move it to `components/` only when a second route tree needs it.
4. New server actions go in `actions/<feature>/`. Don't add `"use server"` files anywhere else.
5. Don't create new top-level folders. If nothing in the folder map fits, ask first.
6. No docs, notes, `.original` copies or backup files inside `app/`. Docs go in `apps/codebility/docs/`.
7. New files: `PascalCase.tsx` for components, `kebab-case.ts` for everything else. Don't mass-rename existing files.
8. Don't commit scratch output: lint dumps, `tsc` logs, `.patch` files, one-off fix scripts.
9. Change the database only through a new migration file. Never edit an applied migration.

## Adding a private page

Example: a `reports` feature under `/home/reports`.

1. Create `app/home/reports/page.tsx` and, if needed, `app/home/reports/_components/`.
2. Put server actions in `actions/reports/`, with reads in `actions/reports/queries.ts`.
3. Add the route to `types/zod/paths.config.ts` under `app`.
4. Add a sidebar link in `constants/sidebar.ts`, with a `permission` key.
5. In the same file, add the key to the `RolePermissions` type, to `NO_PERMISSIONS` and `INACTIVE_PERMISSIONS`, and to the `roles` select.
6. Add `"/home/reports": "reports"` to `routePermissionMap` in `middleware.ts`. The middleware builds its `roles` select from this map.
7. Add the column with a migration, for example `supabase/migrations/20261001_add_reports_permission.sql`:

   ```sql
   alter table roles add column reports boolean not null default false;
   ```

8. Turn the permission on for the roles that need it, in the same migration or in the Supabase dashboard.

Skip steps 4 to 8 for a page every member can see.

## Removing a feature

Run the same steps in reverse: delete the route folder and its `actions/`, `hooks/`, `constants/` and `types/` files. Then remove its sidebar link, its `paths.config.ts` entry and its `routePermissionMap` entry. Before you commit, search for the route string (`/home/reports`) and any `/api/` paths the feature used. Leave the database column and tables unless you're also writing a migration to drop them.

## Before you push

From the repo root:

```bash
pnpm --filter codebility lint
```

```bash
pnpm codebility:build
```

CI runs both on every push and pull request to `dev`. The build type-checks the app, so a type error fails it. Lint fails on errors, including folder-boundary violations. `pnpm --filter codebility typecheck` also works once `next-env.d.ts` exists, which the first `dev` or `build` run creates.

For changes to auth, middleware or applicant approval, also click through in `pnpm codebility`: sign up, sign in, the applicant pages, and accepting or denying a test applicant at `/home/applicants`.

## Known exceptions

- `app/(marketing)` is imported by the root layout, `app/auth/waiting/layout.tsx` and a few files in `lib/`, `types/` and `components/providers/`. The lint rule allows imports from `app/(marketing)` for now. Don't add new ones. Move the shared piece to `components/` or `lib/` instead.
- `constants/sidebar.ts`, `utils/uploadImage.ts` and `utils/ndaStorageService.ts` are `"use server"` files outside `actions/`. Leave them where they are unless you're already changing them.
- `DEBT_RULES` in `apps/codebility/eslint.config.js` lists rules that warn instead of error because older code breaks them. New code should pass them. When a rule reaches zero warnings, remove it from the list.
