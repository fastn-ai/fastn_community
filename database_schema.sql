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
    id SERIAL PRIMARY KEY,

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

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'categories_set_updated_at'
    ) THEN
        CREATE TRIGGER categories_set_updated_at
        BEFORE UPDATE ON categories
        FOR EACH ROW EXECUTE FUNCTION set_updated_at();
    END IF;
END$$;

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'tags_set_updated_at'
    ) THEN
        CREATE TRIGGER tags_set_updated_at
        BEFORE UPDATE ON tags
        FOR EACH ROW EXECUTE FUNCTION set_updated_at();
    END IF;
END$$;

-- Topics table
CREATE TABLE IF NOT EXISTS topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id),
    tag_id INTEGER REFERENCES tags(id),
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    status TEXT NOT NULL DEFAULT 'pending', -- pending | approved | rejected
    view_count INTEGER NOT NULL DEFAULT 0,
    reply_count INTEGER NOT NULL DEFAULT 0,
    like_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'topics_set_updated_at'
    ) THEN
        CREATE TRIGGER topics_set_updated_at
        BEFORE UPDATE ON topics
        FOR EACH ROW EXECUTE FUNCTION set_updated_at();
    END IF;
END$$;

-- Helpful indexes for topics
CREATE INDEX IF NOT EXISTS topics_author_id_idx ON topics (author_id);
CREATE INDEX IF NOT EXISTS topics_category_id_idx ON topics (category_id);
CREATE INDEX IF NOT EXISTS topics_tag_id_idx ON topics (tag_id);
CREATE INDEX IF NOT EXISTS topics_status_idx ON topics (status);
CREATE INDEX IF NOT EXISTS topics_created_at_idx ON topics (created_at DESC);

-- Seed default categories
INSERT INTO categories (name, slug, description)
VALUES 
    ('request feature', 'request-feature', 'Feature requests from users'),
    ('question', 'question', 'General questions and answers'),
    ('bult with fastn', 'built-with-fastn', 'Showcase of projects built with fastn'),
    ('feadback', 'feedback', 'Product and community feedback')
ON CONFLICT (name) DO NOTHING;

-- Seed default tags
INSERT INTO tags (name, slug, description)
VALUES
    ('webhook', 'webhook', 'Webhook related topics'),
    ('flow', 'flow', 'Flow builder and automations'),
    ('widget', 'widget', 'Widgets and UI components'),
    ('ucl', 'ucl', 'UCL platform topics'),
    ('ai builder', 'ai-builder', 'AI Builder topics')
ON CONFLICT (name) DO NOTHING;
