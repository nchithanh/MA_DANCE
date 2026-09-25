import type { Metadata } from "next";
import { Suspense } from "react";
import { MarketingSubpage } from "@/components/MarketingSubpage";
import { BookRoomPageClient } from "@/components/BookRoomPageClient";

export const metadata: Metadata = {
  title: "Đặt phòng studio — MA Dance Studio",
  description: "Đặt phòng tập MA Dance theo giờ. Form lead — xác nhận Zalo.",
};

export default function BookRoomPage() {
  return (
    <MarketingSubpage
      label="Đặt phòng"
      title="Thuê studio theo giờ"
      lead="Chọn CN · phòng · khung giờ. Staff check conflict với lịch khóa. Giá/giờ: Liên hệ."
    >
      <Suspense fallback={<p>Đang tải…</p>}>
        <BookRoomPageClient />
      </Suspense>
    </MarketingSubpage>
  );
}
