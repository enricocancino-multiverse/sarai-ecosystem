-- SARAI Ecosystem Database Setup
-- Run this file after creating the sarai database

ALTER TABLE users ADD COLUMN IF NOT EXISTS is_superadmin BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  is_superadmin BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert test superadmin user (password: password123)
INSERT INTO users (name, email, password_hash, is_admin, is_superadmin, is_active) 
VALUES ('Superadmin User', 'superadmin@dost.gov.ph', '$2a$10$mTFpEBkCgbV/Ap25xd.DPuQAsMS5jUyEzTD/lwbRXShyRmVIAjct.', true, true, true)
ON CONFLICT (email) DO NOTHING;

-- Insert test admin user (password: password123)
INSERT INTO users (name, email, password_hash, is_admin) 
VALUES ('Admin User', 'admin@dost.gov.ph', '$2a$10$mTFpEBkCgbV/Ap25xd.DPuQAsMS5jUyEzTD/lwbRXShyRmVIAjct.', true)
ON CONFLICT (email) DO NOTHING;

-- Insert test staff user (password: password123)
INSERT INTO users (name, email, password_hash, is_admin) 
VALUES ('Staff User', 'staff@dost.gov.ph', '$2a$10$mTFpEBkCgbV/Ap25xd.DPuQAsMS5jUyEzTD/lwbRXShyRmVIAjct.', false)
ON CONFLICT (email) DO NOTHING;

SELECT * FROM users;