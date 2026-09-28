"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  Building2,
  Clapperboard,
  GalleryHorizontal,
  Handshake,
  HelpCircle,
  Images,
  LayoutTemplate,
  MapPin,
  Megaphone,
  Radio,
  Sparkles,
  Ticket,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { AdminOverlayState } from "@/components/AdminOverlay";
import { LangSwitch, SectionNav } from "@/components/admin/SectionNav";
import { Button, CollapseCard, Field, FieldGrid, Input, Textarea } from "@/components/admin/ui";
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

const HOME_SECTIONS: { id: string; title: string; catalog?: boolean; icon: LucideIcon }[] = [
  { id: "sec-hero", title: "Hero", icon: Clapperboard },
  { id: "sec-about", title: "About", icon: Sparkles },
  { id: "sec-partner", title: "Partner", icon: Handshake },
  { id: "sec-clients", title: "Clients", icon: Building2 },
  { id: "sec-milestones", title: "Milestones", icon: Trophy },
  { id: "sec-services", title: "Services", icon: LayoutTemplate },
  { id: "sec-styles", title: "Styles", icon: Sparkles },
  { id: "sec-classes", title: "Level", icon: Users },
  { id: "sec-instructors", title: "Giảng viên", icon: Users },
  { id: "sec-pricing", title: "Gói", catalog: true, icon: Ticket },
  { id: "sec-gallery", title: "Gallery", icon: Images },
  { id: "sec-live", title: "Live", icon: Radio },
  { id: "sec-stories", title: "Stories", catalog: true, icon: GalleryHorizontal },
  { id: "sec-branches", title: "Chi nhánh", catalog: true, icon: MapPin },
  { id: "sec-faq", title: "FAQ", icon: HelpCircle },
  { id: "sec-contact", title: "Banner + Contact", icon: Megaphone },
];

function patchI18n(value: I18nText, lang: HomeLocale, next: string): I18nText {
  return { ...value, [lang]: next };
}

function countHint(label: string, value: string) {
  if (!/tiêu đề|title|dòng/i.test(label)) return undefined;
  return <span className={value.length > 80 ? "text-ma-accent" : "text-ma-text-muted"}>{value.length}</span>;
}

function TextField({
  label,
  value,
  onChange,
  wide,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  wide?: boolean;
}) {
  return (
    <Field label={label} wide={wide} hint={countHint(label, value)}>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </Field>
  );
}

function AreaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <Field label={label} wide hint={countHint(label, value)}>
      <Textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} />
    </Field>
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
  const titled = `${label} (${lang.toUpperCase()})`;
  if (area) {
    return <AreaField label={titled} value={value[lang]} onChange={(next) => onChange(patchI18n(value, lang, next))} />;
  }
  return <TextField label={titled} value={value[lang]} onChange={(next) => onChange(patchI18n(value, lang, next))} />;
}

function Section({
  id,
  title,
  catalog,
  icon: Icon,
  children,
}: {
  id: string;
  title: string;
  catalog?: boolean;
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <CollapseCard id={id} title={title} icon={<Icon className="size-4" aria-hidden />} badge={catalog ? <span className="rounded-full bg-ma-accent-muted px-2 py-0.5 text-[0.65rem] font-medium text-ma-accent">Catalog</span> : undefined}>
      {children}
    </CollapseCard>
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
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ma-accent/30 bg-ma-accent-muted px-4 py-3">
      <p className="text-sm text-ma-text">
        Load từ <strong>Catalog</strong> — không sửa ở Homepage. {text}
      </p>
      <Button variant="secondary" size="sm" onClick={onClick}>
        {action}
      </Button>
    </div>
  );
}

function Nested({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <article className="grid gap-3 rounded-2xl border border-ma-border bg-ma-bg p-4 sm:col-span-2">
      {title ? <h2 className="text-sm font-medium text-ma-text">{title}</h2> : null}
      {children}
    </article>
  );
}

export function HomepageEditor({ home, lang, onLang, onChange, onGoTab, onBusy }: Props) {
  const [active, setActive] = useState(HOME_SECTIONS[0].id);

  function set<K extends keyof Homepage>(key: K, value: Homepage[K]) {
    onChange({ ...home, [key]: value });
  }

  useEffect(() => {
    const nodes = HOME_SECTIONS.map((item) => document.getElementById(item.id)).filter((node): node is HTMLElement => Boolean(node));
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-30% 0px -50% 0px", threshold: [0.15, 0.4] },
    );
    nodes.forEach((node) => obs.observe(node));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="grid gap-5">
      <div className="sticky top-16 z-20 -mx-4 grid gap-3 border-b border-ma-border bg-ma-bg/85 px-4 py-3 backdrop-blur-md lg:-mx-8 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-ma-text-muted">Trang chủ / Homepage</p>
          <LangSwitch locales={HOME_LOCALES} value={lang} onChange={(next) => onLang(next as HomeLocale)} />
        </div>
        <SectionNav sections={HOME_SECTIONS} active={active} onSelect={setActive} />
      </div>
      <p className="text-sm text-ma-text-secondary">
        Mỗi khối bên dưới là một phần trang chủ. <strong className="font-medium text-ma-text">Gói · Stories · Chi nhánh</strong> lấy từ Catalog. Số liệu About nhập tại section đó.
      </p>

      <Section id="sec-hero" title="Hero" icon={Clapperboard}>
        <FieldGrid>
          <TextField label="YouTube id" value={home.hero.videoId} onChange={(videoId) => set("hero", { ...home.hero, videoId })} />
          <TextField label="Form đăng ký" value={home.formHref} onChange={(formHref) => onChange({ ...home, formHref })} />
          <I18nField label="Dòng 1" value={home.hero.line1} lang={lang} onChange={(line1) => set("hero", { ...home.hero, line1 })} />
          <I18nField label="Dòng 2" value={home.hero.line2} lang={lang} onChange={(line2) => set("hero", { ...home.hero, line2 })} />
          <I18nField label="CTA học" value={home.hero.cta1} lang={lang} onChange={(cta1) => set("hero", { ...home.hero, cta1 })} />
          <I18nField label="CTA phòng" value={home.hero.ctaRoom} lang={lang} onChange={(ctaRoom) => set("hero", { ...home.hero, ctaRoom })} />
        </FieldGrid>
      </Section>

      <Section id="sec-about" title="About + số liệu + marquee" icon={Sparkles}>
        <FieldGrid>
          <I18nField label="Est" value={home.about.est} lang={lang} onChange={(est) => set("about", { ...home.about, est })} />
          <I18nField label="Tiêu đề" value={home.about.title} lang={lang} area onChange={(title) => set("about", { ...home.about, title })} />
          <I18nField label="Sub" value={home.about.sub} lang={lang} area onChange={(sub) => set("about", { ...home.about, sub })} />
        </FieldGrid>
        <p className="text-sm text-ma-text-secondary">Số liệu hiện trên trang chủ. Thêm hoặc xóa bao nhiêu ô cũng được.</p>
        {home.about.impact.map((item, i) => (
          <Nested key={i}>
            <FieldGrid>
              <TextField
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
            </FieldGrid>
            <Button
              variant="danger"
              size="sm"
              className="w-fit"
              onClick={() => set("about", { ...home.about, impact: home.about.impact.filter((_, idx) => idx !== i) })}
            >
              Xóa
            </Button>
          </Nested>
        ))}
        <Button
          variant="secondary"
          size="sm"
          className="w-fit"
          onClick={() =>
            set("about", {
              ...home.about,
              impact: [...home.about.impact, { value: "", label: emptyI18n() }],
            })
          }
        >
          Thêm số liệu
        </Button>
        <Field label="Marquee (mỗi dòng 1 từ)" wide>
          <Textarea
            rows={4}
            value={home.about.marquee.join("\n")}
            onChange={(e) =>
              set("about", {
                ...home.about,
                marquee: e.target.value
                  .split("\n")
                  .map((line) => line.trim())
                  .filter(Boolean),
              })
            }
          />
        </Field>
      </Section>

      <Section id="sec-partner" title="Partner" icon={Handshake}>
        <FieldGrid>
          <I18nField label="Label" value={home.partner.label} lang={lang} onChange={(label) => set("partner", { ...home.partner, label })} />
          <I18nField label="Tiêu đề" value={home.partner.title} lang={lang} onChange={(title) => set("partner", { ...home.partner, title })} />
          <I18nField label="P1" value={home.partner.p1} lang={lang} area onChange={(p1) => set("partner", { ...home.partner, p1 })} />
          <I18nField label="P2" value={home.partner.p2} lang={lang} area onChange={(p2) => set("partner", { ...home.partner, p2 })} />
          <I18nField label="P3" value={home.partner.p3} lang={lang} area onChange={(p3) => set("partner", { ...home.partner, p3 })} />
          <ImageField label="Ảnh" value={home.partner.image} onChange={(image) => set("partner", { ...home.partner, image })} onBusy={onBusy} />
          <TextField label="Link" value={home.partner.href} onChange={(href) => set("partner", { ...home.partner, href })} />
        </FieldGrid>
      </Section>

      <Section id="sec-clients" title="Clients" icon={Building2}>
        <FieldGrid>
          <I18nField label="Label" value={home.clients.label} lang={lang} onChange={(label) => set("clients", { ...home.clients, label })} />
          <I18nField label="Tiêu đề" value={home.clients.title} lang={lang} onChange={(title) => set("clients", { ...home.clients, title })} />
          <I18nField label="Sub" value={home.clients.sub} lang={lang} area onChange={(sub) => set("clients", { ...home.clients, sub })} />
        </FieldGrid>
        {home.clients.logos.map((logo, i) => (
          <FieldGrid key={`${logo.src}-${i}`}>
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
            <TextField
              label="Alt"
              value={logo.alt}
              onChange={(alt) => {
                const logos = home.clients.logos.slice();
                logos[i] = { ...logo, alt };
                set("clients", { ...home.clients, logos });
              }}
            />
            <Button
              variant="danger"
              size="sm"
              className="w-fit sm:col-span-2"
              onClick={() => set("clients", { ...home.clients, logos: home.clients.logos.filter((_, idx) => idx !== i) })}
            >
              Xóa
            </Button>
          </FieldGrid>
        ))}
        <Button
          variant="secondary"
          size="sm"
          className="w-fit"
          onClick={() =>
            set("clients", {
              ...home.clients,
              logos: [...home.clients.logos, { src: "partners/clients/", alt: "" }],
            })
          }
        >
          Thêm logo
        </Button>
      </Section>

      <Section id="sec-milestones" title="Milestones" icon={Trophy}>
        <FieldGrid>
          <I18nField label="Label" value={home.milestones.label} lang={lang} onChange={(label) => set("milestones", { ...home.milestones, label })} />
          <I18nField label="Tiêu đề" value={home.milestones.title} lang={lang} onChange={(title) => set("milestones", { ...home.milestones, title })} />
        </FieldGrid>
        {home.milestones.items.map((item, i) => (
          <Nested key={i} title={`Mốc ${i + 1}`}>
            <FieldGrid>
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
            </FieldGrid>
          </Nested>
        ))}
      </Section>

      <Section id="sec-services" title="Services" icon={LayoutTemplate}>
        {home.services.items.map((item, i) => (
          <Nested key={i} title={`Dịch vụ ${i + 1}`}>
            <FieldGrid>
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
              <TextField
                label="Link"
                value={item.href}
                onChange={(href) => {
                  const items = home.services.items.slice();
                  items[i] = { ...item, href };
                  set("services", { ...home.services, items });
                }}
              />
            </FieldGrid>
          </Nested>
        ))}
      </Section>

      <Section id="sec-styles" title="Styles" icon={Sparkles}>
        {home.styles.items.map((item, i) => (
          <FieldGrid key={i}>
            <TextField
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
            <Button
              variant="danger"
              size="sm"
              className="w-fit sm:col-span-2"
              onClick={() => set("styles", { ...home.styles, items: home.styles.items.filter((_, idx) => idx !== i) })}
            >
              Xóa
            </Button>
          </FieldGrid>
        ))}
        <Button
          variant="secondary"
          size="sm"
          className="w-fit"
          onClick={() =>
            set("styles", { ...home.styles, items: [...home.styles.items, { name: "STYLE", image: "media/studio-01.jpg" }] })
          }
        >
          Thêm style
        </Button>
      </Section>

      <Section id="sec-classes" title="Level" icon={Users}>
        {home.classes.items.map((item, i) => (
          <Nested key={i} title={item.tag || "CTA"}>
            <FieldGrid>
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
            </FieldGrid>
          </Nested>
        ))}
      </Section>

      <Section id="sec-instructors" title="Giảng viên" icon={Users}>
        {home.instructors.items.map((item, i) => (
          <Nested key={item.name + i}>
            <FieldGrid>
              <TextField
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
            </FieldGrid>
            <Button
              variant="danger"
              size="sm"
              className="w-fit"
              onClick={() =>
                set("instructors", {
                  ...home.instructors,
                  items: home.instructors.items.filter((_, idx) => idx !== i),
                })
              }
            >
              Xóa
            </Button>
          </Nested>
        ))}
        <Button
          variant="secondary"
          size="sm"
          className="w-fit"
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
        </Button>
      </Section>

      <Section id="sec-pricing" title="Gói" catalog icon={Ticket}>
        <CatalogNote text="Card gói trên trang chủ = tab Gói." action="Sửa gói" onClick={() => onGoTab("packages")} />
      </Section>

      <Section id="sec-gallery" title="Gallery" icon={Images}>
        {home.gallery.items.map((item, i) => (
          <FieldGrid key={i}>
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
            <TextField
              label="Caption"
              value={item.caption}
              onChange={(caption) => {
                const items = home.gallery.items.slice();
                items[i] = { ...item, caption };
                set("gallery", { ...home.gallery, items });
              }}
            />
            <Button
              variant="danger"
              size="sm"
              className="w-fit sm:col-span-2"
              onClick={() => set("gallery", { ...home.gallery, items: home.gallery.items.filter((_, idx) => idx !== i) })}
            >
              Xóa
            </Button>
          </FieldGrid>
        ))}
        <Button
          variant="secondary"
          size="sm"
          className="w-fit"
          onClick={() =>
            set("gallery", {
              ...home.gallery,
              items: [...home.gallery.items, { src: "media/studio-01.jpg", alt: "", caption: "" }],
            })
          }
        >
          Thêm ảnh
        </Button>
      </Section>

      <Section id="sec-live" title="Live" icon={Radio}>
        <FieldGrid>
          <I18nField label="Tiêu đề" value={home.live.title} lang={lang} onChange={(title) => set("live", { ...home.live, title })} />
          <TextField label="Live now URL" value={home.live.now.href} onChange={(href) => set("live", { ...home.live, now: { ...home.live.now, href } })} />
          <ImageField label="Ảnh now" value={home.live.now.image} onChange={(image) => set("live", { ...home.live, now: { ...home.live.now, image } })} onBusy={onBusy} />
        </FieldGrid>
        {home.live.slots.map((slot, i) => (
          <Nested key={i}>
            <FieldGrid>
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
            </FieldGrid>
          </Nested>
        ))}
      </Section>

      <Section id="sec-stories" title="Stories" catalog icon={GalleryHorizontal}>
        <CatalogNote text="Teaser stories trên trang chủ = tab Stories." action="Sửa stories" onClick={() => onGoTab("stories")} />
      </Section>

      <Section id="sec-branches" title="Chi nhánh" catalog icon={MapPin}>
        <CatalogNote text="Card chi nhánh trên trang chủ = tab Chi nhánh." action="Sửa chi nhánh" onClick={() => onGoTab("branches")} />
      </Section>

      <Section id="sec-faq" title="FAQ" icon={HelpCircle}>
        {home.faq.items.map((item, i) => (
          <Nested key={i}>
            <FieldGrid>
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
            </FieldGrid>
            <Button
              variant="danger"
              size="sm"
              className="w-fit"
              onClick={() => set("faq", { ...home.faq, items: home.faq.items.filter((_, idx) => idx !== i) })}
            >
              Xóa
            </Button>
          </Nested>
        ))}
        <Button
          variant="secondary"
          size="sm"
          className="w-fit"
          onClick={() => set("faq", { ...home.faq, items: [...home.faq.items, { q: emptyI18n(), a: emptyI18n() }] })}
        >
          Thêm FAQ
        </Button>
      </Section>

      <Section id="sec-contact" title="Banner + Contact" icon={Megaphone}>
        <FieldGrid>
          <I18nField label="Banner title" value={home.banner.title} lang={lang} onChange={(title) => set("banner", { ...home.banner, title })} />
          <I18nField label="Contact title" value={home.contact.title} lang={lang} onChange={(title) => set("contact", { ...home.contact, title })} />
          <I18nField label="Contact desc" value={home.contact.desc} lang={lang} area onChange={(desc) => set("contact", { ...home.contact, desc })} />
          <TextField label="Phone" value={home.contact.phone} onChange={(phone) => set("contact", { ...home.contact, phone })} />
          <I18nField label="Giờ" value={home.contact.hoursVal} lang={lang} onChange={(hoursVal) => set("contact", { ...home.contact, hoursVal })} />
          <TextField label="Zalo" value={home.contact.zalo} onChange={(zalo) => set("contact", { ...home.contact, zalo })} />
        </FieldGrid>
      </Section>
    </div>
  );
}
