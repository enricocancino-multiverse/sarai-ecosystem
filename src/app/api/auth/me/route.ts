import { NextResponse } from "next/server";
import { getUserFromRequest } from "../../../../lib/session";

export async function GET(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
  return NextResponse.json({ user });
}
