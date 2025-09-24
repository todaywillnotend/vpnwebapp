import { NextRequest, NextResponse } from "next/server";
import { ServerApiClient } from "@/lib/server-api";
import { createUserSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  // Разрешаем только в режиме разработки
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "Dev login is only available in development mode" },
      { status: 403 }
    );
  }

  try {
    const devUserTgId = process.env.NEXT_PUBLIC_DEV_USER_TG_ID;

    if (!devUserTgId) {
      return NextResponse.json(
        {
          error:
            "NEXT_PUBLIC_DEV_USER_TG_ID not configured in environment variables",
        },
        { status: 400 }
      );
    }

    const tgId = parseInt(devUserTgId);
    if (isNaN(tgId)) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_DEV_USER_TG_ID must be a valid number" },
        { status: 400 }
      );
    }

    console.log("Dev login: Fetching user data for TG ID:", tgId);

    // Получаем данные пользователя из внешнего API
    const result = await ServerApiClient.getUser(tgId);

    if (result.error) {
      console.error("Dev login: Failed to fetch user data:", result.error);
      return NextResponse.json(
        { error: `Failed to fetch user data: ${result.error}` },
        { status: result.status }
      );
    }

    const userData = result.data as any;
    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Создаем сессию пользователя
    const userSession = {
      tgId: userData.tg_id || tgId,
      username: userData.username,
      firstName: userData.first_name,
      lastName: userData.last_name,
      photoUrl: userData.photo_url,
      authDate: Math.floor(Date.now() / 1000),
    };

    const sessionToken = createUserSession(userSession);

    console.log("Dev login successful for user:", {
      tgId: userData.tg_id || tgId,
      username: userData.username,
      firstName: userData.first_name,
    });

    return NextResponse.json({
      success: true,
      token: sessionToken,
      user: {
        tgId: userData.tg_id || tgId,
        username: userData.username,
        firstName: userData.first_name,
        lastName: userData.last_name,
        photoUrl: userData.photo_url,
        balance: userData.balance,
        trial: userData.trial,
      },
      message: `Logged in as ${userData.username || userData.first_name || "User"} (${userData.tg_id || tgId})`,
    });
  } catch (error) {
    console.error("Dev login error:", error);
    return NextResponse.json(
      {
        error: "Dev login failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
