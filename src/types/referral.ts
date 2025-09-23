export interface BonusLevel {
  level: number;
  percentage: number;
  title: string;
}

export interface UserReferralStats {
  balance: string;
  invited: number;
}

export interface ReferralConfig {
  bonusLevels: BonusLevel[];
}

export interface ShareData {
  title: string;
  text: string;
}
