# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Root Level Commands
- `pnpm dev` - Start all apps in development mode with watch
- `pnpm codebility` - Start only the Codebility app in development
- `pnpm native` - Start the Expo mobile app
- `pnpm web` - Start the Next.js template app

### Build and Production
- `pnpm codebility:build` - Build the Codebility app
- `pnpm codebility:start` - Start Codebility in production mode

### Code Quality
- `pnpm lint` - Run ESLint across all packages
- `pnpm lint:fix` - Auto-fix ESLint issues
- `pnpm format` - Check Prettier formatting
- `pnpm format:fix` - Auto-fix Prettier formatting
- `pnpm clean:workspaces` - Clean all workspace node_modules

### Individual App Commands
Within each app directory (`apps/codebility`, `apps/dinemate`, etc.):
- `pnpm dev` - Start development server with turbopack
- `pnpm build` - Build for production
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm lint` - Run ESLint for the app
- `pnpm analyze` - Analyze bundle size

## Architecture Overview

### Monorepo Structure
This is a Turborepo monorepo with pnpm workspaces containing multiple Next.js applications and shared packages.

**Key Applications:**
- `apps/codebility` - Main developer talent management platform
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
- **Database**: Supabase (PostgreSQL) with real-time capabilities
- **Authentication**: Supabase Auth with custom middleware
- **State Management**: Zustand (global) + TanStack Query (server state)
- **Forms**: React Hook Form with Zod validation
- **Build System**: Turborepo for build orchestration

### Database & Backend Architecture
- **Primary Database**: Supabase with real-time subscriptions
- **Caching**: Redis implementation with graceful fallback (ioredis)
- **Authentication**: Multi-layered with role-based permissions
- **File Storage**: Supabase Storage for images/documents
- **Email**: Custom mailer service with Nodemailer

### Key Architectural Patterns

**Authentication Flow:**
- Middleware-based route protection in `middleware.ts`
- Role-based access control with `roles` table
- Application status workflow: `applying` → `testing` → `onboarding` → `waitlist` → `accepted`/`denied`
- Email verification requirements
- Comprehensive onboarding system with video watching, quizzes, and digital commitment signing

**State Management Pattern:**
- Zustand stores in `store/` directories for global state
- TanStack Query for server state caching and synchronization
- Form state handled by React Hook Form with Zod schemas

**Component Architecture:**
- Centralized design system in `@codevs/ui` package
- Consistent naming: shared components in `Components/`, UI primitives in `ui/`
- Modal system with provider pattern for complex modals
- Theme support with next-themes (system/light/dark modes)

**Service Layer:**
- Server actions in `actions.ts` files for data mutations
- Service files in `lib/server/` for business logic
- API routes in `app/api/` for external integrations

### Important Configuration Files
- `turbo.json` - Turborepo task configuration and caching rules
- `pnpm-workspace.yaml` - Workspace package definitions
- `middleware.ts` - Authentication and route protection logic
- `.env.example` files in each app for required environment variables
- `database-schema.md` - Complete database schema documentation with table relationships

### Environment Setup
1. Copy `.env.example` to `.env.local` in the target app directory
2. Configure Supabase credentials and other required environment variables
3. Run `pnpm i` from the root to install all dependencies

### Testing and Type Safety
- TypeScript strict mode enabled across all packages
- Zod schemas for runtime validation of data and environment variables
- T3 env pattern for environment variable validation
- No test files found - manual testing or external testing setup

### Common Development Patterns
- Server Components are the default, Client Components marked with "use client"
- Service functions prefixed with action names (e.g., `createProject`, `updateUser`)
- Consistent error handling with toast notifications
- Form validation using Zod schemas with React Hook Form
- Responsive design with mobile-first Tailwind CSS approach

### Package Naming Convention
All shared packages must be prefixed with `@codevs/` (e.g., `@codevs/ui`, `@codevs/eslint-config`).

### Database Schema
The project uses Supabase (PostgreSQL) with the following key tables:
- **Core**: `codev` (users), `roles` (permissions), `project`, `project_members`
- **Applicant System**: `applicant` (test results, onboarding progress, quiz scores, commitments)
- **Onboarding**: `onboarding_video_progress` (video completion tracking)
- **Job System**: `job_listings`, `job_applications`
- **Attendance**: `attendance`, `attendance_summary`
- **Gamification**: `skill_categories`, `codev_points`
- **Kanban**: `kanban_board`, `kanban_column`, `kanban_sprint`, `task`
- **Communication**: `notifications`, `news_banners`, `surveys`

For detailed schema information, relationships, and SQL examples, see `database-schema.md` in the root directory.

### Applicant Onboarding System

**Overview:**
A comprehensive 4-step onboarding system that guides applicants from initial application through to acceptance:

1. **Applying** - Submit application
2. **Testing** - Complete coding assessment
3. **Onboarding** - Watch 4 videos, pass quiz (70%), sign commitment
4. **Waitlist** - Await admin review and acceptance

**Key Features:**
- **Video System**: 4 onboarding videos with 90% watch completion validation
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
- **Admin Dashboard**: View quiz scores, mobile capability, commitment status

**File Locations:**
- Onboarding UI: `apps/codebility/app/applicant/onboarding/`
- Waitlist UI: `apps/codebility/app/applicant/waiting/`
- Admin View: `apps/codebility/app/home/applicants/`
- Migrations: `apps/codebility/supabase/migrations/`
- Videos: Stored in Supabase Storage at `public/onboarding-videos/`

**Database Fields Added:**
- `applicant.quiz_score` - Score achieved on quiz
- `applicant.quiz_total` - Total quiz questions
- `applicant.quiz_passed` - Boolean pass/fail status
- `applicant.quiz_completed_at` - Completion timestamp
- `applicant.can_do_mobile` - Mobile development capability
- `applicant.commitment_signed_at` - Digital signature timestamp
- `applicant.signature_data` - Base64 signature image

**Admin Actions:**
- **Accept**: Sends acceptance email with /home access instructions
- **Deny**: Sends denial email with reapplication information
- **View Progress**: See quiz scores, mobile capability, and commitment status

### File Storage

**Supabase Storage Buckets:**
- `public/onboarding-videos/` - Onboarding video files (part1.mp4 - part4.mp4)
- Upload via Supabase Dashboard → Storage → Select bucket → Upload files
- Videos are referenced by path in video player component
- Total size: ~5.8GB (too large for git, excluded via .gitignore)

### Database Migrations

All database migrations are located in `apps/codebility/supabase/migrations/`

**Migration Naming Convention:** `YYYYMMDD_description.sql`

**Key Migrations:**
- `add_quiz_and_commitment_fields.sql` - Onboarding system fields
- `create_onboarding_videos_table.sql` - Video progress tracking
- `create_notification_system.sql` - Notification infrastructure
- `create_attendance_tables.sql` - Attendance tracking
- `20251127_project_category_many_to_many.sql` - Project categories

**Legacy Migrations:**
The `migration-scripts/` folder in the root contains deprecated migration tools and scripts.
Do not add new migrations there. See `migration-scripts/DEPRECATION_NOTICE.md` for details.