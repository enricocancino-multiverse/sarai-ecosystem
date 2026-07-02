import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function getUserByEmail(email: string) {
  const result = await pool.query(
    "SELECT id, name, email, password_hash, is_admin, is_superadmin, is_active FROM users WHERE email = $1",
    [email]
  );
  return result.rows[0];
}

export async function getUserById(userId: number) {
  const result = await pool.query(
    "SELECT id, name, email, is_admin, is_superadmin, is_active FROM users WHERE id = $1",
    [userId]
  );
  return result.rows[0];
}

export async function getLoggedInUsers() {
  const result = await pool.query(
    "SELECT id, name, email, is_admin, is_superadmin, last_login_at FROM users WHERE last_login_at IS NOT NULL AND is_active = TRUE ORDER BY last_login_at DESC"
  );
  return result.rows;
}

export async function getUsers() {
  const result = await pool.query(
    "SELECT id, name, email, is_admin, is_superadmin, is_active FROM users ORDER BY name ASC"
  );
  return result.rows;
}

export async function createUser(name: string, email: string, passwordHash: string, isAdmin = false, isSuperadmin = false, isActive = true) {
  const result = await pool.query(
    `INSERT INTO users (name, email, password_hash, is_admin, is_superadmin, is_active) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, is_admin, is_superadmin, is_active`,
    [name, email, passwordHash, isAdmin, isSuperadmin, isActive]
  );
  return result.rows[0];
}

export async function recordLogin(userId: number) {
  await pool.query("UPDATE users SET last_login_at = NOW() WHERE id = $1", [userId]);
}

export async function setUserActiveStatus(userId: number, active: boolean) {
  await pool.query("UPDATE users SET is_active = $1 WHERE id = $2", [active, userId]);
}

export async function deleteUserById(userId: number) {
  await pool.query("DELETE FROM users WHERE id = $1", [userId]);
}
