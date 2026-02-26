import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSessionUser } from "@/lib/auth/session";
import { createPartyExpense, getPartyExpenses } from "@/lib/database/party";
import { expenseSchema } from "@/lib/formValidation";

export async function GET() {
  try {
    const expenses = await getPartyExpenses();
    return NextResponse.json({ success: true, data: expenses });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to load expenses",
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
    const parsed = expenseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: parsed.error.issues[0]?.message ?? "Invalid expense payload",
        },
        { status: 400 },
      );
    }

    const expense = await createPartyExpense(parsed.data);
    revalidatePath("/party");

    return NextResponse.json({
      success: true,
      message: "Expense added successfully",
      data: expense,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to add expense",
        error: (error as Error).message,
      },
      { status: 500 },
    );
  }
}
