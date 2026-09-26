import { BookingCta } from "@/components/BookingCta";

export function EventsPageClient() {
  return (
    <>
      <div className="ma-svc-grid">
        <article>
          <span>01</span>
          <h2>Choreography cá nhân / team</h2>
          <p>Cover, stage, thi đấu — chỉnh theo level nhóm.</p>
        </article>
        <article>
          <span>02</span>
          <h2>Brand & corporate</h2>
          <p>Tiết mục sự kiện công ty, launch, showcase.</p>
        </article>
        <article>
          <span>03</span>
          <h2>MV / content</h2>
          <p>Biên đạo + dancer cho quay clip / social.</p>
        </article>
      </div>

      <div className="ma-lead-form">
        <h2 className="ma-form-title">Gửi brief</h2>
        <p className="ma-hint">Mở form chính thức — MA sẽ liên hệ tư vấn qua Zalo.</p>
        <BookingCta className="btn btn-primary btn-full">Mở form brief</BookingCta>
      </div>
    </>
  );
}
