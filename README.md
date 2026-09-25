# MA Dance — marketing site

Frontend marketing homepage under `products/MA/marketingSite/`.

## Intent

- Rebuilt from static template `products/MA/ma-dance/` (HTML / CSS / JS).
- Branding & copy = **MA Dance Studio** (K-Pop / street dance, HCMC).
- VI / EN / KR via in-page language switcher (`localStorage` key `ma-lang`).
- Official partner: **The New Gene Show** — fixed **top bar** + splash + `#partner` — copy: *MA Dance Studio – đối tác vũ đạo & luyện tập chính thức của The New Gene 2026* → https://thenewgene.vn/
- Trust / milestones: `#milestones` — dark editorial **bento** with photo tiles.
- Brand partners strip: `#clients` — logo marquee (THPT Nguyễn Hữu Thọ · VTV · FPT · Dolphin + SVG fillers).
- Type scale (hạ ~10%): section label `1.125rem` · title `2.65rem` · body `.9375rem`. `#about` / `#impact` manifesto. Display token cho partner / page h1.
- Hero: YouTube full-bleed nền (`_sC66dTpGMw`, mute/loop, không control) + overlay canh giữa: logo MA phía trên, 2 dòng title. Sticky pin — section số liệu kéo đè lên hero khi scroll.
- Homepage (rút gọn): hero (Đăng ký học + Thuê phòng) → about + 3 đường đi + 4 số liệu (3 CN · 14+ phòng · 12+ styles · 8 buổi) → partner + clients → milestones → services → styles/level → giảng viên → gói (giá: Liên hệ) → gallery 3 CN → livestream / lịch live → chi nhánh → FAQ → contact. Lịch demo / social / teaser phòng gỡ khỏi home.
- `#live`: card text + ảnh → TikTok `@madancestudio/live` (web hoặc app).
- Content photos: `public/media/` (local). Pages build prefixes asset paths with `/MA_DANCE`.
- Contact / booking CTAs → `/enroll/` · `/book-room/` · `/events/` (form lead trên site). Không CRM.
- Catalog demo (`lib/discovery-data.ts`): ~20 khóa · 14 phòng / 3 CN — **không** khóa số lượng discovery; admin thêm sau. Giá gói / thuê giờ: Liên hệ. Số liệu `#impact` là placeholder.
- Branches: Q10 `436A/101 Đường 3/2` · Phú Nhuận `522/1 Phan Xích Long` · Q3 `02 Hồ Xuân Hương`.

## Lead pages

| Route | Mục đích |
| --- | --- |
| `/classes/` | Catalog khóa + lọc |
| `/enroll/` | Đăng ký học |
| `/packages/` | Gói 1 / 3 / 6 / 12 tháng |
| `/rooms/` · `/book-room/` | 3 hàng CN · ảnh + slot trống/bận demo → form đặt phòng |
| `/events/` | Brief biên đạo |

## Run

```bash
cd products/MA/marketingSite
npm install
npm run dev
```

Open [http://localhost:3020](http://localhost:3020).

## Build (static)

```bash
npm run build                 # → out/
GITHUB_PAGES=true npm run build  # basePath /MA_DANCE for GitHub Pages
```

## Deploy

- Repo: [nchithanh/MA_DANCE](https://github.com/nchithanh/MA_DANCE)
- CI: `.github/workflows/deploy.yml` — push `main` → build + GitHub Pages
- Live (sau khi bật Pages = GitHub Actions): https://nchithanh.github.io/MA_DANCE/
- Settings → Pages → Source: **GitHub Actions**

## Stack

- Next.js 16 (App Router) · React 19 · static `output: "export"`
- Fonts: Be Vietnam Pro (Google Fonts · vietnamese)

## Template source

Keep `../ma-dance/` as the static design reference. Port changes from there into:

| Template | App |
| --- | --- |
| `index.html` | `content/body.html` → `components/MaDanceHome.tsx` |
| `styles.css` | `app/ma-dance.css` |
| `script.js` | `lib/ma-dance-runtime.js` (`initMaDance`) |
| `logo.png` | `public/logo.png` (MA monogram; “DANCE STUDIO” là text CSS) |
| Content photos | `public/media/*.jpg` (local SoT — no `api.minstudio.vn` CDN) |
| Studio gallery | `public/media/studio-01…08.jpg` — real room photos for `#gallery` |
