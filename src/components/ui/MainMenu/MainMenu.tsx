"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Card,
  CardBody,
  Chip,
  Divider,
} from "@heroui/react";
import {
  LinkIcon,
  WalletIcon,
  GiftIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  ClockIcon,
  XMarkIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";

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
  const menuItems = [
    {
      id: "subscriptions",
      title: "Мои подписки",
      icon: LinkIcon,
      onClick: () => console.log("Мои подписки"),
      variant: "default" as const,
      size: "big" as const,
    },
    {
      id: "balance",
      title: "Баланс",
      icon: WalletIcon,
      onClick: () => console.log("Баланс"),
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
    },
    {
      id: "invitations",
      title: "Приглашения",
      subtitle: "Приглашайте друзей и зарабатывайте",
      icon: UserGroupIcon,
      onClick: () => console.log("Приглашения"),
      variant: "yellow" as const,
      size: "small" as const,
    },
    {
      id: "support",
      title: "Поддержка",
      subtitle: "Возникли вопросы? Задавайте!",
      icon: ChatBubbleLeftRightIcon,
      onClick: () => console.log("Поддержка"),
      variant: "dark" as const,
      size: "small" as const,
    },
    {
      id: "instructions",
      title: "Инструкции",
      icon: DocumentTextIcon,
      onClick: () => console.log("Инструкции"),
      variant: "default" as const,
      size: "big" as const,
    },
    {
      id: "about",
      title: "О сервисе",
      icon: ClockIcon,
      onClick: () => console.log("О сервисе"),
      variant: "dark" as const,
      size: "big" as const,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-[1000] flex justify-center items-center p-5 sm:p-5 p-0">
      <div className="bg-black rounded-none sm:rounded-[20px] w-full max-w-[400px] max-h-[90vh] sm:max-h-[90vh] max-h-screen overflow-y-auto text-white">
        {/* Profile Section */}
        <div className="pt-12 px-3 pb-6">
          <div className="text-yellow font-medium text-xs tracking-wider mb-1 rounded-xl inline-block">
            ПРОФИЛЬ
          </div>
          <div className="text-[32px] font-bold text-white mb-5">
            {userProfile.name}
          </div>
          <div className="grid grid-flow-col auto-cols-auto gap-[14px] mb-6 w-fit">
            <div>
              <div className="text-yellow font-medium text-xs tracking-wider py-1 rounded-xl inline-block mb-1">
                БАЛАНС
              </div>
              <div className="text-[24px] font-extrabold text-white">
                {userProfile.balance}
              </div>
            </div>
            <div>
              <div className="text-yellow font-medium text-xs tracking-wider py-1 rounded-xl inline-block mb-1">
                ВАШ ID
              </div>
              <div className="text-[24px] font-extrabold text-white">
                {userProfile.id}
              </div>
            </div>
            <div>
              <div className="text-yellow font-medium text-xs tracking-wider py-1 rounded-xl inline-block mb-1">
                УСТРОЙСТВ
              </div>
              <div className="text-[24px] font-extrabold text-white">
                {userProfile.devices}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="flex gap-[8px] mt-[55px] flex-wrap">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const getColorClasses = () => {
                switch (item.variant) {
                  case "yellow":
                    return "bg-yellow from-yellow-400 to-yellow-500 text-gray-900 font-medium";
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

              return (
                <Button
                  key={item.id}
                  onPress={item.onClick}
                  className={`${getColorClasses()} ${getSizeClasses()} flex items-center gap-4 p-4 rounded-2xl cursor-pointer  relative overflow-hidden hover:opacity-90 transition-opacity mb-[2px]`}
                >
                  <div className="flex flex-col items-start h-full">
                    <div className="flex gap-2 text-base font-bold text-center mb-auto">
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

          <div className="flex bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden mt-[10px]">
            <div className="text-sm font-semibold leading-relaxed">
              <div>Подписывайтесь на телеграм,</div>
              <div>узнавайте новости, о новых</div>
              <div>предложения и акциях</div>
            </div>
            <span className="text-3xl">✈️</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
