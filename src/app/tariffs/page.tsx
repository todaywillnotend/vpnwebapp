"use client";

import AppLayout from "@/components/layout/AppLayout";
import Button from "@/components/ui/Button";

export default function TariffsPage() {
  return (
    <AppLayout>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>Тарифы</h1>
          <Button variant="primary">Создать тариф</Button>
        </div>

        <div
          style={{
            backgroundColor: "white",
            padding: "1.5rem",
            borderRadius: "0.5rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <h3
            style={{
              fontSize: "1.125rem",
              fontWeight: "600",
              marginBottom: "1rem",
            }}
          >
            Управление тарифными планами
          </h3>

          <div
            style={{
              marginTop: "1rem",
              padding: "1rem",
              backgroundColor: "#f3f4f6",
              borderRadius: "0.5rem",
            }}
          >
            <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
              Функции управления тарифами:
            </p>
            <ul
              style={{
                marginTop: "0.5rem",
                paddingLeft: "1rem",
                color: "#6b7280",
                fontSize: "0.875rem",
              }}
            >
              <li>Создание и редактирование тарифных планов</li>
              <li>Настройка цен и ограничений</li>
              <li>Управление сроками действия</li>
              <li>Статистика по продажам</li>
            </ul>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
