"use client";

import { AppLayout } from "@/components/layout";
import { Card, PageHeader } from "@/components/ui";
import { useUser } from "@/contexts/UserContext";
import { useGetAllApiServersGet } from "@/api/generated/api";
import styles from "@/styles/pages.module.scss";

export default function ServersPage() {
  const { tgId } = useUser();

  const {
    data: servers,
    isLoading,
    error,
  } = useGetAllApiServersGet({ tg_id: tgId }, { query: { enabled: true } });

  const handleAddServer = () => {
    console.log("Добавить сервер");
  };

  return (
    <AppLayout>
      <div className={styles.pageContainer}>
        <PageHeader
          title="Серверы"
          action={{
            label: "Добавить сервер",
            onClick: handleAddServer,
          }}
        />

        <Card>
          <h3 className={styles.infoTitle}>Управление серверами</h3>

          {isLoading && <div className={styles.loadingState}>Загрузка...</div>}

          {error && (
            <div className={styles.errorState}>
              Ошибка загрузки данных: {String(error)}
            </div>
          )}

          {!isLoading && !error && (
            <p className={styles.infoText}>
              Всего серверов: {servers?.length || 0}
            </p>
          )}

          <div className={styles.infoSection}>
            <p className={styles.infoText}>Функции управления серверами:</p>
            <ul className={styles.infoList}>
              <li>Мониторинг состояния серверов</li>
              <li>Настройка параметров подключения</li>
              <li>Управление нагрузкой</li>
              <li>Добавление новых локаций</li>
              <li>Автоматическое масштабирование</li>
              <li>Резервное копирование конфигураций</li>
            </ul>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
