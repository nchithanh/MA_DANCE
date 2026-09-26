import type { Metadata } from "next";
import { MarketingSubpage } from "@/components/MarketingSubpage";
import { RoomsPageClient } from "@/components/RoomsPageClient";
import { countRooms } from "@/lib/discovery-data";

const roomTotal = countRooms();

export const metadata: Metadata = {
  title: "Phòng tập — MA Dance Studio",
  description: `${roomTotal} phòng tập · 3 chi nhánh MA Dance. Thuê theo giờ.`,
};

export default function RoomsPage() {
  return (
    <MarketingSubpage
      label="Thuê phòng"
      title={`${roomTotal} phòng · 3 chi nhánh`}
      lead="3 chi nhánh · mỗi hàng một CN. Xem ảnh phòng và khung giờ trống / bận — bấm Book Now để mở form."
    >
      <RoomsPageClient />
    </MarketingSubpage>
  );
}
