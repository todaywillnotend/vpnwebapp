import React from "react";
import { Card } from "../";
import styles from "./StatCard.module.scss";

interface StatCardProps {
  title: string;
  value: string | number;
  isLoading?: boolean;
  color?: "blue" | "green" | "orange" | "red" | "purple";
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  isLoading = false,
  color = "blue",
  className = "",
}) => {
  return (
    <Card className={`${styles.statCard} ${className}`}>
      <h3 className={styles.title}>{title}</h3>
      <p className={`${styles.value} ${styles[color]}`}>
        {isLoading ? "..." : value}
      </p>
    </Card>
  );
};

export default StatCard;
