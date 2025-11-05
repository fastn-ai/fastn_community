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
    id SERIAL PRIMARY KEY,
    author_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id),

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
CREATE INDEX IF NOT EXISTS topics_status_idx ON topics (status);
CREATE INDEX IF NOT EXISTS topics_created_at_idx ON topics (created_at DESC);

-- Replies table
CREATE TABLE IF NOT EXISTS replies (
    id SERIAL PRIMARY KEY,
    topic_id INTEGER NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    author_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_reply_id INTEGER REFERENCES replies(id) ON DELETE CASCADE, -- For nested replies
    
    content TEXT NOT NULL,
   -- Simple soft delete
    like_count INTEGER NOT NULL DEFAULT 0,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure updated_at changes on updates for replies
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'replies_set_updated_at'
    ) THEN
        CREATE TRIGGER replies_set_updated_at
        BEFORE UPDATE ON replies
        FOR EACH ROW EXECUTE FUNCTION set_updated_at();
    END IF;
END$$;

-- Helpful indexes for replies
CREATE INDEX IF NOT EXISTS replies_topic_id_idx ON replies (topic_id);
CREATE INDEX IF NOT EXISTS replies_author_id_idx ON replies (author_id);
CREATE INDEX IF NOT EXISTS replies_parent_reply_id_idx ON replies (parent_reply_id);

CREATE INDEX IF NOT EXISTS replies_created_at_idx ON replies (created_at DESC);

-- Likes table (for both topics and replies)
CREATE TABLE IF NOT EXISTS likes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Polymorphic relationship: either topic_id OR reply_id will be set
    topic_id INTEGER REFERENCES topics(id) ON DELETE CASCADE,
    reply_id INTEGER REFERENCES replies(id) ON DELETE CASCADE,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Ensure user can only like each item once
    CONSTRAINT likes_unique_topic UNIQUE (user_id, topic_id),
    CONSTRAINT likes_unique_reply UNIQUE (user_id, reply_id),
    -- Ensure either topic_id or reply_id is set, but not both
    CONSTRAINT likes_either_topic_or_reply CHECK (
        (topic_id IS NOT NULL AND reply_id IS NULL) OR 
        (topic_id IS NULL AND reply_id IS NOT NULL)
    )
);

-- Helpful indexes for likes
CREATE INDEX IF NOT EXISTS likes_user_id_idx ON likes (user_id);
CREATE INDEX IF NOT EXISTS likes_topic_id_idx ON likes (topic_id);
CREATE INDEX IF NOT EXISTS likes_reply_id_idx ON likes (reply_id);
CREATE INDEX IF NOT EXISTS likes_created_at_idx ON likes (created_at DESC);

-- Shares table (for tracking shares of topics)
CREATE TABLE IF NOT EXISTS shares (
    id SERIAL PRIMARY KEY,
    topic_id INTEGER NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Share platform/type (optional)
    platform TEXT, -- 'twitter', 'facebook', 'linkedin', 'copy_link', etc.
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Helpful indexes for shares
CREATE INDEX IF NOT EXISTS shares_topic_id_idx ON shares (topic_id);
CREATE INDEX IF NOT EXISTS shares_user_id_idx ON shares (user_id);
CREATE INDEX IF NOT EXISTS shares_platform_idx ON shares (platform);
CREATE INDEX IF NOT EXISTS shares_created_at_idx ON shares (created_at DESC);

-- File uploads table (for attachments to topics and replies)
CREATE TABLE IF NOT EXISTS file_uploads (
    id SERIAL PRIMARY KEY,
    
    -- File information
    filename TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL, -- Size in bytes
    mime_type TEXT NOT NULL,
    
    -- Polymorphic relationship: either topic_id OR reply_id will be set
    topic_id INTEGER REFERENCES topics(id) ON DELETE CASCADE,
    reply_id INTEGER REFERENCES replies(id) ON DELETE CASCADE,
    
    -- Upload metadata
    uploaded_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- File status
  
    
    -- Ensure either topic_id or reply_id is set, but not both
    CONSTRAINT file_uploads_either_topic_or_reply CHECK (
        (topic_id IS NOT NULL AND reply_id IS NULL) OR 
        (topic_id IS NULL AND reply_id IS NOT NULL)
    )
);

-- Helpful indexes for file uploads
CREATE INDEX IF NOT EXISTS file_uploads_topic_id_idx ON file_uploads (topic_id);
CREATE INDEX IF NOT EXISTS file_uploads_reply_id_idx ON file_uploads (reply_id);
CREATE INDEX IF NOT EXISTS file_uploads_uploaded_by_idx ON file_uploads (uploaded_by);
CREATE INDEX IF NOT EXISTS file_uploads_mime_type_idx ON file_uploads (mime_type);

CREATE INDEX IF NOT EXISTS file_uploads_uploaded_at_idx ON file_uploads (uploaded_at DESC);

-- Function to update reply count in topics table
CREATE OR REPLACE FUNCTION update_topic_reply_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Increment reply count when a new reply is added
        UPDATE topics 
        SET reply_count = reply_count + 1 
        WHERE id = NEW.topic_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        -- Decrement reply count when a reply is deleted
        UPDATE topics 
        SET reply_count = GREATEST(reply_count - 1, 0) 
        WHERE id = OLD.topic_id;
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Handle soft delete changes
    
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for reply count updates
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'update_topic_reply_count_insert'
    ) THEN
        CREATE TRIGGER update_topic_reply_count_insert
        AFTER INSERT ON replies
        FOR EACH ROW EXECUTE FUNCTION update_topic_reply_count();
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'update_topic_reply_count_delete'
    ) THEN
        CREATE TRIGGER update_topic_reply_count_delete
        AFTER DELETE ON replies
        FOR EACH ROW EXECUTE FUNCTION update_topic_reply_count();
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'update_topic_reply_count_update'
    ) THEN
        CREATE TRIGGER update_topic_reply_count_update
        AFTER UPDATE ON replies
        FOR EACH ROW EXECUTE FUNCTION update_topic_reply_count();
    END IF;
END$$;

-- Function to update like count in topics and replies tables
CREATE OR REPLACE FUNCTION update_like_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Increment like count when a new like is added
        IF NEW.topic_id IS NOT NULL THEN
            UPDATE topics 
            SET like_count = like_count + 1 
            WHERE id = NEW.topic_id;
        ELSIF NEW.reply_id IS NOT NULL THEN
            UPDATE replies 
            SET like_count = like_count + 1 
            WHERE id = NEW.reply_id;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        -- Decrement like count when a like is removed
        IF OLD.topic_id IS NOT NULL THEN
            UPDATE topics 
            SET like_count = GREATEST(like_count - 1, 0) 
            WHERE id = OLD.topic_id;
        ELSIF OLD.reply_id IS NOT NULL THEN
            UPDATE replies 
            SET like_count = GREATEST(like_count - 1, 0) 
            WHERE id = OLD.reply_id;
        END IF;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for like count updates
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'update_like_count_insert'
    ) THEN
        CREATE TRIGGER update_like_count_insert
        AFTER INSERT ON likes
        FOR EACH ROW EXECUTE FUNCTION update_like_count();
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'update_like_count_delete'
    ) THEN
        CREATE TRIGGER update_like_count_delete
        AFTER DELETE ON likes
        FOR EACH ROW EXECUTE FUNCTION update_like_count();
    END IF;
END$$;

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
ALTER TABLE topics DROP COLUMN IF EXISTS tag_id;

CREATE TABLE IF NOT EXISTS topic_tags (
    topic_id INTEGER NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (topic_id, tag_id)
);

-- Query topics with all their tags
SELECT t.id, t.title, array_agg(tags.name) AS tags
FROM topics t
LEFT JOIN topic_tags tt ON t.id = tt.topic_id
LEFT JOIN tags ON tt.tag_id = tags.id
GROUP BY t.id, t.title;

-- Query topics with their replies (example)
SELECT 
    t.id as topic_id,
    t.title,
    t.content as topic_content,
    t.reply_count,
    t.like_count,
    r.id as reply_id,
    r.content as reply_content,
    r.created_at as reply_created_at,
    u.username as reply_author,
    r.parent_reply_id,
    r.like_count as reply_like_count
FROM topics t
LEFT JOIN replies r ON t.id = r.topic_id 
LEFT JOIN users u ON r.author_id = u.id
ORDER BY t.created_at DESC, r.created_at ASC;

-- Query topics with like status for a specific user
SELECT 
    t.id,
    t.title,
    t.like_count,
    CASE WHEN l.user_id IS NOT NULL THEN TRUE ELSE FALSE END as is_liked_by_user
FROM topics t
LEFT JOIN likes l ON t.id = l.topic_id AND l.user_id = ? -- Replace ? with user_id
ORDER BY t.created_at DESC;

-- Query topics with file attachments
SELECT 
    t.id as topic_id,
    t.title,
    f.id as file_id,
    f.original_filename,
    f.file_size,
    f.mime_type,
    f.uploaded_at
FROM topics t
LEFT JOIN file_uploads f ON t.id = f.topic_id 
ORDER BY t.created_at DESC, f.uploaded_at ASC;

-- Query share statistics for topics
SELECT 
    t.id,
    t.title,
    COUNT(s.id) as share_count,
    array_agg(DISTINCT s.platform) as platforms_shared_on
FROM topics t
LEFT JOIN shares s ON t.id = s.topic_id
GROUP BY t.id, t.title
ORDER BY share_count DESC;

ALTER TABLE tags
    ALTER COLUMN created_at TYPE TEXT USING created_at::TEXT,
    ALTER COLUMN updated_at TYPE TEXT USING updated_at::TEXT;

-- For topics table
ALTER TABLE topics
    ALTER COLUMN created_at TYPE TEXT USING created_at::TEXT,
    ALTER COLUMN updated_at TYPE TEXT USING updated_at::TEXT;


CREATE TABLE IF NOT EXISTS topic_tags (
    topic_id SERIAL NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    tag_id SERIAL NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (topic_id, tag_id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    recipient_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Notification content
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'general', -- 'reply', 'like', 'solved', 'follow', 'mention', 'digest', etc.
    
    -- Optional references to related entities
    topic_id INTEGER REFERENCES topics(id) ON DELETE CASCADE,
    reply_id INTEGER REFERENCES replies(id) ON DELETE CASCADE,
    actor_id TEXT REFERENCES users(id) ON DELETE SET NULL, -- User who triggered the notification
    
    -- Navigation link (optional, can be generated from type + topic_id/reply_id)
    link TEXT,
    
    -- Read status
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure updated_at changes on updates for notifications
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'notifications_set_updated_at'
    ) THEN
        CREATE TRIGGER notifications_set_updated_at
        BEFORE UPDATE ON notifications
        FOR EACH ROW EXECUTE FUNCTION set_updated_at();
    END IF;
END$$;

-- Helpful indexes for notifications
CREATE INDEX IF NOT EXISTS notifications_recipient_id_idx ON notifications (recipient_id);
CREATE INDEX IF NOT EXISTS notifications_is_read_idx ON notifications (is_read);
CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON notifications (created_at DESC);
CREATE INDEX IF NOT EXISTS notifications_recipient_read_idx ON notifications (recipient_id, is_read);
CREATE INDEX IF NOT EXISTS notifications_type_idx ON notifications (type);
CREATE INDEX IF NOT EXISTS notifications_topic_id_idx ON notifications (topic_id);
CREATE INDEX IF NOT EXISTS notifications_reply_id_idx ON notifications (reply_id);

-- Function to create notification when reply is added
CREATE OR REPLACE FUNCTION create_reply_notification()
RETURNS TRIGGER AS $$
DECLARE
    topic_author_id TEXT;
    topic_title TEXT;
    reply_author_username TEXT;
BEGIN
    -- Get topic author and title
    SELECT author_id, title INTO topic_author_id, topic_title
    FROM topics
    WHERE id = NEW.topic_id;
    
    -- Get reply author username
    SELECT username INTO reply_author_username
    FROM users
    WHERE id = NEW.author_id;
    
    -- Only notify if reply author is different from topic author
    IF topic_author_id != NEW.author_id THEN
        INSERT INTO notifications (
            recipient_id,
            title,
            message,
            type,
            topic_id,
            reply_id,
            actor_id,
            link
        ) VALUES (
            topic_author_id,
            'New reply to your topic',
            COALESCE(reply_author_username, 'Someone') || ' replied to ''' || topic_title || '''',
            'reply',
            NEW.topic_id,
            NEW.id,
            NEW.author_id,
            '/topic/' || NEW.topic_id
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create notification on reply insert
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'create_reply_notification_trigger'
    ) THEN
        CREATE TRIGGER create_reply_notification_trigger
        AFTER INSERT ON replies
        FOR EACH ROW EXECUTE FUNCTION create_reply_notification();
    END IF;
END$$;

-- Function to mark notification as read
CREATE OR REPLACE FUNCTION mark_notification_read(notification_id_param INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE notifications
    SET is_read = TRUE,
        read_at = NOW()
    WHERE id = notification_id_param;
END;
$$ LANGUAGE plpgsql;