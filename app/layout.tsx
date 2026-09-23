import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./ma-dance.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MA Dance Studio — Học nhảy K-Pop",
  description:
    "MA Dance Studio — Trung tâm dạy nhảy K-Pop & cho thuê phòng tập. One-day class, choreography hot trend, cộng đồng dancer năng lượng cao.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={`${inter.variable} ${bebas.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
