import type { Metadata } from "next";
import { MarketingSubpage } from "@/components/MarketingSubpage";
import { StoriesPageClient } from "@/components/StoriesPageClient";
import { routeMetadata } from "@/lib/route-seo";

export async function generateMetadata(): Promise<Metadata> {
  return routeMetadata("/stories/");
}

export default function StoriesPage() {
  return (
    <MarketingSubpage
      label="Stories"
      title="Chia sẻ từ studio"
      lead="Clip TikTok / YouTube và ghi chú case — không phải catalog khóa. Giữ chỗ vẫn qua form + Zalo."
    >
      <StoriesPageClient />
    </MarketingSubpage>
  );
}
