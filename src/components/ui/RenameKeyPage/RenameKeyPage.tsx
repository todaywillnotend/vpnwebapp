"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@heroui/react";
import { BackButton } from "../";
import { useUser } from "@/contexts/UserContext";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/api/client";

interface RenameKeyPageProps {
  keyData: {
    email?: string | null;
    alias?: string | null;
    expiry_time?: number;
  };
}

const RenameKeyPage: React.FC<RenameKeyPageProps> = ({ keyData }) => {
  const router = useRouter();
  const { user } = useUser();
  const queryClient = useQueryClient();

  const keyName = keyData.alias || keyData.email || "";
  const [newName, setNewName] = useState(keyName);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: { keyId: string; alias: string }) => {
      const response = await api.keys.update(data.keyId, { alias: data.alias });
      return response.data;
    },
    onSuccess: () => {
      // Инвалидируем кэш для обновления данных
      queryClient.invalidateQueries({
        queryKey: ["keys"],
      });

      // Инвалидируем конкретный ключ
      if (keyData.email) {
        queryClient.invalidateQueries({
          queryKey: ["keys", keyData.email],
        });
      }

      // Возвращаемся на страницу деталей ключа
      router.back();
    },
    onError: (error) => {
      console.error("Ошибка при сохранении названия:", error);
    },
  });

  const handleSave = async () => {
    if (!newName.trim() || !keyData.email) return;

    try {
      await mutateAsync({
        keyId: keyData.email,
        alias: newName.trim(),
      });
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
