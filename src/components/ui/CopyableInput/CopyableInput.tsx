"use client";

import React, { useState } from "react";
import { Button, Input } from "@heroui/react";
import { ClipboardDocumentIcon, CheckIcon } from "@heroicons/react/24/outline";

interface CopyableInputProps {
  value: string;
  placeholder?: string;
  successMessage?: string;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
  onCopy?: (value: string) => void;
  disabled?: boolean;
}

const CopyableInput: React.FC<CopyableInputProps> = ({
  value,
  placeholder,
  successMessage = "✓ Скопировано в буфер обмена!",
  className = "",
  inputClassName = "",
  buttonClassName = "",
  onCopy,
  disabled = false,
}) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const handleCopyValue = async () => {
    if (isCopying || disabled) return;

    try {
      setIsCopying(true);
      await navigator.clipboard.writeText(value);
      setCopySuccess(true);

      // Вызываем колбэк если передан
      onCopy?.(value);

      // Сбрасываем состояние через 2 секунды
      setTimeout(() => {
        setCopySuccess(false);
        setIsCopying(false);
      }, 2000);
    } catch (err) {
      console.error("Ошибка копирования:", err);
      setIsCopying(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Input
        value={value}
        placeholder={placeholder}
        isReadOnly
        onClick={handleCopyValue}
        endContent={
          <Button
            isIconOnly
            variant="light"
            className={`transition-all duration-300 ${
              copySuccess
                ? "text-primary scale-110"
                : "text-white hover:text-primary"
            } ${buttonClassName}`}
            onPress={handleCopyValue}
            isDisabled={isCopying || disabled}
          >
            {copySuccess ? (
              <CheckIcon className="w-4 h-4" />
            ) : (
              <ClipboardDocumentIcon className="w-4 h-4" />
            )}
          </Button>
        }
        style={{ cursor: "pointer !important" }}
        className={`w-full bg-black rounded-2xl cursor-pointer transition-all duration-300 ${inputClassName}`}
        classNames={{
          input: "bg-black text-white font-medium cursor-pointer text-ellipsis",
          inputWrapper:
            "cursor-pointer border border-gray-700 bg-black h-12 min-h-12 px-5 rounded-2xl cursor-pointer",
        }}
      />

      {/* Анимированное сообщение о копировании */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-300 flex-1 h-full rounded-2xl ${
          copySuccess
            ? "opacity-100 backdrop-blur-sm bg-black/50"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className={`transform transition-all duration-300 w-full h-full`}>
          <p className="text-primary text-[14px] font-bold px-4 py-2 rounded-xl bg-black/80 border border-primary/20 shadow-lg cursor-default select-none w-full h-full flex items-center justify-center">
            {successMessage}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CopyableInput;
