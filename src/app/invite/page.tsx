"use client";

import { AppLayout } from "@/components/layout";
import {
  InvitePage,
  MenuButton,
  LoadingPage,
  ErrorPage,
} from "@/components/ui";
import { useUser } from "@/contexts/UserContext";
import { useReferral } from "@/hooks/useReferral";

export default function Invite() {
  const { user } = useUser();
  const { isLoading, error } = useReferral({
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
          <InvitePage user={user} />
        </div>
        <div className="mt-auto">
          <MenuButton />
        </div>
      </div>
    </AppLayout>
  );
}
