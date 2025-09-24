import { NextRequest, NextResponse } from "next/server";
import { ServerApiClient } from "@/lib/server-api";
import { validateUserAccess, AuthenticationError } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { tgId: string } }
) {
  try {
    const requestedTgId = parseInt(params.tgId);

    if (isNaN(requestedTgId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // Проверяем права доступа
    const currentUserTgId = await validateUserAccess(request);

    // Пользователь может получить только свои данные
    if (currentUserTgId !== requestedTgId) {
      return NextResponse.json(
        { error: "Access denied. You can only access your own data." },
        { status: 403 }
      );
    }

    // Безопасно обращаемся к внешнему API
    const result = await ServerApiClient.getUser(requestedTgId);

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("User API error:", error);

    if (error instanceof AuthenticationError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Обновление данных пользователя (если потребуется)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { tgId: string } }
) {
  try {
    const requestedTgId = parseInt(params.tgId);

    if (isNaN(requestedTgId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // Проверяем права доступа
    const currentUserTgId = await validateUserAccess(request);

    // Пользователь может обновить только свои данные
    if (currentUserTgId !== requestedTgId) {
      return NextResponse.json(
        { error: "Access denied. You can only update your own data." },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Здесь можно добавить валидацию данных
    // const validatedData = UserUpdateSchema.parse(body);

    // Пока возвращаем заглушку, так как в текущем API нет эндпоинта для обновления пользователя
    return NextResponse.json(
      { message: "User update not implemented yet" },
      { status: 501 }
    );
  } catch (error) {
    console.error("User update error:", error);

    if (error instanceof AuthenticationError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
