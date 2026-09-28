import type { Metadata } from "next";
import { Suspense } from "react";
import { MarketingSubpage } from "@/components/MarketingSubpage";
import { BookRoomPageClient } from "@/components/BookRoomPageClient";
import { routeMetadata } from "@/lib/route-seo";

export async function generateMetadata(): Promise<Metadata> {
  return routeMetadata("/book-room/");
}

export default function BookRoomPage() {
  return (
    <MarketingSubpage
      label="Đặt phòng"
      title="Thuê studio theo giờ"
      lead="Mở form Google chính thức. Staff check conflict với lịch khóa. Giá/giờ: Liên hệ."
    >
      <Suspense fallback={<p>Đang tải…</p>}>
        <BookRoomPageClient />
      </Suspense>
    </MarketingSubpage>
  );
}
