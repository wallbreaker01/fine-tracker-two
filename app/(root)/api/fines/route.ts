import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSessionUser } from "@/lib/auth/session";
import { createFine, getFines } from "@/lib/database/fines";
import { fineSchema } from "@/lib/formValidation";

export async function GET() {
  try {
    const fines = await getFines();
    return NextResponse.json({ success: true, data: fines });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to load fines",
        error: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const parsed = fineSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: parsed.error.issues[0]?.message ?? "Invalid fine payload",
        },
        { status: 400 },
      );
    }

    const fine = await createFine(parsed.data);
    // revalidatePath("/fines");
    // revalidatePath("/dashboard");

    return NextResponse.json({
      success: true,
      message: "Fine added successfully",
      data: fine,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to add fine",
        error: (error as Error).message,
      },
      { status: 500 },
    );
  }
}
