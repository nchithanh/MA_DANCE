import type { Metadata } from "next";
import { fetchSeo } from "@/lib/ma-api";
import { metadataForPath } from "@/lib/seo";
import type { SeoPage } from "@/lib/seo-data";

export async function routeMetadata(path: string, fallback?: Partial<SeoPage>): Promise<Metadata> {
  const seo = await fetchSeo();
  return metadataForPath(seo, path, fallback);
}
