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
      className={`flex items-center justify-between bg-black/40 rounded-2xl p-[8px] border border-gray-700 ${className}`}
    >
      <div className="flex items-center gap-[12px]">
        <div className="w-[40px] h-[40px] bg-primary rounded-full flex items-center justify-center">
          <span className="text-black font-bold text-[14px]">
            {bonusLevel.level}
          </span>
        </div>
        <span className="text-white font-medium">{bonusLevel.title}</span>
      </div>
      <span className="text-primary font-bold text-[14px]">
        {bonusLevel.percentage}% бонуса
      </span>
    </div>
  );
};

export default BonusLevel;
