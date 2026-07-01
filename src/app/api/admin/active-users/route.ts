import { NextResponse } from "next/server";
import { getLoggedInUsers } from "../../../../lib/db";
import { getUserFromRequest } from "../../../../lib/session";

export async function GET(request: Request) {
  const currentUser = getUserFromRequest(request);
  if (!currentUser || !currentUser.is_admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await getLoggedInUsers();
  return NextResponse.json({ users });
}
