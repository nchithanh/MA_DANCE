import { MaDanceHome } from "@/components/MaDanceHome";
import { loadHomeHtml } from "@/lib/site-html";

export default function HomePage() {
  return <MaDanceHome html={loadHomeHtml()} />;
}
