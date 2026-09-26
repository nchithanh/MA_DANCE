import type { Metadata } from "next";
import { Suspense } from "react";
import { MarketingSubpage } from "@/components/MarketingSubpage";
import { StoryPreviewClient } from "@/components/StoryPreviewClient";

export const metadata: Metadata = {
  title: "Story — MA Dance Studio",
  robots: { index: false, follow: false },
};

export default function StoryPreviewPage() {
  return (
    <MarketingSubpage label="Stories" title="Story" lead="Xem trên máy này — story thêm từ Admin.">
      <Suspense fallback={<p>Đang tải…</p>}>
        <StoryPreviewClient />
      </Suspense>
    </MarketingSubpage>
  );
}
