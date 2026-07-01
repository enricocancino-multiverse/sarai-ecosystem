import { NextResponse } from "next/server";
import { createUser, getUserByEmail } from "../../../../lib/db";
import { hashPassword } from "../../../../lib/auth";

export async function POST(request: Request) {
  const { name, email, password } = await request.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  const existing = await getUserByEmail(email);
  if (existing) {
    return NextResponse.json({ error: "Email already exists." }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  await createUser(name, email, passwordHash, false);

  return NextResponse.json({ success: true });
}
