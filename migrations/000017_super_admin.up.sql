ALTER TABLE users
    ADD COLUMN IF NOT EXISTS system_role TEXT NOT NULL DEFAULT 'member'
    CHECK (system_role IN ('member', 'super_admin'));

CREATE INDEX IF NOT EXISTS users_system_role_idx ON users (system_role) WHERE system_role = 'super_admin';
