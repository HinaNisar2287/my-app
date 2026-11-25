
import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "../../../lib/auth";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("medicare_session")?.value;

  if (!token) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }

  const session = await verifySession(token);

  if (!session) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    username: session.username,
  });
}
