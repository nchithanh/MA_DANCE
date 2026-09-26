/** Internal route — respects GitHub Pages `/MA_DANCE`. */
export function siteHref(path: string) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${base}${clean}`;
}

/** Public media URL — respects GitHub Pages `/MA_DANCE`. */
export function mediaUrl(file: string) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const name = file.replace(/^\/?(media\/)?/, "");
  return `${base}/media/${name}`;
}
