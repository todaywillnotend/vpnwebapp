"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@heroui/react";
import { KeyIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { BackButton, MenuButton } from "../";

function formatDateUntil(timestamp: number): string {
  const date = new Date(timestamp);

  // Форматирование даты в формат DD.MM.YY
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2);

  // Форматирование времени в формат HH:MM
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day}.${month}.${year}, ${hours}:${minutes}`;
}

function getDaysUntilExpiry(timestamp: number): number {
  const now = new Date();
  const expiryDate = new Date(timestamp);
  const diffTime = expiryDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

interface RawKeyItem {
  email?: string | null;
  alias?: string | null;
  expiry_time?: number;
}

interface KeysListProps {
  keys: RawKeyItem[];
}

const KeysList: React.FC<KeysListProps> = ({ keys }) => {
  const router = useRouter();
  const warningThreshold = parseInt(
    process.env.NEXT_PUBLIC_DAYS_WARNING_THRESHOLD || "7"
  );

  const handleKeyAction = (keyId: string) => {
    router.push(`/keys/${encodeURIComponent(keyId)}`);
  };

  // Преобразуем сырые данные в нужный формат
  const formattedKeys = keys
    .filter((key) => key.email) // Фильтруем ключи без email
    .map((key) => {
      const daysUntilExpiry = key.expiry_time
        ? getDaysUntilExpiry(key.expiry_time)
        : null;
      const isExpiringSoon =
        daysUntilExpiry !== null && daysUntilExpiry <= warningThreshold;

      return {
        id: key.email!,
        name: key.alias || key.email!,
        expiryDate: key.expiry_time ? formatDateUntil(key.expiry_time) : "",
        isExpiringSoon,
      };
    });

  return (
    <div className="h-full flex flex-col">
      {/* Заголовок */}
      <h1 className="text-3xl font-bold mb-[20px]">Ваши ключи</h1>

      {/* Контент с автоматическим ростом */}
      <div className="flex-1 flex flex-col">
        {/* Список ключей */}
        <div className="space-y-[10px] mb-[20px]">
          {formattedKeys.map((key) => (
            <div key={key.id} className="flex items-center gap-1">
              <Input
                isReadOnly
                value={key.name}
                endContent={
                  <span
                    style={{
                      color: key.isExpiringSoon ? "#FF4848" : "#8F8F8F",
                    }}
                    className="text-sm font-medium whitespace-nowrap px-[6px] ml-[32px]"
                  >
                    (до {key.expiryDate})
                  </span>
                }
                startContent={
                  <KeyIcon className="w-6 h-6 text-white pointer-events-none shrink-0 mr-2 absolute" />
                }
                className="flex-1 opacity-100"
                classNames={{
                  input: "bg-black text-white font-medium ml-[32px] pl-0 pr-0",
                  innerWrapper: "flex flex-wrap h-auto",
                  inputWrapper:
                    "bg-black border border-gray-700 rounded-2xl h-12 min-h-12 px-[22px] relative",
                }}
              />
              <Button
                isIconOnly
                className="bg-white text-black rounded-2xl w-12 h-12 min-w-12"
                onPress={() => handleKeyAction(key.id)}
              >
                <ArrowRightIcon className="w-5 h-5" />
              </Button>
            </div>
          ))}
        </div>

        {/* Описание */}
        <p className="text-gray-400 text-center px-[16px]">
          Вы можете посмотреть дополнительные действия, связанные с ключём
        </p>

        {/* Кнопки внизу - прижаты к низу */}
        <div className="space-y-[8px] mt-auto">
          <MenuButton />
        </div>
      </div>
    </div>
  );
};

export default KeysList;
