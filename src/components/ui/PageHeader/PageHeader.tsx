import React from "react";
import { Button } from "../";
import styles from "./PageHeader.module.scss";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary" | "danger";
  };
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  action,
  className = "",
}) => {
  return (
    <div className={`${styles.header} ${className}`}>
      <div className={styles.content}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {action && (
        <Button variant={action.variant || "primary"} onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default PageHeader;
