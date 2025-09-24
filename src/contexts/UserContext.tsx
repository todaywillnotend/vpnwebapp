"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  tg_id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  balance?: number;
  trial?: boolean;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (authData: any) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Функция для входа через Telegram
  const login = async (authData: any) => {
    try {
      setIsLoading(true);
      setError(null);

      // Отправляем данные аутентификации на сервер
      const authResponse = await fetch("/api/auth/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(authData),
      });

      if (!authResponse.ok) {
        const errorData = await authResponse.json();
        throw new Error(errorData.error || "Authentication failed");
      }

      const { token, user: userData } = await authResponse.json();

      // Сохраняем токен
      localStorage.setItem("auth-token", token);

      // Получаем полные данные пользователя
      const userResponse = await fetch(`/api/users/${userData.tgId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!userResponse.ok) {
        throw new Error("Failed to fetch user data");
      }

      const fullUserData = await userResponse.json();
      setUser(fullUserData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Функция для выхода
  const logout = () => {
    localStorage.removeItem("auth-token");
    setUser(null);
    setError(null);
  };

  // Функция для обновления данных пользователя
  const refreshUser = async () => {
    if (!user) return;

    try {
      const token = localStorage.getItem("auth-token");
      if (!token) {
        logout();
        return;
      }

      const response = await fetch(`/api/users/${user.tg_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        if (response.status === 401) {
          logout();
          return;
        }
        throw new Error("Failed to refresh user data");
      }

      const userData = await response.json();
      setUser(userData);
    } catch (err) {
      console.error("Refresh user error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to refresh user data"
      );
    }
  };

  // Автоматическая проверка сессии при загрузке
  useEffect(() => {
    const checkSession = async () => {
      try {
        const token = localStorage.getItem("auth-token");
        if (!token) {
          setIsLoading(false);
          return;
        }

        // Проверяем сессию на сервере
        const response = await fetch("/api/auth/telegram", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          localStorage.removeItem("auth-token");
          setIsLoading(false);
          return;
        }

        const { user: userData } = await response.json();

        // Получаем полные данные пользователя
        const userResponse = await fetch(`/api/users/${userData.tgId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (userResponse.ok) {
          const fullUserData = await userResponse.json();
          setUser(fullUserData);
        }
      } catch (err) {
        console.error("Session check error:", err);
        localStorage.removeItem("auth-token");
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  // Автоматический вход для Telegram WebApp
  useEffect(() => {
    const initTelegramWebApp = async () => {
      // Проверяем, запущено ли приложение в Telegram WebApp
      if (typeof window !== "undefined" && window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;

        if (tg.initData && !user && !localStorage.getItem("auth-token")) {
          try {
            await login({ initData: tg.initData });
          } catch (err) {
            console.error("Telegram WebApp auto-login failed:", err);
          }
        }
      }
    };

    if (!isLoading && !user) {
      initTelegramWebApp();
    }
  }, [isLoading, user]);

  const value: UserContextType = {
    user,
    isLoading,
    error,
    login,
    logout,
    refreshUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// Типы для Telegram WebApp (глобальные)
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initData: string;
        initDataUnsafe: any;
        ready: () => void;
        expand: () => void;
        close: () => void;
      };
    };
  }
}
