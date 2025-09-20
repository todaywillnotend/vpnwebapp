import React from "react";
import { Navigation } from "../";
import styles from "./AppLayout.module.scss";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Navigation />
      <main className={styles.main}>
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
};

export default AppLayout;
