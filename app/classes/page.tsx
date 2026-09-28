import type { Metadata } from "next";
import { MarketingSubpage } from "@/components/MarketingSubpage";
import { ClassesPageClient } from "@/components/ClassesPageClient";
import { routeMetadata } from "@/lib/route-seo";

export async function generateMetadata(): Promise<Metadata> {
  return routeMetadata("/classes/");
}

export default function ClassesPage() {
  return (
    <MarketingSubpage
      label="Khóa học"
      title="Chọn khóa theo chi nhánh & level"
      lead="Catalog từ Worker — nhiều style / level / khung giờ. Full → gợi ý khung giờ khác."
    >
      <ClassesPageClient />
    </MarketingSubpage>
  );
}
