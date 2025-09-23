"use client";

import React from "react";
import { UserReferralStats } from "@/types/referral";

interface UserStatsProps {
  stats: UserReferralStats;
  className?: string;
}

const UserStats: React.FC<UserStatsProps> = ({ stats, className = "" }) => {
  return (
    <div className={`flex gap-[18px] px-[5px] ${className}`}>
      <div>
        <div className="text-white font-bold text-[16px] mb-[4px]">
          Ваш бонус:
        </div>
        <div className="text-[32px] font-bold text-primary">
          {stats.balance}
        </div>
      </div>
      <div>
        <div className="text-white font-bold text-[16px] mb-[4px]">
          Приглашено:
        </div>
        <div className="text-[32px] font-bold text-primary">
          {stats.invited}
        </div>
      </div>
    </div>
  );
};

export default UserStats;
