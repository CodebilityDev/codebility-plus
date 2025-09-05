# Database Schema Documentation

This document provides a comprehensive overview of all database tables, their relationships, and usage in the Codebility platform.

## Table of Contents
1. [Core User Management](#core-user-management)
2. [Job Posting System](#job-posting-system)
3. [Attendance Tracking System](#attendance-tracking-system)
4. [Points & Gamification](#points--gamification)
5. [Project Management](#project-management)
6. [Skills & Positions](#skills--positions)
7. [Table Relationships Diagram](#table-relationships-diagram)

---

## Core User Management

### `codev` (Main user table)
Primary table for all developers/coders in the system.

```sql
CREATE TABLE codev (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  email_address VARCHAR UNIQUE NOT NULL,
  phone_number VARCHAR,
  address TEXT,
  about TEXT,
  image_url VARCHAR,
  internal_status VARCHAR CHECK (internal_status IN ('TRAINING', 'GRADUATED', 'INACTIVE', 'MENTOR', 'ADMIN', 'DEPLOYED')),
  availability_status BOOLEAN DEFAULT true,
  application_status VARCHAR CHECK (application_status IN ('applying', 'testing', 'onboarding', 'denied', 'passed')),
  years_of_experience INTEGER,
  role_id INTEGER REFERENCES roles(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### `roles` (User permissions)
Defines role-based access control.

```sql
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  orgchart BOOLEAN DEFAULT false,
  settings BOOLEAN DEFAULT false,
  projects BOOLEAN DEFAULT false,
  applicants BOOLEAN DEFAULT false,
  kanban BOOLEAN DEFAULT false,
  -- other permissions...
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Job Posting System

### `job_listings` ⭐ NEW
Stores all job postings created by the company.

```sql
CREATE TABLE job_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR NOT NULL,
  department VARCHAR NOT NULL,
  location VARCHAR NOT NULL,
  type VARCHAR CHECK (type IN ('Full-time', 'Part-time', 'Contract', 'Internship')),
  level VARCHAR CHECK (level IN ('Entry', 'Mid', 'Senior', 'Lead')),
  description TEXT NOT NULL,
  requirements TEXT[], -- Array of requirements
  salary_range VARCHAR,
  remote BOOLEAN DEFAULT false,
  status VARCHAR DEFAULT 'active' CHECK (status IN ('active', 'closed', 'draft')),
  posted_date DATE DEFAULT CURRENT_DATE,
  created_by UUID REFERENCES codev(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_job_listings_status ON job_listings(status);
CREATE INDEX idx_job_listings_created_by ON job_listings(created_by);
```

### `job_applications` ⭐ NEW
Stores applications submitted for job listings.

```sql
CREATE TABLE job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES job_listings(id) ON DELETE CASCADE,
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  phone VARCHAR NOT NULL,
  linkedin VARCHAR,
  portfolio VARCHAR,
  cover_letter TEXT,
  experience TEXT,
  resume_url VARCHAR,
  status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'shortlisted', 'rejected', 'hired')),
  applied_at TIMESTAMP DEFAULT NOW(),
  reviewed_at TIMESTAMP,
  reviewed_by UUID REFERENCES codev(id),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX idx_job_applications_status ON job_applications(status);
CREATE INDEX idx_job_applications_email ON job_applications(email);
```

---

## Attendance Tracking System

### `attendance` ⭐ NEW
Tracks daily attendance for team members on projects.

```sql
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  codev_id UUID REFERENCES codev(id) ON DELETE CASCADE,
  project_id UUID REFERENCES project(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status VARCHAR NOT NULL CHECK (status IN ('present', 'absent', 'late', 'holiday', 'weekend')),
  check_in TIME,
  check_out TIME,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(codev_id, project_id, date) -- Prevent duplicate entries
);

-- Indexes for faster queries
CREATE INDEX idx_attendance_codev_id ON attendance(codev_id);
CREATE INDEX idx_attendance_project_id ON attendance(project_id);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_attendance_status ON attendance(status);
```

### `attendance_summary` ⭐ NEW (Optional)
Pre-calculated monthly attendance statistics for performance.

```sql
CREATE TABLE attendance_summary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  codev_id UUID REFERENCES codev(id) ON DELETE CASCADE,
  project_id UUID REFERENCES project(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  total_days INTEGER DEFAULT 0,
  present_days INTEGER DEFAULT 0,
  absent_days INTEGER DEFAULT 0,
  late_days INTEGER DEFAULT 0,
  attendance_percentage DECIMAL(5,2),
  points_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(codev_id, project_id, year, month)
);
```

---

## Points & Gamification

### `skill_categories`
Categories for different types of points/skills.

```sql
CREATE TABLE skill_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert default categories
INSERT INTO skill_categories (name, description) VALUES
  ('Attendance', 'Points earned from daily attendance'),
  ('Task Completion', 'Points earned from completing tasks'),
  ('Code Review', 'Points earned from code reviews'),
  ('Mentoring', 'Points earned from mentoring others');
```

### `codev_points`
Tracks points earned by each codev per category.

```sql
CREATE TABLE codev_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  codev_id UUID REFERENCES codev(id) ON DELETE CASCADE,
  skill_category_id UUID REFERENCES skill_categories(id),
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(codev_id, skill_category_id)
);
```

### `attendance_points` ⭐ NEW
Separate table for attendance points (not linked to skill categories).

```sql
CREATE TABLE attendance_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  codev_id UUID REFERENCES codev(id) ON DELETE CASCADE UNIQUE,
  points INTEGER DEFAULT 0,
  last_updated DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_attendance_points_codev_id ON attendance_points(codev_id);
```

---

## Project Management

### `projects`
Stores all projects in the system.

```sql
CREATE TABLE project (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  description TEXT,
  status VARCHAR DEFAULT 'active',
  start_date DATE,
  end_date DATE,
  client_id UUID REFERENCES client(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### `project_members`
Junction table linking codevs to projects with roles.

```sql
CREATE TABLE project_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES project(id) ON DELETE CASCADE,
  codev_id UUID REFERENCES codev(id) ON DELETE CASCADE,
  role VARCHAR DEFAULT 'member' CHECK (role IN ('lead', 'member')),
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(project_id, codev_id)
);
```

---

## Table Relationships Diagram

```mermaid
erDiagram
    codev ||--o{ job_listings : "creates"
    codev ||--o{ job_applications : "reviews"
    codev ||--o{ attendance : "has"
    codev ||--o{ codev_points : "earns"
    codev ||--o| attendance_points : "has"
    codev ||--o{ project_members : "belongs_to"
    codev }o--|| roles : "has"
    
    job_listings ||--o{ job_applications : "receives"
    
    project ||--o{ project_members : "has"
    project ||--o{ attendance : "tracks"
    
    skill_categories ||--o{ codev_points : "categorizes"
    
    codev {
        uuid id PK
        string email UK
        string first_name
        string last_name
        string internal_status
        boolean availability_status
        int role_id FK
    }
    
    job_listings {
        uuid id PK
        string title
        string department
        string type
        string level
        uuid created_by FK
        date posted_date
    }
    
    job_applications {
        uuid id PK
        uuid job_id FK
        string email
        string status
        uuid reviewed_by FK
        timestamp applied_at
    }
    
    attendance {
        uuid id PK
        uuid codev_id FK
        uuid project_id FK
        date date
        string status
        time check_in
        time check_out
    }
    
    codev_points {
        uuid id PK
        uuid codev_id FK
        uuid skill_category_id FK
        int points
    }
    
    attendance_points {
        uuid id PK
        uuid codev_id FK UK
        int points
        date last_updated
    }
```

---

## Key Relationships Explained

### 1. **Job Posting Flow**
- `codev` (admin/HR) creates entries in `job_listings`
- External applicants submit data to `job_applications`
- `job_applications.reviewed_by` links back to `codev` who reviews
- When hired, applicant data can be used to create new `codev` entry

### 2. **Attendance & Points Flow**
- Daily attendance recorded in `attendance` table
- Each attendance record linked to `codev`, `project`, and specific `date`
- Attendance points stored in separate `attendance_points` table (not in skill categories)
- 2 points awarded per day for "present" or "late" status
- Points auto-calculated via triggers or manual sync
- Optional: Monthly summaries in `attendance_summary` for reporting

### 3. **Project Team Structure**
- `project_members` links `codev` to `project` with specific roles
- Team lead identified by `role = 'lead'` in `project_members`
- Attendance tracked per project, allowing codevs on multiple projects

---

## Database Triggers & Functions

### Auto-update timestamps
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at
CREATE TRIGGER update_job_listings_updated_at BEFORE UPDATE ON job_listings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_attendance_updated_at BEFORE UPDATE ON attendance
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Attendance Points Calculation
```sql
CREATE OR REPLACE FUNCTION calculate_attendance_points()
RETURNS TRIGGER AS $$
DECLARE
    attendance_category_id UUID;
    current_points INTEGER;
    points_to_add INTEGER := 0;
BEGIN
    -- Get attendance skill category
    SELECT id INTO attendance_category_id 
    FROM skill_categories 
    WHERE name = 'Attendance';
    
    -- Calculate points based on status
    IF NEW.status IN ('present', 'late') THEN
        points_to_add := 2;
    END IF;
    
    -- Update or insert points
    INSERT INTO codev_points (codev_id, skill_category_id, points)
    VALUES (NEW.codev_id, attendance_category_id, points_to_add)
    ON CONFLICT (codev_id, skill_category_id)
    DO UPDATE SET points = codev_points.points + points_to_add;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_attendance_points AFTER INSERT OR UPDATE ON attendance
    FOR EACH ROW EXECUTE FUNCTION calculate_attendance_points();
```

---

## Security Policies (Row Level Security)

### Job Listings RLS
```sql
-- Enable RLS
ALTER TABLE job_listings ENABLE ROW LEVEL SECURITY;

-- Anyone can view active job listings
CREATE POLICY "Public can view active jobs" ON job_listings
    FOR SELECT USING (status = 'active');

-- Only authenticated users with proper role can create/edit
CREATE POLICY "Admins can manage jobs" ON job_listings
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM codev 
            WHERE role_id IN (
                SELECT id FROM roles 
                WHERE applicants = true
            )
        )
    );
```

### Attendance RLS
```sql
-- Enable RLS
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Users can view their own attendance
CREATE POLICY "Users can view own attendance" ON attendance
    FOR SELECT USING (codev_id = auth.uid());

-- Project leads and admins can manage attendance
CREATE POLICY "Leads can manage team attendance" ON attendance
    FOR ALL USING (
        auth.uid() IN (
            SELECT codev_id FROM project_members 
            WHERE project_id = attendance.project_id 
            AND role = 'lead'
        )
        OR
        auth.uid() IN (
            SELECT id FROM codev 
            WHERE role_id IN (
                SELECT id FROM roles 
                WHERE projects = true
            )
        )
    );
```

---

## Usage Examples

### Creating a Job Listing
```sql
INSERT INTO job_listings (
    title, department, location, type, level,
    description, requirements, salary_range, remote, created_by
) VALUES (
    'Senior Full Stack Developer',
    'Engineering',
    'Manila, Philippines',
    'Full-time',
    'Senior',
    'We are looking for an experienced developer...',
    ARRAY['5+ years experience', 'React/Next.js', 'Node.js'],
    '₱80,000 - ₱120,000',
    true,
    'user-uuid-here'
);
```

### Recording Attendance
```sql
-- Single attendance record
INSERT INTO attendance (codev_id, project_id, date, status, check_in, check_out)
VALUES ('codev-uuid', 'project-uuid', '2024-01-25', 'present', '09:00', '18:00');

-- Bulk attendance for a team
INSERT INTO attendance (codev_id, project_id, date, status)
SELECT 
    pm.codev_id,
    pm.project_id,
    '2024-01-25'::date,
    'present'
FROM project_members pm
WHERE pm.project_id = 'project-uuid';
```

### Querying Attendance Summary
```sql
-- Get monthly attendance for a project
SELECT 
    c.first_name,
    c.last_name,
    COUNT(CASE WHEN a.status = 'present' THEN 1 END) as present_days,
    COUNT(CASE WHEN a.status = 'absent' THEN 1 END) as absent_days,
    COUNT(CASE WHEN a.status = 'late' THEN 1 END) as late_days,
    ROUND(
        COUNT(CASE WHEN a.status IN ('present', 'late') THEN 1 END)::numeric / 
        COUNT(CASE WHEN a.status NOT IN ('weekend', 'holiday') THEN 1 END)::numeric * 100, 
        2
    ) as attendance_percentage
FROM attendance a
JOIN codev c ON a.codev_id = c.id
WHERE 
    a.project_id = 'project-uuid'
    AND EXTRACT(YEAR FROM a.date) = 2024
    AND EXTRACT(MONTH FROM a.date) = 1
GROUP BY c.id, c.first_name, c.last_name;
```

---

## Migration Guide

To implement these new tables in your Supabase project:

1. **Create tables in order** (due to foreign key dependencies):
   ```
   1. skill_categories (if not exists)
   2. job_listings
   3. job_applications
   4. attendance
   5. attendance_points
   6. attendance_summary (optional)
   ```

2. **Add default skill categories**:
   ```sql
   INSERT INTO skill_categories (name, description) 
   VALUES ('Attendance', 'Points earned from daily attendance')
   ON CONFLICT (name) DO NOTHING;
   ```

3. **Set up triggers** for automatic timestamp updates and point calculations

4. **Enable Row Level Security** and create appropriate policies

5. **Create indexes** for better query performance

---

## Best Practices

1. **Always use transactions** when updating multiple related tables
2. **Use foreign key constraints** to maintain data integrity
3. **Create indexes** on frequently queried columns
4. **Implement RLS policies** for security
5. **Use triggers** for automatic calculations and updates
6. **Regular backups** before schema changes