import { readFileSync } from "node:fs";
import { join } from "node:path";

export function withBasePath(html: string): string {
  const base = process.env.GITHUB_PAGES === "true" ? "/MA_DANCE" : "";
  if (!base) return html;
  return html.replace(
    /\b(src|href)="(?!https?:|\/\/|#|mailto:|tel:)([^"]+)"/g,
    (_m, attr: string, path: string) =>
      `${attr}="${base}/${path.replace(/^\//, "")}"`,
  );
}

function readContent(file: string): string {
  return withBasePath(readFileSync(join(process.cwd(), "content", file), "utf8"));
}

export function loadChromeHtml(): string {
  return readContent("chrome.html");
}

export function loadFooterHtml(): string {
  return readContent("footer.html");
}

export function loadHomeHtml(): string {
  return readContent("body.html"); // homepage + MMusic type scale 2026-09-25b
}
