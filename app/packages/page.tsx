import type { Metadata } from "next";
import { MarketingSubpage } from "@/components/MarketingSubpage";
import { PackagesPageClient } from "@/components/PackagesPageClient";
import { routeMetadata } from "@/lib/route-seo";

export async function generateMetadata(): Promise<Metadata> {
  return routeMetadata("/packages/");
}

export default function PackagesPage() {
  return (
    <MarketingSubpage
      label="Gói học phí"
      title="Thu theo gói · 8 buổi / tháng"
      lead="Giá chi tiết: Liên hệ. ≥ 3 tháng tặng bảo lưu · 6 & 12 tháng có cọc."
    >
      <PackagesPageClient />
    </MarketingSubpage>
  );
}
