"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@heroui/react";
import {
  ClipboardDocumentIcon,
  CheckIcon,
  LinkIcon,
  CreditCardIcon,
  PencilIcon,
  QrCodeIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { BackButton, MenuButton } from "../";
import { KeyResponse } from "@/api/generated/api";

interface KeyDetailsProps {
  keyData: KeyResponse;
}

function formatTimeRemaining(timestamp: number): {
  days: number;
  hours: number;
} {
  const now = Date.now();
  const expiryTime = timestamp;
  const timeDiff = expiryTime - now;

  if (timeDiff <= 0) {
    return { days: 0, hours: 0 };
  }

  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );

  return { days, hours };
}

const KeyDetails: React.FC<KeyDetailsProps> = ({ keyData }) => {
  const router = useRouter();
  const [copySuccess, setCopySuccess] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const keyName = keyData.alias || keyData.email || "";
  const keyUrl = keyData.remnawave_link || keyData.key || "";
  const timeRemaining = keyData.expiry_time
    ? formatTimeRemaining(keyData.expiry_time)
    : { days: 0, hours: 0 };

  const handleCopyKey = async () => {
    if (isCopying) return; // Предотвращаем множественные клики

    try {
      setIsCopying(true);
      await navigator.clipboard.writeText(keyUrl);
      setCopySuccess(true);

      // Сбрасываем состояние через 2 секунды
      setTimeout(() => {
        setCopySuccess(false);
        setIsCopying(false);
      }, 2000);
    } catch (err) {
      console.error("Ошибка копирования:", err);
      setIsCopying(false);
    }
  };

  const handleConnectDevice = () => {
    // Если ремень, то открывает страницу подписки
    if (keyData?.remnawave_link) {
      window.location.href = keyData.remnawave_link;
    }
  };

  const handleExtendSubscription = () => {
    console.log("Продлить подписку");
  };

  const handleRenameKey = () => {
    router.push(`/keys/${encodeURIComponent(keyData.email || "")}/rename`);
  };

  const handleShowQR = () => {
    console.log("Показать QR-код");
  };

  const handleDeleteKey = () => {
    console.log("Удалить ключ");
  };

  return (
    <div className="h-full flex flex-col">
      {/* Заголовок */}
      <h1 className="text-3xl font-bold mb-[28px]">Ключ: {keyName}</h1>

      {/* Информация об оставшемся времени */}
      <div className="mb-[12px] flex flex-wrap gap-[0px_8px]">
        <div className="text-white text-[16px] mb-2 font-[900]">Осталось:</div>
        <div className="flex items-baseline">
          <span className="text-primary text-[48px] font-[900]">
            {timeRemaining.days}
          </span>
          <span className="text-primary text-[12px] font-medium">ДНЕЙ</span>
          <span className="text-primary text-[48px] font-[900] ml-[4px]">
            {timeRemaining.hours}
          </span>
          <span className="text-primary text-[12px] font-medium">ЧАСОВ</span>
        </div>
      </div>

      {/* Input с ключом и кнопкой копирования */}
      <div className="mb-[12px] relative">
        <Input
          value={keyUrl}
          isReadOnly
          onClick={handleCopyKey}
          endContent={
            <Button
              isIconOnly
              variant="light"
              className={`transition-all duration-300 ${
                copySuccess
                  ? "text-primary scale-110"
                  : "text-white hover:text-primary"
              }`}
              onPress={handleCopyKey}
              isDisabled={isCopying}
            >
              {copySuccess ? (
                <CheckIcon className="w-4 h-4" />
              ) : (
                <ClipboardDocumentIcon className="w-4 h-4" />
              )}
            </Button>
          }
          className="w-full bg-black rounded-2xl cursor-pointer transition-all duration-300"
          classNames={{
            input: "bg-black text-white font-medium cursor-pointer",
            inputWrapper:
              "cursor-pointer border border-gray-700 bg-black h-12 min-h-12 px-5 rounded-2xl",
          }}
        />
        {/* Анимированное сообщение о копировании */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-300 min-h-12 flex-1 h-full rounded-2xl ${
            copySuccess
              ? "opacity-100 scale-100 backdrop-blur-sm bg-black/50"
              : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <div
            className={`transform transition-all duration-300 w-full h-full ${
              copySuccess ? "translate-y-0 scale-100" : "translate-y-2 scale-95"
            }`}
          >
            <p className="text-primary text-[14px] font-bold px-4 py-2 rounded-xl bg-black/80 border border-primary/20 shadow-lg cursor-default select-none w-full h-full flex items-center justify-center">
              ✓ Скопировано в буфер обмена!
            </p>
          </div>
        </div>
      </div>

      {/* Кнопки действий */}
      <div className="space-y-[12px] mb-[20px]">
        {/* Подключить устройство */}
        <Button
          size="lg"
          className="w-full bg-white text-black rounded-2xl text-[14px] font-medium gap-[8px]"
          onPress={handleConnectDevice}
        >
          <LinkIcon className="w-4 h-4" />
          Подключить устройство
        </Button>

        {/* Продлить подписку */}
        <Button
          size="lg"
          className="w-full bg-primary text-white rounded-2xl text-[14px] font-medium gap-[8px]"
          onPress={handleExtendSubscription}
          isDisabled
        >
          <CreditCardIcon className="w-4 h-4" />
          Продлить подписку
        </Button>

        {/* Сменить название ключа */}
        <Button
          size="lg"
          variant="bordered"
          className="w-full bg-transparent border border-white text-white rounded-2xl text-[14px] gap-[8px]"
          onPress={handleRenameKey}
        >
          <PencilIcon className="w-4 h-4" />
          Сменить название ключа
        </Button>

        {/* QR-код и Удалить */}
        <div className="flex gap-[10px] hidden">
          <Button
            size="lg"
            className="flex-1 bg-white text-black rounded-2xl text-[14px] font-medium gap-[8px]"
            onPress={handleShowQR}
          >
            <QrCodeIcon className="w-4 h-4" />
            QR-код
          </Button>
          <Button
            size="lg"
            className="flex-1 bg-red-500 text-white rounded-2xl text-[14px] font-medium gap-[8px]"
            onPress={handleDeleteKey}
          >
            <TrashIcon className="w-4 h-4" />
            Удалить
          </Button>
        </div>
      </div>

      {/* Кнопки внизу - прижаты к низу */}
      <div className="space-y-[8px] mt-auto">
        <BackButton />
        <MenuButton />
      </div>
    </div>
  );
};

export default KeyDetails;
