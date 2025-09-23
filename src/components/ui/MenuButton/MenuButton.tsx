"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { UserIcon } from "@heroicons/react/24/outline";

interface MenuButtonProps {
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
  href?: string;
}

const MenuButton: React.FC<MenuButtonProps> = ({
  className = "w-full bg-white text-black rounded-2xl text-[14px] font-medium gap-[8px]",
  size = "lg",
  variant = "solid",
  onPress,
  href = "/",
}) => {
  const router = useRouter();

  const handlePersonalAccount = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(href);
    }
  };

  return (
    <Button
      size={size}
      className={className}
      variant={variant}
      onPress={handlePersonalAccount}
    >
      <UserIcon className="w-4 h-4" />
      Личный кабинет
    </Button>
  );
};

export default MenuButton;
