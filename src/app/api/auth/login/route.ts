
import { NextRequest, NextResponse } from "next/server";
import { createSession } from "../../../lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminUsername || !adminPassword) {
      return NextResponse.json(
        { error: "Admin credentials are not configured" },
        { status: 500 }
      );
    }

    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      username !== adminUsername ||
      password !== adminPassword
    ) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    const token = await createSession(username);

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
    });

    response.cookies.set("medicare_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Unable to process login request" },
      { status: 400 }
    );
  }
}
