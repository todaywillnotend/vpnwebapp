"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@heroui/react";
import { BackButton } from "../";
import {
  useEditKeyByEmailApiKeysEditByEmailEmailPatch,
  getGetByEmailApiKeysByEmailGetQueryKey,
  getGetAllByFieldApiKeysAllTgIdGetQueryKey,
  getGetRouterKeysByTgIdApiKeysRoutersTgIdGetQueryKey,
} from "@/api/generated/api";
import { useUser } from "@/contexts/UserContext";
import { useQueryClient } from "@tanstack/react-query";

interface RenameKeyPageProps {
  keyData: {
    email?: string | null;
    alias?: string | null;
    expiry_time?: number;
  };
}

const RenameKeyPage: React.FC<RenameKeyPageProps> = ({ keyData }) => {
  const router = useRouter();
  const { tgId } = useUser();
  const queryClient = useQueryClient();

  const keyName = keyData.alias || keyData.email || "";
  const [newName, setNewName] = useState(keyName);

  const { mutateAsync, isPending } =
    useEditKeyByEmailApiKeysEditByEmailEmailPatch();

  const handleSave = async () => {
    if (!newName.trim()) return;

    try {
      await mutateAsync({
        email: keyData.email || "",
        data: { alias: newName.trim() },
        params: { tg_id: tgId },
      });

      // Инвалидируем кэш для обновления данных
      if (keyData.email) {
        // Инвалидируем запрос конкретного ключа по email
        queryClient.invalidateQueries({
          queryKey: getGetByEmailApiKeysByEmailGetQueryKey({
            email: keyData.email,
            tg_id: tgId,
          }),
        });
      }

      if (tgId) {
        // Инвалидируем список всех ключей пользователя
        queryClient.invalidateQueries({
          queryKey: getGetAllByFieldApiKeysAllTgIdGetQueryKey(tgId, {
            tg_id: tgId,
          }),
        });

        // Инвалидируем роутер ключи
        queryClient.invalidateQueries({
          queryKey: getGetRouterKeysByTgIdApiKeysRoutersTgIdGetQueryKey(tgId, {
            tg_id: tgId,
          }),
        });
      }

      // Возвращаемся на страницу деталей ключа
      router.back();
    } catch (error) {
      console.error("Ошибка при сохранении названия:", error);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="h-full flex flex-col">
      {/* Заголовок */}
      <h1 className="text-3xl font-bold mb-[28px]">Ключ: {keyName}</h1>

      {/* Форма смены названия */}
      <div className="flex-1 flex flex-col">
        <div className="mb-6">
          <label className="block text-white text-base font-medium mb-3">
            Название ключа
          </label>
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Введите новое название"
            className="w-full"
            classNames={{
              input: "bg-black text-white font-medium text-base",
              inputWrapper:
                "border border-gray-700 bg-black h-14 min-h-14 px-5 rounded-2xl",
            }}
            autoFocus
          />
        </div>

        {/* Кнопки внизу - прижаты к низу */}
        <div className="space-y-[10px] mt-auto">
          <BackButton isDisabled={isPending} onPress={handleCancel}>
            Отмена
          </BackButton>
          <Button
            size="lg"
            onPress={handleSave}
            className="w-full bg-white text-black rounded-2xl text-base font-medium text-[14px]"
            isLoading={isPending}
            isDisabled={!newName.trim() || newName.trim() === keyName}
          >
            Сохранить
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RenameKeyPage;
