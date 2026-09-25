import type { Metadata } from "next";
import Link from "next/link";
import { MarketingSubpage } from "@/components/MarketingSubpage";
import { branches, countRooms } from "@/lib/discovery-data";

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
      lead="Khóa học ưu tiên lịch phòng. Slot trống có thể thuê theo giờ. Catalog demo — admin thêm phòng sau."
    >
      <p className="ma-actions">
        <Link href="/book-room/" className="btn btn-primary">
          Đặt phòng
        </Link>
      </p>
      {branches.map((b) => (
        <section key={b.id} className="ma-branch-block">
          <h2>{b.name}</h2>
          <p className="note">{b.note}</p>
          <p className="note">{b.address}</p>
          <div className="ma-room-grid">
            {b.rooms.map((r) => (
              <article key={r.id}>
                <h3>{r.name}</h3>
                <p>{r.size}</p>
                <Link className="svc-link" href={`/book-room/?branch=${b.id}&room=${r.id}`}>
                  Đặt phòng →
                </Link>
              </article>
            ))}
          </div>
        </section>
      ))}
    </MarketingSubpage>
  );
}
