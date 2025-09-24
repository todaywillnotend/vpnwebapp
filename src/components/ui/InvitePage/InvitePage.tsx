"use client";

import React, { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { BoltIcon, QrCodeIcon } from "@heroicons/react/24/outline";
import { CopyableInput, BonusLevel, UserStats } from "@/components/ui";
import { useReferral } from "@/hooks/useReferral";
import { BONUS_LEVELS, REFERRAL_MESSAGES } from "@/config/referral";
import { UserResponse } from "@/api/generated/api";

const VPN_PROJECT_REFERAL_TEXT =
  process.env.NEXT_PUBLIC_VPN_PROJECT_REFERAL_TEXT || "";

interface InvitePageProps {
  user?: UserResponse;
  className?: string;
}

const InvitePage: React.FC<InvitePageProps> = ({ user, className = "" }) => {
  const router = useRouter();

  // Используем хук для работы с реферальными данными
  const { stats, inviteLink, shareInvite } = useReferral({
    tgId: user?.tg_id || 0,
  });

  // Мемоизированные обработчики событий
  const handleInvite = useCallback(async () => {
    try {
      await shareInvite();
    } catch (error) {
      console.error("Ошибка при приглашении:", error);
    }
  }, [shareInvite]);

  const handleQRCode = useCallback(() => {
    console.log("Показать QR-код для:", inviteLink);
    // TODO: Реализовать показ QR-кода
  }, [inviteLink]);

  const handleTop5 = useCallback(() => {
    router.push("/top5");
  }, [router]);

  const handleCopySuccess = useCallback((value: string) => {
    console.log("Ссылка скопирована:", value);
  }, []);

  // Мемоизированные компоненты уровней бонусов
  const bonusLevelsComponents = useMemo(
    () =>
      BONUS_LEVELS.map((level) => (
        <BonusLevel key={level.level} bonusLevel={level} />
      )),
    []
  );

  return (
    <div className={`h-full flex flex-col ${className}`}>
      {/* Заголовок */}
      <div className="text-[32px] font-bold text-white mb-[8px]">
        Пригласить
      </div>

      {/* Описание */}
      <div className="text-white mb-[18px] text-[14px]">
        {VPN_PROJECT_REFERAL_TEXT}
      </div>

      {/* Уровни бонусов */}
      <div className="flex flex-wrap gap-[8px] mb-[18px]">
        {bonusLevelsComponents}
      </div>

      {/* Статистика пользователя */}
      <UserStats stats={stats} className="mb-[18px]" />

      {/* Ссылка для приглашения */}
      <div className="mb-[12px]">
        <CopyableInput
          value={inviteLink}
          successMessage={REFERRAL_MESSAGES.COPY_SUCCESS}
          onCopy={handleCopySuccess}
        />
      </div>

      {/* Кнопка Пригласить */}
      <Button
        size="lg"
        onPress={handleInvite}
        className="w-full bg-white text-black rounded-2xl text-[14px] font-medium mb-[12px]"
      >
        Пригласить
      </Button>

      {/* Кнопки QR-код и Топ-5 */}
      <div className="flex gap-[10px] mb-[20px]">
        <Button
          size="lg"
          onPress={handleQRCode}
          className="flex-1 bg-white border border-white text-black rounded-2xl text-[14px] font-medium gap-[8px]"
          variant="bordered"
          isDisabled
        >
          <QrCodeIcon className="w-4 h-4" />
          QR-код
        </Button>
        <Button
          size="lg"
          onPress={handleTop5}
          className="flex-1 bg-primary text-white rounded-2xl text-[14px] font-medium gap-[8px]"
        >
          <BoltIcon className="w-4 h-4" />
          Топ-5
        </Button>
      </div>
    </div>
  );
};

export default InvitePage;
