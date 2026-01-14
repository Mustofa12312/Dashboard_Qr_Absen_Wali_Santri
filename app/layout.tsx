import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Absen Wisuda Admin Dashboard",
  description: "Admin panel kehadiran wali wisuda santri",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className="
          min-h-screen 
          bg-slate-950
          text-slate-50
          antialiased
        "
      >
        {children}
      </body>
    </html>
  );
}
