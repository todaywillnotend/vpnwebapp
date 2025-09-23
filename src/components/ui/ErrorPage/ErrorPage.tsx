import { Button } from "@heroui/react";
import { AppLayout } from "@/components/layout";

interface ErrorPageProps {
  message?: string;
  onRetry?: () => void;
  showRetryButton?: boolean;
}

export function ErrorPage({
  message = "Ошибка загрузки данных",
  onRetry,
  showRetryButton = true,
}: ErrorPageProps) {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <AppLayout>
      <div className="h-full flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-red-400 mb-4">{message}</p>
          {showRetryButton && (
            <Button onPress={handleRetry} className="bg-primary text-white">
              Попробовать снова
            </Button>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
