"use client";

import { AppLayout } from "@/components/layout";
import {
  Top5Page,
  BackButton,
  MenuButton,
  LoadingPage,
  ErrorPage,
} from "@/components/ui";
import { useUser } from "@/contexts/UserContext";
import { useReferral } from "@/hooks/useReferral";

export default function Top5() {
  const { user } = useUser();
  const { stats, isLoading, error } = useReferral({
    tgId: user?.tg_id || 0,
  });

  if (isLoading) {
    return <LoadingPage />;
  }

  if (error) {
    return <ErrorPage />;
  }

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <Top5Page
            userProfile={{
              balance: stats.balance,
              invited: String(stats.invited),
            }}
          />
        </div>
        <div className="mt-auto">
          <div className="mb-[8px]">
            <BackButton />
          </div>
          <MenuButton />
        </div>
      </div>
    </AppLayout>
  );
}
