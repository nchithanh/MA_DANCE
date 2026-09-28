import type { Metadata } from "next";
import { MarketingSubpage } from "@/components/MarketingSubpage";
import { EventsPageClient } from "@/components/EventsPageClient";
import { routeMetadata } from "@/lib/route-seo";

export async function generateMetadata(): Promise<Metadata> {
  return routeMetadata("/events/");
}

export default function EventsPage() {
  return (
    <MarketingSubpage
      label="Biên đạo & sự kiện"
      title="Choreo · event · MV cover"
      lead="Ngoài lớp tháng cố định — team MA nhận brief sản xuất."
    >
      <EventsPageClient />
    </MarketingSubpage>
  );
}
