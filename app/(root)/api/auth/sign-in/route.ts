import { NextResponse } from "next/server";
import { verifyPassword } from "@/lib/auth/password";
import { db, ensureUsersTable } from "@/lib/database/data";
import { signInSchema } from "@/lib/formValidation";
import {AUTH_SESSION_COOKIE, SESSION_MAX_AGE_SECONDS, createSessionCookieValue} from "@/lib/auth/session";
import { UserRow } from "@/lib/types";



export async function POST(request: Request) {
  try {
    const body = await request.json(); // get sign in data
    const parsed = signInSchema.safeParse(body); //check the data

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid sign-in data",
          error: parsed.error.message,
        },
        { status: 400 },
      );
    }

    // Ensure table exists (cached after first call for performance)
    await ensureUsersTable();

    const email = parsed.data.email.trim().toLowerCase();
    const result = await db.query<UserRow>(
      "SELECT id, name, email, image_url, password_hash, role FROM users WHERE email = $1",
      [email],
    );

    const user = result.rows[0];
    if (!user || !(await verifyPassword(parsed.data.password, user.password_hash))) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
          error: "Email or password is incorrect",
        },
        { status: 401 },
      );
    }

    const response = NextResponse.json({
      success: true,
      message: `Welcome back, ${user.name}`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.image_url,
        role: user.role,
      },
    });

    response.cookies.set({
      name: AUTH_SESSION_COOKIE,
      value: createSessionCookieValue({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }),
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to sign in right now",
        error: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

//handles user sign in, validates data
