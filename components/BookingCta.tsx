import { BOOKING_FORM_URL } from "@/lib/booking";

type BookingCtaProps = {
  className?: string;
  title?: string;
  children: React.ReactNode;
};

export function BookingCta({ className, title, children }: BookingCtaProps) {
  return (
    <a
      href={BOOKING_FORM_URL}
      className={className}
      title={title}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}
