import type { Catalog } from "@/lib/ma-api";
import { MA_GOOGLE_FORM } from "@/lib/discovery-data";
import { mediaUrl, siteHref } from "@/lib/media";
import { formatStoryDate, type Story } from "@/lib/stories";

export type HomeCatalogOptions = {
  formHref?: string;
  ctaLabel?: string;
  mapLabel?: string;
};

const HOME_STORY_SIDE = 3;

function emptyNote(text: string) {
  const p = document.createElement("p");
  p.className = "ma-empty";
  p.textContent = text;
  return p;
}

function setBusy(el: Element | null, busy: boolean) {
  if (!el) return;
  if (busy) el.setAttribute("aria-busy", "true");
  else el.removeAttribute("aria-busy");
}

function slot(name: string) {
  return document.querySelector(`[data-home-slot="${name}"]`);
}

function fillPackages(catalog: Catalog, options: HomeCatalogOptions = {}) {
  const grid = slot("packages");
  if (!grid) return;
  grid.replaceChildren();
  setBusy(grid, false);
  if (!catalog.packages.length) {
    grid.append(emptyNote("Chưa có gói trên Worker."));
    return;
  }
  for (const pack of catalog.packages) {
    const article = document.createElement("article");
    article.className = `price-card reveal visible${pack.featured ? " price-featured" : ""}`;

    const tag = document.createElement("p");
    tag.className = "price-tag";
    tag.textContent = pack.tag;

    const title = document.createElement("h3");
    title.textContent = pack.title;

    const num = document.createElement("div");
    num.className = "price-num";
    num.textContent = "Liên hệ";

    const desc = document.createElement("p");
    desc.className = "price-desc";
    desc.textContent = pack.sessions;

    const list = document.createElement("ul");
    for (const line of [pack.hold, pack.deposit]) {
      const li = document.createElement("li");
      li.textContent = line;
      list.append(li);
    }

    const cta = document.createElement("a");
    cta.href = options.formHref || MA_GOOGLE_FORM;
    cta.target = "_blank";
    cta.rel = "noopener noreferrer";
    cta.className = pack.featured ? "btn btn-primary btn-full" : "svc-link";
    cta.textContent = options.ctaLabel || "Đăng ký học";

    article.append(tag, title, num, desc, list, cta);
    grid.append(article);
  }
}

function storyLink(story: Story) {
  const a = document.createElement("a");
  a.href = siteHref(`/stories/${story.slug}/`);

  const img = document.createElement("img");
  img.src = mediaUrl(story.image);
  img.alt = story.imageAlt || story.title;
  img.loading = "lazy";
  img.decoding = "async";

  const kicker = document.createElement("p");
  kicker.className = "stories-kicker";
  kicker.textContent = story.kindLabel;

  const title = document.createElement("h3");
  title.textContent = story.title;

  const time = document.createElement("time");
  time.dateTime = story.date;
  time.textContent = formatStoryDate(story.date);

  return { a, img, kicker, title, time };
}

function fillStories(catalog: Catalog) {
  const board = slot("stories");
  if (!board) return;
  board.replaceChildren();
  setBusy(board, false);

  const [featured, ...rest] = catalog.stories;
  if (!featured) {
    board.append(emptyNote("Chưa có stories trên Worker."));
    return;
  }

  const feat = document.createElement("article");
  feat.className = "stories-feat reveal visible";
  const featParts = storyLink(featured);
  featParts.img.width = 960;
  featParts.img.height = 600;
  const copy = document.createElement("div");
  copy.className = "stories-feat__copy";
  const excerpt = document.createElement("p");
  excerpt.textContent = featured.excerpt;
  copy.append(featParts.kicker, featParts.title, excerpt, featParts.time);
  featParts.a.append(featParts.img, copy);
  feat.append(featParts.a);
  board.append(feat);

  const sideStories = rest.slice(0, HOME_STORY_SIDE);
  if (!sideStories.length) return;

  const side = document.createElement("div");
  side.className = "stories-side";
  for (const story of sideStories) {
    const row = document.createElement("article");
    row.className = "stories-row reveal visible";
    const parts = storyLink(story);
    parts.img.width = 400;
    parts.img.height = 300;
    const wrap = document.createElement("div");
    wrap.append(parts.kicker, parts.title, parts.time);
    parts.a.append(parts.img, wrap);
    row.append(parts.a);
    side.append(row);
  }
  board.append(side);
}

function mapsQuery(branch: Catalog["branches"][number]) {
  return encodeURIComponent(branch.address || branch.name);
}

function fillBranches(catalog: Catalog, options: HomeCatalogOptions = {}) {
  const grid = slot("branches");
  if (!grid) return;
  grid.replaceChildren();
  setBusy(grid, false);
  if (!catalog.branches.length) {
    grid.append(emptyNote("Chưa có chi nhánh trên Worker."));
    return;
  }
  for (const branch of catalog.branches) {
    const q = mapsQuery(branch);
    const article = document.createElement("article");
    article.className = "br-card reveal visible";

    const map = document.createElement("div");
    map.className = "br-map";
    const iframe = document.createElement("iframe");
    iframe.title = branch.name;
    iframe.loading = "lazy";
    iframe.referrerPolicy = "no-referrer-when-downgrade";
    iframe.allowFullscreen = true;
    iframe.src = `https://maps.google.com/maps?q=${q}&z=16&hl=vi&output=embed`;
    map.append(iframe);

    const title = document.createElement("h3");
    title.textContent = branch.name;

    const addr = document.createElement("p");
    addr.textContent = branch.address;

    article.append(map, title, addr);
    if (branch.note) {
      const note = document.createElement("p");
      note.className = "br-meta";
      note.textContent = branch.note;
      article.append(note);
    }

    const link = document.createElement("a");
    link.href = `https://www.google.com/maps/search/?api=1&query=${q}`;
    link.className = "svc-link";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = options.mapLabel || "Mở Maps →";
    article.append(link);
    grid.append(article);
  }
}

export function hydrateHomeFromCatalog(catalog: Catalog, options: HomeCatalogOptions = {}) {
  fillPackages(catalog, options);
  fillStories(catalog);
  fillBranches(catalog, options);
}

export function showHomeCatalogError() {
  for (const name of ["packages", "stories", "branches"]) {
    const el = slot(name);
    if (!el) continue;
    el.replaceChildren();
    setBusy(el, false);
    el.append(emptyNote("Không tải được catalog từ Worker."));
  }
}
