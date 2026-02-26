import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { getSessionUser } from "@/lib/auth/session";
import { deleteFine, getFineById, updateFine } from "@/lib/database/fines";
import { fineSchema } from "@/lib/formValidation";

const parseId = (value: string) => {
  const id = Number(value);
  return Number.isFinite(id) && id > 0 ? id : null;
};

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  try {
    const { id: rawId } = await context.params;
    const id = parseId(rawId);

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Invalid fine id" },
        { status: 400 },
      );
    }
    const fine = await getFineById(id);

    if (!fine) {
      return NextResponse.json(
        { success: false, message: "Fine not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: fine });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to load fine",
        error: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id: rawId } = await context.params;
    const id = parseId(rawId);

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Invalid fine id" },
        { status: 400 },
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

    const updated = await updateFine(id, parsed.data);

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Fine not found" },
        { status: 404 },
      );
    }

    revalidatePath("/fines");
    revalidatePath("/dashboard");

    return NextResponse.json({
      success: true,
      message: "Fine updated successfully",
      data: updated,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update fine",
        error: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id: rawId } = await context.params;
    const id = parseId(rawId);

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Invalid fine id" },
        { status: 400 },
      );
    }

    const deleted = await deleteFine(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Fine not found" },
        { status: 404 },
      );
    }

    revalidatePath("/fines");
    revalidatePath("/dashboard");

    return NextResponse.json({
      success: true,
      message: "Fine deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete fine",
        error: (error as Error).message,
      },
      { status: 500 },
    );
  }
}