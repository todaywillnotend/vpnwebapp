"use client";

import { useCallback, useMemo } from "react";
import {
  useGetAllByFieldApiReferralsAllTgIdGet,
  useGetPaymentsByTgIdApiPaymentsByTgIdTgIdGet,
} from "@/api/generated/api";
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
  // Получаем данные о рефералах
  const {
    data: referrals,
    isLoading: referralsLoading,
    error: referralsError,
  } = useGetAllByFieldApiReferralsAllTgIdGet(
    tgId,
    { tg_id: tgId },
    { query: { enabled: Boolean(tgId) } }
  );

  // Получаем платежи самого пользователя для поиска реферальных бонусов
  const {
    data: payments,
    isLoading: paymentsLoading,
    error: paymentsError,
  } = useGetPaymentsByTgIdApiPaymentsByTgIdTgIdGet(
    tgId,
    { tg_id: tgId },
    { query: { enabled: Boolean(tgId) } }
  );

  // Генерируем ссылку приглашения с tgId
  const inviteLink = useMemo(() => {
    return `${NEXT_PUBLIC_TG_BOT}?start=referral_${tgId}`;
  }, [tgId]);

  // Вычисляем статистику пользователя
  const stats = useMemo((): UserReferralStats => {
    const invitedCount = referrals?.length || 0;

    // Подсчитываем реферальные бонусы из платежей самого пользователя
    // Ищем платежи, которые являются реферальными пополнениями
    const referralBonus =
      payments?.reduce((total: number, payment: any) => {
        // Ищем успешные платежи, которые связаны с реферальной системой
        if (
          payment.status === "success" &&
          (payment.payment_system === "referral" ||
            payment.payment_system === "bonus" ||
            payment.payment_system === "referral_bonus" ||
            payment.payment_system?.toLowerCase().includes("referral") ||
            payment.payment_system?.toLowerCase().includes("реферал"))
        ) {
          return total + payment.amount;
        }
        return total;
      }, 0) || 0;

    // Округляем до 2 знаков после запятой
    const roundedBonus = Math.round(referralBonus * 100) / 100;

    return {
      balance: `${roundedBonus}₽`,
      invited: invitedCount,
    };
  }, [referrals, payments]);

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

  // Объединяем состояния загрузки и ошибок
  const isLoading = referralsLoading || paymentsLoading;
  const error = referralsError || paymentsError;

  return {
    stats,
    inviteLink,
    isLoading,
    error: error as Error | null,
    shareInvite,
    copyToClipboard,
  };
};
