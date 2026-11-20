CREATE TABLE IF NOT EXISTS communities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(80) NOT NULL,
    description VARCHAR(500)
);

-- Add user/profile tables only after deciding on the authentication,
-- privacy, moderation and age-safety requirements.
