/** Demo catalog seed — admin có thể thêm/sửa sau. Không khóa số lượng theo discovery. Giá = Liên hệ. */
export type BranchId = "q10" | "q3" | "pn";

export type Room = {
  id: string;
  name: string;
  size: string;
  photo: string;
};

export type Branch = {
  id: BranchId;
  name: string;
  address: string;
  rooms: Room[];
  note: string;
};

export type Course = {
  id: string;
  style: string;
  level: string;
  branch: BranchId;
  schedule: string;
  teacher: string;
  start: string;
  end: string;
  seats: number;
  cap: number;
  midOpen: boolean;
};

export type Package = {
  id: string;
  tag: string;
  title: string;
  sessions: string;
  hold: string;
  deposit: string;
  featured: boolean;
};

export const MA_PHONE = "0764669969";
export const MA_PHONE_DISPLAY = "076 466 9969";
export const MA_ZALO = "https://zalo.me/0764669969";
/** Optional external form (Summer Deal) — giữ làm kênh phụ. */
export const MA_GOOGLE_FORM = "https://forms.gle/LUyZiNv2F3Hnu499A";

export const branches: Branch[] = [
  {
    id: "q10" as const,
    name: "Quận 10",
    address: "436A/101 Đường 3/2, Phường Hoà Hưng, TP.HCM",
    rooms: [
      { id: "mi1", name: "MI1", size: "lớn", photo: "studio-01.jpg" },
      { id: "mi2", name: "MI2", size: "lớn", photo: "studio-03.jpg" },
      { id: "mon3", name: "MON3", size: "nhỏ", photo: "studio-02.jpg" },
      { id: "mon4", name: "MON4", size: "nhỏ", photo: "studio-06.jpg" },
      { id: "mi5", name: "MI5", size: "lớn", photo: "studio-04.jpg" },
      { id: "mon5", name: "MON5", size: "nhỏ", photo: "studio-07.jpg" },
      { id: "lab-q10", name: "Lab", size: "nhỏ · quay", photo: "studio-05.jpg" },
    ],
    note: "MI lớn · MON nhỏ · Lab quay",
  },
  {
    id: "q3" as const,
    name: "Quận 3",
    address: "02 Hồ Xuân Hương, Phường Xuân Hoà, TP.HCM",
    rooms: [
      { id: "room-a", name: "Room A", size: "~100 m²", photo: "studio-03.jpg" },
      { id: "room-b", name: "Room B", size: "vừa", photo: "studio-04.jpg" },
      { id: "room-c", name: "Room C", size: "nhỏ · practice", photo: "studio-02.jpg" },
    ],
    note: "Room A lớn · B vừa · C practice",
  },
  {
    id: "pn" as const,
    name: "Phú Nhuận",
    address: "522/1 Phan Xích Long, Phường Đức Nhuận, TP.HCM",
    rooms: [
      { id: "mi3", name: "MI3", size: "lớn", photo: "studio-01.jpg" },
      { id: "mi4", name: "MI4", size: "nhỏ", photo: "studio-06.jpg" },
      { id: "mi6", name: "MI6", size: "lớn", photo: "studio-08.jpg" },
      { id: "practice-pn", name: "Practice", size: "nhỏ · luyện", photo: "studio-07.jpg" },
    ],
    note: "MI3/MI6 lớn · MI4/Practice nhỏ",
  },
];

export const midEnroll = [
  { level: "Begin", rule: "Dừng nhận từ buổi 4–5" },
  { level: "Inter", rule: "Nhận ở các buổi lẻ của khóa" },
  { level: "Advance", rule: "Nhận buổi 1 & buổi 5" },
];

export const packages: Package[] = [
  {
    id: "1m",
    tag: "Cơ bản",
    title: "Gói 1 tháng",
    sessions: "8 buổi / tháng",
    hold: "Không tặng bảo lưu — có thể mua BL lẻ",
    deposit: "Không cọc",
    featured: false,
  },
  {
    id: "3m",
    tag: "Phổ biến",
    title: "Gói 3 tháng",
    sessions: "8 buổi / tháng × 3",
    hold: "Tặng bảo lưu",
    deposit: "Không cọc",
    featured: true,
  },
  {
    id: "6m",
    tag: "Ưu đãi",
    title: "Gói 6 tháng",
    sessions: "8 buổi / tháng × 6",
    hold: "Tặng bảo lưu",
    deposit: "Có cọc",
    featured: false,
  },
  {
    id: "12m",
    tag: "Cam kết dài",
    title: "Gói 12 tháng",
    sessions: "8 buổi / tháng × 12",
    hold: "Tặng bảo lưu",
    deposit: "Có cọc",
    featured: false,
  },
];

export const courses: Course[] = [
  {
    id: "kp-begin-q10",
    style: "K-Pop",
    level: "Begin",
    branch: "q10" as BranchId,
    schedule: "T2 · T5 · 18:00–19:20",
    teacher: "HYE",
    start: "2026-10-06",
    end: "2026-10-31",
    seats: 12,
    cap: 15,
    midOpen: true,
  },
  {
    id: "kp-inter-pn",
    style: "K-Pop",
    level: "Inter",
    branch: "pn" as BranchId,
    schedule: "T3 · T6 · 18:00–19:20",
    teacher: "SOO",
    start: "2026-10-07",
    end: "2026-10-30",
    seats: 9,
    cap: 14,
    midOpen: true,
  },
  {
    id: "kp-adv-q10",
    style: "K-Pop",
    level: "Advance",
    branch: "q10" as BranchId,
    schedule: "T7 · 19:00–20:30",
    teacher: "HYE",
    start: "2026-10-04",
    end: "2026-10-25",
    seats: 13,
    cap: 15,
    midOpen: false,
  },
  {
    id: "hh-begin-q10",
    style: "Hip-Hop",
    level: "Begin",
    branch: "q10" as BranchId,
    schedule: "T2 · T5 · 19:30–20:50",
    teacher: "JIN",
    start: "2026-10-06",
    end: "2026-10-31",
    seats: 7,
    cap: 14,
    midOpen: true,
  },
  {
    id: "hh-inter-q3",
    style: "Hip-Hop",
    level: "Inter",
    branch: "q3" as BranchId,
    schedule: "T3 · T6 · 19:30–20:50",
    teacher: "JIN",
    start: "2026-10-07",
    end: "2026-10-31",
    seats: 10,
    cap: 12,
    midOpen: true,
  },
  {
    id: "hh-adv-pn",
    style: "Hip-Hop",
    level: "Advance",
    branch: "pn" as BranchId,
    schedule: "CN · 18:00–19:30",
    teacher: "JIN",
    start: "2026-10-05",
    end: "2026-10-26",
    seats: 11,
    cap: 12,
    midOpen: true,
  },
  {
    id: "gh-begin-q3",
    style: "Girls Hip",
    level: "Begin",
    branch: "q3" as BranchId,
    schedule: "T4 · T7 · 18:00–19:20",
    teacher: "MIN",
    start: "2026-10-08",
    end: "2026-10-31",
    seats: 6,
    cap: 14,
    midOpen: true,
  },
  {
    id: "gh-inter-q10",
    style: "Girls Hip",
    level: "Inter",
    branch: "q10" as BranchId,
    schedule: "T3 · T6 · 18:00–19:20",
    teacher: "MIN",
    start: "2026-10-07",
    end: "2026-10-30",
    seats: 10,
    cap: 15,
    midOpen: true,
  },
  {
    id: "gh-adv-pn",
    style: "Girls Hip",
    level: "Advance",
    branch: "pn" as BranchId,
    schedule: "T7 · 10:00–11:20",
    teacher: "MIN",
    start: "2026-10-04",
    end: "2026-10-25",
    seats: 14,
    cap: 15,
    midOpen: false,
  },
  {
    id: "urban-begin-q3",
    style: "Urban",
    level: "Begin",
    branch: "q3" as BranchId,
    schedule: "T2 · T5 · 17:00–18:20",
    teacher: "SOO",
    start: "2026-10-06",
    end: "2026-10-31",
    seats: 5,
    cap: 12,
    midOpen: true,
  },
  {
    id: "urban-inter-q10",
    style: "Urban",
    level: "Inter",
    branch: "q10" as BranchId,
    schedule: "T4 · CN · 20:00–21:20",
    teacher: "SOO",
    start: "2026-10-08",
    end: "2026-10-30",
    seats: 15,
    cap: 15,
    midOpen: false,
  },
  {
    id: "urban-adv-pn",
    style: "Urban",
    level: "Advance",
    branch: "pn" as BranchId,
    schedule: "T7 · 16:00–17:30",
    teacher: "SOO",
    start: "2026-10-04",
    end: "2026-10-25",
    seats: 9,
    cap: 12,
    midOpen: true,
  },
  {
    id: "waack-begin-pn",
    style: "Waacking",
    level: "Begin",
    branch: "pn" as BranchId,
    schedule: "T3 · T5 · 18:30–19:50",
    teacher: "MIN",
    start: "2026-10-07",
    end: "2026-10-30",
    seats: 8,
    cap: 12,
    midOpen: true,
  },
  {
    id: "waack-inter-q10",
    style: "Waacking",
    level: "Inter",
    branch: "q10" as BranchId,
    schedule: "T4 · T7 · 19:30–20:50",
    teacher: "MIN",
    start: "2026-10-08",
    end: "2026-10-31",
    seats: 7,
    cap: 12,
    midOpen: true,
  },
  {
    id: "cover-begin-q10",
    style: "Cover",
    level: "Begin",
    branch: "q10" as BranchId,
    schedule: "CN · 14:00–15:20",
    teacher: "HYE",
    start: "2026-10-05",
    end: "2026-10-26",
    seats: 4,
    cap: 14,
    midOpen: true,
  },
  {
    id: "cover-inter-pn",
    style: "Cover",
    level: "Inter",
    branch: "pn" as BranchId,
    schedule: "T7 · 14:00–15:30",
    teacher: "HYE",
    start: "2026-10-04",
    end: "2026-10-25",
    seats: 10,
    cap: 14,
    midOpen: true,
  },
  {
    id: "cover-adv-q3",
    style: "Cover",
    level: "Advance",
    branch: "q3" as BranchId,
    schedule: "CN · 16:00–17:30",
    teacher: "HYE",
    start: "2026-10-05",
    end: "2026-10-26",
    seats: 11,
    cap: 12,
    midOpen: true,
  },
  {
    id: "pop-inter-q3",
    style: "Popping",
    level: "Inter",
    branch: "q3" as BranchId,
    schedule: "T4 · CN · 18:30–19:50",
    teacher: "JIN",
    start: "2026-10-08",
    end: "2026-10-30",
    seats: 8,
    cap: 12,
    midOpen: true,
  },
  {
    id: "lock-begin-q10",
    style: "Locking",
    level: "Begin",
    branch: "q10" as BranchId,
    schedule: "T7 · 11:30–12:50",
    teacher: "JIN",
    start: "2026-10-04",
    end: "2026-10-25",
    seats: 6,
    cap: 12,
    midOpen: true,
  },
  {
    id: "cont-inter-pn",
    style: "Contemporary",
    level: "Inter",
    branch: "pn" as BranchId,
    schedule: "CN · 10:00–11:20",
    teacher: "SOO",
    start: "2026-10-05",
    end: "2026-10-26",
    seats: 9,
    cap: 14,
    midOpen: true,
  },
];

export function countRooms() {
  return branches.reduce((n, b) => n + b.rooms.length, 0);
}

export function branchName(id: BranchId, list: Branch[] = branches) {
  return list.find((b) => b.id === id)?.name ?? id;
}

function hhmm(hour: number) {
  return `${String(hour).padStart(2, "0")}:00`;
}

/** Khung 2 tiếng, 07:00 → 22:00. Slot cuối đủ 2h: 19:00–21:00 (còn 21–22 không đủ 1 khung). */
export const STUDIO_SLOTS = (() => {
  const slots: { id: string; startHour: number; endHour: number; start: string; end: string; label: string }[] = [];
  for (let hour = 7; hour + 2 <= 22; hour += 2) {
    const end = hour + 2;
    slots.push({
      id: `${hhmm(hour)}-${hhmm(end)}`,
      startHour: hour,
      endHour: end,
      start: hhmm(hour),
      end: hhmm(end),
      label: `${String(hour).padStart(2, "0")}–${String(end).padStart(2, "0")}`,
    });
  }
  return slots;
})();

/** Lịch bận demo (khóa / đã giữ). Deterministic — không phải lịch thật. */
export function isRoomSlotBusy(roomId: string, slotId: string, dateIso: string): boolean {
  let hash = 0;
  const key = `${roomId}|${slotId}|${dateIso}`;
  for (let i = 0; i < key.length; i += 1) hash = (hash * 33 + key.charCodeAt(i)) >>> 0;
  const startHour = Number(slotId.slice(0, 2));
  const peak = startHour >= 17;
  return (hash + startHour * 7) % (peak ? 3 : 5) === 0;
}
