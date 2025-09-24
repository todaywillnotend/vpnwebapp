import { NextRequest, NextResponse } from "next/server";
import { ServerApiClient } from "@/lib/server-api";
import { validateUserAccess, AuthenticationError } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const userTgId = await validateUserAccess(request);

    // Получаем ключи пользователя
    const result = await ServerApiClient.getUserKeys(userTgId);

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      );
    }

    return NextResponse.json(result.data || []);
  } catch (error) {
    console.error("Keys API error:", error);

    if (error instanceof AuthenticationError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch keys" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userTgId = await validateUserAccess(request);
    const body = await request.json();

    // Создаем новый ключ для пользователя
    const result = await ServerApiClient.createKey(userTgId, {
      ...body,
      owner_tg_id: userTgId, // Убеждаемся, что ключ принадлежит текущему пользователю
    });

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      );
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error("Key creation error:", error);

    if (error instanceof AuthenticationError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    return NextResponse.json(
      { error: "Failed to create key" },
      { status: 500 }
    );
  }
}
