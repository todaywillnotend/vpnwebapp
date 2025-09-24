"use client";

import { AppLayout } from "@/components/layout";
import { RenameKeyPage, LoadingPage, ErrorPage } from "@/components/ui";
import { useUser } from "@/contexts/UserContext";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { api } from "@/api/client";

export default function RenameKeyPageRoute() {
  const { user } = useUser();
  const params = useParams();
  const keyId = decodeURIComponent(params.keyId as string);

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

  // Находим конкретный ключ по ID
  const currentKey = keys.find((key: any) => key.email === keyId);

  if (keysLoading) {
    return <LoadingPage />;
  }

  if (error) {
    return <ErrorPage />;
  }

  if (!currentKey) {
    return <ErrorPage message="Ключ не найден" showRetryButton={false} />;
  }

  return (
    <AppLayout>
      <RenameKeyPage keyData={currentKey} />
    </AppLayout>
  );
}
