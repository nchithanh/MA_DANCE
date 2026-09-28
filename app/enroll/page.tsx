import type { Metadata } from "next";
import { Suspense } from "react";
import { MarketingSubpage } from "@/components/MarketingSubpage";
import { EnrollPageClient } from "@/components/EnrollPageClient";
import { routeMetadata } from "@/lib/route-seo";

export async function generateMetadata(): Promise<Metadata> {
  return routeMetadata("/enroll/");
}

export default function EnrollPage() {
  return (
    <MarketingSubpage
      label="Đăng ký học"
      title="Ghi danh khóa tháng"
      lead="Mở form Google chính thức → team MA xác nhận Zalo. Điểm danh trừ buổi · không học bù. Form không đồng nghĩa đã vào lớp."
    >
      <Suspense fallback={<p>Đang tải…</p>}>
        <EnrollPageClient />
      </Suspense>
    </MarketingSubpage>
  );
}
