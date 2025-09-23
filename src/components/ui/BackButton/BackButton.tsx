"use client";

import React, { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

interface BackButtonProps {
  children?: ReactNode;
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
  isDisabled?: boolean;
}

const BackButton: React.FC<BackButtonProps> = ({
  className = "w-full bg-transparent border border-white text-white rounded-2xl text-[14px] gap-[8px]",
  size = "lg",
  variant = "bordered",
  onPress,
  isDisabled,
  children,
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
      isDisabled={isDisabled}
    >
      {children ?? (
        <>
          <ArrowLeftIcon className="w-4 h-4" />
          Назад
        </>
      )}
    </Button>
  );
};

export default BackButton;
