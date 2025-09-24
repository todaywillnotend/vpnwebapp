import { NextRequest, NextResponse } from "next/server";
import { ServerApiClient } from "@/lib/server-api";
import { validateUserAccess, AuthenticationError } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { keyId: string } }
) {
  try {
    const userTgId = await validateUserAccess(request);
    const keyId = decodeURIComponent(params.keyId);

    // Сначала получаем все ключи пользователя для проверки владения
    const keysResult = await ServerApiClient.getUserKeys(userTgId);

    if (keysResult.error) {
      return NextResponse.json(
        { error: keysResult.error },
        { status: keysResult.status }
      );
    }

    // Проверяем, что ключ принадлежит пользователю
    const userKeys = Array.isArray(keysResult.data) ? keysResult.data : [];
    const keyExists = userKeys.some((key: any) => key.email === keyId);

    if (!keyExists) {
      return NextResponse.json(
        { error: "Key not found or access denied" },
        { status: 404 }
      );
    }

    // Возвращаем информацию о ключе
    const keyData = userKeys.find((key: any) => key.email === keyId);

    return NextResponse.json(keyData);
  } catch (error) {
    console.error("Key details API error:", error);

    if (error instanceof AuthenticationError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch key details" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { keyId: string } }
) {
  try {
    const userTgId = await validateUserAccess(request);
    const keyId = decodeURIComponent(params.keyId);
    const body = await request.json();

    // Сначала проверяем, что ключ принадлежит пользователю
    const keysResult = await ServerApiClient.getUserKeys(userTgId);

    if (keysResult.error) {
      return NextResponse.json(
        { error: keysResult.error },
        { status: keysResult.status }
      );
    }

    const userKeys = Array.isArray(keysResult.data) ? keysResult.data : [];
    const keyExists = userKeys.some((key: any) => key.email === keyId);

    if (!keyExists) {
      return NextResponse.json(
        { error: "Key not found or access denied" },
        { status: 404 }
      );
    }

    // Обновляем ключ
    const result = await ServerApiClient.updateKey(keyId, body);

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Key update error:", error);

    if (error instanceof AuthenticationError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    return NextResponse.json(
      { error: "Failed to update key" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { keyId: string } }
) {
  try {
    const userTgId = await validateUserAccess(request);
    const keyId = decodeURIComponent(params.keyId);

    // Сначала проверяем, что ключ принадлежит пользователю
    const keysResult = await ServerApiClient.getUserKeys(userTgId);

    if (keysResult.error) {
      return NextResponse.json(
        { error: keysResult.error },
        { status: keysResult.status }
      );
    }

    const userKeys = Array.isArray(keysResult.data) ? keysResult.data : [];
    const keyExists = userKeys.some((key: any) => key.email === keyId);

    if (!keyExists) {
      return NextResponse.json(
        { error: "Key not found or access denied" },
        { status: 404 }
      );
    }

    // Удаляем ключ
    const result = await ServerApiClient.deleteKey(keyId);

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Key deleted successfully",
    });
  } catch (error) {
    console.error("Key deletion error:", error);

    if (error instanceof AuthenticationError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    return NextResponse.json(
      { error: "Failed to delete key" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Token",
    },
  });
}
