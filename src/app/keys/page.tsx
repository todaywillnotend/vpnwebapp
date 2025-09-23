"use client";

import { AppLayout } from "@/components/layout";
import { KeysList, LoadingPage, ErrorPage } from "@/components/ui";
import { useUser } from "@/contexts/UserContext";
import { useGetAllByFieldApiKeysAllTgIdGet } from "@/api/generated/api";

export default function KeysPage() {
  const { tgId } = useUser();

  const {
    data: keys = [],
    isLoading: keysLoading,
    error,
  } = useGetAllByFieldApiKeysAllTgIdGet(
    tgId,
    { tg_id: tgId }, // Фиктивное значение, реальный admin ID автоматически добавляется на сервере
    {
      query: {
        enabled: true,
      },
    }
  );

  if (keysLoading) {
    return <LoadingPage />;
  }

  if (error) {
    return <ErrorPage />;
  }

  return (
    <AppLayout>
      <KeysList keys={keys} />
    </AppLayout>
  );
}
