"use client";

import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout";
import { FeatureShowcase, MenuButton } from "@/components/ui";
import { BackButton } from "@/components/ui";

const ABOUT_SERVICE_TEXT = process.env.NEXT_PUBLIC_ABOUT_SERVICE_TEXT || "";

export default function AboutPage() {
  const router = useRouter();

  const handlePersonalAccount = () => {
    router.push("/");
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        {/* Feature Showcase */}
        <div className="mb-8">
          <FeatureShowcase />
        </div>

        {/* About Service Text */}
        <div className="flex-1 mb-8">
          <div className="bg-black/30 rounded-2xl p-6 border border-gray-600">
            <h2 className="text-primary text-lg font-bold mb-4 text-center">
              О СЕРВИСЕ
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed text-center">
              {ABOUT_SERVICE_TEXT}
            </p>
          </div>
        </div>

        {/* Personal Account Button */}
        <div className="mt-auto">
          <MenuButton />
        </div>
      </div>
    </AppLayout>
  );
}
