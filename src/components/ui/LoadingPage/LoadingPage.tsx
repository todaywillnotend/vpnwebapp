import { Spinner } from "@heroui/react";
import { AppLayout } from "@/components/layout";

interface LoadingPageProps {
  message?: string;
}

export function LoadingPage({ message = "Загрузка..." }: LoadingPageProps) {
  return (
    <AppLayout>
      <div className="h-full flex items-center justify-center">
        <Spinner color="primary" size="lg" aria-label={message} />
      </div>
    </AppLayout>
  );
}
