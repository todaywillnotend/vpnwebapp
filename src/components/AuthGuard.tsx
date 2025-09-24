"use client";

import { useUser } from "@/contexts/UserContext";
import { LoadingPage, ErrorPage, TrialMenu } from "@/components/ui";
import { AppLayout } from "@/components/layout";
import { TelegramLoginButton } from "@/components/TelegramLoginButton";

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, isLoading, error } = useUser();

  // Показываем загрузку
  if (isLoading) {
    return <LoadingPage message="Проверка авторизации..." />;
  }

  // Показываем ошибку
  if (error) {
    return <ErrorPage message={error} />;
  }

  // Пользователь не авторизован
  if (!user) {
    return (
      <AppLayout>
        <div className="h-full flex flex-col items-center justify-center text-center px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">
              Добро пожаловать!
            </h1>
            <p className="text-gray-400 mb-8">
              Войдите через Telegram, чтобы продолжить
            </p>
          </div>

          <TelegramLoginButton />

          <div className="mt-8 text-sm text-gray-500">
            <p>Приложение работает как:</p>
            <ul className="mt-2 space-y-1">
              <li>• Telegram WebApp (автоматический вход)</li>
              <li>• Веб-сайт с Telegram Login</li>
            </ul>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Пользователь не активировал триал
  if (!user.trial) {
    return (
      <AppLayout>
        <TrialMenu
          userProfile={{
            name: user.username || `${user.first_name} ${user.last_name}`,
            balance: user.balance ? `${user.balance}₽` : "0₽",
            id: String(user.tg_id),
            devices: "02",
          }}
        />
      </AppLayout>
    );
  }

  // Пользователь авторизован и активировал триал
  return <>{children}</>;
};
