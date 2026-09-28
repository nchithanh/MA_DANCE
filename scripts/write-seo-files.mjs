#!/usr/bin/env node
/**
 * Copy live Worker sitemap index + robots into public/ for GitHub Pages.
 */
const API = (process.env.NEXT_PUBLIC_MA_API_URL || "https://ma-website.nchithanh9999.workers.dev").replace(
  /\/$/,
  "",
);
const files = ["sitemap.xml", "sitemap-pages.xml", "sitemap-stories.xml", "robots.txt"];

async function main() {
  const { mkdir, writeFile } = await import("node:fs/promises");
  const { dirname, join } = await import("node:path");
  const { fileURLToPath } = await import("node:url");
  const root = join(dirname(fileURLToPath(import.meta.url)), "..");
  const publicDir = join(root, "public");
  await mkdir(publicDir, { recursive: true });
  for (const name of files) {
    const res = await fetch(`${API}/${name}`);
    if (!res.ok) {
      throw new Error(`${name} ${res.status} from ${API}`);
    }
    const body = await res.text();
    await writeFile(join(publicDir, name), body);
    console.log(`wrote public/${name} (${body.length} bytes)`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
