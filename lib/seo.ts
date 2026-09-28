import type { Metadata } from "next";
import {
  isIndexable,
  parseSeo,
  publicUrl,
  type SeoDoc,
  type SeoPage,
  type SeoRobots,
} from "@/lib/seo-data";

function robotsMeta(robots: SeoRobots, noindexSite: boolean): Metadata["robots"] {
  if (noindexSite) return { index: false, follow: false };
  if (robots === "noindex,nofollow") return { index: false, follow: false };
  if (robots === "noindex,follow") return { index: false, follow: true };
  return { index: true, follow: true };
}

export function metadataForPath(
  seo: SeoDoc,
  path: string,
  fallback?: Partial<SeoPage>,
): Metadata {
  const page = seo.pages[path] || fallback;
  const title = page?.title || seo.site.defaultTitle;
  const description = page?.description || seo.site.defaultDescription;
  const canonical = page?.canonical || publicUrl(seo.site.canonicalOrigin, path);
  const og = page?.ogImage || seo.site.ogImage;
  const ogAbs = og
    ? /^https?:\/\//i.test(og)
      ? og
      : publicUrl(seo.site.canonicalOrigin, `/${og.replace(/^\//, "")}`)
    : undefined;
  const robots = robotsMeta(page?.robots || "index,follow", seo.site.noindexSite);
  return {
    title,
    description,
    alternates: { canonical },
    robots,
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: seo.site.name,
      images: ogAbs ? [{ url: ogAbs }] : undefined,
      type: "website",
      locale: "vi_VN",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: seo.site.twitter || undefined,
    },
    verification: {
      google: seo.site.googleVerify || undefined,
      other: seo.site.bingVerify ? { "msvalidate.01": seo.site.bingVerify } : undefined,
    },
  };
}

export function websiteJsonLd(seo: SeoDoc) {
  const url = `${seo.site.canonicalOrigin}/`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: seo.site.name,
        url,
        description: seo.site.defaultDescription,
        inLanguage: "vi",
      },
      {
        "@type": "Organization",
        name: seo.site.name,
        url,
      },
    ],
  };
}

export { parseSeo, isIndexable };
