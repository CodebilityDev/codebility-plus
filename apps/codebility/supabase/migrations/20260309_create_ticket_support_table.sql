-- ==============================================
-- CREATE TICKET SUPPORT TABLE
-- Date: 2026-03-09
-- ==============================================

-- 1. Create a sequence for the ticket number
CREATE SEQUENCE IF NOT EXISTS ticket_number_seq START 1001;

-- 2. Create the ticket_support table
CREATE TABLE IF NOT EXISTS ticket_support (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES codev(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    email TEXT,
    role_position TEXT,
    project_id UUID REFERENCES project(id) ON DELETE SET NULL,
    assigned_team TEXT,
    ticket_type TEXT NOT NULL,
    other_type TEXT,
    subject TEXT, -- This will correspond to 'ticketTitle' from frontend
    message TEXT NOT NULL, -- This will correspond to 'ticketDetails' from frontend
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')),
    priority TEXT NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create a function to generate the formatted ticket number
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.ticket_number IS NULL THEN
        NEW.ticket_number := 'TS-' || LPAD(nextval('ticket_number_seq')::text, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Create the shared update_updated_at_column function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. Create trigger to auto-generate ticket number before insert
CREATE TRIGGER set_ticket_number
    BEFORE INSERT ON ticket_support
    FOR EACH ROW
    EXECUTE FUNCTION generate_ticket_number();

-- 6. Create trigger to update updated_at timestamp
CREATE TRIGGER update_ticket_support_updated_at
    BEFORE UPDATE ON ticket_support
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 7. Enable Row Level Security (RLS)
ALTER TABLE ticket_support ENABLE ROW LEVEL SECURITY;

-- 8. Define RLS Policies

-- Policy: Authenticated users can create tickets
CREATE POLICY "Authenticated users can create tickets"
    ON ticket_support FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Policy: Users can view their own tickets
CREATE POLICY "Users can view own tickets"
    ON ticket_support FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Policy: Admins can manage all tickets
CREATE POLICY "Admins can manage all tickets"
    ON ticket_support FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM codev 
            WHERE id = auth.uid() 
            AND (internal_status = 'ADMIN' OR role_id IN (SELECT id FROM roles WHERE (name ILIKE '%admin%' OR name ILIKE '%super%')))
        )
    );

-- 8. Create Indexes for performance
CREATE INDEX IF NOT EXISTS idx_ticket_support_ticket_number ON ticket_support(ticket_number);
CREATE INDEX IF NOT EXISTS idx_ticket_support_user_id ON ticket_support(user_id);
CREATE INDEX IF NOT EXISTS idx_ticket_support_status ON ticket_support(status);
CREATE INDEX IF NOT EXISTS idx_ticket_support_created_at ON ticket_support(created_at);

-- 9. Comment on table
COMMENT ON TABLE ticket_support IS 'Stores support tickets submitted by users.';
