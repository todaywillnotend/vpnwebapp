"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import {
  LinkIcon,
  WalletIcon,
  GiftIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/outline";

const TELEGRAM_SUPPORT = process.env.NEXT_PUBLIC_TELEGRAM_SUPPORT || "";
const TELEGRAM_NEWS_CHANNEL =
  process.env.NEXT_PUBLIC_TELEGRAM_NEWS_CHANNEL || "";

interface MainMenuProps {
  userProfile?: {
    name: string;
    balance: string;
    id: string;
    devices: string;
  };
}

const MainMenu: React.FC<MainMenuProps> = ({
  userProfile = {
    name: "Anzorro",
    balance: "468₽",
    id: "4683123",
    devices: "02",
  },
}) => {
  const router = useRouter();

  const menuItems = [
    {
      id: "subscriptions",
      title: "Мои ключи",
      icon: LinkIcon,
      onClick: () => router.push("/keys"),
      variant: "default" as const,
      size: "big" as const,
    },
    {
      id: "balance",
      title: "Пополнить",
      icon: WalletIcon,
      onClick: () => console.log("Пополнить"),
      variant: "default" as const,
      size: "small" as const,
    },
    {
      id: "gift",
      title: "Подарить",
      icon: GiftIcon,
      onClick: () => console.log("Подарить"),
      variant: "dark" as const,
      size: "small" as const,
      disabled: true,
    },
    {
      id: "invitations",
      title: "Приглашения",
      subtitle: "Приглашайте друзей и зарабатывайте",
      icon: UserGroupIcon,
      bgImageUrl: "/images/coins.png",
      onClick: () => console.log("Приглашения"),
      variant: "yellow" as const,
      size: "small" as const,
    },
    {
      id: "support",
      title: "Поддержка",
      subtitle: "Возникли вопросы? Задавайте!",
      icon: ChatBubbleLeftRightIcon,
      // onClick: () => console.log("Поддержка"),
      variant: "dark" as const,
      size: "small" as const,
      onClick: () => (window.location.href = TELEGRAM_SUPPORT),
    },
    {
      id: "instructions",
      title: "Инструкции",
      icon: DocumentTextIcon,
      onClick: () => console.log("Инструкции"),
      variant: "default" as const,
      size: "big" as const,
      disabled: true,
    },
    {
      id: "about",
      title: "О сервисе",
      icon: ShieldExclamationIcon,
      onClick: () => router.push("/about"),
      variant: "dark" as const,
      size: "big" as const,
    },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="text-primary font-medium text-xs tracking-wider mb-[4px] rounded-xl inline-block">
        ПРОФИЛЬ
      </div>
      <div className="text-[32px] font-bold text-white mb-[20px]">
        {userProfile.name}
      </div>
      <div className="grid grid-flow-col auto-cols-auto gap-[14px] w-fit">
        <div>
          <div className="text-primary font-medium text-xs tracking-wider py-[4px] rounded-xl inline-block mb-[4px]">
            БАЛАНС
          </div>
          <div className="text-[24px] font-extrabold text-white">
            {userProfile.balance}
          </div>
        </div>
        <div>
          <div className="text-primary font-medium text-xs tracking-wider py-[4px] rounded-xl inline-block mb-[4px]">
            ВАШ ID
          </div>
          <div className="text-[24px] font-extrabold text-white">
            {userProfile.id}
          </div>
        </div>
        <div>
          <div className="text-primary font-medium text-xs tracking-wider py-[4px] rounded-xl inline-block mb-[4px]">
            УСТРОЙСТВ
          </div>
          <div className="text-[24px] font-extrabold text-white">
            {userProfile.devices}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex gap-[8px] mt-[40px] flex-wrap">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const getColorClasses = () => {
            switch (item.variant) {
              case "yellow":
                return "bg-primary from-primary-400 to-primary-500 text-gray-900 font-medium";
              case "dark":
                return "bg-black text-white border border-gray-600 font-medium";
              default:
                return "bg-white text-black font-medium";
            }
          };

          const getSizeClasses = () => {
            switch (item.size) {
              case "small":
                return "w-[calc(50%-4px)]";
              case "big":
              default:
                return "w-full";
            }
          };

          const getBorderClasses = () => {
            if (item.disabled) {
              return "bg-[#3d3d3d] text-gray-400";
            }

            if (item.bgImageUrl || item.disabled) {
              return "border-transparent";
            } else {
              return "border-white";
            }
          };

          return (
            <Button
              size="lg"
              key={item.id}
              disabled={item.disabled}
              onPress={item.onClick}
              className={`${getColorClasses()} ${getSizeClasses()} ${getBorderClasses()} flex items-center gap-4 p-[12px] rounded-2xl cursor-pointer  mb-[2px] whitespace-normal border ${item.subtitle ? "min-h-[141px]" : ""}`}
              style={
                item.bgImageUrl
                  ? {
                      backgroundImage: `url(${item.bgImageUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }
                  : undefined
              }
            >
              <div className="flex flex-col items-start h-full relative z-10">
                <div className="flex items-center gap-2 text-sm font-medium text-center mb-auto">
                  <Icon className="w-6 h-6" />
                  {item.title}
                </div>
                {item.subtitle && (
                  <span className="text-sm opacity-80 font-medium mt-[47px] text-left">
                    {item.subtitle}
                  </span>
                )}
              </div>
            </Button>
          );
        })}
      </div>

      <Button
        size="lg"
        onPress={() => (window.location.href = TELEGRAM_NEWS_CHANNEL)}
        className="flex justify-start min-h-[75px] bg-[#2aabee] text-white rounded-2xl p-[20px] mt-[10px] mb-[20px] w-full whitespace-normal"
        style={{
          backgroundImage: `url("/images/telegram.png")`,
          backgroundSize: "90px",
          backgroundPosition: "right bottom",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="text-[14px] text-left font-medium max-w-[80%]">
          Подписывайтесь на телеграм, узнавайте новости, о новых предложениях и
          акциях
        </div>
      </Button>
    </div>
  );
};

export default MainMenu;
