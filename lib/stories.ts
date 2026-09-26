export type StoryKind = "tiktok" | "youtube" | "note";

export type Story = {
  slug: string;
  date: string;
  kind: StoryKind;
  kindLabel: string;
  image: string;
  imageAlt: string;
  title: string;
  excerpt: string;
  body: string[];
  watchLabel?: string;
  watchHref?: string;
};

/** Editorial posts — no invented metrics or prices. */
export const STORIES: Story[] = [
  {
    slug: "cover-night",
    date: "2026-09-16",
    kind: "tiktok",
    kindLabel: "TikTok",
    image: "popup-chuoi-ngayther.jpg",
    imageAlt: "Cover night — livestream TikTok tại MA Dance Studio",
    title: "Cover night tại studio",
    excerpt:
      "Buổi live cover trên TikTok @madancestudio — choreo cover, vibe phòng tập, mở trên web hoặc app.",
    body: [
      "Cover night là khung live định kỳ của MA: studio bật livestream TikTok, dancer cover track đang tập trong tuần.",
      "Không phải buổi diễn sân khấu. Là phòng tập — gương, sàn, đèn — để người xem thấy cách lớp vận hành thật.",
      "Xem trên TikTok @madancestudio (web hoặc app). Đăng ký khóa tháng hoặc thuê phòng khi muốn vào đúng không gian đó.",
    ],
    watchLabel: "Xem trên TikTok",
    watchHref: "https://www.tiktok.com/@madancestudio/live",
  },
  {
    slug: "class-recap",
    date: "2026-09-19",
    kind: "tiktok",
    kindLabel: "TikTok",
    image: "crew-girlstyle.jpg",
    imageAlt: "Class recap — highlight buổi học MA Dance",
    title: "Class recap trong tuần",
    excerpt:
      "Highlight buổi học: count, formation, energy lớp. Clip ngắn trên TikTok — không thay catalog khóa.",
    body: [
      "Class recap gom vài đoạn từ lớp trong tuần: breakdown, đi hết bài, hoặc formation team.",
      "Clip để xem vibe — không phải lịch sĩ số thật. Khóa tháng vẫn 8 buổi cố định; giữ chỗ qua form, studio xác nhận Zalo.",
      "Theo dõi @madancestudio để bắt recap tiếp theo. Muốn vào lớp: chọn CN · style · level trên catalog.",
    ],
    watchLabel: "Xem TikTok MA",
    watchHref: "https://www.tiktok.com/@madancestudio",
  },
  {
    slug: "the-new-gene-2026",
    date: "2026-08-20",
    kind: "note",
    kindLabel: "Case",
    image: "brand-figure.jpg",
    imageAlt: "MA Dance Studio đồng hành The New Gene 2026",
    title: "MA × The New Gene 2026",
    excerpt:
      "MA Dance là đối tác vũ đạo và luyện tập chính thức của The New Gene 2026 — từ phòng tập tới sân khấu.",
    body: [
      "The New Gene 2026 là chương trình MA đồng hành với vai trò đối tác vũ đạo và luyện tập chính thức.",
      "Một tiết mục không chỉ là nhạc — còn đội hình, count, và cách nghệ sĩ làm chủ sân khấu. Studio hỗ trợ thí sinh luyện trước khi lên đèn.",
      "Không công bố số liệu phát sóng hay giải thưởng trên trang này. Chi tiết chương trình: thenewgene.vn. Collab khác với MA: form liên hệ hoặc Zalo.",
    ],
    watchLabel: "The New Gene",
    watchHref: "https://thenewgene.vn/",
  },
  {
    slug: "studio-ba-chi-nhanh",
    date: "2026-08-05",
    kind: "youtube",
    kindLabel: "YouTube",
    image: "studio-01.jpg",
    imageAlt: "Phòng tập MA — tường logo, sàn gỗ, 3 chi nhánh",
    title: "Không gian 3 chi nhánh",
    excerpt:
      "Q10 · Q3 · Phú Nhuận — phòng thật, gương full. Xem clip trên YouTube @madancestudio hoặc gallery trên web.",
    body: [
      "MA vận hành 3 chi nhánh tại TP.HCM: 436A/101 Đường 3/2 (Q10), 522/1 Phan Xích Long (Phú Nhuận), 02 Hồ Xuân Hương (Q3).",
      "Gallery trên web là ảnh phòng thật. Thuê giờ khi không chồng lịch khóa tháng — giá/giờ: Liên hệ.",
      "Kênh YouTube @madancestudio đăng clip không gian và class. Bấm ảnh studio trên trang chủ để xem lớn.",
    ],
    watchLabel: "YouTube @madancestudio",
    watchHref: "https://youtube.com/@madancestudio",
  },
];

export function getStory(slug: string): Story | undefined {
  return STORIES.find((s) => s.slug === slug);
}

export function formatStoryDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}.${m}.${y}`;
}
