/** Internal route — respects GitHub Pages `/MA_DANCE`. */
export function siteHref(path: string) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${base}${clean}`;
}

/** Public media URL — respects GitHub Pages `/MA_DANCE`. Worker/R2 URLs pass through. */
export function mediaUrl(file: string) {
  const raw = String(file || "").trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const name = raw.replace(/^\/?(media\/)?/, "");
  return `${base}/media/${name}`;
}

/** Public asset under site root (`media/…`, `partners/…`, `logo.png`). */
export function assetUrl(path: string) {
  const raw = String(path || "").trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return `${base}/${raw.replace(/^\//, "")}`;
}

/** Admin / catalog preview — bare file (`studio-01.jpg`) = `/media/…`; path có `/` = asset; http = giữ nguyên. */
export function previewUrl(path: string) {
  const raw = String(path || "").trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  if (!raw.includes("/")) return mediaUrl(raw);
  return assetUrl(raw);
}
