"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  UsersIcon,
  KeyIcon,
  ServerIcon,
  CurrencyDollarIcon,
  GiftIcon,
  UserGroupIcon,
  CreditCardIcon,
  BellIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/outline";
import styles from "./Navigation.module.scss";

const navigationItems = [
  {
    name: "Дашборд",
    href: "/",
    icon: HomeIcon,
  },
  {
    name: "Пользователи",
    href: "/users",
    icon: UsersIcon,
  },
  {
    name: "VPN Ключи",
    href: "/keys",
    icon: KeyIcon,
  },
  {
    name: "Серверы",
    href: "/servers",
    icon: ServerIcon,
  },
  {
    name: "Тарифы",
    href: "/tariffs",
    icon: CurrencyDollarIcon,
  },
  {
    name: "Купоны",
    href: "/coupons",
    icon: GiftIcon,
  },
  {
    name: "Рефералы",
    href: "/referrals",
    icon: UserGroupIcon,
  },
  {
    name: "Платежи",
    href: "/payments",
    icon: CreditCardIcon,
  },
  {
    name: "Уведомления",
    href: "/notifications",
    icon: BellIcon,
  },
  {
    name: "Блокировки",
    href: "/bans",
    icon: ShieldExclamationIcon,
  },
];

const Navigation: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className={styles.navigation}>
      <div className={styles.header}>
        <h1 className={styles.title}>VPN Admin</h1>
      </div>

      <ul className={styles.menu}>
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`${styles.menuItem} ${isActive ? styles.active : ""}`}
              >
                <Icon className={styles.icon} />
                <span className={styles.text}>{item.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navigation;
