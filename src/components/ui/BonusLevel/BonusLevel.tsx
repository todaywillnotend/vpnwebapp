"use client";

import React from "react";
import { BonusLevel as BonusLevelType } from "@/types/referral";

interface BonusLevelProps {
  bonusLevel: BonusLevelType;
  className?: string;
}

const BonusLevel: React.FC<BonusLevelProps> = ({
  bonusLevel,
  className = "",
}) => {
  return (
    <div
      className={`flex items-center justify-between bg-black/40 rounded-2xl p-[8px] border border-gray-700 min-w-[48%] h-[48px] flex-1 ${className}`}
    >
      <div className="flex items-center gap-[12px]">
        <span className="text-white text-[14px] font-medium">
          {bonusLevel.title}
        </span>
      </div>
      <span className="text-primary font-bold text-[14px]">
        {bonusLevel.percentage}% бонуса
      </span>
    </div>
  );
};

export default BonusLevel;
