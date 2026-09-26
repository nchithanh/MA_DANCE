import { BookingCta } from "@/components/BookingCta";

export function EnrollPageClient() {
  return (
    <div className="ma-lead-form">
      <p className="ma-hint">
        Mở form đăng ký chính thức — studio xác nhận sĩ số và gói qua Zalo.
      </p>
      <p className="ma-legal">
        Form không đồng nghĩa đã vào lớp. Lễ tân / quản lý xác nhận sĩ số, gói và
        cọc (nếu 6–12 tháng) qua Zalo.
      </p>
      <BookingCta className="btn btn-primary btn-full">Mở form đăng ký</BookingCta>
    </div>
  );
}
