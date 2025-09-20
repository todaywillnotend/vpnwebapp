"use client";

import { AppLayout } from "@/components/layout";
import { Card, PageHeader } from "@/components/ui";
import { useUser } from "@/contexts/UserContext";
import { useGetAllApiKeysGet } from "@/api/generated/api";
import styles from "@/styles/pages.module.scss";

export default function KeysPage() {
  const { tgId } = useUser();

  const {
    data: keys,
    isLoading,
    error,
  } = useGetAllApiKeysGet({ tg_id: tgId }, { query: { enabled: true } });

  const handleCreateKey = () => {
    console.log("Создать ключ");
  };

  return (
    <AppLayout>
      <div className={styles.pageContainer}>
        <PageHeader
          title="VPN Ключи"
          action={{
            label: "Создать ключ",
            onClick: handleCreateKey,
          }}
        />

        <Card>
          <h3 className={styles.infoTitle}>Управление VPN ключами</h3>

          {isLoading && <div className={styles.loadingState}>Загрузка...</div>}

          {error && (
            <div className={styles.errorState}>
              Ошибка загрузки данных: {String(error)}
            </div>
          )}

          {!isLoading && !error && (
            <p className={styles.infoText}>Всего ключей: {keys?.length || 0}</p>
          )}

          <div className={styles.infoSection}>
            <p className={styles.infoText}>Функции управления ключами:</p>
            <ul className={styles.infoList}>
              <li>Создание новых VPN ключей</li>
              <li>Просмотр статуса и срока действия</li>
              <li>Управление лимитами трафика</li>
              <li>Блокировка и разблокировка ключей</li>
              <li>Экспорт конфигураций</li>
              <li>Мониторинг использования</li>
            </ul>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
