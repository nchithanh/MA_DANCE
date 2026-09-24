import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./ma-dance.css";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-be-vietnam",
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
    <html lang="vi" className={beVietnam.variable}>
      <body className={beVietnam.className}>{children}</body>
    </html>
  );
}
