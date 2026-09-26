-- D1 database: ma_website
-- Catalog MA Dance (không cột giá). Seed = lib/discovery-data.ts + lib/stories.ts
-- Worker: workers/ma-website/ (copy schema.sql). Site seed: this file.
-- wrangler d1 execute ma_website --remote --file=d1/schema.sql

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS branches (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  note TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS rooms (
  id TEXT PRIMARY KEY,
  branch_id TEXT NOT NULL REFERENCES branches(id) ON UPDATE CASCADE ON DELETE CASCADE,
  name TEXT NOT NULL,
  size TEXT NOT NULL DEFAULT '',
  photo TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_rooms_branch ON rooms(branch_id, sort_order);

CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY,
  style TEXT NOT NULL,
  level TEXT NOT NULL,
  branch_id TEXT NOT NULL REFERENCES branches(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  schedule TEXT NOT NULL DEFAULT '',
  teacher TEXT NOT NULL DEFAULT '',
  start_date TEXT NOT NULL DEFAULT '',
  end_date TEXT NOT NULL DEFAULT '',
  seats INTEGER NOT NULL DEFAULT 0,
  cap INTEGER NOT NULL DEFAULT 15,
  mid_open INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_courses_branch ON courses(branch_id, level, style);

CREATE TABLE IF NOT EXISTS packages (
  id TEXT PRIMARY KEY,
  tag TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL,
  sessions TEXT NOT NULL DEFAULT '',
  hold TEXT NOT NULL DEFAULT '',
  deposit TEXT NOT NULL DEFAULT '',
  featured INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS stories (
  slug TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  kind TEXT NOT NULL,
  kind_label TEXT NOT NULL,
  image TEXT NOT NULL DEFAULT '',
  image_alt TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  watch_label TEXT,
  watch_href TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS story_blocks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  story_slug TEXT NOT NULL REFERENCES stories(slug) ON UPDATE CASCADE ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  body TEXT NOT NULL,
  UNIQUE (story_slug, sort_order)
);

CREATE TABLE IF NOT EXISTS mid_enroll (
  level TEXT PRIMARY KEY,
  rule TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS site_meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

INSERT OR IGNORE INTO site_meta (key, value) VALUES ('schema_version', '1');

INSERT OR IGNORE INTO branches (id, name, address, note, sort_order) VALUES
  ('q10', 'Quận 10', '436A/101 Đường 3/2, Phường Hoà Hưng, TP.HCM', 'MI lớn · MON nhỏ · Lab quay', 0),
  ('q3', 'Quận 3', '02 Hồ Xuân Hương, Phường Xuân Hoà, TP.HCM', 'Room A lớn · B vừa · C practice', 1),
  ('pn', 'Phú Nhuận', '522/1 Phan Xích Long, Phường Đức Nhuận, TP.HCM', 'MI3/MI6 lớn · MI4/Practice nhỏ', 2);

INSERT OR IGNORE INTO rooms (id, branch_id, name, size, photo, sort_order) VALUES
  ('mi1', 'q10', 'MI1', 'lớn', 'studio-01.jpg', 0),
  ('mi2', 'q10', 'MI2', 'lớn', 'studio-03.jpg', 1),
  ('mon3', 'q10', 'MON3', 'nhỏ', 'studio-02.jpg', 2),
  ('mon4', 'q10', 'MON4', 'nhỏ', 'studio-06.jpg', 3),
  ('mi5', 'q10', 'MI5', 'lớn', 'studio-04.jpg', 4),
  ('mon5', 'q10', 'MON5', 'nhỏ', 'studio-07.jpg', 5),
  ('lab-q10', 'q10', 'Lab', 'nhỏ · quay', 'studio-05.jpg', 6),
  ('room-a', 'q3', 'Room A', '~100 m²', 'studio-03.jpg', 0),
  ('room-b', 'q3', 'Room B', 'vừa', 'studio-04.jpg', 1),
  ('room-c', 'q3', 'Room C', 'nhỏ · practice', 'studio-02.jpg', 2),
  ('mi3', 'pn', 'MI3', 'lớn', 'studio-01.jpg', 0),
  ('mi4', 'pn', 'MI4', 'nhỏ', 'studio-06.jpg', 1),
  ('mi6', 'pn', 'MI6', 'lớn', 'studio-08.jpg', 2),
  ('practice-pn', 'pn', 'Practice', 'nhỏ · luyện', 'studio-07.jpg', 3);

INSERT OR IGNORE INTO mid_enroll (level, rule) VALUES
  ('Begin', 'Dừng nhận từ buổi 4–5'),
  ('Inter', 'Nhận ở các buổi lẻ của khóa'),
  ('Advance', 'Nhận buổi 1 & buổi 5');

INSERT OR IGNORE INTO packages (id, tag, title, sessions, hold, deposit, featured, sort_order) VALUES
  ('1m', 'Cơ bản', 'Gói 1 tháng', '8 buổi / tháng', 'Không tặng bảo lưu — có thể mua BL lẻ', 'Không cọc', 0, 0),
  ('3m', 'Phổ biến', 'Gói 3 tháng', '8 buổi / tháng × 3', 'Tặng bảo lưu', 'Không cọc', 1, 1),
  ('6m', 'Ưu đãi', 'Gói 6 tháng', '8 buổi / tháng × 6', 'Tặng bảo lưu', 'Có cọc', 0, 2),
  ('12m', 'Cam kết dài', 'Gói 12 tháng', '8 buổi / tháng × 12', 'Tặng bảo lưu', 'Có cọc', 0, 3);

INSERT OR IGNORE INTO courses (id, style, level, branch_id, schedule, teacher, start_date, end_date, seats, cap, mid_open, sort_order) VALUES
  ('kp-begin-q10', 'K-Pop', 'Begin', 'q10', 'T2 · T5 · 18:00–19:20', 'HYE', '2026-10-06', '2026-10-31', 12, 15, 1, 0),
  ('kp-inter-pn', 'K-Pop', 'Inter', 'pn', 'T3 · T6 · 18:00–19:20', 'SOO', '2026-10-07', '2026-10-30', 9, 14, 1, 1),
  ('kp-adv-q10', 'K-Pop', 'Advance', 'q10', 'T7 · 19:00–20:30', 'HYE', '2026-10-04', '2026-10-25', 13, 15, 0, 2),
  ('hh-begin-q10', 'Hip-Hop', 'Begin', 'q10', 'T2 · T5 · 19:30–20:50', 'JIN', '2026-10-06', '2026-10-31', 7, 14, 1, 3),
  ('hh-inter-q3', 'Hip-Hop', 'Inter', 'q3', 'T3 · T6 · 19:30–20:50', 'JIN', '2026-10-07', '2026-10-31', 10, 12, 1, 4),
  ('hh-adv-pn', 'Hip-Hop', 'Advance', 'pn', 'CN · 18:00–19:30', 'JIN', '2026-10-05', '2026-10-26', 11, 12, 1, 5),
  ('gh-begin-q3', 'Girls Hip', 'Begin', 'q3', 'T4 · T7 · 18:00–19:20', 'MIN', '2026-10-08', '2026-10-31', 6, 14, 1, 6),
  ('gh-inter-q10', 'Girls Hip', 'Inter', 'q10', 'T3 · T6 · 18:00–19:20', 'MIN', '2026-10-07', '2026-10-30', 10, 15, 1, 7),
  ('gh-adv-pn', 'Girls Hip', 'Advance', 'pn', 'T7 · 10:00–11:20', 'MIN', '2026-10-04', '2026-10-25', 14, 15, 0, 8),
  ('urban-begin-q3', 'Urban', 'Begin', 'q3', 'T2 · T5 · 17:00–18:20', 'SOO', '2026-10-06', '2026-10-31', 5, 12, 1, 9),
  ('urban-inter-q10', 'Urban', 'Inter', 'q10', 'T4 · CN · 20:00–21:20', 'SOO', '2026-10-08', '2026-10-30', 15, 15, 0, 10),
  ('urban-adv-pn', 'Urban', 'Advance', 'pn', 'T7 · 16:00–17:30', 'SOO', '2026-10-04', '2026-10-25', 9, 12, 1, 11),
  ('waack-begin-pn', 'Waacking', 'Begin', 'pn', 'T3 · T5 · 18:30–19:50', 'MIN', '2026-10-07', '2026-10-30', 8, 12, 1, 12),
  ('waack-inter-q10', 'Waacking', 'Inter', 'q10', 'T4 · T7 · 19:30–20:50', 'MIN', '2026-10-08', '2026-10-31', 7, 12, 1, 13),
  ('cover-begin-q10', 'Cover', 'Begin', 'q10', 'CN · 14:00–15:20', 'HYE', '2026-10-05', '2026-10-26', 4, 14, 1, 14),
  ('cover-inter-pn', 'Cover', 'Inter', 'pn', 'T7 · 14:00–15:30', 'HYE', '2026-10-04', '2026-10-25', 10, 14, 1, 15),
  ('cover-adv-q3', 'Cover', 'Advance', 'q3', 'CN · 16:00–17:30', 'HYE', '2026-10-05', '2026-10-26', 11, 12, 1, 16),
  ('pop-inter-q3', 'Popping', 'Inter', 'q3', 'T4 · CN · 18:30–19:50', 'JIN', '2026-10-08', '2026-10-30', 8, 12, 1, 17),
  ('lock-begin-q10', 'Locking', 'Begin', 'q10', 'T7 · 11:30–12:50', 'JIN', '2026-10-04', '2026-10-25', 6, 12, 1, 18),
  ('cont-inter-pn', 'Contemporary', 'Inter', 'pn', 'CN · 10:00–11:20', 'SOO', '2026-10-05', '2026-10-26', 9, 14, 1, 19);

INSERT OR IGNORE INTO stories (slug, date, kind, kind_label, image, image_alt, title, excerpt, watch_label, watch_href, sort_order) VALUES
  (
    'cover-night',
    '2026-09-16',
    'tiktok',
    'TikTok',
    'popup-chuoi-ngayther.jpg',
    'Cover night — livestream TikTok tại MA Dance Studio',
    'Cover night tại studio',
    'Buổi live cover trên TikTok @madancestudio — choreo cover, vibe phòng tập, mở trên web hoặc app.',
    'Xem trên TikTok',
    'https://www.tiktok.com/@madancestudio/live',
    0
  ),
  (
    'class-recap',
    '2026-09-19',
    'tiktok',
    'TikTok',
    'crew-girlstyle.jpg',
    'Class recap — highlight buổi học MA Dance',
    'Class recap trong tuần',
    'Highlight buổi học: count, formation, energy lớp. Clip ngắn trên TikTok — không thay catalog khóa.',
    'Xem TikTok MA',
    'https://www.tiktok.com/@madancestudio',
    1
  ),
  (
    'the-new-gene-2026',
    '2026-08-20',
    'note',
    'Case',
    'brand-figure.jpg',
    'MA Dance Studio đồng hành The New Gene 2026',
    'MA × The New Gene 2026',
    'MA Dance là đối tác vũ đạo và luyện tập chính thức của The New Gene 2026 — từ phòng tập tới sân khấu.',
    'The New Gene',
    'https://thenewgene.vn/',
    2
  ),
  (
    'studio-ba-chi-nhanh',
    '2026-08-05',
    'youtube',
    'YouTube',
    'studio-01.jpg',
    'Phòng tập MA — tường logo, sàn gỗ, 3 chi nhánh',
    'Không gian 3 chi nhánh',
    'Q10 · Q3 · Phú Nhuận — phòng thật, gương full. Xem clip trên YouTube @madancestudio hoặc gallery trên web.',
    'YouTube @madancestudio',
    'https://youtube.com/@madancestudio',
    3
  );

INSERT OR IGNORE INTO story_blocks (story_slug, sort_order, body) VALUES
  ('cover-night', 0, 'Cover night là khung live định kỳ của MA: studio bật livestream TikTok, dancer cover track đang tập trong tuần.'),
  ('cover-night', 1, 'Không phải buổi diễn sân khấu. Là phòng tập — gương, sàn, đèn — để người xem thấy cách lớp vận hành thật.'),
  ('cover-night', 2, 'Xem trên TikTok @madancestudio (web hoặc app). Đăng ký khóa tháng hoặc thuê phòng khi muốn vào đúng không gian đó.'),
  ('class-recap', 0, 'Class recap gom vài đoạn từ lớp trong tuần: breakdown, đi hết bài, hoặc formation team.'),
  ('class-recap', 1, 'Clip để xem vibe — không phải lịch sĩ số thật. Khóa tháng vẫn 8 buổi cố định; giữ chỗ qua form, studio xác nhận Zalo.'),
  ('class-recap', 2, 'Theo dõi @madancestudio để bắt recap tiếp theo. Muốn vào lớp: chọn CN · style · level trên catalog.'),
  ('the-new-gene-2026', 0, 'The New Gene 2026 là chương trình MA đồng hành với vai trò đối tác vũ đạo và luyện tập chính thức.'),
  ('the-new-gene-2026', 1, 'Một tiết mục không chỉ là nhạc — còn đội hình, count, và cách nghệ sĩ làm chủ sân khấu. Studio hỗ trợ thí sinh luyện trước khi lên đèn.'),
  ('the-new-gene-2026', 2, 'Không công bố số liệu phát sóng hay giải thưởng trên trang này. Chi tiết chương trình: thenewgene.vn. Collab khác với MA: form liên hệ hoặc Zalo.'),
  ('studio-ba-chi-nhanh', 0, 'MA vận hành 3 chi nhánh tại TP.HCM: 436A/101 Đường 3/2 (Q10), 522/1 Phan Xích Long (Phú Nhuận), 02 Hồ Xuân Hương (Q3).'),
  ('studio-ba-chi-nhanh', 1, 'Gallery trên web là ảnh phòng thật. Thuê giờ khi không chồng lịch khóa tháng — giá/giờ: Liên hệ.'),
  ('studio-ba-chi-nhanh', 2, 'Kênh YouTube @madancestudio đăng clip không gian và class. Bấm ảnh studio trên trang chủ để xem lớn.');
