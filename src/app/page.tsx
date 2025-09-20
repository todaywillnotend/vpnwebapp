"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout";
import { MainMenu } from "@/components/ui";
import { useUser } from "@/contexts/UserContext";

export default function Home() {
  const { user } = useUser();

  const handleCreateUser = () => {
    console.log("Создать пользователя");
  };

  const handleAddServer = () => {
    console.log("Добавить сервер");
  };

  const handleEmergencyBlock = () => {
    console.log("Экстренная блокировка");
  };

  return (
    <AppLayout>
      <MainMenu
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
