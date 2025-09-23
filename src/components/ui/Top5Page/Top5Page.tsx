"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";

interface Top5PageProps {
  userProfile?: {
    balance: string;
    invited: string;
  };
}

const Top5Page: React.FC<Top5PageProps> = ({
  userProfile = {
    balance: "1290₽",
    invited: "0",
  },
}) => {
  const router = useRouter();

  // Данные топ-5 пользователей
  const topUsers = [
    { position: 1, phone: "1) 11445****", referrals: 35, avatars: ["A", "J"] },
    { position: 2, phone: "2) 11445****", referrals: 7, avatars: [] },
    { position: 3, phone: "3) 11445****", referrals: 7, avatars: [] },
    { position: 4, phone: "4) 11445****", referrals: 7, avatars: [] },
    { position: 5, phone: "5) 11445****", referrals: 6, avatars: [] },
  ];

  const getPositionColor = (position: number) => {
    switch (position) {
      case 1:
      case 2:
      case 3:
        return "bg-primary text-white";
      default:
        return "bg-black text-primary border border-gray-700";
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Заголовок */}
      <div className="flex items-center gap-[8px] mb-[12px]">
        <div className="text-[32px] font-bold text-primary">Топ-5</div>
        <div className="text-primary text-[32px]">⭐</div>
      </div>

      {/* Описание */}
      <div className="text-white text-[14px] mb-[18px] leading-relaxed">
        Здесь можно увидеть топ людей, которые пригласили наибольшее количество
        рефералов в сервис
      </div>

      {/* Список топ-5 */}
      <div className="space-y-[8px] mb-[32px]">
        {topUsers.map((user, index) => (
          <div
            key={index}
            className={`flex items-center justify-between rounded-2xl p-[16px] ${getPositionColor(user.position)}`}
          >
            <div className="flex items-center gap-[12px]">
              <span className="font-medium text-[16px] text-white">
                {user.phone}
              </span>
            </div>
            <span className="font-medium text-[16px]">
              {user.referrals} человек
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Top5Page;
