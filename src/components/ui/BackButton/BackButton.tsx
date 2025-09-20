"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

interface BackButtonProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?:
    | "solid"
    | "bordered"
    | "light"
    | "flat"
    | "faded"
    | "shadow"
    | "ghost";
  onPress?: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({
  className = "w-full bg-transparent border border-white text-white rounded-2xl text-lg gap-[8px]",
  size = "lg",
  variant = "bordered",
  onPress,
}) => {
  const router = useRouter();

  const handleGoBack = () => {
    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };

  return (
    <Button
      size={size}
      className={className}
      variant={variant}
      onPress={handleGoBack}
    >
      <ArrowLeftIcon className="w-5 h-5" />
      Назад
    </Button>
  );
};

export default BackButton;
