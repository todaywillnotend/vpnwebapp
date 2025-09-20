"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout";
import { Button, StatCard, Card, PageHeader, MainMenu } from "@/components/ui";
import { useUser } from "@/contexts/UserContext";
import {
  useGetAllApiUsersGet,
  useGetAllApiKeysGet,
  useGetAllApiServersGet,
  useGetOneApiUsersTgIdGet,
} from "@/api/generated/api";
import styles from "@/styles/pages.module.scss";

export default function Home() {
  const { tgId } = useUser();

  // Используем tgId из контекста
  // const {
  //   data: users,
  //   isLoading: usersLoading,
  //   error: usersError,
  // } = useGetAllApiUsersGet(
  //   { tg_id: tgId },
  //   { query: { enabled: true, retry: false } }
  // );

  // const { data: keys, isLoading: keysLoading } = useGetAllApiKeysGet(
  //   { tg_id: tgId },
  //   { query: { enabled: true } }
  // );

  // const { data: servers, isLoading: serversLoading } = useGetAllApiServersGet(
  //   { tg_id: tgId },
  //   { query: { enabled: true } }
  // );

  const { data: user, isLoading: userLoading } = useGetOneApiUsersTgIdGet(
    tgId,
    { tg_id: tgId },
    { query: { enabled: true } }
  );

  const handleCreateUser = () => {
    console.log("Создать пользователя");
  };

  const handleAddServer = () => {
    console.log("Добавить сервер");
  };

  const handleEmergencyBlock = () => {
    console.log("Экстренная блокировка");
  };

  if (userLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <AppLayout>
      <div className={styles.pageContainer}>
        <MainMenu
          userProfile={{
            name: user?.username || user?.first_name + " " + user?.last_name,
            balance: user?.balance ? String(user?.balance) + "₽" : "0₽",
            id: String(user?.tg_id) || "-",
            devices: "02",
          }}
        />
      </div>
    </AppLayout>
  );
}
