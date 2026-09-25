import type { Metadata } from "next";
import { MarketingSubpage } from "@/components/MarketingSubpage";
import { ClassesPageClient } from "@/components/ClassesPageClient";

export const metadata: Metadata = {
  title: "Khóa học — MA Dance Studio",
  description:
    "Catalog khóa MA Dance: Begin / Inter / Advance · 8 buổi/tháng · 3 chi nhánh.",
};

export default function ClassesPage() {
  return (
    <MarketingSubpage
      label="Khóa học"
      title="Chọn khóa theo chi nhánh & level"
      lead="Catalog demo — nhiều style / level / khung giờ. Admin thêm khóa sau. Full → gợi ý khung giờ khác."
    >
      <ClassesPageClient />
    </MarketingSubpage>
  );
}
