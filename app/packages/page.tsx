import type { Metadata } from "next";
import { BookingCta } from "@/components/BookingCta";
import { MarketingSubpage } from "@/components/MarketingSubpage";
import { packages } from "@/lib/discovery-data";

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
      <div className="price-grid">
        {packages.map((p) => (
          <article
            key={p.id}
            className={`price-card${p.featured ? " price-featured" : ""}`}
          >
            <p className="price-tag">{p.tag}</p>
            <h2>{p.title}</h2>
            <div className="price-num">Liên hệ</div>
            <p className="price-desc">{p.sessions}</p>
            <ul>
              <li>{p.hold}</li>
              <li>{p.deposit}</li>
              <li>Điểm danh trừ buổi · không học bù</li>
            </ul>
            <BookingCta
              className={`btn btn-full ${p.featured ? "btn-primary" : "btn-ghost"}`}
            >
              Đăng ký gói
            </BookingCta>
          </article>
        ))}
      </div>
      <aside className="ma-callout">
        <h3>Rule tài chính</h3>
        <ul>
          <li>Thanh toán: một lần hoặc từng đợt — tùy gói · TM / CK + ảnh bill</li>
          <li>Nợ: vẫn vào lớp, thu sau khi học</li>
          <li>Nghỉ không bảo lưu: mất buổi, không hoàn</li>
          <li>Điểm danh xong → trừ 1 buổi · không học bù</li>
        </ul>
      </aside>
    </MarketingSubpage>
  );
}
