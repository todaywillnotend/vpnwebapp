"use client";

import { AppLayout } from "@/components/layout";
import { Card, PageHeader } from "@/components/ui";
import { useUser } from "@/contexts/UserContext";
import { useGetAllApiUsersGet } from "@/api/generated/api";
import styles from "@/styles/pages.module.scss";

export default function UsersPage() {
  const { tgId } = useUser();

  const {
    data: users,
    isLoading,
    error,
  } = useGetAllApiUsersGet(
    { tg_id: tgId },
    { query: { enabled: true } } // Включаем для получения реальных данных
  );

  const handleAddUser = () => {
    console.log("Добавить пользователя");
  };

  return (
    <AppLayout>
      <div className={styles.pageContainer}>
        <PageHeader
          title="Управление пользователями"
          action={{
            label: "Добавить пользователя",
            onClick: handleAddUser,
          }}
        />

        <Card>
          <h3 className={styles.infoTitle}>Список пользователей</h3>

          {isLoading && <div className={styles.loadingState}>Загрузка...</div>}

          {error && (
            <div className={styles.errorState}>
              Ошибка загрузки данных: {String(error)}
            </div>
          )}

          {!isLoading && !error && (
            <p className={styles.infoText}>
              Всего пользователей: {users?.length || 0}
            </p>
          )}

          <div className={styles.infoSection}>
            <p className={styles.infoText}>
              Здесь будет таблица с пользователями. Для полной функциональности
              необходимо:
            </p>
            <ul className={styles.infoList}>
              <li>Создать компоненты таблицы с пагинацией</li>
              <li>Добавить фильтры и поиск</li>
              <li>Реализовать CRUD операции</li>
              <li>Добавить модальные окна для редактирования</li>
            </ul>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
