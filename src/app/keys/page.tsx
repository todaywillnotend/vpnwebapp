"use client";

import { AppLayout } from "@/components/layout";
import { KeysList, LoadingPage, ErrorPage } from "@/components/ui";
import { useUser } from "@/contexts/UserContext";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";

export default function KeysPage() {
  const { user } = useUser();

  const {
    data: keys = [],
    isLoading: keysLoading,
    error,
  } = useQuery({
    queryKey: ["keys"],
    queryFn: async () => {
      const response = await api.keys.getAll();
      return response.data;
    },
    enabled: Boolean(user?.tg_id),
  });

  if (keysLoading) {
    return <LoadingPage />;
  }

  if (error) {
    return <ErrorPage />;
  }

  return (
    <AppLayout>
      <KeysList keys={keys} />
    </AppLayout>
  );
}
