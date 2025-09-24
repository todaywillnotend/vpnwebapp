import { NextRequest } from "next/server";
import crypto from "crypto";

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

export interface UserSession {
  tgId: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
  authDate: number;
}

export interface AuthError {
  message: string;
  code: string;
  status: number;
}

export class AuthenticationError extends Error {
  constructor(
    message: string,
    public code: string = "AUTH_ERROR",
    public status: number = 401
  ) {
    super(message);
    this.name = "AuthenticationError";
  }
}

// Проверка данных Telegram WebApp
export function validateTelegramWebAppData(
  initData: string
): UserSession | null {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      console.error("TELEGRAM_BOT_TOKEN not set");
      return null;
    }

    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get("hash");
    urlParams.delete("hash");

    // Создаем строку для проверки подписи
    const dataCheckString = Array.from(urlParams.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join("\n");

    // Создаем секретный ключ
    const secretKey = crypto
      .createHmac("sha256", "WebAppData")
      .update(botToken)
      .digest();

    // Проверяем подпись
    const calculatedHash = crypto
      .createHmac("sha256", secretKey)
      .update(dataCheckString)
      .digest("hex");

    if (calculatedHash !== hash) {
      console.error("Invalid Telegram WebApp signature");
      return null;
    }

    // Парсим данные пользователя
    const userParam = urlParams.get("user");
    if (!userParam) {
      console.error("No user data in Telegram WebApp");
      return null;
    }

    const user = JSON.parse(userParam);
    const authDate = parseInt(urlParams.get("auth_date") || "0");

    // Проверяем, что данные не старше 24 часов
    const currentTime = Math.floor(Date.now() / 1000);
    if (currentTime - authDate > 86400) {
      console.error("Telegram WebApp data is too old");
      return null;
    }

    return {
      tgId: user.id,
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
      photoUrl: user.photo_url,
      authDate,
    };
  } catch (error) {
    console.error("Error validating Telegram WebApp data:", error);
    return null;
  }
}

// Проверка данных Telegram Login Widget
export function validateTelegramLoginData(data: TelegramUser): boolean {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      console.error("TELEGRAM_BOT_TOKEN not set");
      return false;
    }

    // В режиме разработки пропускаем валидацию для тестовых данных
    if (process.env.NODE_ENV === "development" && data.hash === "test_hash") {
      console.log("Development mode: skipping validation for test data");
      return true;
    }

    const { hash, ...userData } = data;

    // Создаем строку для проверки
    const dataCheckString = Object.keys(userData)
      .sort()
      .map((key) => `${key}=${userData[key as keyof typeof userData]}`)
      .join("\n");

    // Создаем секретный ключ
    const secretKey = crypto.createHash("sha256").update(botToken).digest();

    // Проверяем подпись
    const calculatedHash = crypto
      .createHmac("sha256", secretKey)
      .update(dataCheckString)
      .digest("hex");

    if (calculatedHash !== hash) {
      console.error("Invalid Telegram Login signature");
      return false;
    }

    // Проверяем, что данные не старше 24 часов
    const currentTime = Math.floor(Date.now() / 1000);
    if (currentTime - data.auth_date > 86400) {
      console.error("Telegram Login data is too old");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error validating Telegram Login data:", error);
    return false;
  }
}

// Создание простой сессии (без JWT, используем localStorage + server validation)
export function createUserSession(user: UserSession): string {
  // Создаем простой токен на основе данных пользователя и времени
  const sessionData = {
    tgId: user.tgId,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    photoUrl: user.photoUrl,
    authDate: user.authDate,
    sessionId: crypto.randomBytes(16).toString("hex"),
  };

  return Buffer.from(JSON.stringify(sessionData)).toString("base64");
}

// Проверка сессии
export function validateUserSession(sessionToken: string): UserSession | null {
  try {
    const sessionData = JSON.parse(
      Buffer.from(sessionToken, "base64").toString("utf-8")
    );

    // Проверяем, что сессия не старше 24 часов
    const currentTime = Math.floor(Date.now() / 1000);
    if (currentTime - sessionData.authDate > 86400) {
      return null;
    }

    return {
      tgId: sessionData.tgId,
      username: sessionData.username,
      firstName: sessionData.firstName,
      lastName: sessionData.lastName,
      photoUrl: sessionData.photoUrl,
      authDate: sessionData.authDate,
    };
  } catch (error) {
    console.error("Error validating user session:", error);
    return null;
  }
}

// Извлечение пользователя из запроса
export async function getUserFromRequest(
  request: NextRequest
): Promise<UserSession> {
  const authHeader = request.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    throw new AuthenticationError(
      "Missing or invalid authorization header",
      "MISSING_AUTH_HEADER"
    );
  }

  const token = authHeader.substring(7);
  const session = validateUserSession(token);

  if (!session) {
    throw new AuthenticationError(
      "Invalid or expired session",
      "INVALID_SESSION"
    );
  }

  return session;
}

// Проверка доступа пользователя
export async function validateUserAccess(
  request: NextRequest
): Promise<number> {
  const session = await getUserFromRequest(request);
  return session.tgId;
}

// Проверка авторизации для middleware
export async function verifyTelegramAuth(authHeader: string): Promise<boolean> {
  try {
    if (!authHeader?.startsWith("Bearer ")) {
      return false;
    }

    const token = authHeader.substring(7);
    const session = validateUserSession(token);
    return session !== null;
  } catch {
    return false;
  }
}
