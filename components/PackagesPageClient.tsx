"use client";

import { BookingCta } from "@/components/BookingCta";
import { useSiteData } from "@/lib/use-site-data";

export function PackagesPageClient() {
  const { data } = useSiteData();

  return (
    <>
      <div className="price-grid">
        {data.packages.map((p) => (
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
    </>
  );
}
