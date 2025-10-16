-- Function to auto-update updated_at column (must be created BEFORE triggers)
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Roles table (id as integer auto-increment)
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure updated_at changes on updates for roles
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'roles_set_updated_at'
    ) THEN
        CREATE TRIGGER roles_set_updated_at
        BEFORE UPDATE ON roles
        FOR EACH ROW EXECUTE FUNCTION set_updated_at();
    END IF;
END$$;

-- Seed default roles
INSERT INTO roles (name)
VALUES ('user'), ('moderator'), ('admin'), ('super_admin')
ON CONFLICT (name) DO NOTHING;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    -- We use TEXT for id to store external OIDC subject identifiers
    id TEXT PRIMARY KEY,

    username TEXT NOT NULL,
    email TEXT NOT NULL,

    avatar TEXT,
    bio TEXT,
    location TEXT,
    website TEXT,
    twitter TEXT,
    github TEXT,
    linkedin TEXT,

    -- Role reference (nullable for flexibility)
    role_id INTEGER REFERENCES roles(id),

    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure updated_at changes on updates for users
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'users_set_updated_at'
    ) THEN
        CREATE TRIGGER users_set_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW EXECUTE FUNCTION set_updated_at();
    END IF;
END$$;

-- Unique constraints (case-insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique_ci ON users (LOWER(email));
CREATE UNIQUE INDEX IF NOT EXISTS users_username_unique_ci ON users (LOWER(username));

-- Helpful indexes
CREATE INDEX IF NOT EXISTS users_role_id_idx ON users (role_id);
CREATE INDEX IF NOT EXISTS users_is_active_idx ON users (is_active);
CREATE INDEX IF NOT EXISTS users_created_at_idx ON users (created_at DESC);
