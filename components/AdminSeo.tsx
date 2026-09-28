"use client";

import { ImageField } from "@/components/ImageField";
import type { AdminOverlayState } from "@/components/AdminOverlay";
import { Badge, Button, Checkbox, CollapseCard, Field, FieldGrid, Input, Select, Textarea } from "@/components/admin/ui";
import { MA_API_URL } from "@/lib/ma-api";
import {
  emptySeoPage,
  isIndexable,
  publicUrl,
  SEO_FIXED_PAGES,
  storySeoPath,
  type SeoDoc,
  type SeoPage,
  type SeoRobots,
} from "@/lib/seo-data";
import type { Story } from "@/lib/stories";
import { useMemo, useState } from "react";

const ROBOTS: SeoRobots[] = ["index,follow", "noindex,follow", "noindex,nofollow"];

type Row = { path: string; label: string; kind: "page" | "story" };

function patchPage(seo: SeoDoc, path: string, part: Partial<SeoPage>): SeoDoc {
  const prev = seo.pages[path] || emptySeoPage();
  return { ...seo, pages: { ...seo.pages, [path]: { ...prev, ...part } } };
}

function Count({ value, max }: { value: number; max: number }) {
  return <span className={value > max ? "text-ma-accent" : "text-ma-text-muted"}>({value}/{max})</span>;
}

function GooglePreview({ title, description, url }: { title: string; description: string; url: string }) {
  return (
    <div className="rounded-2xl border border-ma-border bg-ma-bg p-4">
      <p className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-ma-text-muted">Preview SERP</p>
      <p className="mt-2 text-base text-[#8ab4f8] underline decoration-[#8ab4f8]/40">{title || "—"}</p>
      <p className="mt-1 text-sm text-ma-success">{url}</p>
      <p className="mt-1 text-sm text-ma-text-secondary">{description || "—"}</p>
    </div>
  );
}

function PageEditor({
  path,
  page,
  origin,
  onChange,
  onBusy,
}: {
  path: string;
  page: SeoPage;
  origin: string;
  onChange: (part: Partial<SeoPage>) => void;
  onBusy?: (state: AdminOverlayState | null) => void;
}) {
  const canonical = page.canonical || publicUrl(origin, path);
  return (
    <div className="grid gap-4">
      <GooglePreview title={page.title} description={page.description} url={canonical} />
      <Field label="Title" hint={<Count value={page.title.length} max={60} />}>
        <Input value={page.title} onChange={(e) => onChange({ title: e.target.value })} />
      </Field>
      <Field label="Meta description" hint={<Count value={page.description.length} max={160} />}>
        <Textarea rows={3} value={page.description} onChange={(e) => onChange({ description: e.target.value })} />
      </Field>
      <FieldGrid>
        <Field label="Robots">
          <Select value={page.robots} onChange={(e) => onChange({ robots: e.target.value as SeoRobots })}>
            {ROBOTS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Từ khóa chính">
          <Input value={page.focusKw} onChange={(e) => onChange({ focusKw: e.target.value })} />
        </Field>
      </FieldGrid>
      <Field label="Canonical (trống = origin + path)">
        <Input value={page.canonical} placeholder={canonical} onChange={(e) => onChange({ canonical: e.target.value })} />
      </Field>
      <ImageField label="OG image" value={page.ogImage} onChange={(ogImage) => onChange({ ogImage })} onBusy={onBusy} />
    </div>
  );
}

export function SeoPagesEditor({
  seo,
  stories,
  onChange,
  onBusy,
}: {
  seo: SeoDoc;
  stories: Story[];
  onChange: (next: SeoDoc) => void;
  onBusy?: (state: AdminOverlayState | null) => void;
}) {
  const rows: Row[] = useMemo(() => {
    const pages = SEO_FIXED_PAGES.map((item) => ({ path: item.path, label: item.label, kind: "page" as const }));
    const storyRows = stories.map((story) => ({
      path: storySeoPath(story.slug),
      label: story.title,
      kind: "story" as const,
    }));
    return [...pages, ...storyRows];
  }, [stories]);
  const [open, setOpen] = useState("/");

  return (
    <div className="grid gap-3">
      <p className="text-sm text-ma-text-secondary">Title, description và robots từng URL. Story lấy slug từ Catalog.</p>
      {rows.map((row) => {
        const page = seo.pages[row.path] || emptySeoPage({ title: row.label });
        const indexed = isIndexable(seo, row.path);
        return (
          <CollapseCard
            key={row.path}
            title={row.label}
            open={open === row.path}
            onToggle={(next) => {
              if (next) setOpen(row.path);
            }}
            badge={<Badge tone={indexed ? "success" : "muted"}>{indexed ? "index" : "noindex"}</Badge>}
          >
            <p className="-mt-1 text-xs text-ma-text-muted">{row.path}</p>
            <PageEditor
              path={row.path}
              page={page}
              origin={seo.site.canonicalOrigin}
              onBusy={onBusy}
              onChange={(part) => onChange(patchPage(seo, row.path, part))}
            />
          </CollapseCard>
        );
      })}
    </div>
  );
}

export function SeoSettingsEditor({
  seo,
  onChange,
  onBusy,
}: {
  seo: SeoDoc;
  onChange: (next: SeoDoc) => void;
  onBusy?: (state: AdminOverlayState | null) => void;
}) {
  const site = seo.site;
  function patchSite(part: Partial<SeoDoc["site"]>) {
    onChange({ ...seo, site: { ...site, ...part } });
  }
  return (
    <div className="grid gap-4">
      <p className="text-sm text-ma-text-secondary">Cài đặt toàn site. Tắt index = không cho công cụ tìm kiếm lập chỉ mục.</p>
      <FieldGrid>
        <Field label="Tên site">
          <Input value={site.name} onChange={(e) => patchSite({ name: e.target.value })} />
        </Field>
        <Field label="Tagline">
          <Input value={site.tagline} onChange={(e) => patchSite({ tagline: e.target.value })} />
        </Field>
      </FieldGrid>
      <Field label="Title mặc định">
        <Input value={site.defaultTitle} onChange={(e) => patchSite({ defaultTitle: e.target.value })} />
      </Field>
      <Field label="Description mặc định">
        <Textarea rows={3} value={site.defaultDescription} onChange={(e) => patchSite({ defaultDescription: e.target.value })} />
      </Field>
      <Field label="Canonical origin (không slash cuối)" hint={<span className="text-ma-text-muted">Live Pages: https://nchithanh.github.io/MA_DANCE</span>}>
        <Input value={site.canonicalOrigin} onChange={(e) => patchSite({ canonicalOrigin: e.target.value })} />
      </Field>
      <ImageField label="OG mặc định" value={site.ogImage} onChange={(ogImage) => patchSite({ ogImage })} onBusy={onBusy} />
      <Field label="Twitter / X @">
        <Input value={site.twitter} onChange={(e) => patchSite({ twitter: e.target.value })} />
      </Field>
      <Checkbox
        id="seo-noindex"
        label="Discourage search engines (noindex toàn site)"
        checked={site.noindexSite}
        onChange={(noindexSite) => patchSite({ noindexSite })}
      />
      <FieldGrid>
        <Field label="Google Search Console">
          <Input
            value={site.googleVerify}
            placeholder="content của google-site-verification"
            onChange={(e) => patchSite({ googleVerify: e.target.value })}
          />
        </Field>
        <Field label="Bing">
          <Input value={site.bingVerify} placeholder="msvalidate.01" onChange={(e) => patchSite({ bingVerify: e.target.value })} />
        </Field>
      </FieldGrid>
      <Field label="robots.txt thêm (tuỳ chọn)">
        <Textarea rows={4} value={site.robotsExtra} onChange={(e) => patchSite({ robotsExtra: e.target.value })} />
      </Field>
    </div>
  );
}

export function SeoSitemapPanel({ seo, stories }: { seo: SeoDoc; stories: Story[] }) {
  const origin = seo.site.canonicalOrigin;
  const indexUrl = publicUrl(origin, "/sitemap.xml");
  const workerIndex = `${MA_API_URL}/sitemap.xml`;
  const indexedPages = SEO_FIXED_PAGES.filter((item) => isIndexable(seo, item.path));
  const indexedStories = stories.filter((story) => isIndexable(seo, storySeoPath(story.slug)));

  return (
    <div className="grid gap-4">
      <p className="text-sm text-ma-text-secondary">
        Sitemap index. Google đọc file trên Pages sau mỗi deploy. Worker phục vụ bản live để xem trước.
      </p>
      <div className="rounded-2xl border border-ma-border bg-ma-card p-4">
        <p className="text-sm font-medium">GSC — nộp URL này</p>
        <code className="mt-2 block break-all text-sm text-ma-accent">{indexUrl}</code>
        <p className="mt-2 text-xs text-ma-text-muted">Preview Worker: {workerIndex}</p>
      </div>
      <ul className="overflow-hidden rounded-2xl border border-ma-border">
        <li className="flex items-center justify-between gap-3 border-b border-ma-border px-4 py-3 text-sm">
          <span>sitemap-pages.xml</span>
          <span className="text-ma-text-secondary">{indexedPages.length} URL</span>
        </li>
        <li className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
          <span>sitemap-stories.xml</span>
          <span className="text-ma-text-secondary">{indexedStories.length} URL</span>
        </li>
      </ul>
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-ma-text-muted">Pages</p>
        <ul className="mt-2 grid gap-1 text-sm text-ma-text-secondary">
          {indexedPages.map((item) => (
            <li key={item.path} className="break-all">
              {publicUrl(origin, item.path)}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-ma-text-muted">Stories</p>
        <ul className="mt-2 grid gap-1 text-sm text-ma-text-secondary">
          {indexedStories.map((story) => (
            <li key={story.slug} className="break-all">
              {publicUrl(origin, storySeoPath(story.slug))}
            </li>
          ))}
        </ul>
      </div>
      <a
        className="inline-flex w-fit items-center justify-center rounded-xl border border-ma-border px-3 py-1.5 text-xs text-ma-text-secondary transition hover:bg-ma-card-hover hover:text-ma-text"
        href={workerIndex}
        target="_blank"
        rel="noreferrer"
      >
        Mở sitemap Worker
      </a>
    </div>
  );
}
