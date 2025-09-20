import React from "react";
import styles from "./Card.module.scss";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
}

const Card: React.FC<CardProps> = ({
  children,
  className = "",
  padding = "md",
}) => {
  const classes = [styles.card, styles[padding], className]
    .filter(Boolean)
    .join(" ");

  return <div className={classes}>{children}</div>;
};

export default Card;
