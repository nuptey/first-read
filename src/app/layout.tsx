import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "First Read",
  description:
    "AI-assisted triage for commercial contract review. Drop a PDF, get a verdict.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
