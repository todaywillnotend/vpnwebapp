"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface UserContextType {
  tgId: number;
  setTgId: (id: number) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  // В реальном приложении это будет браться из localStorage или API
  const defaultTgId = parseInt(process.env.NEXT_PUBLIC_DEFAULT_TG_ID || "");
  const [tgId, setTgId] = useState<number>(defaultTgId);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  const value: UserContextType = {
    tgId,
    setTgId,
    isAuthenticated,
    setIsAuthenticated,
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
