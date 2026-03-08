import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GlowLab — Agent-Native Storefront",
  description: "Watch AI agents negotiate skincare deals in real-time",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
