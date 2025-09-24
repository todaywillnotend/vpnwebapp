"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import {
  LinkIcon,
  CreditCardIcon,
  PencilIcon,
  QrCodeIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { BackButton, MenuButton, CopyableInput } from "../";
import { KeyResponse } from "@/api/generated/api";
import { getDaysPlural, getHoursPlural } from "@/lib/pluralize";

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

  const keyName = keyData.alias || keyData.email || "";
  const keyUrl = keyData.remnawave_link || keyData.key || "";
  const timeRemaining = keyData.expiry_time
    ? formatTimeRemaining(keyData.expiry_time)
    : { days: 0, hours: 0 };

  const handleCopyKey = (value: string) => {
    console.log("Ключ скопирован:", value);
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
          <span className="text-primary text-[12px] font-medium">
            {getDaysPlural(timeRemaining.days).toUpperCase()}
          </span>
          <span className="text-primary text-[48px] font-[900] ml-[4px]">
            {timeRemaining.hours}
          </span>
          <span className="text-primary text-[12px] font-medium">
            {getHoursPlural(timeRemaining.hours).toUpperCase()}
          </span>
        </div>
      </div>

      {/* Input с ключом и кнопкой копирования */}
      <CopyableInput
        value={keyUrl}
        onCopy={handleCopyKey}
        className="mb-[12px]"
      />

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
        <div className="flex gap-[10px]">
          <Button
            size="lg"
            className="flex-1 bg-white text-black rounded-2xl text-[14px] font-medium gap-[8px]"
            onPress={handleShowQR}
            isDisabled
          >
            <QrCodeIcon className="w-4 h-4" />
            QR-код
          </Button>
          <Button
            size="lg"
            className="flex-1 bg-red-500 text-white rounded-2xl text-[14px] font-medium gap-[8px]"
            onPress={handleDeleteKey}
            isDisabled
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
