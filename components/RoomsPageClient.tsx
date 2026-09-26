"use client";

import { useMemo, useState } from "react";
import { BookingCta } from "@/components/BookingCta";
import { STUDIO_SLOTS, branches, isRoomSlotBusy } from "@/lib/discovery-data";
import { mediaUrl } from "@/lib/media";

const DAY_LABELS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

function isoLocal(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** 7 ngày tới — hôm nay + 6 ngày. */
function buildDays(count = 7) {
  const start = new Date();
  start.setHours(12, 0, 0, 0);
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return {
      iso: isoLocal(d),
      weekday: i === 0 ? "Hôm nay" : DAY_LABELS[d.getDay()],
      date: `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`,
    };
  });
}

export function RoomsPageClient() {
  const days = useMemo(() => buildDays(7), []);
  const [dateIso, setDateIso] = useState(days[0]?.iso ?? isoLocal(new Date()));

  return (
    <div className="ma-room-board">
      <div className="ma-room-toolbar">
        <div className="ma-room-days" role="tablist" aria-label="7 ngày tới">
          {days.map((day) => (
            <button
              key={day.iso}
              type="button"
              role="tab"
              aria-selected={day.iso === dateIso}
              className={`ma-room-day${day.iso === dateIso ? " is-active" : ""}`}
              onClick={() => setDateIso(day.iso)}
            >
              <span>{day.weekday}</span>
              <em>{day.date}</em>
            </button>
          ))}
        </div>
        <p className="ma-room-legend">
          <span className="ma-slot is-free" aria-hidden="true">07–09</span> Trống
          <span className="ma-slot is-busy" aria-hidden="true">19–21</span> Bận · khóa / đã giữ
        </p>
      </div>
      <p className="ma-hint">
        Mỗi khung 2 tiếng · 07:00–22:00. Lịch demo — bấm khung trống hoặc Đặt lịch để gửi form.
      </p>

      {branches.map((b) => (
        <section key={b.id} className="ma-room-line" aria-labelledby={`rooms-${b.id}`}>
          <header className="ma-room-line__head">
            <p className="label">{b.rooms.length} phòng</p>
            <h2 id={`rooms-${b.id}`}>{b.name}</h2>
            <p>{b.note}</p>
            <p>{b.address}</p>
          </header>
          <div className="ma-room-line__track">
            {b.rooms.map((r) => {
              const freeCount = STUDIO_SLOTS.filter((s) => !isRoomSlotBusy(r.id, s.id, dateIso)).length;
              return (
                <article key={r.id} className="ma-room-unit">
                  <div className="ma-room-unit__photo">
                    <img
                      src={mediaUrl(r.photo)}
                      alt={`Phòng ${r.name} — ${b.name} · ${r.size}`}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="ma-room-unit__body">
                    <h3>{r.name}</h3>
                    <p>
                      {r.size} · {freeCount}/{STUDIO_SLOTS.length} khung trống
                    </p>
                    <ol className="ma-room-slots" aria-label={`Khung giờ ${r.name}`}>
                      {STUDIO_SLOTS.map((slot) => {
                        const busy = isRoomSlotBusy(r.id, slot.id, dateIso);
                        if (busy) {
                          return (
                            <li key={slot.id}>
                              <span className="ma-slot is-busy" title={`${slot.start}–${slot.end} — bận`}>
                                {slot.label}
                              </span>
                            </li>
                          );
                        }
                        return (
                          <li key={slot.id}>
                            <BookingCta
                              className="ma-slot is-free"
                              title={`${slot.start}–${slot.end} — trống, đặt lịch`}
                            >
                              {slot.label}
                            </BookingCta>
                          </li>
                        );
                      })}
                    </ol>
                    <BookingCta className="ma-room-book">Book Now</BookingCta>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
