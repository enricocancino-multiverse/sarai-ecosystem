import { NextResponse } from "next/server";
import { getUserById, setUserActiveStatus, deleteUserById } from "../../../../../lib/db";
import { getUserFromRequest } from "../../../../../lib/session";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const currentUser = getUserFromRequest(request);
  if (!currentUser || (!currentUser.is_admin && !currentUser.is_superadmin)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const targetUser = await getUserById(Number(id));
    if (!targetUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (targetUser.is_superadmin && !currentUser.is_superadmin) {
      return NextResponse.json({ error: "Cannot modify superadmin." }, { status: 403 });
    }

    const body = await request.json();
    const { active } = body;
    if (typeof active !== "boolean") {
      return NextResponse.json({ error: "active must be a boolean." }, { status: 400 });
    }

    await setUserActiveStatus(Number(id), active);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin user patch error:", error);
    return NextResponse.json({ error: "Unable to update user." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const currentUser = getUserFromRequest(request);
  if (!currentUser || (!currentUser.is_admin && !currentUser.is_superadmin)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const targetUser = await getUserById(Number(id));
    if (!targetUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (targetUser.is_superadmin) {
      return NextResponse.json({ error: "Cannot delete superadmin." }, { status: 403 });
    }

    await deleteUserById(Number(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin user delete error:", error);
    return NextResponse.json({ error: "Unable to delete user." }, { status: 500 });
  }
}
