"use client";

import { AppLayout } from "@/components/layout";
import { KeysList } from "@/components/ui";
import { useUser } from "@/contexts/UserContext";
import { CircularProgress, Spinner } from "@heroui/react";
import { useGetAllByFieldApiKeysAllTgIdGet } from "@/api/generated/api";
import { useState } from "react";

export default function KeysPage() {
  const { tgId } = useUser();

  const { data: keys = [], isLoading: keysLoading } =
    useGetAllByFieldApiKeysAllTgIdGet(
      tgId,
      { tg_id: tgId }, // Фиктивное значение, реальный admin ID автоматически добавляется на сервере
      {
        query: {
          enabled: true,
        },
      }
    );

  if (keysLoading) {
    return (
      <AppLayout>
        <div className="h-full flex items-center justify-center">
          <Spinner color="primary" size="lg" aria-label="Загрузка..." />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <KeysList keys={keys} />
    </AppLayout>
  );
}
