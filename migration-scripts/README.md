# Supabase Data Migration Guide

This guide will help you transfer all data from your current Supabase project to a new one.

## Method 1: Using Supabase Dashboard (Recommended for most users)

### Step 1: Export from Old Project

1. **Login to your old Supabase project**
   - Go to https://supabase.com
   - Select your current project

2. **Export Schema**
   - Go to **Settings** → **Database**
   - Click **Connection string** tab
   - Copy the connection details
   - Go to **SQL Editor**
   - Run the queries in `export-schema.sql`
   - Copy the output to create schema statements

3. **Export Data**
   - In **SQL Editor**, run the queries in `export-data.sql`
   - This will show you all tables
   - For each table, run: `COPY (SELECT * FROM table_name) TO STDOUT WITH CSV HEADER;`
   - Copy the CSV output and save to files

### Step 2: Import to New Project

1. **Create new Supabase project**
   - Create a new project at https://supabase.com

2. **Import Schema**
   - Go to **SQL Editor** in new project
   - Run the schema creation statements from Step 1

3. **Import Data**
   - For each CSV file, go to **Table Editor**
   - Click **Insert** → **Import data from CSV**
   - Upload your CSV files

## Method 2: Using pg_dump/pg_restore (Advanced)

### Prerequisites
```bash
# Install PostgreSQL tools
brew install postgresql
```

### Export from Old Project
```bash
# Get connection string from Supabase Settings → Database
# Format: postgresql://postgres:[password]@[host]:5432/postgres

# Export schema and data
pg_dump "postgresql://postgres:[OLD_PASSWORD]@[OLD_HOST]:5432/postgres" \
  --no-owner \
  --no-acl \
  --clean \
  --if-exists \
  -f backup.sql

# Or export schema only
pg_dump "postgresql://postgres:[OLD_PASSWORD]@[OLD_HOST]:5432/postgres" \
  --schema-only \
  --no-owner \
  --no-acl \
  -f schema.sql

# Or export data only
pg_dump "postgresql://postgres:[OLD_PASSWORD]@[OLD_HOST]:5432/postgres" \
  --data-only \
  --no-owner \
  --no-acl \
  -f data.sql
```

### Import to New Project
```bash
# Import to new project
psql "postgresql://postgres:[NEW_PASSWORD]@[NEW_HOST]:5432/postgres" \
  -f backup.sql
```

## Method 3: Using Supabase CLI (Most Advanced)

### Setup
```bash
# Already installed via brew install supabase/tap/supabase

# Login (requires interactive terminal)
supabase login

# Link to old project
supabase link --project-ref [OLD_PROJECT_REF]

# Generate migration
supabase db diff -f initial_migration

# Switch to new project
supabase link --project-ref [NEW_PROJECT_REF]

# Apply migration
supabase db push
```

## Method 4: Using Custom Migration Scripts

I've created Node.js scripts to automate the process:

### Step 1: Install Dependencies
```bash
cd /Users/zeff/Desktop/Work/codebility-plus/migration-scripts
npm init -y
npm install @supabase/supabase-js csv-parser csv-writer
```

### Step 2: Run Migration Script
```bash
node migrate-data.js
```

## Important Notes

### Before Migration:
1. **Backup your current project** - Export everything first
2. **Test the new project** - Import to a test project first
3. **Check dependencies** - Ensure all extensions are enabled
4. **Note the differences** - Different project URLs, keys, etc.

### After Migration:
1. **Update environment variables** in your app
2. **Test all functionality** 
3. **Check Row Level Security** policies
4. **Verify triggers and functions**
5. **Test authentication** flows

### Common Issues:
- **UUID conflicts** - Ensure UUID extension is enabled
- **RLS policies** - May need manual recreation
- **Storage buckets** - Need separate migration
- **Auth users** - May need to re-invite users
- **Custom extensions** - Enable in new project first

## Storage Migration

Supabase Storage (files/images) needs separate migration:

1. **Export files** from old project's Storage
2. **Download all buckets** using Supabase API
3. **Upload to new project** using new project API
4. **Update file URLs** in your database

## Authentication Migration

- **Email/Password users**: Export user data and re-invite
- **OAuth providers**: Reconfigure in new project
- **Custom claims**: Recreate in new project

## Need Help?

If you encounter issues:
1. Check Supabase logs in Dashboard
2. Verify database connection strings
3. Ensure all extensions are enabled
4. Check RLS policies are correctly applied
5. Test with small data sets first

## Quick Commands Reference

```bash
# Check current project
supabase status

# Generate migration
supabase db diff -f migration_name

# Apply migration
supabase db push

# Reset database (careful!)
supabase db reset

# Start local development
supabase start
```