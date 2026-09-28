import { type Homepage, pickI18n } from "@/lib/homepage-data";
import { assetUrl, siteHref } from "@/lib/media";

function emptyNote(text: string) {
  const p = document.createElement("p");
  p.className = "ma-empty";
  p.textContent = text;
  return p;
}

function slot(name: string) {
  return document.querySelector(`[data-home-slot="${name}"]`);
}

function setBusy(el: Element | null, busy: boolean) {
  if (!el) return;
  if (busy) el.setAttribute("aria-busy", "true");
  else el.removeAttribute("aria-busy");
}

function text(el: Element | null, value: string) {
  if (el) el.textContent = value;
}

function href(el: HTMLAnchorElement | null, value: string) {
  if (!el) return;
  el.href = value.startsWith("/") ? siteHref(value) : value;
}

function youtubeSrc(id: string) {
  const vid = id.replace(/[^a-zA-Z0-9_-]/g, "");
  return `https://www.youtube.com/embed/${vid}?autoplay=1&mute=1&loop=1&playlist=${vid}&controls=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`;
}

function fillHero(home: Homepage, lang: string) {
  const video = document.getElementById("heroVideo") as HTMLIFrameElement | null;
  if (video && home.hero.videoId) video.src = youtubeSrc(home.hero.videoId);
  const box = slot("hero");
  if (!box) return;
  box.replaceChildren();
  setBusy(box, false);

  const logo = document.createElement("div");
  logo.className = "hero-logo";
  const img = document.createElement("img");
  img.src = assetUrl("logo.png");
  img.alt = "MA";
  const tag = document.createElement("span");
  tag.className = "logo-tag";
  tag.textContent = "DANCE STUDIO";
  logo.append(img, tag);

  const title = document.createElement("h1");
  title.className = "hero-title";
  const l1 = document.createElement("span");
  l1.textContent = pickI18n(home.hero.line1, lang);
  const l2 = document.createElement("span");
  l2.className = "hero-line2";
  l2.textContent = pickI18n(home.hero.line2, lang);
  title.append(l1, l2);

  const actions = document.createElement("div");
  actions.className = "hero-actions";
  const cta1 = document.createElement("a");
  cta1.className = "btn btn-primary";
  cta1.href = home.formHref;
  cta1.target = "_blank";
  cta1.rel = "noopener noreferrer";
  cta1.textContent = pickI18n(home.hero.cta1, lang);
  const cta2 = document.createElement("a");
  cta2.className = "btn btn-ghost";
  cta2.href = siteHref("/rooms/");
  cta2.textContent = pickI18n(home.hero.ctaRoom, lang);
  actions.append(cta1, cta2);
  box.append(logo, title, actions);

  const scroll = document.querySelector(".scroll-hint span");
  text(scroll, pickI18n(home.hero.scroll, lang));
}

function fillAbout(home: Homepage, lang: string) {
  const box = slot("about");
  if (!box) return;
  box.replaceChildren();
  setBusy(box, false);

  const est = document.createElement("p");
  est.className = "about-est reveal visible";
  est.textContent = pickI18n(home.about.est, lang);

  const title = document.createElement("h2");
  title.id = "about-heading";
  title.className = "impact__title reveal visible";
  title.textContent = pickI18n(home.about.title, lang);

  const sub = document.createElement("p");
  sub.className = "impact__sub reveal visible";
  sub.textContent = pickI18n(home.about.sub, lang);

  const nav = document.createElement("nav");
  nav.className = "impact-chips reveal visible";
  nav.setAttribute("aria-label", pickI18n(home.about.sub, lang));
  const chips = [
    { href: home.formHref, label: pickI18n(home.hero.cta1, lang), ext: true },
    { href: siteHref("/rooms/"), label: pickI18n(home.hero.ctaRoom, lang), ext: false },
    { href: siteHref("/events/"), label: "Biên đạo", ext: false },
  ];
  for (const chip of chips) {
    const a = document.createElement("a");
    a.className = "impact-chip";
    a.href = chip.href;
    if (chip.ext) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
    const span = document.createElement("span");
    span.textContent = chip.label;
    const arrow = document.createElement("span");
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "→";
    a.append(span, arrow);
    nav.append(a);
  }
  box.append(est, title, sub, nav);

  const grid = document.getElementById("impact");
  if (grid) {
    grid.replaceChildren();
    for (const item of home.about.impact) {
      const wrap = document.createElement("div");
      wrap.className = "impact-item reveal visible";
      const strong = document.createElement("strong");
      strong.textContent = item.value.trim() || "—";
      const span = document.createElement("span");
      span.textContent = pickI18n(item.label, lang);
      wrap.append(strong, span);
      grid.append(wrap);
    }
  }

  const group = document.querySelector(".marquee--impact .marquee-group");
  if (group) {
    group.replaceChildren();
    for (const word of home.about.marquee) {
      const span = document.createElement("span");
      span.textContent = word;
      const dot = document.createElement("span");
      dot.textContent = "·";
      group.append(span, dot);
    }
    document.querySelectorAll(".marquee--impact .marquee-group[aria-hidden]").forEach((clone) => {
      clone.replaceChildren();
      clone.append(...[...group.childNodes].map((node) => node.cloneNode(true)));
    });
  }
}

function fillPartner(home: Homepage, lang: string) {
  const box = slot("partner");
  if (!box) return;
  box.replaceChildren();
  setBusy(box, false);
  const p = home.partner;
  box.innerHTML = "";
  const copy = document.createElement("div");
  copy.className = "partner__copy reveal visible";
  const label = document.createElement("p");
  label.className = "label partner__label";
  label.textContent = pickI18n(p.label, lang);
  const title = document.createElement("h2");
  title.id = "partner-heading";
  title.textContent = pickI18n(p.title, lang);
  const body = document.createElement("div");
  body.className = "partner__body";
  for (const para of [p.p1, p.p2, p.p3]) {
    const el = document.createElement("p");
    el.textContent = pickI18n(para, lang);
    body.append(el);
  }
  const actions = document.createElement("div");
  actions.className = "partner__actions";
  const cta = document.createElement("a");
  cta.className = "btn btn-primary";
  cta.href = p.href;
  cta.target = "_blank";
  cta.rel = "noopener noreferrer";
  cta.textContent = pickI18n(p.cta, lang);
  const cta2 = document.createElement("a");
  cta2.className = "btn btn-ghost";
  cta2.href = home.formHref;
  cta2.target = "_blank";
  cta2.rel = "noopener noreferrer";
  cta2.textContent = pickI18n(p.cta2, lang);
  actions.append(cta, cta2);
  copy.append(label, title, body, actions);

  const visual = document.createElement("div");
  visual.className = "partner__visual reveal visible";
  const img = document.createElement("img");
  img.src = assetUrl(p.image);
  img.alt = p.imageAlt;
  img.width = 480;
  img.height = 480;
  visual.append(img);
  box.append(copy, visual);
}

function fillClients(home: Homepage, lang: string) {
  const head = slot("clients-head");
  if (head) {
    head.replaceChildren();
    setBusy(head, false);
    const label = document.createElement("p");
    label.className = "label";
    label.textContent = pickI18n(home.clients.label, lang);
    const title = document.createElement("h2");
    title.id = "clients-heading";
    title.textContent = pickI18n(home.clients.title, lang);
    const sub = document.createElement("p");
    sub.className = "section-sub";
    sub.textContent = pickI18n(home.clients.sub, lang);
    head.append(label, title, sub);
  }
  const track = slot("clients");
  if (!track) return;
  track.replaceChildren();
  setBusy(track, false);
  if (!home.clients.logos.length) {
    track.append(emptyNote("Chưa có logo đối tác."));
    return;
  }
  function group(hidden: boolean) {
    const wrap = document.createElement("div");
    wrap.className = "clients-group";
    if (hidden) wrap.setAttribute("aria-hidden", "true");
    for (const logo of home.clients.logos) {
      const span = document.createElement("span");
      span.className = logo.screen ? "clients-logo clients-logo--screen" : "clients-logo";
      const img = document.createElement("img");
      img.src = assetUrl(logo.src);
      img.alt = hidden ? "" : logo.alt;
      img.decoding = "async";
      span.append(img);
      wrap.append(span);
    }
    return wrap;
  }
  track.append(group(false), group(true));
}

function fillMilestones(home: Homepage, lang: string) {
  const box = slot("milestones");
  if (!box) return;
  box.replaceChildren();
  setBusy(box, false);
  const head = document.createElement("div");
  head.className = "section-head milestones__head reveal visible";
  const label = document.createElement("p");
  label.className = "label";
  label.textContent = pickI18n(home.milestones.label, lang);
  const title = document.createElement("h2");
  title.id = "milestones-heading";
  title.textContent = pickI18n(home.milestones.title, lang);
  const sub = document.createElement("p");
  sub.className = "section-sub";
  sub.textContent = pickI18n(home.milestones.sub, lang);
  head.append(label, title, sub);

  const bento = document.createElement("div");
  bento.className = "ms-bento";
  home.milestones.items.forEach((item, i) => {
    const article = document.createElement("article");
    article.className = `ms-tile reveal visible${i === 0 ? " ms-tile--feature" : ""}${item.badgeSrc ? " ms-tile--partner" : ""}`;
    const img = document.createElement("img");
    img.className = "ms-tile__img is-loaded";
    img.src = assetUrl(item.image);
    img.alt = item.alt;
    img.loading = "lazy";
    img.decoding = "async";
    const shade = document.createElement("div");
    shade.className = "ms-tile__shade";
    shade.setAttribute("aria-hidden", "true");
    article.append(img, shade);
    if (item.badgeSrc) {
      const badge = document.createElement("div");
      badge.className = "ms-tile__badge";
      badge.setAttribute("aria-hidden", "true");
      const bImg = document.createElement("img");
      bImg.src = assetUrl(item.badgeSrc);
      bImg.alt = "";
      bImg.width = 40;
      bImg.height = 40;
      const bSpan = document.createElement("span");
      bSpan.textContent = item.badgeLabel || "";
      badge.append(bImg, bSpan);
      article.append(badge);
    }
    const body = document.createElement("div");
    body.className = "ms-tile__body";
    const num = document.createElement("span");
    num.className = "ms-tile__num";
    num.setAttribute("aria-hidden", "true");
    num.textContent = String(i + 1).padStart(2, "0");
    const h3 = document.createElement("h3");
    h3.textContent = pickI18n(item.title, lang);
    const p = document.createElement("p");
    p.textContent = pickI18n(item.desc, lang);
    body.append(num, h3, p);
    article.append(body);
    bento.append(article);
  });
  box.append(head, bento);
}

function fillServices(home: Homepage, lang: string) {
  const box = slot("services");
  if (!box) return;
  box.replaceChildren();
  setBusy(box, false);
  const head = document.createElement("div");
  head.className = "section-head reveal visible";
  const label = document.createElement("p");
  label.className = "label";
  label.textContent = pickI18n(home.services.label, lang);
  const title = document.createElement("h2");
  title.textContent = pickI18n(home.services.title, lang);
  head.append(label, title);
  const stack = document.createElement("div");
  stack.className = "svc-stack";
  home.services.items.forEach((item, i) => {
    const article = document.createElement("article");
    article.className = `svc-card svc-split reveal visible${i === 1 ? " svc-split--rev" : ""}`;
    const media = document.createElement("div");
    media.className = "svc-media";
    const img = document.createElement("img");
    img.src = assetUrl(item.image);
    img.alt = item.alt;
    img.className = "is-loaded";
    img.loading = "lazy";
    img.decoding = "async";
    media.append(img);
    const body = document.createElement("div");
    body.className = "svc-body";
    const num = document.createElement("span");
    num.className = "svc-num";
    num.textContent = String(i + 1).padStart(2, "0");
    const h3 = document.createElement("h3");
    h3.textContent = pickI18n(item.title, lang);
    const p = document.createElement("p");
    p.textContent = pickI18n(item.desc, lang);
    const a = document.createElement("a");
    a.className = "svc-link";
    href(a, item.href);
    a.textContent = pickI18n(item.link, lang);
    body.append(num, h3, p, a);
    article.append(media, body);
    stack.append(article);
  });
  box.append(head, stack);
}

function fillStyles(home: Homepage, lang: string) {
  const box = slot("styles");
  if (!box) return;
  box.replaceChildren();
  setBusy(box, false);
  const head = document.createElement("div");
  head.className = "section-head reveal visible";
  const label = document.createElement("p");
  label.className = "label";
  label.textContent = pickI18n(home.styles.label, lang);
  const title = document.createElement("h2");
  title.textContent = pickI18n(home.styles.title, lang);
  const sub = document.createElement("p");
  sub.className = "section-sub";
  sub.textContent = pickI18n(home.styles.sub, lang);
  head.append(label, title, sub);
  const grid = document.createElement("div");
  grid.className = "styles-grid";
  for (const item of home.styles.items) {
    const a = document.createElement("a");
    a.href = siteHref("/classes/");
    a.className = "style-card reveal visible";
    const img = document.createElement("img");
    img.src = assetUrl(item.image);
    img.alt = item.name;
    img.className = "is-loaded";
    img.loading = "lazy";
    img.decoding = "async";
    const span = document.createElement("span");
    span.textContent = item.name;
    a.append(img, span);
    grid.append(a);
  }
  box.append(head, grid);
}

function fillClasses(home: Homepage, lang: string) {
  const head = slot("classes-head");
  if (head) {
    head.replaceChildren();
    setBusy(head, false);
    const label = document.createElement("p");
    label.className = "label";
    label.textContent = pickI18n(home.classes.label, lang);
    const title = document.createElement("h2");
    title.textContent = pickI18n(home.classes.title, lang);
    const hint = document.createElement("p");
    hint.className = "hscroll-hint";
    hint.textContent = pickI18n(home.classes.hint, lang);
    head.append(label, title, hint);
  }
  const track = slot("classes");
  if (!track) return;
  track.replaceChildren();
  setBusy(track, false);
  for (const item of home.classes.items) {
    const article = document.createElement("article");
    article.className = item.cta ? "hscroll-card hscroll-card-cta" : "hscroll-card";
    if (!item.cta && item.tag) {
      const tag = document.createElement("span");
      tag.className = "htag";
      tag.textContent = item.tag;
      article.append(tag);
    }
    const h3 = document.createElement("h3");
    h3.textContent = pickI18n(item.title, lang);
    const p = document.createElement("p");
    p.textContent = pickI18n(item.desc, lang);
    article.append(h3, p);
    if (!item.cta) {
      const ul = document.createElement("ul");
      const li1 = document.createElement("li");
      li1.textContent = pickI18n(item.meta, lang);
      const li2 = document.createElement("li");
      li2.textContent = pickI18n(item.extra, lang);
      ul.append(li1, li2);
      article.append(ul);
    }
    const a = document.createElement("a");
    href(a, item.href);
    if (item.href.startsWith("http")) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
    a.className = item.cta ? "btn btn-primary btn-sm" : "svc-link";
    a.textContent = pickI18n(item.link, lang);
    article.append(a);
    track.append(article);
  }
}

function fillInstructors(home: Homepage, lang: string) {
  const head = slot("instructors-head");
  if (head) {
    head.replaceChildren();
    setBusy(head, false);
    const label = document.createElement("p");
    label.className = "label";
    label.textContent = pickI18n(home.instructors.label, lang);
    const title = document.createElement("h2");
    title.textContent = pickI18n(home.instructors.title, lang);
    head.append(label, title);
  }
  const track = slot("instructors");
  if (!track) return;
  track.replaceChildren();
  setBusy(track, false);
  const row = document.createElement("div");
  row.className = "snap-track";
  for (const item of home.instructors.items) {
    const article = document.createElement("article");
    article.className = "inst-card";
    const photo = document.createElement("div");
    photo.className = "inst-photo";
    const img = document.createElement("img");
    img.className = "inst-img is-loaded";
    img.src = assetUrl(item.image);
    img.alt = item.name;
    img.loading = "lazy";
    img.decoding = "async";
    const overlay = document.createElement("div");
    overlay.className = "inst-overlay";
    const ov = document.createElement("span");
    ov.textContent = item.overlay;
    overlay.append(ov);
    photo.append(img, overlay);
    const info = document.createElement("div");
    info.className = "inst-info";
    const h3 = document.createElement("h3");
    h3.textContent = item.name;
    const role = document.createElement("p");
    role.textContent = pickI18n(
      item.role === "inst" ? home.instructors.roleInst : home.instructors.roleChoreo,
      lang,
    );
    const bio = document.createElement("p");
    bio.className = "inst-bio";
    bio.textContent = pickI18n(item.bio, lang);
    info.append(h3, role, bio);
    article.append(photo, info);
    row.append(article);
  }
  track.append(row);
}

function fillSectionHead(
  name: string,
  label: string,
  title: string,
  sub?: string,
  headingId?: string,
) {
  const box = slot(name);
  if (!box) return;
  box.replaceChildren();
  setBusy(box, false);
  const p = document.createElement("p");
  p.className = "label";
  p.textContent = label;
  const h2 = document.createElement("h2");
  if (headingId) h2.id = headingId;
  h2.textContent = title;
  box.append(p, h2);
  if (sub) {
    const s = document.createElement("p");
    s.className = "section-sub";
    s.textContent = sub;
    box.append(s);
  }
}

function fillGallery(home: Homepage, lang: string) {
  fillSectionHead(
    "gallery-head",
    pickI18n(home.gallery.label, lang),
    pickI18n(home.gallery.title, lang),
    pickI18n(home.gallery.sub, lang),
  );
  const ctaWrap = slot("gallery-cta");
  if (ctaWrap) {
    ctaWrap.replaceChildren();
    const a = document.createElement("a");
    a.href = siteHref("/rooms/");
    a.className = "btn btn-primary";
    a.textContent = pickI18n(home.gallery.cta, lang);
    ctaWrap.append(a);
  }
  const track = slot("gallery");
  if (!track) return;
  track.replaceChildren();
  setBusy(track, false);
  home.gallery.items.forEach((item, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "gal-item";
    const frame = document.createElement("div");
    frame.className = "gal-frame";
    const img = document.createElement("img");
    img.className = "gal-img is-loaded";
    img.src = assetUrl(item.src);
    img.alt = item.alt;
    img.loading = "lazy";
    img.decoding = "async";
    frame.append(img);
    if (i === 0) {
      const hint = document.createElement("span");
      hint.className = "gal-tap-hint";
      hint.id = "galTapHint";
      hint.setAttribute("aria-hidden", "true");
      hint.innerHTML =
        '<span class="gal-tap-hint__ripple"></span><em class="gal-tap-hint__label"></em>';
      const em = hint.querySelector("em");
      if (em) em.textContent = pickI18n(home.gallery.hint, lang);
      frame.append(hint);
    }
    const cap = document.createElement("span");
    cap.textContent = item.caption;
    btn.append(frame, cap);
    track.append(btn);
  });
}

function fillLive(home: Homepage, lang: string) {
  const box = slot("live");
  if (!box) return;
  box.replaceChildren();
  setBusy(box, false);
  const head = document.createElement("div");
  head.className = "section-head reveal visible";
  const label = document.createElement("p");
  label.className = "label";
  label.textContent = pickI18n(home.live.label, lang);
  const title = document.createElement("h2");
  title.id = "live-heading";
  title.textContent = pickI18n(home.live.title, lang);
  const sub = document.createElement("p");
  sub.className = "section-sub";
  sub.textContent = pickI18n(home.live.sub, lang);
  head.append(label, title, sub);

  const board = document.createElement("div");
  board.className = "live-board";
  const now = document.createElement("article");
  now.className = "live-now reveal visible";
  const nowA = document.createElement("a");
  nowA.className = "live-now__link";
  nowA.href = home.live.now.href;
  nowA.target = "_blank";
  nowA.rel = "noopener noreferrer";
  const nowImg = document.createElement("img");
  nowImg.src = assetUrl(home.live.now.image);
  nowImg.alt = home.live.now.alt;
  nowImg.width = 960;
  nowImg.height = 600;
  nowImg.loading = "lazy";
  nowImg.decoding = "async";
  const nowCopy = document.createElement("div");
  nowCopy.className = "live-now__copy";
  const badge = document.createElement("p");
  badge.className = "live-now__badge";
  badge.textContent = pickI18n(home.live.now.badge, lang);
  const nowH = document.createElement("h3");
  nowH.textContent = pickI18n(home.live.now.title, lang);
  const nowD = document.createElement("p");
  nowD.textContent = pickI18n(home.live.now.desc, lang);
  nowCopy.append(badge, nowH, nowD);
  nowA.append(nowImg, nowCopy);
  now.append(nowA);

  const side = document.createElement("div");
  side.className = "live-side";
  const sched = document.createElement("p");
  sched.className = "live-sched__label";
  sched.textContent = pickI18n(home.live.sched, lang);
  const list = document.createElement("div");
  list.className = "live-sched";
  for (const slotItem of home.live.slots) {
    const article = document.createElement("article");
    article.className = "live-card reveal visible";
    const a = document.createElement("a");
    a.href = slotItem.href;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    const img = document.createElement("img");
    img.src = assetUrl(slotItem.image);
    img.alt = slotItem.alt;
    img.width = 640;
    img.height = 480;
    img.loading = "lazy";
    img.decoding = "async";
    const copy = document.createElement("div");
    copy.className = "live-card__copy";
    const when = document.createElement("p");
    when.className = "live-card__when";
    when.textContent = pickI18n(slotItem.when, lang);
    const h3 = document.createElement("h3");
    h3.textContent = pickI18n(slotItem.title, lang);
    const d = document.createElement("p");
    d.textContent = pickI18n(slotItem.desc, lang);
    copy.append(when, h3, d);
    a.append(img, copy);
    article.append(a);
    list.append(article);
  }
  side.append(sched, list);
  board.append(now, side);
  box.append(head, board);
}

function fillFaq(home: Homepage, lang: string) {
  const box = slot("faq");
  if (!box) return;
  box.replaceChildren();
  setBusy(box, false);
  const head = document.createElement("div");
  head.className = "section-head reveal visible";
  const label = document.createElement("p");
  label.className = "label";
  label.textContent = pickI18n(home.faq.label, lang);
  const title = document.createElement("h2");
  title.textContent = pickI18n(home.faq.title, lang);
  head.append(label, title);
  const list = document.createElement("div");
  list.className = "faq-list";
  for (const item of home.faq.items) {
    const details = document.createElement("details");
    details.className = "faq-item reveal visible";
    const summary = document.createElement("summary");
    summary.textContent = pickI18n(item.q, lang);
    const p = document.createElement("p");
    p.textContent = pickI18n(item.a, lang);
    details.append(summary, p);
    list.append(details);
  }
  box.append(head, list);
}

function fillBanner(home: Homepage, lang: string) {
  const box = slot("banner");
  if (!box) return;
  box.replaceChildren();
  setBusy(box, false);
  const inner = document.createElement("div");
  inner.className = "banner-inner reveal visible";
  const h2 = document.createElement("h2");
  h2.textContent = pickI18n(home.banner.title, lang);
  const p = document.createElement("p");
  p.textContent = pickI18n(home.banner.sub, lang);
  const a = document.createElement("a");
  a.className = "btn btn-primary btn-lg";
  a.href = home.banner.href || home.formHref;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.textContent = pickI18n(home.banner.cta, lang);
  inner.append(h2, p, a);
  box.append(inner);
}

function fillContact(home: Homepage, lang: string) {
  const box = slot("contact");
  if (!box) return;
  box.replaceChildren();
  setBusy(box, false);
  const c = home.contact;
  const info = document.createElement("div");
  info.className = "contact-info reveal visible";
  const label = document.createElement("p");
  label.className = "label";
  label.textContent = pickI18n(c.label, lang);
  const title = document.createElement("h2");
  title.className = "display-xl";
  title.textContent = pickI18n(c.title, lang);
  const desc = document.createElement("p");
  desc.className = "contact-desc";
  desc.textContent = pickI18n(c.desc, lang);
  const details = document.createElement("details");
  details.className = "contact-box";
  details.id = "contactBox";
  const summary = document.createElement("summary");
  summary.className = "contact-box__summary";
  const sumSpan = document.createElement("span");
  sumSpan.textContent = pickI18n(c.box, lang);
  summary.append(sumSpan);
  const ul = document.createElement("ul");
  ul.className = "contact-list";
  const rows: [string, Node][] = [
    [pickI18n(c.addressLabel, lang), document.createTextNode(pickI18n(c.addressVal, lang))],
    [
      pickI18n(c.phoneLabel, lang),
      Object.assign(document.createElement("a"), { href: c.phoneHref, textContent: c.phone }),
    ],
    [
      pickI18n(c.socialLabel, lang),
      Object.assign(document.createElement("a"), {
        href: c.facebookHref,
        textContent: c.facebook,
        target: "_blank",
        rel: "noopener noreferrer",
      }),
    ],
    [pickI18n(c.hoursLabel, lang), document.createTextNode(pickI18n(c.hoursVal, lang))],
  ];
  for (const [lab, value] of rows) {
    const li = document.createElement("li");
    const labEl = document.createElement("span");
    labEl.className = "ct-label";
    labEl.textContent = lab;
    li.append(labEl, value);
    ul.append(li);
  }
  details.append(summary, ul);
  const socials = document.createElement("div");
  socials.className = "socials";
  for (const [hrefVal, labelVal] of [
    [c.zalo, "Zalo"],
    [c.tiktok, "TT"],
    [c.youtube, "YT"],
    [c.facebookHref, "FB"],
  ] as const) {
    const a = document.createElement("a");
    a.href = hrefVal;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = labelVal;
    socials.append(a);
  }
  info.append(label, title, desc, details, socials);

  const form = document.createElement("div");
  form.className = "contact-form ed-form reveal visible";
  const lead = document.createElement("p");
  lead.className = "contact-form__lead";
  lead.textContent = pickI18n(c.formLead, lang);
  const send = document.createElement("a");
  send.href = home.formHref;
  send.className = "btn btn-primary btn-full";
  send.target = "_blank";
  send.rel = "noopener noreferrer";
  send.textContent = pickI18n(c.send, lang);
  form.append(lead, send);
  box.append(info, form);
}

function fillCatalogHeads(home: Homepage, lang: string) {
  fillSectionHead(
    "pricing-head",
    pickI18n(home.pricing.label, lang),
    pickI18n(home.pricing.title, lang),
    pickI18n(home.pricing.note, lang),
  );
  const more = slot("pricing-more");
  if (more) {
    more.replaceChildren();
    const a = document.createElement("a");
    a.href = siteHref("/packages/");
    a.className = "svc-link";
    a.textContent = pickI18n(home.pricing.more, lang);
    more.append(a);
  }
  fillSectionHead(
    "stories-head",
    pickI18n(home.storiesHead.label, lang),
    pickI18n(home.storiesHead.title, lang),
    pickI18n(home.storiesHead.sub, lang),
    "stories-heading",
  );
  const storiesMore = slot("stories-more");
  if (storiesMore) {
    storiesMore.replaceChildren();
    const a = document.createElement("a");
    a.href = siteHref("/stories/");
    a.className = "svc-link";
    a.textContent = pickI18n(home.storiesHead.all, lang);
    storiesMore.append(a);
  }
  fillSectionHead(
    "branches-head",
    pickI18n(home.branchesHead.label, lang),
    pickI18n(home.branchesHead.title, lang),
  );
}

export function hydrateHomepage(home: Homepage, lang: string) {
  fillHero(home, lang);
  fillAbout(home, lang);
  fillPartner(home, lang);
  fillClients(home, lang);
  fillMilestones(home, lang);
  fillServices(home, lang);
  fillStyles(home, lang);
  fillClasses(home, lang);
  fillInstructors(home, lang);
  fillCatalogHeads(home, lang);
  fillGallery(home, lang);
  fillLive(home, lang);
  fillFaq(home, lang);
  fillBanner(home, lang);
  fillContact(home, lang);
}

export function showHomepageError() {
  const names = [
    "hero",
    "about",
    "partner",
    "clients-head",
    "clients",
    "milestones",
    "services",
    "styles",
    "classes-head",
    "classes",
    "instructors-head",
    "instructors",
    "pricing-head",
    "gallery-head",
    "gallery",
    "live",
    "stories-head",
    "branches-head",
    "faq",
    "banner",
    "contact",
  ];
  for (const name of names) {
    const el = slot(name);
    if (!el) continue;
    el.replaceChildren();
    setBusy(el, false);
    el.append(emptyNote("Không tải được homepage từ Worker."));
  }
}
