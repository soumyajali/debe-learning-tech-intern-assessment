import type { Metadata } from "next";
import "../../app/globals.css";

export const metadata: Metadata = {
  title: "Session Reschedule Widget",
  description: "Student session reschedule workspace",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
