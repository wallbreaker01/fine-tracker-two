import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth/password";
import { db, ensureUsersTable } from "@/lib/database/data";
import { signUpSchema } from "@/lib/formValidation";
import { sendWelcomeEmail } from "@/lib/nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = signUpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Invalid sign-up data" },
        { status: 400 },
      );
    }

    await ensureUsersTable();

    const email = parsed.data.email.trim().toLowerCase();
    const existing = await db.query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);

    if (existing.rowCount && existing.rowCount > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "An account with this email already exists",
        },
        { status: 409 },
      );
    }

    const passwordHash = hashPassword(parsed.data.password);
    await db.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, 'user')", [parsed.data.name.trim(), email, passwordHash],
    );

    try {
      await sendWelcomeEmail({
        email,
        name: parsed.data.name.trim(),
        intro: "Your account has been created successfully.",
        password: parsed.data.password,
      });
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
    }

    return NextResponse.json({
      success: true,
      message: "Account created successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to create account right now",
        error: (error as Error).message,
      },
      { status: 500 },
    );
  }
}