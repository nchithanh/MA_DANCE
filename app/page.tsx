import { MaDanceHome } from "@/components/MaDanceHome";
import { routeMetadata } from "@/lib/route-seo";
import { loadHomeHtml } from "@/lib/site-html";

export async function generateMetadata() {
  return routeMetadata("/");
}

export default function HomePage() {
  return <MaDanceHome html={loadHomeHtml()} />;
}
