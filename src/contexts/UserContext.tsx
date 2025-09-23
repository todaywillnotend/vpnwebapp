"use client";

import { useGetOneApiUsersTgIdGet, UserResponse } from "@/api/generated/api";
import { AppLayout } from "@/components/layout";
import { TrialMenu, LoadingPage, ErrorPage } from "@/components/ui";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface UserContextType {
  tgId: number;
  setTgId: (id: number) => void;
  user: UserResponse;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  // В реальном приложении это будет браться из localStorage или API
  const defaultTgId = parseInt(
    process.env.NEXT_PUBLIC_DEFAULT_TG_ID || "123456789"
  );
  const [tgId, setTgId] = useState<number>(defaultTgId);

  const {
    data: user,
    isLoading: userLoading,
    error,
  } = useGetOneApiUsersTgIdGet(
    tgId,
    { tg_id: tgId }, // Фиктивное значение, реальный admin ID автоматически добавляется на сервере
    { query: { enabled: Boolean(tgId) } }
  );

  if (userLoading) {
    return <LoadingPage />;
  }

  if (error) {
    return <ErrorPage />;
  }

  // Если не использовал триал
  if (!user?.trial || !user) {
    return (
      <AppLayout>
        <TrialMenu
          userProfile={{
            name: user?.username || user?.first_name + " " + user?.last_name,
            balance: user?.balance ? String(user?.balance) + "₽" : "0₽",
            id: String(user?.tg_id) || "-",
            devices: "02",
          }}
        />
      </AppLayout>
    );
  }

  const value: UserContextType = {
    tgId,
    setTgId,
    user,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
