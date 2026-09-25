import type { Metadata } from "next";
import { MarketingSubpage } from "@/components/MarketingSubpage";
import { EventsPageClient } from "@/components/EventsPageClient";

export const metadata: Metadata = {
  title: "Biên đạo & sự kiện — MA Dance Studio",
  description: "Choreography cá nhân, team, brand event, MV cover — brief form MA Dance.",
};

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
