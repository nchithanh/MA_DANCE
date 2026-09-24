# MA Dance — marketing site

Frontend marketing homepage under `products/MA/marketingSite/`.

## Intent

- Rebuilt from static template `products/MA/ma-dance/` (HTML / CSS / JS).
- Branding & copy = **MA Dance Studio** (K-Pop / street dance, HCMC).
- VI / EN / KR via in-page language switcher (`localStorage` key `ma-lang`).
- Official partner: **The New Gene Show** — fixed **top bar** + splash + `#partner` — copy: *MA Dance Studio – đối tác vũ đạo & luyện tập chính thức của The New Gene 2026* → https://thenewgene.vn/
- Trust / milestones: `#milestones` (“Dấu ấn MA”) — dark editorial **bento** with photo tiles (Be Yourself feature · TNG/partner · community · casting).
- Fixed bottom **section spy** (`#sectionSpy`) — full-width black bar, white links; active = white bg + black text; IntersectionObserver scrollspy.

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
- Fonts: Bebas Neue · Inter (Google Fonts)

## Template source

Keep `../ma-dance/` as the static design reference. Port changes from there into:

| Template | App |
| --- | --- |
| `index.html` | `content/body.html` → `components/MaDanceHome.tsx` |
| `styles.css` | `app/ma-dance.css` |
| `script.js` | `lib/ma-dance-runtime.js` (`initMaDance`) |
| `logo.png` | `public/logo.png` (MA monogram; “DANCE STUDIO” là text CSS) |
