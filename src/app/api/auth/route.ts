import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  AUTH_COOKIE,
  AUTH_COOKIE_MAX_AGE,
  expectedAuthToken,
  verifyPassword,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const submitted =
    typeof body === "object" && body !== null && "password" in body
      ? String((body as { password: unknown }).password ?? "")
      : "";

  if (!submitted) {
    return NextResponse.json(
      { error: "Password is required." },
      { status: 400 },
    );
  }

  let valid = false;
  try {
    valid = verifyPassword(submitted);
  } catch {
    return NextResponse.json(
      { error: "Server is not configured. Contact the administrator." },
      { status: 500 },
    );
  }

  if (!valid) {
    return NextResponse.json(
      { error: "Incorrect password." },
      { status: 401 },
    );
  }

  const token = await expectedAuthToken();
  const jar = await cookies();
  jar.set({
    name: AUTH_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: AUTH_COOKIE_MAX_AGE,
  });

  return NextResponse.json({ ok: true });
}
