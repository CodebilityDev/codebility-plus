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

## Folder layout

All paths are relative to `apps/codebility/`.

`app/` holds Next.js routing files only: `page`, `layout`, `loading`, `error`, `not-found`, `route`, `sitemap` and `robots`. Everything else lives in one of these folders:

| Folder | Put here |
|---|---|
| `components/` | React components |
| `providers/` | React context providers |
| `hooks/` | Client hooks |
| `store/` | Zustand stores |
| `actions/` | `"use server"` functions (mutations and reads) |
| `lib/` | Server-only code: Supabase clients, Redis, cached fetches |
| `utils/` | Pure helpers and Zod schemas, no I/O |
| `types/` | TypeScript types |
| `constants/` | Static data and config, including route paths |
| `styles/` | CSS files |

Inside each folder, files are grouped by the route that uses them:

- **One route uses it** → `<folder>/<route>/`. The route folder mirrors the URL: `/home/applicants` → `components/home/applicants/`. Route groups drop their parentheses (`(marketing)` → `marketing`). Dynamic segments don't get a folder: files for `/profiles/[id]` go in `components/marketing/profiles/` with a descriptive name like `ProfileDetailContent.tsx`.
- **Two or more routes use it** → `<folder>/global/`. This includes code shared by two pages in the same area, like `/careers` and `/codevs`.
- **The area's layout or root page uses it** → `<folder>/<area>/`. For example, the `/home` shell (`Navbar`, `MobileNav`) is in `components/home/`, and the landing page `/` is in `components/marketing/`.

`components/global/` has category folders so it stays browsable: `ui/`, `layout/`, `typography/`, `feedback/`, `modals/`, `account-settings/`, `marketing/`, `codev/`, `animation/`. Other `global/` folders are flat.

Examples:

| File | Why it's there |
|---|---|
| `components/home/applicants/applicantColumns.tsx` | Only `/home/applicants` uses it |
| `actions/home/applicants/applicants.ts` | Accept, deny and move actions for `/home/applicants` |
| `components/global/account-settings/AccountSettings.tsx` | Used by `/home/account-settings` and `/applicant/account-settings` |
| `providers/global/ThemeProvider.tsx` | Used by more than one route |
| `lib/global/supabase-server.ts` | Used everywhere, including `middleware.ts` |
| `constants/global/paths.ts` | Route paths used across the app |
| `actions/home/sidebar.ts` | The `/home` sidebar links and permission lookup |

Import with the `@/` alias (`@/components/global/ui/button`), not `../` chains.

## Rules

1. Put each new file where the layout above says. When a second route starts using a route-only file, move it to `global/`.
2. A file may import from any `global/` folder and from folders of its own route, and from nothing else. `components/home/applicants/` can use `hooks/global/` and `actions/home/applicants/`, but not `components/auth/sign-in/`.
3. Nothing imports from `app/`, except a route file importing a sibling routing file such as `./loading`.
4. No subfolders inside a route folder. Name files so they make sense on their own: `ProfileDetailContent.tsx`, not `profiles/[id]/Content.tsx`.
5. No `index.ts` barrel files. Import from the file that defines the export.
6. New files: `PascalCase.tsx` for components, `kebab-case.ts` for everything else. Don't mass-rename existing files.
7. Don't create new top-level folders, and don't put docs, notes or backup copies next to code. Docs go in `apps/codebility/docs/`.
8. Don't commit scratch output: lint dumps, `tsc` logs, `.patch` files, one-off fix scripts.
9. Change the database only through a new migration in `supabase/migrations/`, named `YYYYMMDD_description.sql`. Never edit an applied migration.

ESLint (`codebility/route-scope` in `apps/codebility/eslint.config.js`) enforces rules 2 and 3, and fails on any non-routing file inside `app/`.

## Adding a private page

Example: a `reports` feature under `/home/reports`.

1. Create `app/home/reports/page.tsx`.
2. Put its components in `components/home/reports/`, server actions in `actions/home/reports/`, and hooks, types or constants in the matching `home/reports/` folder of each.
3. Add the route to `constants/global/paths.ts` under `app`.
4. Add a sidebar link in `actions/home/sidebar.ts`, with a `permission` key.
5. In the same file, add the key to the `RolePermissions` type, to `NO_PERMISSIONS` and `INACTIVE_PERMISSIONS`, and to the `roles` select.
6. Add `"/home/reports": "reports"` to `routePermissionMap` in `middleware.ts`. The middleware builds its `roles` select from this map.
7. Add the column with a migration, for example `supabase/migrations/20261001_add_reports_permission.sql`:

   ```sql
   alter table roles add column reports boolean not null default false;
   ```

8. Turn the permission on for the roles that need it, in the same migration or in the Supabase dashboard.

Skip steps 4 to 8 for a page every member can see.

## Removing a feature

Delete `app/home/<feature>/` and every `<folder>/home/<feature>/` folder. Then remove its sidebar link, its `paths.ts` entry and its `routePermissionMap` entry. If a `global/` file was only there because of this feature, move it back to the one route that still uses it, or delete it if nothing does. Before you commit, search for the route string (`/home/reports`) and any `/api/` paths the feature used. Leave the database column and tables unless you're also writing a migration to drop them.

## Before you push

From the repo root:

```bash
pnpm --filter codebility lint
```

```bash
pnpm codebility:build
```

CI runs both on every push and pull request to `dev`. The build type-checks the app, so a type error fails it. Lint fails on errors, including folder-layout violations. `pnpm --filter codebility typecheck` also works once `next-env.d.ts` exists, which the first `dev` or `build` run creates.

For changes to auth, middleware or applicant approval, also click through in `pnpm codebility`: sign up, sign in, the applicant pages, and accepting or denying a test applicant at `/home/applicants`.

## Known exceptions

- `app/applicant/layout.tsx`, `components/applicant/waiting/applicantFetchComp.tsx` and `components/auth/declined/DeclineComponent.tsx` start with `"use server"` although they are components. Leave them unless you're already changing them.
- `actions/home/applicants/accepted-email.ts` is not called anywhere: accepting an applicant does not send the acceptance email yet.
- `DEBT_RULES` in `apps/codebility/eslint.config.js` lists rules that warn instead of error because older code breaks them. New code should pass them. When a rule reaches zero warnings, remove it from the list.
