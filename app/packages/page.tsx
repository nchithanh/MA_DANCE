import type { Metadata } from "next";
import { MarketingSubpage } from "@/components/MarketingSubpage";
import { PackagesPageClient } from "@/components/PackagesPageClient";

export const metadata: Metadata = {
  title: "Gói học phí — MA Dance Studio",
  description: "Gói 1 / 3 / 6 / 12 tháng · 8 buổi/tháng · bảo lưu theo rule MA.",
};

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
