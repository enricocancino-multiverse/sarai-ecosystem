import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "";

export function createSessionCookie(user: { id: number; name: string; email: string; is_admin: boolean }) {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });
}

export function getUserFromRequest(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/session=([^;]+)/);
  if (!match) return null;

  const token = match[1];
  try {
    return jwt.verify(token, JWT_SECRET) as { id: number; name: string; email: string; is_admin: boolean };
  } catch (error) {
    return null;
  }
}

export function createSessionResponse(user: { id: number; name: string; email: string; is_admin: boolean }) {
  const token = createSessionCookie(user);
  const response = new Response(JSON.stringify({ success: true, user }), {
    headers: { "Content-Type": "application/json" },
  });
  response.headers.set("Set-Cookie", `session=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`);
  return response;
}
