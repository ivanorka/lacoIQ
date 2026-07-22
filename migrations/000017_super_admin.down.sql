DROP INDEX IF EXISTS users_system_role_idx;
ALTER TABLE users DROP COLUMN IF EXISTS system_role;
