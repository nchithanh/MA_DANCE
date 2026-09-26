import type { Metadata } from "next";
import { MarketingSubpage } from "@/components/MarketingSubpage";
import { StoriesPageClient } from "@/components/StoriesPageClient";

export const metadata: Metadata = {
  title: "Stories — MA Dance Studio",
  description:
    "TikTok, YouTube và case studio MA Dance — cover night, class recap, The New Gene, không gian 3 chi nhánh.",
};

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
