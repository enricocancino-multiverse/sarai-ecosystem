import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function getUserByEmail(email: string) {
  const result = await pool.query("SELECT id, name, email, password_hash, is_admin FROM users WHERE email = $1", [email]);
  return result.rows[0];
}

export async function getLoggedInUsers() {
  const result = await pool.query("SELECT id, name, email, is_admin, last_login_at FROM users WHERE last_login_at IS NOT NULL ORDER BY last_login_at DESC");
  return result.rows;
}

export async function createUser(name: string, email: string, passwordHash: string, isAdmin = false) {
  const result = await pool.query(
    `INSERT INTO users (name, email, password_hash, is_admin) VALUES ($1, $2, $3, $4) RETURNING id, name, email, is_admin`,
    [name, email, passwordHash, isAdmin]
  );
  return result.rows[0];
}

export async function recordLogin(userId: number) {
  await pool.query("UPDATE users SET last_login_at = NOW() WHERE id = $1", [userId]);
}
