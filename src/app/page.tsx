"use client";

import { AppLayout } from "@/components/layout";
import { Button, StatCard, Card, PageHeader } from "@/components/ui";
import { useUser } from "@/contexts/UserContext";
import {
  useGetAllApiUsersGet,
  useGetAllApiKeysGet,
  useGetAllApiServersGet,
} from "@/api/generated/api";
import styles from "@/styles/pages.module.scss";

export default function Home() {
  const { tgId } = useUser();

  // Используем tgId из контекста
  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
  } = useGetAllApiUsersGet(
    { tg_id: tgId },
    { query: { enabled: true, retry: false } }
  );

  const { data: keys, isLoading: keysLoading } = useGetAllApiKeysGet(
    { tg_id: tgId },
    { query: { enabled: true } }
  );

  const { data: servers, isLoading: serversLoading } = useGetAllApiServersGet(
    { tg_id: tgId },
    { query: { enabled: true } }
  );

  const handleCreateUser = () => {
    console.log("Создать пользователя");
  };

  const handleAddServer = () => {
    console.log("Добавить сервер");
  };

  const handleEmergencyBlock = () => {
    console.log("Экстренная блокировка");
  };

  return (
    <AppLayout>
      <div className={styles.pageContainer}>
        <PageHeader title="Дашборд VPN Admin Panel" />

        <div className={styles.statsGrid}>
          <StatCard
            title="Пользователи"
            value={users?.length || 0}
            isLoading={usersLoading}
            color="blue"
          />
          <StatCard
            title="VPN Ключи"
            value={keys?.length || 0}
            isLoading={keysLoading}
            color="green"
          />
          <StatCard
            title="Серверы"
            value={servers?.length || 0}
            isLoading={serversLoading}
            color="orange"
          />
        </div>

        <div className={styles.actionsContainer}>
          <Button variant="primary" onClick={handleCreateUser}>
            Создать пользователя
          </Button>
          <Button variant="secondary" onClick={handleAddServer}>
            Добавить сервер
          </Button>
          <Button variant="danger" onClick={handleEmergencyBlock}>
            Экстренная блокировка
          </Button>
        </div>

        <Card>
          <div className={styles.infoSection}>
            <h3 className={styles.infoTitle}>Статус API</h3>
            <p className={styles.infoText}>
              API хуки успешно сгенерированы из OpenAPI схемы. Система работает
              в полном режиме с реальными данными из VPN сервиса.
            </p>
            {usersError && (
              <p className={styles.errorState}>
                Ошибка загрузки данных: {String(usersError)}
              </p>
            )}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
