-- PostgreSQL schema for SARAI Ecosystem authentication

CREATE TABLE users (
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

-- Example superadmin user insert
-- INSERT INTO users (name, email, password_hash, is_admin, is_superadmin, is_active) VALUES ('Superadmin User', 'superadmin@dost.gov.ph', '<bcrypt hashed password>', true, true, true);
-- Example admin user insert
-- INSERT INTO users (name, email, password_hash, is_admin) VALUES ('Admin User', 'admin@dost.gov.ph', '<bcrypt hashed password>', true);
