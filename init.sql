-- Create the checkins table
CREATE TABLE IF NOT EXISTS checkins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    dietary_needs TEXT,
    allergies TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Note: email is defined as UNIQUE, which automatically creates an index.
-- This allows us to use standard UPSERT logic (ON CONFLICT (email) DO UPDATE).
