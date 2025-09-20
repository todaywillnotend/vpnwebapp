import type { Metadata } from "next";
import QueryProvider from "@/providers/QueryProvider";
import { UserProvider } from "@/contexts/UserContext";
import { HeroUIProvider } from "@heroui/react";
import "./globals.scss";

export const metadata: Metadata = {
  title: "VPN Admin Panel",
  description: "VPN service administration panel",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <HeroUIProvider>
          <UserProvider>
            <QueryProvider>{children}</QueryProvider>
          </UserProvider>
        </HeroUIProvider>
      </body>
    </html>
  );
}
