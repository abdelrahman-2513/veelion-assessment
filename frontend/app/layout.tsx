import type { Metadata } from "next";
import { AppNav } from "@/components/AppNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "VeeLion Task Management",
  description: "Task dashboard, activity feed, and reports",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="shell">
          <AppNav />
          {children}
        </div>
      </body>
    </html>
  );
}