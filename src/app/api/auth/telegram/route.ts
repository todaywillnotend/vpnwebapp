import { NextRequest, NextResponse } from "next/server";
import {
  validateTelegramWebAppData,
  validateTelegramLoginData,
  createUserSession,
  TelegramUser,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Auth request received:", {
      ...body,
      hash: body.hash ? "***" : undefined,
    });

    // Проверяем тип аутентификации
    if (body.initData) {
      console.log("Processing WebApp authentication");
      // Telegram WebApp аутентификация
      const user = validateTelegramWebAppData(body.initData);

      if (!user) {
        console.error("WebApp validation failed");
        return NextResponse.json(
          { error: "Invalid Telegram WebApp data" },
          { status: 401 }
        );
      }

      console.log("WebApp authentication successful for user:", user.tgId);

      const sessionToken = createUserSession(user);

      return NextResponse.json({
        success: true,
        token: sessionToken,
        user: {
          tgId: user.tgId,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          photoUrl: user.photoUrl,
        },
      });
    } else if (body.id && body.hash) {
      // Telegram Login Widget аутентификация
      console.log("Processing Login Widget authentication for user:", body.id);
      const telegramUser: TelegramUser = {
        id: body.id,
        first_name: body.first_name,
        last_name: body.last_name,
        username: body.username,
        photo_url: body.photo_url,
        auth_date: body.auth_date,
        hash: body.hash,
      };

      const isValid = validateTelegramLoginData(telegramUser);

      if (!isValid) {
        console.error("Login Widget validation failed for user:", body.id);
        return NextResponse.json(
          { error: "Invalid Telegram Login data" },
          { status: 401 }
        );
      }

      const user = {
        tgId: telegramUser.id,
        username: telegramUser.username,
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name,
        photoUrl: telegramUser.photo_url,
        authDate: telegramUser.auth_date,
      };

      console.log(
        "Login Widget authentication successful for user:",
        user.tgId
      );
      const sessionToken = createUserSession(user);

      return NextResponse.json({
        success: true,
        token: sessionToken,
        user: {
          tgId: user.tgId,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          photoUrl: user.photoUrl,
        },
      });
    } else {
      console.error("Invalid authentication data format:", Object.keys(body));
      return NextResponse.json(
        { error: "Invalid authentication data" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      {
        error: "Authentication failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Проверка текущей сессии
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No session found" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const { validateUserSession } = await import("@/lib/auth");
    const session = validateUserSession(token);

    if (!session) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: {
        tgId: session.tgId,
        username: session.username,
        firstName: session.firstName,
        lastName: session.lastName,
        photoUrl: session.photoUrl,
      },
    });
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json(
      { error: "Session check failed" },
      { status: 500 }
    );
  }
}
