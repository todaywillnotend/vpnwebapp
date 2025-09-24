import { NextRequest, NextResponse } from "next/server";
import { verifyTelegramAuth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  // Защищаем только API routes (кроме публичных)
  if (request.nextUrl.pathname.startsWith("/api/")) {
    // Исключаем публичные эндпоинты
    const publicPaths = ["/api/auth/telegram", "/api/auth/dev-login"];

    const isPublicPath = publicPaths.some((path) =>
      request.nextUrl.pathname.startsWith(path)
    );

    if (isPublicPath) {
      return NextResponse.next();
    }

    try {
      const authHeader = request.headers.get("authorization");

      if (!authHeader) {
        return NextResponse.json(
          {
            error: "Authorization required",
            code: "MISSING_AUTH_HEADER",
          },
          { status: 401 }
        );
      }

      // Проверяем Telegram аутентификацию
      const isValid = await verifyTelegramAuth(authHeader);

      if (!isValid) {
        return NextResponse.json(
          {
            error: "Invalid or expired authentication",
            code: "INVALID_AUTH",
          },
          { status: 401 }
        );
      }

      // Добавляем CORS заголовки для API
      const response = NextResponse.next();
      response.headers.set("Access-Control-Allow-Origin", "*");
      response.headers.set(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, OPTIONS"
      );
      response.headers.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
      );

      return response;
    } catch (error) {
      console.error("Middleware authentication error:", error);
      return NextResponse.json(
        {
          error: "Authentication failed",
          code: "AUTH_ERROR",
        },
        { status: 401 }
      );
    }
  }

  // Для всех остальных запросов
  return NextResponse.next();
}

// Обработка OPTIONS запросов для CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export const config = {
  matcher: ["/api/:path*"],
};
