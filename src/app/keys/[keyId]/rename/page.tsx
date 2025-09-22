"use client";

import { AppLayout } from "@/components/layout";
import { RenameKeyPage } from "@/components/ui";
import { useUser } from "@/contexts/UserContext";
import { Spinner } from "@heroui/react";
import { useGetAllByFieldApiKeysAllTgIdGet } from "@/api/generated/api";
import { useParams } from "next/navigation";

export default function RenameKeyPageRoute() {
  const { tgId } = useUser();
  const params = useParams();
  const keyId = params.keyId as string;

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

  // Находим конкретный ключ по ID
  const currentKey = keys.find(
    (key) => key.email === decodeURIComponent(keyId)
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

  if (!currentKey) {
    return (
      <AppLayout>
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-bold text-white mb-2">
              Ключ не найден
            </h2>
            <p className="text-graydark">Запрашиваемый ключ не существует</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <RenameKeyPage keyData={currentKey} />
    </AppLayout>
  );
}
