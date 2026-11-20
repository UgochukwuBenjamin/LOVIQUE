
-- =====================================================
-- LOVIQUE DATABASE
-- Social Networking Platform
-- PostgreSQL
-- Brand: Red & Black
-- =====================================================

-- =====================================================
-- 1. USERS
-- Account registration and authentication
-- =====================================================

CREATE TABLE IF NOT EXISTS users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,

    account_status VARCHAR(20) DEFAULT 'active'
        CHECK (account_status IN ('active', 'suspended', 'deleted')),

    email_verified BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);


-- =====================================================
-- 2. PROFILES
-- User information and onboarding
-- =====================================================

CREATE TABLE IF NOT EXISTS profiles (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    user_id BIGINT UNIQUE NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,

    username VARCHAR(30) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,

    bio TEXT,
    avatar_url TEXT,
    country VARCHAR(100),
    date_of_birth DATE,

    profile_visibility VARCHAR(20) DEFAULT 'public'
        CHECK (profile_visibility IN ('public', 'private')),

    onboarding_completed BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);


-- =====================================================
-- 3. INTERESTS
-- Available interests users can select
-- =====================================================

CREATE TABLE IF NOT EXISTS interests (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);


-- =====================================================
-- 4. USER INTERESTS
-- Connects users to their selected interests
-- =====================================================

CREATE TABLE IF NOT EXISTS user_interests (
    user_id BIGINT NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,

    interest_id BIGINT NOT NULL
        REFERENCES interests(id) ON DELETE CASCADE,

    PRIMARY KEY (user_id, interest_id)
);


-- =====================================================
-- 5. COMMUNITIES
-- Users can create and discover communities
-- =====================================================

CREATE TABLE IF NOT EXISTS communities (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    name VARCHAR(150) NOT NULL,
    category VARCHAR(80) NOT NULL,
    description VARCHAR(500),

    cover_image_url TEXT,

    created_by BIGINT
        REFERENCES users(id) ON DELETE SET NULL,

    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Upgrade an existing communities table if necessary.
ALTER TABLE communities
    ADD COLUMN IF NOT EXISTS cover_image_url TEXT;

ALTER TABLE communities
    ADD COLUMN IF NOT EXISTS created_by BIGINT
    REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE communities
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ
    DEFAULT CURRENT_TIMESTAMP;


-- =====================================================
-- 6. COMMUNITY MEMBERS
-- Users joining communities
-- =====================================================

CREATE TABLE IF NOT EXISTS community_members (
    community_id BIGINT NOT NULL
        REFERENCES communities(id) ON DELETE CASCADE,

    user_id BIGINT NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,

    role VARCHAR(20) DEFAULT 'member'
        CHECK (role IN ('member', 'moderator', 'admin')),

    joined_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (community_id, user_id)
);


-- =====================================================
-- 7. CONNECTIONS
-- Friendship and connection requests
-- =====================================================

CREATE TABLE IF NOT EXISTS connections (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    requester_id BIGINT NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,

    receiver_id BIGINT NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,

    connection_type VARCHAR(20) NOT NULL
        CHECK (connection_type IN ('friendship', 'dating')),

    status VARCHAR(20) DEFAULT 'pending'
        CHECK (status IN (
            'pending',
            'accepted',
            'declined',
            'cancelled'
        )),

    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CHECK (requester_id <> receiver_id),

    UNIQUE (requester_id, receiver_id, connection_type)
);

-- Prevent duplicate requests in opposite directions.
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_connection_pair
ON connections (
    LEAST(requester_id, receiver_id),
    GREATEST(requester_id, receiver_id),
    connection_type
);


-- =====================================================
-- 8. MESSAGES
-- Private user messages
-- =====================================================

CREATE TABLE IF NOT EXISTS messages (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    sender_id BIGINT NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,

    receiver_id BIGINT NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,

    content TEXT NOT NULL,

    is_read BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CHECK (sender_id <> receiver_id)
);


-- =====================================================
-- 9. NOTIFICATIONS
-- User notifications
-- =====================================================

CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    user_id BIGINT NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,

    title VARCHAR(150) NOT NULL,
    message TEXT,

    notification_type VARCHAR(50),

    is_read BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);


-- =====================================================
-- 10. REPORTS
-- User reporting and moderation
-- =====================================================

CREATE TABLE IF NOT EXISTS reports (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    reporter_id BIGINT NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,

    reported_user_id BIGINT NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,

    reason VARCHAR(100) NOT NULL,
    description TEXT,

    status VARCHAR(20) DEFAULT 'pending'
        CHECK (status IN (
            'pending',
            'reviewing',
            'resolved',
            'dismissed'
        )),

    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CHECK (reporter_id <> reported_user_id)
);


-- =====================================================
-- 11. BLOCKED USERS
-- User blocking functionality
-- =====================================================

CREATE TABLE IF NOT EXISTS blocks (
    blocker_id BIGINT NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,

    blocked_id BIGINT NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,

    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (blocker_id, blocked_id),

    CHECK (blocker_id <> blocked_id)
);


-- =====================================================
-- 12. INDEXES
-- Improve database query performance
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_profiles_username
ON profiles(username);

CREATE INDEX IF NOT EXISTS idx_profiles_country
ON profiles(country);

CREATE INDEX IF NOT EXISTS idx_messages_sender
ON messages(sender_id);

CREATE INDEX IF NOT EXISTS idx_messages_receiver
ON messages(receiver_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user
ON notifications(user_id);

CREATE INDEX IF NOT EXISTS idx_connections_receiver
ON connections(receiver_id);

CREATE INDEX IF NOT EXISTS idx_connections_requester
ON connections(requester_id);

CREATE INDEX IF NOT EXISTS idx_community_members_user
ON community_members(user_id);

CREATE INDEX IF NOT EXISTS idx_communities_category
ON communities(category);

CREATE INDEX IF NOT EXISTS idx_reports_status
ON reports(status);


-- =====================================================
-- 13. INITIAL INTERESTS
-- Default interests for LOVIQUE onboarding
-- =====================================================

INSERT INTO interests (name) VALUES
('Technology'),
('Music'),
('Movies'),
('Reading'),
('Gaming'),
('Photography'),
('Sports'),
('Fashion'),
('Art'),
('Travel'),
('Cooking'),
('Fitness'),
('Entrepreneurship'),
('Education'),
('Volunteering'),
('Business'),
('Design'),
('Science'),
('Nature'),
('Writing')
ON CONFLICT (name) DO NOTHING;


-- =====================================================
-- END OF LOVIQUE DATABASE SCHEMA
-- =====================================================
