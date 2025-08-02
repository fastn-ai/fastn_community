-- Fastn Community Platform Database Schema
-- PostgreSQL Database Schema for Community Platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom ID generation functions
CREATE OR REPLACE FUNCTION generate_user_id() 
RETURNS TEXT AS $$
BEGIN
    RETURN 'user_' || to_char(now(), 'YYYYMMDD_HH24MISS_MS') || '_' || 
           lpad(floor(random() * 1000)::text, 3, '0');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_topic_id() 
RETURNS TEXT AS $$
BEGIN
    RETURN 'topic_' || to_char(now(), 'YYYYMMDD_HH24MISS_MS') || '_' || 
           lpad(floor(random() * 1000)::text, 3, '0');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_reply_id() 
RETURNS TEXT AS $$
BEGIN
    RETURN 'reply_' || to_char(now(), 'YYYYMMDD_HH24MISS_MS') || '_' || 
           lpad(floor(random() * 1000)::text, 3, '0');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_category_id() 
RETURNS TEXT AS $$
BEGIN
    RETURN 'cat_' || to_char(now(), 'YYYYMMDD_HH24MISS_MS') || '_' || 
           lpad(floor(random() * 1000)::text, 3, '0');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_tag_id() 
RETURNS TEXT AS $$
BEGIN
    RETURN 'tag_' || to_char(now(), 'YYYYMMDD_HH24MISS_MS') || '_' || 
           lpad(floor(random() * 1000)::text, 3, '0');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_tutorial_id() 
RETURNS TEXT AS $$
BEGIN
    RETURN 'tutorial_' || to_char(now(), 'YYYYMMDD_HH24MISS_MS') || '_' || 
           lpad(floor(random() * 1000)::text, 3, '0');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_event_id() 
RETURNS TEXT AS $$
BEGIN
    RETURN 'event_' || to_char(now(), 'YYYYMMDD_HH24MISS_MS') || '_' || 
           lpad(floor(random() * 1000)::text, 3, '0');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_badge_id() 
RETURNS TEXT AS $$
BEGIN
    RETURN 'badge_' || to_char(now(), 'YYYYMMDD_HH24MISS_MS') || '_' || 
           lpad(floor(random() * 1000)::text, 3, '0');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_notification_id() 
RETURNS TEXT AS $$
BEGIN
    RETURN 'notif_' || to_char(now(), 'YYYYMMDD_HH24MISS_MS') || '_' || 
           lpad(floor(random() * 1000)::text, 3, '0');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_media_id() 
RETURNS TEXT AS $$
BEGIN
    RETURN 'media_' || to_char(now(), 'YYYYMMDD_HH24MISS_MS') || '_' || 
           lpad(floor(random() * 1000)::text, 3, '0');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_interaction_id() 
RETURNS TEXT AS $$
BEGIN
    RETURN 'interact_' || to_char(now(), 'YYYYMMDD_HH24MISS_MS') || '_' || 
           lpad(floor(random() * 1000)::text, 3, '0');
END;
$$ LANGUAGE plpgsql;

-- Users table
CREATE TABLE users (
    id TEXT PRIMARY KEY DEFAULT generate_user_id(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    location VARCHAR(100),
    website VARCHAR(255),
    twitter VARCHAR(50),
    github VARCHAR(50),
    linkedin VARCHAR(50),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    reputation_score INTEGER DEFAULT 0,
    topics_count INTEGER DEFAULT 0,
    replies_count INTEGER DEFAULT 0,
    likes_received INTEGER DEFAULT 0,
    badges_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
    id TEXT PRIMARY KEY DEFAULT generate_category_id(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    slug VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(50),
    color VARCHAR(7),
    topics_count INTEGER DEFAULT 0,
    tutorials_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Topics table
CREATE TABLE topics (
    id TEXT PRIMARY KEY DEFAULT generate_topic_id(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT,
    author_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'published',
    is_featured BOOLEAN DEFAULT FALSE,
    is_hot BOOLEAN DEFAULT FALSE,
    is_new BOOLEAN DEFAULT TRUE,
    view_count INTEGER DEFAULT 0,
    reply_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    bookmark_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Replies table
CREATE TABLE replies (
    id TEXT PRIMARY KEY DEFAULT generate_reply_id(),
    topic_id TEXT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    author_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_reply_id TEXT REFERENCES replies(id) ON DELETE CASCADE,
    is_accepted BOOLEAN DEFAULT FALSE,
    is_helpful BOOLEAN DEFAULT FALSE,
    like_count INTEGER DEFAULT 0,
    dislike_count INTEGER DEFAULT 0,
    reply_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tags table
CREATE TABLE tags (
    id TEXT PRIMARY KEY DEFAULT generate_tag_id(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    slug VARCHAR(50) UNIQUE NOT NULL,
    color VARCHAR(7),
    topics_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Topic-Tag relationships (many-to-many)
CREATE TABLE topic_tags (
    id TEXT PRIMARY KEY DEFAULT generate_interaction_id(),
    topic_id TEXT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    tag_id TEXT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(topic_id, tag_id)
);

-- Tutorials table
CREATE TABLE tutorials (
    id TEXT PRIMARY KEY DEFAULT generate_tutorial_id(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    author_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
    difficulty VARCHAR(20) DEFAULT 'beginner',
    estimated_time INTEGER, -- in minutes
    prerequisites TEXT,
    tags TEXT[], -- Array of tag names
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    bookmark_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    rating_average DECIMAL(3,2) DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'published',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE events (
    id TEXT PRIMARY KEY DEFAULT generate_event_id(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    organizer_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    max_attendees INTEGER,
    current_attendees INTEGER DEFAULT 0,
    is_online BOOLEAN DEFAULT FALSE,
    meeting_url VARCHAR(255),
    status VARCHAR(20) DEFAULT 'upcoming',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Badges table
CREATE TABLE badges (
    id TEXT PRIMARY KEY DEFAULT generate_badge_id(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(7),
    criteria TEXT,
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User-Badge relationships (many-to-many)
CREATE TABLE user_badges (
    id TEXT PRIMARY KEY DEFAULT generate_interaction_id(),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id TEXT NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    awarded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, badge_id)
);

-- Notifications table
CREATE TABLE notifications (
    id TEXT PRIMARY KEY DEFAULT generate_notification_id(),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    data JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Media files table
CREATE TABLE media_files (
    id TEXT PRIMARY KEY DEFAULT generate_media_id(),
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    uploaded_by TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    entity_type VARCHAR(50), -- 'topic', 'tutorial', 'reply', etc.
    entity_id TEXT, -- Reference to the entity this file belongs to
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User interactions (likes, bookmarks, etc.)
CREATE TABLE user_interactions (
    id TEXT PRIMARY KEY DEFAULT generate_interaction_id(),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    entity_type VARCHAR(50) NOT NULL, -- 'topic', 'reply', 'tutorial'
    entity_id TEXT NOT NULL,
    interaction_type VARCHAR(20) NOT NULL, -- 'like', 'bookmark', 'share'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, entity_type, entity_id, interaction_type)
);

-- Tutorial ratings
CREATE TABLE tutorial_ratings (
    id TEXT PRIMARY KEY DEFAULT generate_interaction_id(),
    tutorial_id TEXT NOT NULL REFERENCES tutorials(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tutorial_id, user_id)
);

-- User settings
CREATE TABLE user_settings (
    id TEXT PRIMARY KEY DEFAULT generate_user_id(),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT TRUE,
    privacy_level VARCHAR(20) DEFAULT 'public',
    theme VARCHAR(20) DEFAULT 'light',
    language VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'UTC',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Search history
CREATE TABLE search_history (
    id TEXT PRIMARY KEY DEFAULT generate_interaction_id(),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    results_count INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User sessions
CREATE TABLE user_sessions (
    id TEXT PRIMARY KEY DEFAULT generate_interaction_id(),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Event attendees
CREATE TABLE event_attendees (
    id TEXT PRIMARY KEY DEFAULT generate_interaction_id(),
    event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'registered', -- 'registered', 'attended', 'cancelled'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX idx_topics_author_id ON topics(author_id);
CREATE INDEX idx_topics_category_id ON topics(category_id);
CREATE INDEX idx_topics_created_at ON topics(created_at);
CREATE INDEX idx_topics_status ON topics(status);
CREATE INDEX idx_replies_topic_id ON replies(topic_id);
CREATE INDEX idx_replies_author_id ON replies(author_id);
CREATE INDEX idx_replies_parent_reply_id ON replies(parent_reply_id);
CREATE INDEX idx_topic_tags_topic_id ON topic_tags(topic_id);
CREATE INDEX idx_topic_tags_tag_id ON topic_tags(tag_id);
CREATE INDEX idx_user_interactions_user_id ON user_interactions(user_id);
CREATE INDEX idx_user_interactions_entity ON user_interactions(entity_type, entity_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_search_history_user_id ON search_history(user_id);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_topics_updated_at BEFORE UPDATE ON topics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_replies_updated_at BEFORE UPDATE ON replies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tags_updated_at BEFORE UPDATE ON tags FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tutorials_updated_at BEFORE UPDATE ON tutorials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_badges_updated_at BEFORE UPDATE ON badges FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tutorial_ratings_updated_at BEFORE UPDATE ON tutorial_ratings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create triggers for count updates
CREATE OR REPLACE FUNCTION update_topic_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE users SET topics_count = topics_count + 1 WHERE id = NEW.author_id;
        UPDATE categories SET topics_count = topics_count + 1 WHERE id = NEW.category_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE users SET topics_count = topics_count - 1 WHERE id = OLD.author_id;
        UPDATE categories SET topics_count = topics_count - 1 WHERE id = OLD.category_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_topic_counts_trigger
    AFTER INSERT OR DELETE ON topics
    FOR EACH ROW EXECUTE FUNCTION update_topic_counts();

-- Create triggers for reply counts
CREATE OR REPLACE FUNCTION update_reply_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE topics SET reply_count = reply_count + 1 WHERE id = NEW.topic_id;
        UPDATE users SET replies_count = replies_count + 1 WHERE id = NEW.author_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE topics SET reply_count = reply_count - 1 WHERE id = OLD.topic_id;
        UPDATE users SET replies_count = replies_count - 1 WHERE id = OLD.author_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_reply_counts_trigger
    AFTER INSERT OR DELETE ON replies
    FOR EACH ROW EXECUTE FUNCTION update_reply_counts();

-- Insert default categories
INSERT INTO categories (id, name, description, slug, icon, color, topics_count, tutorials_count, is_active) VALUES
(generate_category_id(), 'Questions', 'Ask questions and get help from the community', 'questions', 'help-circle', '#3B82F6', 0, 0, true),
(generate_category_id(), 'Announcements', 'Important updates and announcements', 'announcements', 'megaphone', '#EF4444', 0, 0, true),
(generate_category_id(), 'Best Practices', 'Share best practices and tips', 'best-practices', 'star', '#10B981', 0, 0, true),
(generate_category_id(), 'Built with fastn', 'Showcase your fastn projects', 'built-with-fastn', 'zap', '#8B5CF6', 0, 0, true),
(generate_category_id(), 'Showcase', 'Show off your work and projects', 'showcase', 'award', '#F59E0B', 0, 0, true),
(generate_category_id(), 'Tutorials', 'Educational content and guides', 'tutorials', 'book-open', '#06B6D4', 0, 0, true);

-- Insert default badges
INSERT INTO badges (id, name, description, icon, color, criteria, points) VALUES
(generate_badge_id(), 'First Post', 'Created your first topic', 'message-circle', '#3B82F6', 'Create your first topic', 10),
(generate_badge_id(), 'Helpful', 'Received 10 helpful votes', 'thumbs-up', '#10B981', 'Receive 10 helpful votes', 50),
(generate_badge_id(), 'Popular', 'Topic received 100+ views', 'trending-up', '#F59E0B', 'Topic reaches 100 views', 25),
(generate_badge_id(), 'Expert', 'Answered 50+ questions', 'award', '#8B5CF6', 'Answer 50 questions', 100),
(generate_badge_id(), 'Community Leader', 'Reached 1000 reputation points', 'crown', '#EF4444', 'Reach 1000 reputation', 200);

-- Create views for common queries
CREATE VIEW topic_summary AS
SELECT 
    t.id,
    t.title,
    t.description,
    t.author_id,
    u.username as author_username,
    u.avatar_url as author_avatar,
    c.name as category_name,
    c.color as category_color,
    t.status,
    t.is_featured,
    t.is_hot,
    t.is_new,
    t.view_count,
    t.reply_count,
    t.like_count,
    t.bookmark_count,
    t.share_count,
    t.created_at,
    t.updated_at
FROM topics t
JOIN users u ON t.author_id = u.id
JOIN categories c ON t.category_id = c.id;

CREATE VIEW reply_summary AS
SELECT 
    r.id,
    r.topic_id,
    r.author_id,
    u.username as author_username,
    u.avatar_url as author_avatar,
    r.content,
    r.parent_reply_id,
    r.is_accepted,
    r.is_helpful,
    r.like_count,
    r.dislike_count,
    r.reply_count,
    r.created_at,
    r.updated_at
FROM replies r
JOIN users u ON r.author_id = u.id;

-- Create materialized views for performance
CREATE MATERIALIZED VIEW user_stats AS
SELECT 
    u.id,
    u.username,
    u.reputation_score,
    u.topics_count,
    u.replies_count,
    u.likes_received,
    u.badges_count,
    COUNT(DISTINCT ub.badge_id) as earned_badges_count,
    AVG(tr.rating) as average_rating
FROM users u
LEFT JOIN user_badges ub ON u.id = ub.user_id
LEFT JOIN tutorial_ratings tr ON u.id = tr.user_id
GROUP BY u.id, u.username, u.reputation_score, u.topics_count, u.replies_count, u.likes_received, u.badges_count;

-- Create indexes on materialized view
CREATE INDEX idx_user_stats_reputation ON user_stats(reputation_score);
CREATE INDEX idx_user_stats_topics_count ON user_stats(topics_count);

-- Refresh materialized view function
CREATE OR REPLACE FUNCTION refresh_user_stats()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW user_stats;
END;
$$ LANGUAGE plpgsql; 