"use client";

import React, { useState, useEffect } from "react";
import {
  RocketLaunchIcon,
  WifiIcon,
  GlobeAltIcon,
  ChatBubbleLeftRightIcon,
  ComputerDesktopIcon,
  MagnifyingGlassIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

const VPN_PROJECT_NAME = process.env.NEXT_PUBLIC_VPN_PROJECT_NAME || "";
const VPN_PROJECT_DESCRIPTION =
  process.env.NEXT_PUBLIC_VPN_PROJECT_DESCRIPTION || "";

interface Feature {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    id: "speed",
    icon: RocketLaunchIcon,
    title: "ВЫСОКАЯ СКОРОСТЬ ЗАГРУЗКИ",
    description:
      "Стабильное и высокоскоростное\nподключение без рекламы ( до 10 Гб/сек )",
  },
  {
    id: "connection",
    icon: WifiIcon,
    title: "СТАБИЛЬНОЕ ПОДКЛЮЧЕНИЕ",
    description:
      "Смотрите любимые соц. сети, видеоплатформы и другие сайты и приложения",
  },
  {
    id: "locations",
    icon: GlobeAltIcon,
    title: "СМЕНА ЛОКАЦИЙ",
    description: "Подключайтесь к серверам самых разных локаций",
  },
  {
    id: "support",
    icon: ChatBubbleLeftRightIcon,
    title: "ОТЗЫВЧИВАЯ ПОДДЕРЖКА",
    description:
      "Поддержка ответит на интересующие вас вопросы и поможет разобраться с подключением",
  },
  {
    id: "trial",
    icon: StarIcon,
    title: "БЕСПЛАТНЫЙ ПЕРИОД 7 ДНЕЙ",
    description:
      "Пользуйтесь надежным и быстрым VPN абсолютно бесплатно 7 дней",
  },
];

const FeatureShowcase: React.FC = () => {
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [resetTimer, setResetTimer] = useState(0);

  // Автоматическое переключение каждые 4 секунды
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveFeatureIndex((prev) => (prev + 1) % features.length);
        setIsAnimating(false);
      }, 150);
    }, 4000);

    return () => clearInterval(interval);
  }, [resetTimer]); // Перезапускаем интервал при изменении resetTimer

  const handleIconClick = (index: number) => {
    if (index !== activeFeatureIndex) {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveFeatureIndex(index);
        setIsAnimating(false);
      }, 150);
      // Сбрасываем таймер автоматического переключения
      setResetTimer((prev) => prev + 1);
    }
  };

  const activeFeature = features[activeFeatureIndex];

  return (
    <div className="flex flex-col items-center text-center mb-8">
      {/* Logo */}
      <div className="mb-6">
        <img
          src="/images/logo.png"
          alt="BeeFreevpn Logo"
          className="w-16 h-16"
        />
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold text-white mb-4 tracking-wide">
        {VPN_PROJECT_NAME}
      </h1>

      {/* Subtitle */}
      <p className="text-primary text-[14px] font-medium mb-8">
        {VPN_PROJECT_DESCRIPTION}
      </p>

      {/* Feature Icons */}
      <div className="flex justify-center gap-6 mb-4">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          const isActive = index === activeFeatureIndex;

          return (
            <div
              key={feature.id}
              className="relative flex flex-col items-center cursor-pointer group"
              onClick={() => handleIconClick(index)}
            >
              {/* Активный индикатор */}
              <div
                className={`absolute rounded-full transition-all duration-2500 ${
                  isActive
                    ? "bg-primary/20 scale-110 shadow-lg shadow-primary/30"
                    : "bg-transparent scale-100"
                }`}
              />

              {/* Пульсирующий эффект для активной иконки */}
              {isActive && (
                <div className="absolute -inset-3 rounded-full bg-primary/10" />
              )}

              <Icon
                className={`relative w-6 h-6 transition-all duration-500 transform ${
                  isActive
                    ? "text-primary scale-125 drop-shadow-lg"
                    : "text-white hover:text-primary/70 hover:scale-110 group-hover:drop-shadow-md"
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Active Feature Content */}
      <div className="text-center min-h-[80px] flex flex-col justify-center">
        <div
          className={`transition-all duration-300 transform ${
            isAnimating
              ? "opacity-0 translate-y-4 scale-95"
              : "opacity-100 translate-y-0 scale-100"
          }`}
        >
          <h2 className="text-primary text-[16px] font-bold mb-3 tracking-wide">
            {activeFeature.title}
          </h2>
          <p className="text-gray-300 text-[14px] leading-relaxed max-w-sm whitespace-pre-line mx-auto">
            {activeFeature.description}
          </p>
        </div>
      </div>

      <style jsx>{`
        .animate-progress {
          animation: progress 4s linear infinite;
        }

        @keyframes progress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default FeatureShowcase;
