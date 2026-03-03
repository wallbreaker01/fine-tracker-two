import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { db, ensureUsersTable, updateUserAvatar } from "@/lib/database/data";
import { AvatarRow, AvatarUpdatePayload } from "@/lib/types";


export async function PUT(request: Request) {
  try{
    const sessionUser = await getSessionUser();
    if(!sessionUser){
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = (await request.json()) as AvatarUpdatePayload;
    const avatarUrl = typeof body.avatarUrl === 'string' ? body.avatarUrl.trim() : "";
    if(!avatarUrl){
      return NextResponse.json(
        { success: false, message: "Avatar URL is required" },
        { status: 400 },
      );
    }
    
    const updated = await updateUserAvatar(sessionUser.id, avatarUrl);
    if(!updated){
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({
      success: true,
      message: "Profile photo updated successfully",
      data: {
        avatar: updated.image_url ?? null,
      },
    });

  } catch(error){
    return NextResponse.json(
      {
        success: false,
        message: "Unable to update profile photo",
        error: (error as Error).message,
      },
      { status: 500 },
    );
  }
}