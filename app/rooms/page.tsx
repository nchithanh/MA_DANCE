import type { Metadata } from "next";
import { MarketingSubpage } from "@/components/MarketingSubpage";
import { RoomsPageClient } from "@/components/RoomsPageClient";

export const metadata: Metadata = {
  title: "Phòng tập — MA Dance Studio",
  description: "Phòng tập · 3 chi nhánh MA Dance. Thuê theo giờ.",
};

export default function RoomsPage() {
  return (
    <MarketingSubpage
      label="Thuê phòng"
      title="Phòng tập · 3 chi nhánh"
      lead="3 chi nhánh · mỗi hàng một CN. Xem ảnh phòng và khung giờ trống / bận — bấm Book Now để mở form."
    >
      <RoomsPageClient />
    </MarketingSubpage>
  );
}
