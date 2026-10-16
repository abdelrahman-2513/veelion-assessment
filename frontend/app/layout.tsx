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
        <div style={{ width: "min(980px, 100% - 2rem)", margin: "0 auto", padding: "2rem 0 3rem" }}>
          <AppNav />
          {children}
        </div>
      </body>
    </html>
  );
}