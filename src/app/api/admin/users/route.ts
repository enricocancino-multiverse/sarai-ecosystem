import { NextResponse } from "next/server";
import { getUserFromRequest } from "../../../../lib/session";
import { getUserByEmail, getUsers, createUser } from "../../../../lib/db";
import { hashPassword } from "../../../../lib/auth";

export async function GET(request: Request) {
  const currentUser = getUserFromRequest(request);
  if (!currentUser || (!currentUser.is_admin && !currentUser.is_superadmin)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await getUsers();
  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  const currentUser = getUserFromRequest(request);
  if (!currentUser || (!currentUser.is_admin && !currentUser.is_superadmin)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, email, password, isAdmin = false, isSuperadmin = false, isActive = true } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required." }, { status: 400 });
    }

    if (isSuperadmin && !currentUser.is_superadmin) {
      return NextResponse.json({ error: "Only superadmins can provision superadmins." }, { status: 403 });
    }

    const existing = await getUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: "A user with that email already exists." }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const user = await createUser(name, email, passwordHash, Boolean(isAdmin), Boolean(isSuperadmin), Boolean(isActive));
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("Admin users route error:", error);
    return NextResponse.json({ error: "Unable to provision user." }, { status: 500 });
  }
}
