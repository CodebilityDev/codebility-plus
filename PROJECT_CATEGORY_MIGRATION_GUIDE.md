# Project Category Migration Guide

## Overview
Successfully migrated the project-category relationship from **one-to-one** to **many-to-many** (one project can have multiple categories).

## Changes Summary

### 1. Database Schema Changes

#### New Junction Table Created
- **Table**: `project_categories`
- **Purpose**: Links projects to multiple categories
- **Columns**:
  - `id` (UUID, primary key)
  - `project_id` (UUID, foreign key to `projects.id`)
  - `category_id` (INTEGER, foreign key to `projects_category.id`)
  - `created_at` (timestamp)
- **Constraints**:
  - Unique constraint on `(project_id, category_id)` to prevent duplicates
  - Foreign keys with CASCADE delete

#### Removed Column
- Removed `project_category_id` from `projects` table (old one-to-one relationship)

#### Migration File Location
[migration-scripts/project-category-many-to-many.sql](migration-scripts/project-category-many-to-many.sql)

**The migration includes**:
- Automatic data migration from old `project_category_id` to new junction table
- Indexes for performance optimization
- A helpful view `projects_with_categories` for easy querying

---

### 2. TypeScript Type Updates

#### New Types Added
Location: [apps/codebility/types/home/codev.ts](apps/codebility/types/home/codev.ts)

```typescript
export interface ProjectCategory {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectCategoryJunction {
  id: string;
  project_id: string;
  category_id: number;
  created_at?: string;
}
```

#### Updated Project Interface
- **Changed**: `project_category_id?: number`
- **To**: `categories?: ProjectCategory[]`

---

### 3. Service Layer Updates

#### Updated Files:
- [apps/codebility/lib/server/project.service.ts](apps/codebility/lib/server/project.service.ts)
- [apps/codebility/app/home/projects/actions.ts](apps/codebility/app/home/projects/actions.ts)

**Changes:**
- All queries now fetch categories through the junction table
- Categories are automatically flattened for easier consumption
- Query structure:
```typescript
categories:project_categories(
  projects_category(
    id,
    name,
    description
  )
)
```

---

### 4. CRUD Operations Updated

#### Create Project
- Now accepts `category_ids` (JSON array) instead of single `project_category_id`
- Automatically inserts into junction table

#### Update Project
- Accepts `category_ids` (JSON array)
- Replaces all existing categories for the project

#### Get Project
- Automatically includes all categories in the response

---

### 5. New Helper Functions

Location: [apps/codebility/app/home/projects/actions.ts](apps/codebility/app/home/projects/actions.ts)

```typescript
// Get all categories for a specific project
getProjectCategoriesForProject(projectId: string)

// Add categories to a project
addCategoriesToProject(projectId: string, categoryIds: number[])

// Remove a single category from a project
removeCategoryFromProject(projectId: string, categoryId: number)

// Replace all categories for a project
replaceProjectCategories(projectId: string, categoryIds: number[])
```

---

### 6. Admin Dashboard Updates

Location: [apps/codebility/app/home/admin-dashboard/page.tsx](apps/codebility/app/home/admin-dashboard/page.tsx)

- Updated to query the junction table
- Counts unique projects per category
- Handles many-to-many relationship correctly

---

## How to Apply the Migration

### Step 1: Run the Migration SQL
Execute the migration file in your Supabase SQL editor:

```bash
# File: migration-scripts/project-category-many-to-many.sql
```

**This will**:
1. Create `projects_category` table if it doesn't exist
2. Create the `project_categories` junction table
3. Migrate existing data automatically
4. Remove the old `project_category_id` column
5. Create helpful indexes and views

### Step 2: Test the Changes
No code changes needed - the application code has been updated to work with the new schema.

### Step 3: Update Frontend Components (If Needed)
You'll need to update any forms that create/edit projects to send `category_ids` as a JSON array:

#### Example: Creating a Project
```javascript
const formData = new FormData();
formData.append("name", "My Project");
formData.append("category_ids", JSON.stringify([1, 2, 3])); // Multiple categories
```

#### Example: Displaying Categories
```typescript
// Old way (single category)
{project.project_category_id}

// New way (multiple categories)
{project.categories?.map(cat => cat.name).join(", ")}
```

---

## Frontend Components That May Need Updates

These components reference `projects_category` or `project_category_id` and may need UI updates:

1. [apps/codebility/app/home/projects/_components/ProjectAddModal.tsx](apps/codebility/app/home/projects/_components/ProjectAddModal.tsx)
2. [apps/codebility/app/home/projects/_components/ProjectEditModal.tsx](apps/codebility/app/home/projects/_components/ProjectEditModal.tsx)
3. [apps/codebility/app/home/projects/_components/ProjectViewModal.tsx](apps/codebility/app/home/projects/_components/ProjectViewModal.tsx)
4. [apps/codebility/app/home/projects/_components/ProjectCardContainer.tsx](apps/codebility/app/home/projects/_components/ProjectCardContainer.tsx)

**Recommended UI Update:**
- Change single select dropdowns to multi-select or checkbox groups for categories
- Display multiple category badges/chips instead of a single category name

---

## Benefits of This Change

1. **Flexibility**: Projects can now belong to multiple categories
2. **Better Organization**: More accurate categorization of projects
3. **Analytics**: Better insights into project distribution across categories
4. **Scalability**: Easier to add new categories without restructuring

---

## Database View Available

A convenient view has been created for querying projects with their categories:

```sql
SELECT * FROM projects_with_categories;
```

This view returns projects with all their categories as a JSON array.

---

## Rollback Plan (If Needed)

If you need to rollback:

```sql
-- 1. Add back the old column
ALTER TABLE projects ADD COLUMN project_category_id INTEGER;

-- 2. Populate it with the first category from junction table (if any)
UPDATE projects p
SET project_category_id = (
  SELECT category_id
  FROM project_categories
  WHERE project_id = p.id
  LIMIT 1
);

-- 3. Drop the junction table
DROP TABLE project_categories;

-- 4. Revert code changes via git
git revert <commit-hash>
```

---

## Questions or Issues?

If you encounter any issues:
1. Check that the migration SQL ran successfully
2. Verify the junction table exists: `SELECT * FROM project_categories LIMIT 5;`
3. Check browser console for any API errors
4. Review the helper functions in [actions.ts](apps/codebility/app/home/projects/actions.ts) for examples

---

## Next Steps

1. **Run the migration** in your Supabase database
2. **Test the application** to ensure project queries work correctly
3. **Update frontend forms** to use multi-select for categories
4. **Update display components** to show multiple categories
5. **Test create/edit operations** with multiple categories

Good luck! 🚀
