# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Folder structure, contribution rules and the recipe for adding a page live in `AGENTS.md`. Read it before adding or moving files in `apps/codebility`:

@AGENTS.md

## Development Commands

### Root Level Commands
- `pnpm dev` - Start all apps in development mode with watch
- `pnpm codebility` - Start only the Codebility app in development
- `pnpm native` - Start the Expo mobile app
- `pnpm web` - Start the Next.js template app

### Build and Production
- `pnpm codebility:build` - Build the Codebility app (builds `@codevs/ui` first, then type-checks and builds the app)
- `pnpm codebility:start` - Start Codebility in production mode

### Code Quality
- `pnpm --filter codebility lint` - Lint the Codebility app, including folder-boundary rules
- `pnpm lint` - Run ESLint across all packages
- `pnpm format` - Check Prettier formatting
- `pnpm format:fix` - Auto-fix Prettier formatting
- `pnpm clean:workspaces` - Clean all workspace node_modules

### Individual App Commands
Within each app directory (`apps/codebility`, `apps/dinemate`, etc.):
- `pnpm dev` - Start development server with turbopack
- `pnpm build` - Build for production
- `pnpm typecheck` - Run TypeScript type checking (needs `next-env.d.ts`, created by the first `dev` or `build`)
- `pnpm lint` - Run ESLint for the app
- `pnpm analyze` - Analyze bundle size

## Architecture Overview

### Monorepo Structure
This is a Turborepo monorepo with pnpm workspaces containing multiple Next.js applications and shared packages.

**Key Applications:**
- `apps/codebility` - Auth, applicant approval and the public marketing site. The member area is being rebuilt; see `AGENTS.md`.
- `apps/dinemate` - Restaurant POS system
- `apps/expo` - React Native mobile app
- `apps/next` - Next.js template/starter

**Shared Packages:**
- `packages/ui` - Centralized UI component library (shadcn/ui + Radix UI)
- `tooling/eslint` - Shared ESLint configuration
- `tooling/prettier` - Shared Prettier configuration
- `tooling/tailwind` - Shared Tailwind CSS configuration
- `tooling/typescript` - Shared TypeScript configuration

### Technology Stack
- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS with shared configuration
- **UI Components**: shadcn/ui with Radix UI primitives
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with custom middleware
- **State Management**: Zustand (global) + TanStack Query (server state)
- **Forms**: React Hook Form with Zod validation
- **Build System**: Turborepo for build orchestration

### Database & Backend Architecture
- **Primary Database**: Supabase
- **Authentication**: Supabase Auth plus role-based permissions from the `roles` table
- **File Storage**: Supabase Storage for images and documents
- **Email**: Resend, called from `actions/home/applicants/*-email.ts`

### Authentication Flow
- `middleware.ts` protects routes and redirects by application status
- Application status: `applying` → `testing` → `onboarding` → `waitlist` → `passed` (accepted) or `denied`/`failed`
- Email verification is required, and 2FA is enforced when the user has enrolled it
- Approved (`passed`) users land on `/home`. Everyone else stays in `/applicant/*` or `/auth/*`.
- Per-route permissions: `routePermissionMap` in `middleware.ts`, backed by boolean columns on `roles`

### Important Configuration Files
- `turbo.json` - Turborepo task configuration and caching rules
- `pnpm-workspace.yaml` - Workspace package definitions
- `apps/codebility/middleware.ts` - Authentication and route protection logic
- `apps/codebility/eslint.config.js` - Lint rules, including folder boundaries
- `apps/codebility/database-schema.md` - Database schema documentation with table relationships

### Environment Setup
1. Create `.env.local` in the app directory. For Codebility, the variables are listed in the `env` block of `.github/workflows/ci.yml`; other apps may ship a `.env.example`.
2. Configure Supabase credentials and other required environment variables
3. Run `pnpm i` from the root to install all dependencies

### Testing and Type Safety
- TypeScript strict mode (`noImplicitAny` is off in the Codebility app)
- `next build` fails on type errors, and CI runs lint and build on every push and PR to `dev`
- Zod schemas for runtime validation; T3 env pattern for environment variables
- No test runner is configured. Test changes manually in the dev server.

### Package Naming Convention
All shared packages must be prefixed with `@codevs/` (e.g., `@codevs/ui`, `@codevs/eslint-config`).

### Database Schema
The Supabase database still contains tables for features removed from the app in September 2026. Key tables:
- **Core**: `codev` (users), `roles` (permissions)
- **Applicant System**: `applicant` (test results, onboarding progress, quiz scores, commitments)
- **Onboarding**: `onboarding_video_progress` (video completion tracking)
- **Not used by the app right now**: `project`, `project_members`, `job_listings`, `job_applications`, `attendance`, `attendance_summary`, `skill_categories`, `codev_points`, `kanban_*`, `task`, `notifications`, `news_banners`, `surveys`

For detailed schema information, relationships, and SQL examples, see `apps/codebility/database-schema.md`.

### Applicant Onboarding System

**Overview:**
A 4-step onboarding system that takes applicants from initial application to acceptance:

1. **Applying** - Submit application
2. **Testing** - Complete coding assessment
3. **Onboarding** - Watch 4 videos, pass quiz (70%), sign commitment
4. **Waitlist** - Await admin review and acceptance

**Key Features:**
- **Video System**: 4 onboarding videos; each must be 98% watched to count as complete
- **Sequential Unlocking**: Videos unlock only after completing previous ones
- **Quiz System**: 6 questions focusing on understanding that Codebility is:
  - FREE (no payment required)
  - For portfolio building and upskilling
  - NOT for quick employment
  - Requires 3-6 months commitment
  - Requires twice-weekly mandatory meetings
- **Digital Commitment**: Canvas-based signature capture
- **Mobile Capability**: Tracks if applicant can do React Native development
- **Progress Persistence**: State saved across page refreshes
- **Email Notifications**: Automated emails at each stage transition
- **Admin View**: Quiz scores, mobile capability, commitment status

**File Locations:**
- Routes: `apps/codebility/app/applicant/onboarding/`, `app/applicant/waiting/`, `app/home/applicants/`
- Components: `components/applicant/onboarding/`, `components/applicant/waiting/`, `components/home/applicants/`
- Server actions: `actions/home/applicants/`, `actions/applicant/onboarding/`, `actions/applicant/waiting/`
- Migrations: `apps/codebility/supabase/migrations/`

**Database Fields Added:**
- `applicant.quiz_score` - Score achieved on quiz
- `applicant.quiz_total` - Total quiz questions
- `applicant.quiz_passed` - Boolean pass/fail status
- `applicant.quiz_completed_at` - Completion timestamp
- `applicant.can_do_mobile` - Mobile development capability
- `applicant.commitment_signed_at` - Digital signature timestamp
- `applicant.signature_data` - Base64 signature image

**Admin Actions:**
- **Accept**: Sets status to `passed`. The acceptance email (`actions/home/applicants/accepted-email.ts`) exists but is not sent yet.
- **Deny**: Sends denial email with reapplication information
- **View Progress**: See quiz scores, mobile capability, and commitment status

### Onboarding Videos
The videos are unlisted YouTube videos referenced by ID through `NEXT_PUBLIC_ONBOARDING_VIDEO_ID_1` to `_4`. Don't host them on Supabase Storage. See `apps/codebility/docs/VIDEO_UPLOAD_GUIDE.md`.

### Database Migrations

All database migrations are located in `apps/codebility/supabase/migrations/`

**Migration Naming Convention:** `YYYYMMDD_description.sql`. Some older files are undated; don't rename them.

**Legacy Migrations:**
The `migration-scripts/` folder in the root contains deprecated migration tools and scripts.
Do not add new migrations there. See `migration-scripts/DEPRECATION_NOTICE.md` for details.

## Agent skills

### Issue tracker

Issues and specs live in GitHub Issues for `CodebilityDev/codebility-plus`. See `docs/agents/issue-tracker.md`.

### Triage labels

Five canonical triage roles mapped to GitHub label strings. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout: root `CONTEXT.md` and `docs/adr/`, neither created yet. See `docs/agents/domain.md`.
