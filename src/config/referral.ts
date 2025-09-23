import { BonusLevel, ReferralConfig, ShareData } from "@/types/referral";

const SHARE_TITLE = process.env.NEXT_PUBLIC_SHARE_TITLE || "";
const SHARE_TEXT = process.env.NEXT_PUBLIC_SHARE_TEXT || "";

export const BONUS_LEVELS: BonusLevel[] = [
  {
    level: 1,
    percentage: 25,
    title: "1 уровень",
  },
  {
    level: 2,
    percentage: 10,
    title: "2 уровень",
  },
];

export const SHARE_CONFIG: ShareData = {
  title: SHARE_TITLE,
  text: SHARE_TEXT,
};

export const DEFAULT_REFERRAL_CONFIG: ReferralConfig = {
  bonusLevels: BONUS_LEVELS,
};

export const REFERRAL_MESSAGES = {
  COPY_SUCCESS: "✓ Ссылка скопирована!",
  SHARE_FALLBACK_SUCCESS: "Ссылка скопирована в буфер обмена",
  SHARE_ERROR: "Не удалось поделиться ссылкой",
} as const;
