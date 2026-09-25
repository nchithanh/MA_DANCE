import type { Metadata } from "next";
import { Suspense } from "react";
import { MarketingSubpage } from "@/components/MarketingSubpage";
import { EnrollPageClient } from "@/components/EnrollPageClient";

export const metadata: Metadata = {
  title: "Đăng ký học — MA Dance Studio",
  description: "Ghi danh khóa tháng MA Dance. Form giữ chỗ — xác nhận qua Zalo.",
};

export default function EnrollPage() {
  return (
    <MarketingSubpage
      label="Đăng ký học"
      title="Ghi danh khóa tháng"
      lead="Gửi form → team MA xác nhận Zalo. Điểm danh trừ buổi · không học bù. Form không đồng nghĩa đã vào lớp."
    >
      <Suspense fallback={<p>Đang tải…</p>}>
        <EnrollPageClient />
      </Suspense>
    </MarketingSubpage>
  );
}
