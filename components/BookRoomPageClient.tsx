import { BookingCta } from "@/components/BookingCta";

export function BookRoomPageClient() {
  return (
    <div className="ma-lead-form">
      <p className="ma-hint">
        Mở form chính thức để đặt phòng. Staff check conflict với lịch khóa. Giá/giờ:
        Liên hệ.
      </p>
      <BookingCta className="btn btn-primary btn-full">Mở form đặt phòng</BookingCta>
    </div>
  );
}
