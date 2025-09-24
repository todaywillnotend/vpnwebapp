"use client";

import { useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";
import { UserReferralStats } from "@/types/referral";
import { SHARE_CONFIG, REFERRAL_MESSAGES } from "@/config/referral";

const NEXT_PUBLIC_TG_BOT = process.env.NEXT_PUBLIC_TG_BOT || "";

interface UseReferralProps {
  tgId: number;
}

interface UseReferralReturn {
  stats: UserReferralStats;
  inviteLink: string;
  isLoading: boolean;
  error: Error | null;
  shareInvite: () => Promise<void>;
  copyToClipboard: () => Promise<void>;
}

export const useReferral = ({ tgId }: UseReferralProps): UseReferralReturn => {
  // Получаем данные о рефералах через новый API
  const {
    data: referralData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["referrals", tgId],
    queryFn: async () => {
      const response = await api.referrals.getAll();
      return response.data;
    },
    enabled: Boolean(tgId),
    staleTime: 5 * 60 * 1000, // 5 минут
  });

  // Генерируем ссылку приглашения с tgId
  const inviteLink = useMemo(() => {
    return `${NEXT_PUBLIC_TG_BOT}?start=referral_${tgId}`;
  }, [tgId]);

  // Получаем статистику из ответа API
  const stats = useMemo((): UserReferralStats => {
    if (!referralData?.stats) {
      return {
        balance: "0₽",
        invited: 0,
      };
    }

    return {
      balance: referralData.stats.balance,
      invited: referralData.stats.invited,
    };
  }, [referralData]);

  // Функция для шаринга через Web Share API
  const shareInvite = useCallback(async (): Promise<void> => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: SHARE_CONFIG.title,
          text: SHARE_CONFIG.text,
          url: inviteLink,
        });
      } else {
        // Fallback - копируем в буфер обмена
        await copyToClipboard();
      }
    } catch (error) {
      console.error("Ошибка при шаринге:", error);
      // Fallback при ошибке шаринга
      await copyToClipboard();
    }
  }, [inviteLink]);

  // Функция для копирования в буфер обмена
  const copyToClipboard = useCallback(async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      // Можно добавить toast уведомление здесь
      console.log(REFERRAL_MESSAGES.SHARE_FALLBACK_SUCCESS);
    } catch (error) {
      console.error("Ошибка копирования:", error);
      throw new Error(REFERRAL_MESSAGES.SHARE_ERROR);
    }
  }, [inviteLink]);

  return {
    stats,
    inviteLink,
    isLoading,
    error: error as Error | null,
    shareInvite,
    copyToClipboard,
  };
};
