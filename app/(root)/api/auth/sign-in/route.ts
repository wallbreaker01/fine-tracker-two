import { NextResponse } from "next/server";
import { verifyPassword } from "@/lib/auth/password";
import { db, ensureUsersTable } from "@/lib/database/data";
import { signInSchema } from "@/lib/formValidation";
import { AUTH_SESSION_COOKIE, createSessionCookieValue} from "@/lib/auth/session";

type UserRow = {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: "admin" | "user";
};

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

    await ensureUsersTable(); //wait to ensure user table

    const email = parsed.data.email.trim().toLowerCase();
    const result = await db.query<UserRow>(
      "SELECT id, name, email, password_hash, role FROM users WHERE email = $1", [email],
    );

    const user = result.rows[0];
    if (!user || !verifyPassword(parsed.data.password, user.password_hash)) {
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
      maxAge: 60 * 60 * 24 * 7,
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