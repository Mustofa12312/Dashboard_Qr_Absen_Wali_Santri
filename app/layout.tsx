import { Inter } from "next/font/google";
import "./globals.css";
import type { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Absen Wisuda Admin Dashboard",
  description: "Admin panel kehadiran wali wisuda santri",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`
          ${inter.className}
          min-h-screen 
          bg-slate-950
          text-slate-50
          antialiased
          selection:bg-emerald-500/30 selection:text-emerald-200
        `}
      >
        {children}
      </body>
    </html>
  );
}
