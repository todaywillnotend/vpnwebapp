import type { Metadata } from "next";
import QueryProvider from "@/providers/QueryProvider";
import { UserProvider } from "@/contexts/UserContext";
import { AuthGuard } from "@/components/AuthGuard";
import { HeroUIProvider } from "@heroui/react";
import "./globals.scss";

const VPN_PROJECT_NAME = process.env.NEXT_PUBLIC_VPN_PROJECT_NAME || "";
const VPN_PROJECT_DESCRIPTION =
  process.env.NEXT_PUBLIC_VPN_PROJECT_DESCRIPTION || "";

export const metadata: Metadata = {
  title: VPN_PROJECT_NAME,
  description: VPN_PROJECT_DESCRIPTION,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className="dark">
      <body>
        <QueryProvider>
          <HeroUIProvider>
            <UserProvider>
              <AuthGuard>{children}</AuthGuard>
            </UserProvider>
          </HeroUIProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
