"use client";

import { useEffect, useRef, useState } from "react";
import { useUser } from "@/contexts/UserContext";

interface TelegramLoginButtonProps {
  botName?: string;
  buttonSize?: "large" | "medium" | "small";
  cornerRadius?: number;
  requestAccess?: boolean;
}

export const TelegramLoginButton: React.FC<TelegramLoginButtonProps> = ({
  botName = process.env.NEXT_PUBLIC_TG_BOT_USERNAME || "your_bot",
  buttonSize = "large",
  cornerRadius = 20,
  requestAccess = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { login } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [widgetLoaded, setWidgetLoaded] = useState(false);

  useEffect(() => {
    console.log("TelegramLoginButton: Initializing with bot name:", botName);

    // Функция обратного вызова для Telegram Login
    const onTelegramAuth = async (user: any) => {
      console.log("Telegram auth callback received:", user);
      setIsLoading(true);
      setError(null);

      try {
        await login({
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          username: user.username,
          photo_url: user.photo_url,
          auth_date: user.auth_date,
          hash: user.hash,
        });
        console.log("Login successful");
      } catch (error) {
        console.error("Telegram login failed:", error);
        setError("Ошибка авторизации через Telegram");
      } finally {
        setIsLoading(false);
      }
    };

    // Добавляем функцию в глобальную область видимости
    (window as any).onTelegramAuth = onTelegramAuth;

    // Проверяем, что у нас есть имя бота
    if (!botName || botName === "your_bot") {
      console.error("Bot name not configured properly:", botName);
      setError(
        "Имя бота не настроено. Проверьте NEXT_PUBLIC_VPN_PROJECT_NAME в .env"
      );
      return;
    }

    // Создаем скрипт для Telegram Login Widget
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-login", botName);
    script.setAttribute("data-size", buttonSize);
    script.setAttribute("data-corner-radius", cornerRadius.toString());
    script.setAttribute("data-request-access", requestAccess ? "write" : "");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.async = true;

    // Обработчики загрузки скрипта
    script.onload = () => {
      console.log("Telegram widget script loaded successfully");
      setWidgetLoaded(true);
    };

    script.onerror = (error) => {
      console.error("Failed to load Telegram widget script:", error);
      setError("Не удалось загрузить виджет Telegram");
    };

    // Добавляем скрипт в контейнер
    if (containerRef.current) {
      containerRef.current.appendChild(script);
      console.log("Script added to container");
    } else {
      console.error("Container ref is null");
    }

    // Очистка при размонтировании
    return () => {
      if (containerRef.current && script.parentNode) {
        script.parentNode.removeChild(script);
      }
      delete (window as any).onTelegramAuth;
    };
  }, [botName, buttonSize, cornerRadius, requestAccess, login]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-400">Авторизация...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {error && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-500 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <div ref={containerRef} className="mb-4 min-h-[50px] bg-white" />

      {/* Отладочная информация */}
      {process.env.NEXT_PUBLIC_NODE_ENV === "development" && (
        <div className="text-xs text-gray-500 mb-4 text-center">
          <p>Bot: {botName}</p>
          <p>Widget loaded: {widgetLoaded ? "Yes" : "No"}</p>
        </div>
      )}

      {/* Fallback кнопка */}
      <div className="text-center">
        <p className="text-sm text-gray-400 mb-2">Если кнопка не появилась:</p>
        <button
          onClick={() => {
            const botUrl = `https://t.me/${botName}?start=auth`;
            console.log("Opening bot URL:", botUrl);
            window.open(botUrl, "_blank");
          }}
          className="bg-[#2aabee] text-white px-6 py-3 rounded-2xl font-medium hover:bg-[#229ed9] transition-colors"
        >
          Открыть в Telegram
        </button>
      </div>

      {/* Альтернативная кнопка для тестирования - показываем только если настроен dev режим */}
      {process.env.NEXT_PUBLIC_NODE_ENV === "development" &&
        Boolean(process.env.NEXT_PUBLIC_DEV_USER_TG_ID) && (
          <div className="mt-4">
            <button
              onClick={async () => {
                try {
                  setIsLoading(true);
                  setError(null);

                  // Используем специальный эндпоинт для dev входа
                  const response = await fetch("/api/auth/dev-login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                  });

                  if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Dev login failed");
                  }

                  const { token, user, message } = await response.json();

                  // Сохраняем токен и обновляем состояние
                  localStorage.setItem("auth-token", token);
                  console.log("Dev login successful:", message);

                  // Перезагружаем страницу для применения изменений
                  window.location.reload();
                } catch (error) {
                  console.error("Dev login error:", error);
                  setError(
                    error instanceof Error ? error.message : "Dev login failed"
                  );
                } finally {
                  setIsLoading(false);
                }
              }}
              className="text-xs text-gray-500 underline hover:text-gray-400 transition-colors"
            >
              Тестовый вход (dev)
            </button>
            <p className="text-xs text-gray-600 mt-1">
              Вход под пользователем из NEXT_PUBLIC_DEV_USER_TG_ID
            </p>
          </div>
        )}
    </div>
  );
};

// Компонент для отображения в случае, если Telegram WebApp не поддерживается
export const TelegramWebAppFallback: React.FC = () => {
  return (
    <div className="text-center p-6 bg-gray-800 rounded-2xl">
      <h3 className="text-lg font-semibold text-white mb-2">
        Telegram WebApp не поддерживается
      </h3>
      <p className="text-gray-400 mb-3">
        Откройте приложение в Telegram или используйте веб-версию
      </p>
      <TelegramLoginButton />
    </div>
  );
};
