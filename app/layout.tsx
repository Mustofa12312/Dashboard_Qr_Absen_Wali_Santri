import { Inter } from "next/font/google";
import "./globals.css";
import type { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Absen Wisuda Admin Dashboard",
  description: "Admin panel kehadiran wali wisuda santri",
};

import { ToastProvider } from "@/components/ui/Toast";
import { EventProvider } from "@/context/EventContext";
import { ThemeProvider } from "@/context/ThemeContext";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`
          ${inter.className}
          min-h-screen 
          bg-slate-50 dark:bg-slate-950
          text-slate-900 dark:text-slate-50
          antialiased
          selection:bg-emerald-500/30 selection:text-emerald-200
          transition-colors duration-300
        `}
      >
        <ThemeProvider>
          <EventProvider>
            <ToastProvider>{children}</ToastProvider>
          </EventProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
