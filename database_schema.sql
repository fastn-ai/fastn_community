-- Fastn Community Platform Database Schema
-- PostgreSQL Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    bio TEXT,
    avatar_url VARCHAR(500),
    location VARCHAR(200),
    company VARCHAR(200),
    website VARCHAR(500),
    reputation INTEGER DEFAULT 0,
    level VARCHAR(50) DEFAULT 'beginner',
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(20),
    slug VARCHAR(100) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Topics table
CREATE TABLE topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'published',
    is_featured BOOLEAN DEFAULT FALSE,
    is_hot BOOLEAN DEFAULT FALSE,
    is_new BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    reply_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    bookmark_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tutorials table
CREATE TABLE tutorials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    estimated_time VARCHAR(100),
    prerequisites TEXT,
    status VARCHAR(20) DEFAULT 'published',
    is_featured BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    bookmark_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tags table
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Topic tags junction table
CREATE TABLE topic_tags (
    topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (topic_id, tag_id)
);

-- Tutorial tags junction table
CREATE TABLE tutorial_tags (
    tutorial_id UUID REFERENCES tutorials(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (tutorial_id, tag_id)
);

-- Replies/Comments table
CREATE TABLE replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
    tutorial_id UUID REFERENCES tutorials(id) ON DELETE CASCADE,
    parent_reply_id UUID REFERENCES replies(id) ON DELETE CASCADE,
    like_count INTEGER DEFAULT 0,
    is_accepted BOOLEAN DEFAULT FALSE,
    is_helpful BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (
        (topic_id IS NOT NULL AND tutorial_id IS NULL) OR 
        (topic_id IS NULL AND tutorial_id IS NOT NULL)
    )
);

-- Media files table
CREATE TABLE media_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
    tutorial_id UUID REFERENCES tutorials(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (
        (topic_id IS NOT NULL AND tutorial_id IS NULL) OR 
        (topic_id IS NULL AND tutorial_id IS NOT NULL)
    )
);

-- User interactions table (likes, bookmarks, etc.)
CREATE TABLE user_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
    tutorial_id UUID REFERENCES tutorials(id) ON DELETE CASCADE,
    reply_id UUID REFERENCES replies(id) ON DELETE CASCADE,
    interaction_type VARCHAR(20) NOT NULL CHECK (interaction_type IN ('like', 'bookmark', 'share', 'view')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (
        (topic_id IS NOT NULL AND tutorial_id IS NULL AND reply_id IS NULL) OR 
        (topic_id IS NULL AND tutorial_id IS NOT NULL AND reply_id IS NULL) OR
        (topic_id IS NULL AND tutorial_id IS NULL AND reply_id IS NOT NULL)
    ),
    UNIQUE(user_id, topic_id, interaction_type),
    UNIQUE(user_id, tutorial_id, interaction_type),
    UNIQUE(user_id, reply_id, interaction_type)
);

-- Tutorial ratings table
CREATE TABLE tutorial_ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tutorial_id UUID NOT NULL REFERENCES tutorials(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, tutorial_id)
);

-- Badges table
CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(20),
    criteria_type VARCHAR(50),
    criteria_value INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User badges junction table
CREATE TABLE user_badges (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, badge_id)
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    reference_id UUID,
    reference_type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User settings table
CREATE TABLE user_settings (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT TRUE,
    topic_replies_notifications BOOLEAN DEFAULT TRUE,
    mentions_notifications BOOLEAN DEFAULT TRUE,
    weekly_digest BOOLEAN DEFAULT FALSE,
    marketing_emails BOOLEAN DEFAULT FALSE,
    profile_visibility VARCHAR(20) DEFAULT 'public',
    show_email BOOLEAN DEFAULT FALSE,
    show_location BOOLEAN DEFAULT TRUE,
    allow_messages BOOLEAN DEFAULT TRUE,
    show_online_status BOOLEAN DEFAULT TRUE,
    theme VARCHAR(20) DEFAULT 'light',
    language VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'UTC',
    date_format VARCHAR(20) DEFAULT 'MM/DD/YYYY',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_type VARCHAR(50) NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    location VARCHAR(200),
    is_virtual BOOLEAN DEFAULT FALSE,
    max_attendees INTEGER,
    current_attendees INTEGER DEFAULT 0,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Event attendees table
CREATE TABLE event_attendees (
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'registered',
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (event_id, user_id)
);

-- Search history table
CREATE TABLE search_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    results_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User sessions table
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_topics_author_id ON topics(author_id);
CREATE INDEX idx_topics_category_id ON topics(category_id);
CREATE INDEX idx_topics_status ON topics(status);
CREATE INDEX idx_topics_created_at ON topics(created_at);
CREATE INDEX idx_topics_is_featured ON topics(is_featured);

CREATE INDEX idx_tutorials_author_id ON tutorials(author_id);
CREATE INDEX idx_tutorials_category_id ON tutorials(category_id);
CREATE INDEX idx_tutorials_difficulty ON tutorials(difficulty);
CREATE INDEX idx_tutorials_status ON tutorials(status);
CREATE INDEX idx_tutorials_created_at ON tutorials(created_at);

CREATE INDEX idx_replies_author_id ON replies(author_id);
CREATE INDEX idx_replies_topic_id ON replies(topic_id);
CREATE INDEX idx_replies_tutorial_id ON replies(tutorial_id);
CREATE INDEX idx_replies_parent_id ON replies(parent_reply_id);

CREATE INDEX idx_user_interactions_user_id ON user_interactions(user_id);
CREATE INDEX idx_user_interactions_topic_id ON user_interactions(topic_id);
CREATE INDEX idx_user_interactions_tutorial_id ON user_interactions(tutorial_id);
CREATE INDEX idx_user_interactions_type ON user_interactions(interaction_type);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

CREATE INDEX idx_search_history_user_id ON search_history(user_id);
CREATE INDEX idx_search_history_created_at ON search_history(created_at);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_topics_updated_at BEFORE UPDATE ON topics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tutorials_updated_at BEFORE UPDATE ON tutorials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_replies_updated_at BEFORE UPDATE ON replies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tutorial_ratings_updated_at BEFORE UPDATE ON tutorial_ratings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create functions for updating counts
CREATE OR REPLACE FUNCTION update_topic_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.topic_id IS NOT NULL THEN
            UPDATE topics SET 
                reply_count = reply_count + 1,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = NEW.topic_id;
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.topic_id IS NOT NULL THEN
            UPDATE topics SET 
                reply_count = reply_count - 1,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = OLD.topic_id;
        END IF;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

CREATE TRIGGER update_topic_reply_count
    AFTER INSERT OR DELETE ON replies
    FOR EACH ROW EXECUTE FUNCTION update_topic_counts();

-- Create function to update tag usage count
CREATE OR REPLACE FUNCTION update_tag_usage_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE tags SET usage_count = usage_count + 1 WHERE id = NEW.tag_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE tags SET usage_count = usage_count - 1 WHERE id = OLD.tag_id;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tag_usage_count_topic
    AFTER INSERT OR DELETE ON topic_tags
    FOR EACH ROW EXECUTE FUNCTION update_tag_usage_count();

CREATE TRIGGER update_tag_usage_count_tutorial
    AFTER INSERT OR DELETE ON tutorial_tags
    FOR EACH ROW EXECUTE FUNCTION update_tag_usage_count();

-- Insert default categories
INSERT INTO categories (name, description, icon, color, slug) VALUES
('Questions', 'Ask questions and get help from the community', 'help-circle', 'blue', 'questions'),
('Best Practices', 'Share and learn best practices for fastn development', 'star', 'green', 'best-practices'),
('Announcements', 'Official announcements and updates', 'megaphone', 'red', 'announcements'),
('Built with fastn', 'Showcase your fastn projects and applications', 'code', 'purple', 'built-with-fastn'),
('Getting Started', 'Tutorials and guides for beginners', 'book-open', 'orange', 'getting-started'),
('API Development', 'Tutorials about building APIs with fastn', 'zap', 'yellow', 'api-development'),
('Database', 'Database integration and ORM patterns', 'database', 'indigo', 'database'),
('Security', 'Authentication and authorization systems', 'shield', 'pink', 'security'),
('Real-time', 'Real-time applications and WebSockets', 'radio', 'teal', 'real-time'),
('Testing', 'Testing strategies and methodologies', 'test-tube', 'cyan', 'testing'),
('Deployment', 'Deployment and DevOps practices', 'cloud', 'gray', 'deployment'),
('Performance', 'Performance optimization and caching', 'trending-up', 'lime', 'performance');

-- Insert default badges
INSERT INTO badges (name, description, icon, color, criteria_type, criteria_value) VALUES
('First Topic', 'Created your first topic', 'message-square', 'blue', 'topics_created', 1),
('Helpful', 'Received 10 helpful votes', 'heart', 'green', 'helpful_votes', 10),
('Active', 'Posted for 7 consecutive days', 'activity', 'orange', 'consecutive_days', 7),
('Expert', 'Reached 1000 reputation points', 'trophy', 'yellow', 'reputation', 1000),
('Popular', 'Topic reached 1000 views', 'trending-up', 'purple', 'topic_views', 1000),
('Mentor', 'Helped 50 users', 'user', 'pink', 'users_helped', 50),
('Top Contributor', 'Among the top 10 contributors', 'award', 'red', 'top_contributor', 10),
('Community Builder', 'Created 20 topics', 'users', 'indigo', 'topics_created', 20);

-- Create views for common queries
CREATE VIEW topic_stats AS
SELECT 
    t.id,
    t.title,
    t.view_count,
    t.reply_count,
    t.like_count,
    t.bookmark_count,
    t.share_count,
    u.username as author_username,
    u.avatar_url as author_avatar,
    c.name as category_name,
    c.color as category_color,
    t.created_at,
    t.updated_at
FROM topics t
JOIN users u ON t.author_id = u.id
LEFT JOIN categories c ON t.category_id = c.id
WHERE t.status = 'published';

CREATE VIEW tutorial_stats AS
SELECT 
    t.id,
    t.title,
    t.difficulty,
    t.estimated_time,
    t.prerequisites,
    t.view_count,
    t.like_count,
    t.bookmark_count,
    t.share_count,
    t.rating,
    t.rating_count,
    u.username as author_username,
    u.avatar_url as author_avatar,
    c.name as category_name,
    c.color as category_color,
    t.created_at,
    t.updated_at
FROM tutorials t
JOIN users u ON t.author_id = u.id
LEFT JOIN categories c ON t.category_id = c.id
WHERE t.status = 'published';

-- Create materialized view for search optimization
CREATE MATERIALIZED VIEW search_index AS
SELECT 
    'topic' as content_type,
    t.id as content_id,
    t.title,
    t.description,
    t.content,
    u.username as author,
    c.name as category,
    t.created_at,
    t.view_count,
    t.reply_count,
    t.like_count
FROM topics t
JOIN users u ON t.author_id = u.id
LEFT JOIN categories c ON t.category_id = c.id
WHERE t.status = 'published'
UNION ALL
SELECT 
    'tutorial' as content_type,
    t.id as content_id,
    t.title,
    t.description,
    t.content,
    u.username as author,
    c.name as category,
    t.created_at,
    t.view_count,
    0 as reply_count,
    t.like_count
FROM tutorials t
JOIN users u ON t.author_id = u.id
LEFT JOIN categories c ON t.category_id = c.id
WHERE t.status = 'published';

-- Create indexes on the materialized view
CREATE INDEX idx_search_index_content_type ON search_index(content_type);
CREATE INDEX idx_search_index_author ON search_index(author);
CREATE INDEX idx_search_index_category ON search_index(category);
CREATE INDEX idx_search_index_created_at ON search_index(created_at);

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_app_user; 