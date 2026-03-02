import { NextResponse, NextRequest } from "next/server";
import { getNotifications, markAsRead, markAllAsRead} from "@/lib/database/notifications";
import { getSessionUser } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const notifications = await getNotifications();

    return NextResponse.json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    console.error("Notification API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();

    if (body.action === "markAsRead" && body.notificationId) {
      await markAsRead(body.notificationId);
      return NextResponse.json({ success: true });
    } else if (body.action === "markAllAsRead") {
      await markAllAsRead();
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, message: "Invalid action" },
      { status: 400 },
    );
  } catch (error) {
    console.error("Notification API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
