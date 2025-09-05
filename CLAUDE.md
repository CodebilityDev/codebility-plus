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
- Application status workflow: `applying` → `pending` → `passed`/`failed`
- Email verification requirements

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
- **Job System**: `job_listings`, `job_applications` 
- **Attendance**: `attendance`, `attendance_summary`
- **Gamification**: `skill_categories`, `codev_points`
- **Kanban**: `kanban_board`, `kanban_column`, `kanban_sprint`, `task`

For detailed schema information, relationships, and SQL examples, see `database-schema.md` in the root directory.