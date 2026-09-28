export const SEO_VERSION = 1 as const;
export const DEFAULT_CANONICAL_ORIGIN = "https://nchithanh.github.io/MA_DANCE";

export const SEO_FIXED_PAGES = [
  { path: "/", label: "Trang chủ" },
  { path: "/classes/", label: "Khóa học" },
  { path: "/packages/", label: "Gói học phí" },
  { path: "/rooms/", label: "Thuê phòng" },
  { path: "/stories/", label: "Stories" },
  { path: "/enroll/", label: "Đăng ký học" },
  { path: "/book-room/", label: "Đặt phòng" },
  { path: "/events/", label: "Biên đạo & sự kiện" },
] as const;

export type SeoRobots = "index,follow" | "noindex,follow" | "noindex,nofollow";

export type SeoPage = {
  title: string;
  description: string;
  robots: SeoRobots;
  canonical: string;
  ogImage: string;
  focusKw: string;
};

export type SeoSite = {
  name: string;
  tagline: string;
  defaultTitle: string;
  defaultDescription: string;
  canonicalOrigin: string;
  ogImage: string;
  twitter: string;
  noindexSite: boolean;
  robotsExtra: string;
  googleVerify: string;
  bingVerify: string;
};

export type SeoDoc = {
  version: typeof SEO_VERSION;
  site: SeoSite;
  pages: Record<string, SeoPage>;
};

const ROBOTS: SeoRobots[] = ["index,follow", "noindex,follow", "noindex,nofollow"];

function asRobots(value: unknown): SeoRobots {
  const raw = String(value || "index,follow");
  return ROBOTS.includes(raw as SeoRobots) ? (raw as SeoRobots) : "index,follow";
}

export function emptySeoPage(partial?: Partial<SeoPage>): SeoPage {
  return {
    title: partial?.title || "",
    description: partial?.description || "",
    robots: partial?.robots || "index,follow",
    canonical: partial?.canonical || "",
    ogImage: partial?.ogImage || "",
    focusKw: partial?.focusKw || "",
  };
}

export function seedSeo(): SeoDoc {
  const pages: Record<string, SeoPage> = {
    "/": emptySeoPage({
      title: "MA Dance Studio — Khóa tháng · Thuê phòng · Biên đạo",
      description:
        "MA Dance Studio — đăng ký khóa 8 buổi/tháng, thuê phòng 3 chi nhánh, biên đạo sự kiện. Form giữ chỗ · xác nhận Zalo.",
      focusKw: "MA Dance Studio",
    }),
    "/classes/": emptySeoPage({
      title: "Khóa học — MA Dance Studio",
      description: "Catalog khóa MA Dance: Begin / Inter / Advance · 8 buổi/tháng · 3 chi nhánh.",
      focusKw: "khóa học nhảy",
    }),
    "/packages/": emptySeoPage({
      title: "Gói học phí — MA Dance Studio",
      description: "Gói 1 / 3 / 6 / 12 tháng · 8 buổi/tháng · bảo lưu theo rule MA.",
      focusKw: "học phí nhảy",
    }),
    "/rooms/": emptySeoPage({
      title: "Phòng tập — MA Dance Studio",
      description: "Phòng tập · 3 chi nhánh MA Dance. Thuê theo giờ.",
      focusKw: "thuê phòng nhảy",
    }),
    "/stories/": emptySeoPage({
      title: "Stories — MA Dance Studio",
      description:
        "TikTok, YouTube và case studio MA Dance — cover night, class recap, The New Gene, không gian 3 chi nhánh.",
      focusKw: "MA Dance stories",
    }),
    "/enroll/": emptySeoPage({
      title: "Đăng ký học — MA Dance Studio",
      description: "Ghi danh khóa tháng MA Dance. Form giữ chỗ — xác nhận qua Zalo.",
      focusKw: "đăng ký học nhảy",
    }),
    "/book-room/": emptySeoPage({
      title: "Đặt phòng studio — MA Dance Studio",
      description: "Đặt phòng tập MA Dance theo giờ. Form lead — xác nhận Zalo.",
      focusKw: "đặt phòng studio",
    }),
    "/events/": emptySeoPage({
      title: "Biên đạo & sự kiện — MA Dance Studio",
      description: "Choreography cá nhân, team, brand event, MV cover — brief form MA Dance.",
      focusKw: "biên đạo sự kiện",
    }),
  };
  return {
    version: SEO_VERSION,
    site: {
      name: "MA Dance Studio",
      tagline: "Khóa tháng · Thuê phòng · Biên đạo",
      defaultTitle: "MA Dance Studio — Khóa tháng · Thuê phòng · Biên đạo",
      defaultDescription:
        "MA Dance Studio — đăng ký khóa 8 buổi/tháng, thuê phòng 3 chi nhánh, biên đạo sự kiện. Form giữ chỗ · xác nhận Zalo.",
      canonicalOrigin: DEFAULT_CANONICAL_ORIGIN,
      ogImage: "logo.png",
      twitter: "",
      noindexSite: false,
      robotsExtra: "",
      googleVerify: "",
      bingVerify: "",
    },
    pages,
  };
}

export function parseSeo(raw: unknown): SeoDoc {
  const seed = seedSeo();
  if (!raw || typeof raw !== "object") return seed;
  const row = raw as Record<string, unknown>;
  const siteRaw = row.site && typeof row.site === "object" ? (row.site as Record<string, unknown>) : {};
  const pagesRaw = row.pages && typeof row.pages === "object" ? (row.pages as Record<string, unknown>) : {};
  const pages: Record<string, SeoPage> = { ...seed.pages };
  for (const [path, value] of Object.entries(pagesRaw)) {
    if (!value || typeof value !== "object") continue;
    const item = value as Record<string, unknown>;
    pages[path] = emptySeoPage({
      title: String(item.title || pages[path]?.title || ""),
      description: String(item.description || pages[path]?.description || ""),
      robots: asRobots(item.robots),
      canonical: String(item.canonical || ""),
      ogImage: String(item.ogImage || ""),
      focusKw: String(item.focusKw || ""),
    });
  }
  return {
    version: SEO_VERSION,
    site: {
      name: String(siteRaw.name || seed.site.name),
      tagline: String(siteRaw.tagline || seed.site.tagline),
      defaultTitle: String(siteRaw.defaultTitle || seed.site.defaultTitle),
      defaultDescription: String(siteRaw.defaultDescription || seed.site.defaultDescription),
      canonicalOrigin: String(siteRaw.canonicalOrigin || seed.site.canonicalOrigin).replace(/\/$/, ""),
      ogImage: String(siteRaw.ogImage || seed.site.ogImage),
      twitter: String(siteRaw.twitter || ""),
      noindexSite: Boolean(siteRaw.noindexSite),
      robotsExtra: String(siteRaw.robotsExtra || ""),
      googleVerify: String(siteRaw.googleVerify || ""),
      bingVerify: String(siteRaw.bingVerify || ""),
    },
    pages,
  };
}

export function storySeoPath(slug: string) {
  return `/stories/${slug}/`;
}

export function isIndexable(seo: SeoDoc, path: string) {
  if (seo.site.noindexSite) return false;
  const page = seo.pages[path];
  if (!page) return true;
  return page.robots.startsWith("index");
}

export function publicUrl(origin: string, path: string) {
  const base = String(origin || DEFAULT_CANONICAL_ORIGIN).replace(/\/$/, "");
  const isFile = /\.(xml|txt)$/i.test(path);
  let next = path.startsWith("/") ? path : `/${path}`;
  if (isFile) return `${base}${next.replace(/\/+$/, "")}`;
  if (next !== "/" && !next.endsWith("/")) next += "/";
  return `${base}${next === "/" ? "/" : next}`;
}
