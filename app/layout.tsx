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
  title: "MA Dance Studio — Khóa tháng · Thuê phòng · Biên đạo",
  description:
    "MA Dance Studio — đăng ký khóa 8 buổi/tháng, thuê phòng 3 chi nhánh, biên đạo sự kiện. Form giữ chỗ · xác nhận Zalo.",
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
