import { NextResponse } from "next/server";
import { verifyPassword } from "../../../../lib/auth";
import { createSessionResponse } from "../../../../lib/session";
import { getUserByEmail, recordLogin } from "../../../../lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, mode } = body;

    if (!email || !password || !mode) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    if (!user.is_active) {
      return NextResponse.json({ error: "Account inactive. Contact regional IT support." }, { status: 403 });
    }

    const passwordMatches = await verifyPassword(password, user.password_hash);
    if (!passwordMatches) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    if (mode === "admin" && !user.is_admin && !user.is_superadmin) {
      return NextResponse.json({ error: "Admin access denied." }, { status: 403 });
    }

    if (mode === "superadmin") {
      if (!user.is_superadmin) {
        return NextResponse.json({ error: "Superadmin access denied." }, { status: 403 });
      }
    }

    await recordLogin(user.id);
    return createSessionResponse({
      id: user.id,
      name: user.name,
      email: user.email,
      is_admin: Boolean(user.is_admin),
      is_superadmin: Boolean(user.is_superadmin),
    });
  } catch (error) {
    console.error("Login route error:", error);
    return NextResponse.json({ error: "Server error during login." }, { status: 500 });
  }
}
