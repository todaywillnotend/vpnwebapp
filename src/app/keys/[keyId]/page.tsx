"use client";

import { AppLayout } from "@/components/layout";
import {
  KeyDetails,
  MenuButton,
  LoadingPage,
  ErrorPage,
} from "@/components/ui";
import { useUser } from "@/contexts/UserContext";
import { useGetAllByFieldApiKeysAllTgIdGet } from "@/api/generated/api";
import { useParams } from "next/navigation";

export default function KeyDetailsPage() {
  const { tgId } = useUser();
  const params = useParams();
  const keyId = params.keyId as string;

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

  // Находим конкретный ключ по ID
  const currentKey = keys.find(
    (key) => key.email === decodeURIComponent(keyId)
  );

  if (keysLoading) {
    return <LoadingPage />;
  }

  if (error) {
    return <ErrorPage />;
  }

  if (!currentKey) {
    return <ErrorPage message="Ключ не найден" showRetryButton={false} />;
  }

  return (
    <AppLayout>
      <KeyDetails keyData={currentKey} />
    </AppLayout>
  );
}
