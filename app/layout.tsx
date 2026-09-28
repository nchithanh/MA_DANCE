import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import { fetchSeo } from "@/lib/ma-api";
import { metadataForPath, websiteJsonLd } from "@/lib/seo";
import "./ma-dance.css";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-be-vietnam",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const seo = await fetchSeo();
    return {
      ...metadataForPath(seo, "/"),
      metadataBase: new URL(`${seo.site.canonicalOrigin}/`),
    };
  } catch {
    return {
      title: "MA Dance Studio — Khóa tháng · Thuê phòng · Biên đạo",
      description:
        "MA Dance Studio — đăng ký khóa 8 buổi/tháng, thuê phòng 3 chi nhánh, biên đạo sự kiện. Form giữ chỗ · xác nhận Zalo.",
    };
  }
}

const logoHref = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/logo.png`;

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  let jsonLd = null;
  try {
    jsonLd = websiteJsonLd(await fetchSeo());
  } catch {
    jsonLd = null;
  }
  return (
    <html lang="vi" className={beVietnam.variable}>
      <body className={beVietnam.className}>
        <style
          dangerouslySetInnerHTML={{
            __html: `:root{--ma-logo:url("${logoHref}")}`,
          }}
        />
        {jsonLd ? (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        ) : null}
        {children}
      </body>
    </html>
  );
}
