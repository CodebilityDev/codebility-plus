# DEPRECATION NOTICE

⚠️ **This folder is deprecated and should not be used for new migrations.**

## What is this folder?

This folder contains old migration scripts and tools from when the database schema was being set up and migrated between Supabase projects.

## Where should migrations go now?

All new migrations should be added to:
```
apps/codebility/supabase/migrations/
```

## What's in this folder?

- **Old setup scripts**: Initial database schema setup
- **Migration tools**: JavaScript files for data migration between projects
- **Legacy SQL**: One-off fixes and schema corrections from early development
- **Project category migration**: This has been moved to `apps/codebility/supabase/migrations/20251127_project_category_many_to_many.sql`

## Should I delete this folder?

**Not recommended** - Keep it for historical reference in case you need to:
- Understand how the schema evolved
- Reference old migration patterns
- Debug issues related to early database setup

However, **do not add new files** to this directory.

## For New Migrations

Follow the process documented in:
```
apps/codebility/supabase/migrations/README.md
```

Use the naming convention: `YYYYMMDD_description.sql`
