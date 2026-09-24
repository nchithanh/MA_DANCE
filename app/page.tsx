import { readFileSync } from "node:fs";
import { join } from "node:path";
import { MaDanceHome } from "@/components/MaDanceHome";

/** Prefix relative public assets so GitHub Pages basePath resolves correctly. */
function withBasePath(html: string): string {
  const base = process.env.GITHUB_PAGES === "true" ? "/MA_DANCE" : "";
  if (!base) return html;
  return html.replace(
    /\b(src|href)="(?!https?:|\/\/|#|mailto:|tel:)([^"]+)"/g,
    (_m, attr: string, path: string) =>
      `${attr}="${base}/${path.replace(/^\//, "")}"`,
  );
}

export default function HomePage() {
  const html = withBasePath(
    readFileSync(join(process.cwd(), "content", "body.html"), "utf8"),
  );
  return <MaDanceHome html={html} />;
}
