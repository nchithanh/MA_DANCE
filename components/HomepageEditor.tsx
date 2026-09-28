"use client";

import type { ReactNode } from "react";
import type { AdminOverlayState } from "@/components/AdminOverlay";
import { ImageField } from "@/components/ImageField";
import {
  emptyI18n,
  HOME_LOCALES,
  type HomeLocale,
  type Homepage,
  type I18nText,
} from "@/lib/homepage-data";

type CatalogTab = "packages" | "stories" | "branches";

type Props = {
  home: Homepage;
  lang: HomeLocale;
  onLang: (lang: HomeLocale) => void;
  onChange: (next: Homepage) => void;
  onGoTab: (tab: CatalogTab) => void;
  onBusy?: (state: AdminOverlayState | null) => void;
};

const HOME_SECTIONS = [
  { id: "sec-hero", title: "Hero" },
  { id: "sec-about", title: "About" },
  { id: "sec-partner", title: "Partner" },
  { id: "sec-clients", title: "Clients" },
  { id: "sec-milestones", title: "Milestones" },
  { id: "sec-services", title: "Services" },
  { id: "sec-styles", title: "Styles" },
  { id: "sec-classes", title: "Level" },
  { id: "sec-instructors", title: "Giảng viên" },
  { id: "sec-pricing", title: "Gói", catalog: true },
  { id: "sec-gallery", title: "Gallery" },
  { id: "sec-live", title: "Live" },
  { id: "sec-stories", title: "Stories", catalog: true },
  { id: "sec-branches", title: "Chi nhánh", catalog: true },
  { id: "sec-faq", title: "FAQ" },
  { id: "sec-contact", title: "Banner + Contact" },
] as const;

function patchI18n(value: I18nText, lang: HomeLocale, next: string): I18nText {
  return { ...value, [lang]: next };
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <label className="col-12 col-md-6">
      <span className="form-label">{label}</span>
      <input className="form-control" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function Area({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <label className="col-12">
      <span className="form-label">{label}</span>
      <textarea className="form-control" rows={3} value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function I18nField({
  label,
  value,
  lang,
  area,
  onChange,
}: {
  label: string;
  value: I18nText;
  lang: HomeLocale;
  area?: boolean;
  onChange: (next: I18nText) => void;
}) {
  const Comp = area ? Area : Field;
  return (
    <Comp
      label={`${label} (${lang.toUpperCase()})`}
      value={value[lang]}
      onChange={(next) => onChange(patchI18n(value, lang, next))}
    />
  );
}

function Accordion({
  id,
  title,
  catalog,
  children,
}: {
  id: string;
  title: string;
  catalog?: boolean;
  children: ReactNode;
}) {
  return (
    <details className="accordion-item" id={id}>
      <summary className="accordion-button">
        <span className="flex-grow-1">{title}</span>
        {catalog ? <span className="badge text-bg-warning me-2">catalog</span> : null}
      </summary>
      <div className="accordion-body d-grid gap-3">{children}</div>
    </details>
  );
}

function CatalogNote({
  text,
  action,
  onClick,
}: {
  text: string;
  action: string;
  onClick: () => void;
}) {
  return (
    <div className="alert alert-warning d-flex flex-wrap align-items-center justify-content-between gap-2 mb-0">
      <p className="mb-0">
        Load từ <strong>Catalog</strong> — không sửa ở Homepage. {text}
      </p>
      <button type="button" className="btn btn-sm btn-outline-dark" onClick={onClick}>
        {action}
      </button>
    </div>
  );
}

export function HomepageEditor({ home, lang, onLang, onChange, onGoTab, onBusy }: Props) {
  function set<K extends keyof Homepage>(key: K, value: Homepage[K]) {
    onChange({ ...home, [key]: value });
  }

  return (
    <div className="d-grid gap-3">
      <div className="admin-jump sticky-top bg-body py-2">
        <div className="btn-group mb-2" role="tablist" aria-label="Locale homepage">
          {HOME_LOCALES.map((item) => (
            <button
              key={item}
              type="button"
              className={`btn btn-sm ${lang === item ? "btn-light" : "btn-outline-light"}`}
              onClick={() => onLang(item)}
            >
              {item.toUpperCase()}
            </button>
          ))}
        </div>
        <nav className="d-flex flex-wrap gap-1" aria-label="Section homepage">
          {HOME_SECTIONS.map((item) => {
            const catalog = "catalog" in item && item.catalog;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`btn btn-sm ${catalog ? "btn-outline-warning" : "btn-outline-secondary"}`}
              >
                {item.title}
              </a>
            );
          })}
        </nav>
      </div>
      <p className="text-secondary small mb-0">
        Copy / ảnh / list theo section. Ảnh = path public hoặc URL Worker.{" "}
        <strong>Gói · Stories · Chi nhánh</strong> load từ Catalog — không sửa list ở đây. Số liệu
        About nhập ở section bên dưới.
      </p>

      <Accordion id="sec-hero" title="Hero">
        <div className="row g-3">
          <Field label="YouTube id" value={home.hero.videoId} onChange={(videoId) => set("hero", { ...home.hero, videoId })} />
          <Field label="Form đăng ký" value={home.formHref} onChange={(formHref) => onChange({ ...home, formHref })} />
          <I18nField label="Dòng 1" value={home.hero.line1} lang={lang} onChange={(line1) => set("hero", { ...home.hero, line1 })} />
          <I18nField label="Dòng 2" value={home.hero.line2} lang={lang} onChange={(line2) => set("hero", { ...home.hero, line2 })} />
          <I18nField label="CTA học" value={home.hero.cta1} lang={lang} onChange={(cta1) => set("hero", { ...home.hero, cta1 })} />
          <I18nField label="CTA phòng" value={home.hero.ctaRoom} lang={lang} onChange={(ctaRoom) => set("hero", { ...home.hero, ctaRoom })} />
        </div>
      </Accordion>

      <Accordion id="sec-about" title="About + số liệu + marquee">
        <div className="row g-3">
          <I18nField label="Est" value={home.about.est} lang={lang} onChange={(est) => set("about", { ...home.about, est })} />
          <I18nField label="Tiêu đề" value={home.about.title} lang={lang} area onChange={(title) => set("about", { ...home.about, title })} />
          <I18nField label="Sub" value={home.about.sub} lang={lang} area onChange={(sub) => set("about", { ...home.about, sub })} />
        </div>
        <p className="text-secondary small mb-0">Số liệu hiện trên trang chủ. Thêm hoặc xóa bao nhiêu ô cũng được.</p>
        {home.about.impact.map((item, i) => (
          <article key={i} className="card">
            <div className="row g-3">
              <Field
                label="Số"
                value={item.value}
                onChange={(value) => {
                  const impact = home.about.impact.slice();
                  impact[i] = { ...item, value };
                  set("about", { ...home.about, impact });
                }}
              />
              <I18nField
                label="Nhãn"
                value={item.label}
                lang={lang}
                onChange={(label) => {
                  const impact = home.about.impact.slice();
                  impact[i] = { ...item, label };
                  set("about", { ...home.about, impact });
                }}
              />
            </div>
            <button
              type="button"
              className="btn btn-sm btn-outline-danger"
              onClick={() =>
                set("about", { ...home.about, impact: home.about.impact.filter((_, idx) => idx !== i) })
              }
            >
              Xóa
            </button>
          </article>
        ))}
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={() =>
            set("about", {
              ...home.about,
              impact: [...home.about.impact, { value: "", label: emptyI18n() }],
            })
          }
        >
          Thêm số liệu
        </button>
        <label className="d-block">
          <span className="form-label">Marquee (mỗi dòng 1 từ)</span>
          <textarea
            className="form-control"
            rows={4}
            value={home.about.marquee.join("\n")}
            onChange={(e) =>
              set("about", {
                ...home.about,
                marquee: e.target.value.split("\n").map((line) => line.trim()).filter(Boolean),
              })
            }
          />
        </label>
      </Accordion>

      <Accordion id="sec-partner" title="Partner">
        <div className="row g-3">
          <I18nField label="Label" value={home.partner.label} lang={lang} onChange={(label) => set("partner", { ...home.partner, label })} />
          <I18nField label="Tiêu đề" value={home.partner.title} lang={lang} onChange={(title) => set("partner", { ...home.partner, title })} />
          <I18nField label="P1" value={home.partner.p1} lang={lang} area onChange={(p1) => set("partner", { ...home.partner, p1 })} />
          <I18nField label="P2" value={home.partner.p2} lang={lang} area onChange={(p2) => set("partner", { ...home.partner, p2 })} />
          <I18nField label="P3" value={home.partner.p3} lang={lang} area onChange={(p3) => set("partner", { ...home.partner, p3 })} />
          <ImageField label="Ảnh" value={home.partner.image} onChange={(image) => set("partner", { ...home.partner, image })} onBusy={onBusy} />
          <Field label="Link" value={home.partner.href} onChange={(href) => set("partner", { ...home.partner, href })} />
        </div>
      </Accordion>

      <Accordion id="sec-clients" title="Clients">
        <div className="row g-3">
          <I18nField label="Label" value={home.clients.label} lang={lang} onChange={(label) => set("clients", { ...home.clients, label })} />
          <I18nField label="Tiêu đề" value={home.clients.title} lang={lang} onChange={(title) => set("clients", { ...home.clients, title })} />
          <I18nField label="Sub" value={home.clients.sub} lang={lang} area onChange={(sub) => set("clients", { ...home.clients, sub })} />
        </div>
        {home.clients.logos.map((logo, i) => (
          <div key={`${logo.src}-${i}`} className="row g-3">
            <ImageField
              label="Logo"
              value={logo.src}
              onBusy={onBusy}
              onChange={(src) => {
                const logos = home.clients.logos.slice();
                logos[i] = { ...logo, src };
                set("clients", { ...home.clients, logos });
              }}
            />
            <Field
              label="Alt"
              value={logo.alt}
              onChange={(alt) => {
                const logos = home.clients.logos.slice();
                logos[i] = { ...logo, alt };
                set("clients", { ...home.clients, logos });
              }}
            />
            <button
              type="button"
              className="btn btn-sm btn-outline-danger"
              onClick={() =>
                set("clients", { ...home.clients, logos: home.clients.logos.filter((_, idx) => idx !== i) })
              }
            >
              Xóa
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={() =>
            set("clients", {
              ...home.clients,
              logos: [...home.clients.logos, { src: "partners/clients/", alt: "" }],
            })
          }
        >
          Thêm logo
        </button>
      </Accordion>

      <Accordion id="sec-milestones" title="Milestones">
        <div className="row g-3">
          <I18nField label="Label" value={home.milestones.label} lang={lang} onChange={(label) => set("milestones", { ...home.milestones, label })} />
          <I18nField label="Tiêu đề" value={home.milestones.title} lang={lang} onChange={(title) => set("milestones", { ...home.milestones, title })} />
        </div>
        {home.milestones.items.map((item, i) => (
          <article key={i} className="card">
            <h2>Mốc {i + 1}</h2>
            <div className="row g-3">
              <I18nField
                label="Tiêu đề"
                value={item.title}
                lang={lang}
                onChange={(title) => {
                  const items = home.milestones.items.slice();
                  items[i] = { ...item, title };
                  set("milestones", { ...home.milestones, items });
                }}
              />
              <I18nField
                label="Mô tả"
                value={item.desc}
                lang={lang}
                area
                onChange={(desc) => {
                  const items = home.milestones.items.slice();
                  items[i] = { ...item, desc };
                  set("milestones", { ...home.milestones, items });
                }}
              />
              <ImageField
                label="Ảnh"
                value={item.image}
                onBusy={onBusy}
                onChange={(image) => {
                  const items = home.milestones.items.slice();
                  items[i] = { ...item, image };
                  set("milestones", { ...home.milestones, items });
                }}
              />
            </div>
          </article>
        ))}
      </Accordion>

      <Accordion id="sec-services" title="Services">
        {home.services.items.map((item, i) => (
          <article key={i} className="card">
            <h2>Dịch vụ {i + 1}</h2>
            <div className="row g-3">
              <I18nField
                label="Tiêu đề"
                value={item.title}
                lang={lang}
                onChange={(title) => {
                  const items = home.services.items.slice();
                  items[i] = { ...item, title };
                  set("services", { ...home.services, items });
                }}
              />
              <I18nField
                label="Mô tả"
                value={item.desc}
                lang={lang}
                area
                onChange={(desc) => {
                  const items = home.services.items.slice();
                  items[i] = { ...item, desc };
                  set("services", { ...home.services, items });
                }}
              />
              <ImageField
                label="Ảnh"
                value={item.image}
                onBusy={onBusy}
                onChange={(image) => {
                  const items = home.services.items.slice();
                  items[i] = { ...item, image };
                  set("services", { ...home.services, items });
                }}
              />
              <Field
                label="Link"
                value={item.href}
                onChange={(href) => {
                  const items = home.services.items.slice();
                  items[i] = { ...item, href };
                  set("services", { ...home.services, items });
                }}
              />
            </div>
          </article>
        ))}
      </Accordion>

      <Accordion id="sec-styles" title="Styles">
        {home.styles.items.map((item, i) => (
          <div key={i} className="row g-3">
            <Field
              label="Tên"
              value={item.name}
              onChange={(name) => {
                const items = home.styles.items.slice();
                items[i] = { ...item, name };
                set("styles", { ...home.styles, items });
              }}
            />
            <ImageField
              label="Ảnh"
              value={item.image}
              onBusy={onBusy}
              onChange={(image) => {
                const items = home.styles.items.slice();
                items[i] = { ...item, image };
                set("styles", { ...home.styles, items });
              }}
            />
            <button
              type="button"
              className="btn btn-sm btn-outline-danger"
              onClick={() => set("styles", { ...home.styles, items: home.styles.items.filter((_, idx) => idx !== i) })}
            >
              Xóa
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={() =>
            set("styles", { ...home.styles, items: [...home.styles.items, { name: "STYLE", image: "media/studio-01.jpg" }] })
          }
        >
          Thêm style
        </button>
      </Accordion>

      <Accordion id="sec-classes" title="Level">
        {home.classes.items.map((item, i) => (
          <article key={i} className="card">
            <h2>{item.tag || "CTA"}</h2>
            <div className="row g-3">
              <I18nField
                label="Tiêu đề"
                value={item.title}
                lang={lang}
                onChange={(title) => {
                  const items = home.classes.items.slice();
                  items[i] = { ...item, title };
                  set("classes", { ...home.classes, items });
                }}
              />
              <I18nField
                label="Mô tả"
                value={item.desc}
                lang={lang}
                area
                onChange={(desc) => {
                  const items = home.classes.items.slice();
                  items[i] = { ...item, desc };
                  set("classes", { ...home.classes, items });
                }}
              />
            </div>
          </article>
        ))}
      </Accordion>

      <Accordion id="sec-instructors" title="Giảng viên">
        {home.instructors.items.map((item, i) => (
          <article key={item.name + i} className="card">
            <div className="row g-3">
              <Field
                label="Tên"
                value={item.name}
                onChange={(name) => {
                  const items = home.instructors.items.slice();
                  items[i] = { ...item, name };
                  set("instructors", { ...home.instructors, items });
                }}
              />
              <ImageField
                label="Ảnh"
                value={item.image}
                onBusy={onBusy}
                onChange={(image) => {
                  const items = home.instructors.items.slice();
                  items[i] = { ...item, image };
                  set("instructors", { ...home.instructors, items });
                }}
              />
              <I18nField
                label="Bio"
                value={item.bio}
                lang={lang}
                area
                onChange={(bio) => {
                  const items = home.instructors.items.slice();
                  items[i] = { ...item, bio };
                  set("instructors", { ...home.instructors, items });
                }}
              />
              <button
                type="button"
                className="btn btn-sm btn-outline-danger"
                onClick={() =>
                  set("instructors", {
                    ...home.instructors,
                    items: home.instructors.items.filter((_, idx) => idx !== i),
                  })
                }
              >
                Xóa
              </button>
            </div>
          </article>
        ))}
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={() =>
            set("instructors", {
              ...home.instructors,
              items: [
                ...home.instructors.items,
                { name: "NEW", role: "inst", overlay: "", bio: emptyI18n(), image: "media/studio-01.jpg" },
              ],
            })
          }
        >
          Thêm giảng viên
        </button>
      </Accordion>

      <Accordion id="sec-pricing" title="Gói" catalog>
        <CatalogNote text="Card gói trên trang chủ = tab Gói." action="Sửa gói" onClick={() => onGoTab("packages")} />
      </Accordion>

      <Accordion id="sec-gallery" title="Gallery">
        {home.gallery.items.map((item, i) => (
          <div key={i} className="row g-3">
            <ImageField
              label="Ảnh"
              value={item.src}
              onBusy={onBusy}
              onChange={(src) => {
                const items = home.gallery.items.slice();
                items[i] = { ...item, src };
                set("gallery", { ...home.gallery, items });
              }}
            />
            <Field
              label="Caption"
              value={item.caption}
              onChange={(caption) => {
                const items = home.gallery.items.slice();
                items[i] = { ...item, caption };
                set("gallery", { ...home.gallery, items });
              }}
            />
            <button
              type="button"
              className="btn btn-sm btn-outline-danger"
              onClick={() => set("gallery", { ...home.gallery, items: home.gallery.items.filter((_, idx) => idx !== i) })}
            >
              Xóa
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={() =>
            set("gallery", {
              ...home.gallery,
              items: [...home.gallery.items, { src: "media/studio-01.jpg", alt: "", caption: "" }],
            })
          }
        >
          Thêm ảnh
        </button>
      </Accordion>

      <Accordion id="sec-live" title="Live">
        <div className="row g-3">
          <I18nField label="Tiêu đề" value={home.live.title} lang={lang} onChange={(title) => set("live", { ...home.live, title })} />
          <Field label="Live now URL" value={home.live.now.href} onChange={(href) => set("live", { ...home.live, now: { ...home.live.now, href } })} />
          <ImageField label="Ảnh now" value={home.live.now.image} onChange={(image) => set("live", { ...home.live, now: { ...home.live.now, image } })} onBusy={onBusy} />
        </div>
        {home.live.slots.map((slot, i) => (
          <article key={i} className="card">
            <I18nField
              label="When"
              value={slot.when}
              lang={lang}
              onChange={(when) => {
                const slots = home.live.slots.slice();
                slots[i] = { ...slot, when };
                set("live", { ...home.live, slots });
              }}
            />
            <I18nField
              label="Tiêu đề"
              value={slot.title}
              lang={lang}
              onChange={(title) => {
                const slots = home.live.slots.slice();
                slots[i] = { ...slot, title };
                set("live", { ...home.live, slots });
              }}
            />
            <ImageField
              label="Ảnh"
              value={slot.image}
              onBusy={onBusy}
              onChange={(image) => {
                const slots = home.live.slots.slice();
                slots[i] = { ...slot, image };
                set("live", { ...home.live, slots });
              }}
            />
          </article>
        ))}
      </Accordion>

      <Accordion id="sec-stories" title="Stories" catalog>
        <CatalogNote text="Teaser stories trên trang chủ = tab Stories." action="Sửa stories" onClick={() => onGoTab("stories")} />
      </Accordion>

      <Accordion id="sec-branches" title="Chi nhánh" catalog>
        <CatalogNote text="Card chi nhánh trên trang chủ = tab Chi nhánh." action="Sửa chi nhánh" onClick={() => onGoTab("branches")} />
      </Accordion>

      <Accordion id="sec-faq" title="FAQ">
        {home.faq.items.map((item, i) => (
          <article key={i} className="card">
            <I18nField
              label="Câu hỏi"
              value={item.q}
              lang={lang}
              onChange={(q) => {
                const items = home.faq.items.slice();
                items[i] = { ...item, q };
                set("faq", { ...home.faq, items });
              }}
            />
            <I18nField
              label="Trả lời"
              value={item.a}
              lang={lang}
              area
              onChange={(a) => {
                const items = home.faq.items.slice();
                items[i] = { ...item, a };
                set("faq", { ...home.faq, items });
              }}
            />
            <button
              type="button"
              className="btn btn-sm btn-outline-danger"
              onClick={() => set("faq", { ...home.faq, items: home.faq.items.filter((_, idx) => idx !== i) })}
            >
              Xóa
            </button>
          </article>
        ))}
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={() => set("faq", { ...home.faq, items: [...home.faq.items, { q: emptyI18n(), a: emptyI18n() }] })}
        >
          Thêm FAQ
        </button>
      </Accordion>

      <Accordion id="sec-contact" title="Banner + Contact">
        <div className="row g-3">
          <I18nField label="Banner title" value={home.banner.title} lang={lang} onChange={(title) => set("banner", { ...home.banner, title })} />
          <I18nField label="Contact title" value={home.contact.title} lang={lang} onChange={(title) => set("contact", { ...home.contact, title })} />
          <I18nField label="Contact desc" value={home.contact.desc} lang={lang} area onChange={(desc) => set("contact", { ...home.contact, desc })} />
          <Field label="Phone" value={home.contact.phone} onChange={(phone) => set("contact", { ...home.contact, phone })} />
          <I18nField label="Giờ" value={home.contact.hoursVal} lang={lang} onChange={(hoursVal) => set("contact", { ...home.contact, hoursVal })} />
          <Field label="Zalo" value={home.contact.zalo} onChange={(zalo) => set("contact", { ...home.contact, zalo })} />
        </div>
      </Accordion>
    </div>
  );
}
