"use client";

import { ImageField } from "@/components/ImageField";
import type { AdminOverlayState } from "@/components/AdminOverlay";
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

function GooglePreview({ title, description, url }: { title: string; description: string; url: string }) {
  return (
    <div className="border rounded p-3 bg-body-tertiary">
      <p className="admin-kicker text-uppercase text-secondary fw-bold mb-2">Preview SERP</p>
      <p className="small mb-1 text-primary text-decoration-underline" style={{ fontSize: "1.05rem" }}>
        {title || "—"}
      </p>
      <p className="small text-success mb-1">{url}</p>
      <p className="small text-secondary mb-0">{description || "—"}</p>
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
    <div className="d-grid gap-3">
      <GooglePreview title={page.title} description={page.description} url={canonical} />
      <div>
        <label className="form-label">
          Title <span className={page.title.length > 60 ? "text-warning" : "text-secondary"}>({page.title.length}/60)</span>
        </label>
        <input className="form-control" value={page.title} onChange={(e) => onChange({ title: e.target.value })} />
      </div>
      <div>
        <label className="form-label">
          Meta description{" "}
          <span className={page.description.length > 160 ? "text-warning" : "text-secondary"}>
            ({page.description.length}/160)
          </span>
        </label>
        <textarea
          className="form-control"
          rows={3}
          value={page.description}
          onChange={(e) => onChange({ description: e.target.value })}
        />
      </div>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Robots</label>
          <select
            className="form-select"
            value={page.robots}
            onChange={(e) => onChange({ robots: e.target.value as SeoRobots })}
          >
            {ROBOTS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Từ khóa chính</label>
          <input className="form-control" value={page.focusKw} onChange={(e) => onChange({ focusKw: e.target.value })} />
        </div>
      </div>
      <div>
        <label className="form-label">Canonical (trống = origin + path)</label>
        <input
          className="form-control"
          value={page.canonical}
          placeholder={canonical}
          onChange={(e) => onChange({ canonical: e.target.value })}
        />
      </div>
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
    <div className="d-grid gap-2">
      <p className="text-secondary small mb-1">
        Title / description / robots từng URL — giống Yoast. Story lấy slug từ Catalog.
      </p>
      {rows.map((row) => {
        const page = seo.pages[row.path] || emptySeoPage({ title: row.label });
        const indexed = isIndexable(seo, row.path);
        return (
          <details
            key={row.path}
            className="border rounded"
            open={open === row.path}
            onToggle={(e) => {
              if ((e.target as HTMLDetailsElement).open) setOpen(row.path);
            }}
          >
            <summary className="d-flex align-items-center justify-content-between gap-2 px-3 py-2">
              <span>
                <strong>{row.label}</strong>
                <span className="text-secondary small ms-2">{row.path}</span>
              </span>
              <span className={`badge ${indexed ? "text-bg-success" : "text-bg-secondary"}`}>
                {indexed ? "index" : "noindex"}
              </span>
            </summary>
            <div className="border-top p-3">
              <PageEditor
                path={row.path}
                page={page}
                origin={seo.site.canonicalOrigin}
                onBusy={onBusy}
                onChange={(part) => onChange(patchPage(seo, row.path, part))}
              />
            </div>
          </details>
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
    <div className="d-grid gap-3">
      <p className="text-secondary small mb-0">
        Cài đặt toàn site. Tắt index = Discourage search engines (WordPress Reading).
      </p>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Tên site</label>
          <input className="form-control" value={site.name} onChange={(e) => patchSite({ name: e.target.value })} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Tagline</label>
          <input className="form-control" value={site.tagline} onChange={(e) => patchSite({ tagline: e.target.value })} />
        </div>
      </div>
      <div>
        <label className="form-label">Title mặc định</label>
        <input
          className="form-control"
          value={site.defaultTitle}
          onChange={(e) => patchSite({ defaultTitle: e.target.value })}
        />
      </div>
      <div>
        <label className="form-label">Description mặc định</label>
        <textarea
          className="form-control"
          rows={3}
          value={site.defaultDescription}
          onChange={(e) => patchSite({ defaultDescription: e.target.value })}
        />
      </div>
      <div>
        <label className="form-label">Canonical origin (không slash cuối)</label>
        <input
          className="form-control"
          value={site.canonicalOrigin}
          onChange={(e) => patchSite({ canonicalOrigin: e.target.value })}
        />
        <div className="form-text">Live Pages: https://nchithanh.github.io/MA_DANCE</div>
      </div>
      <ImageField label="OG mặc định" value={site.ogImage} onChange={(ogImage) => patchSite({ ogImage })} onBusy={onBusy} />
      <div>
        <label className="form-label">Twitter / X @</label>
        <input className="form-control" value={site.twitter} onChange={(e) => patchSite({ twitter: e.target.value })} />
      </div>
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          id="seo-noindex"
          checked={site.noindexSite}
          onChange={(e) => patchSite({ noindexSite: e.target.checked })}
        />
        <label className="form-check-label" htmlFor="seo-noindex">
          Discourage search engines (noindex toàn site)
        </label>
      </div>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Google Search Console</label>
          <input
            className="form-control"
            value={site.googleVerify}
            onChange={(e) => patchSite({ googleVerify: e.target.value })}
            placeholder="content của google-site-verification"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Bing</label>
          <input
            className="form-control"
            value={site.bingVerify}
            onChange={(e) => patchSite({ bingVerify: e.target.value })}
            placeholder="msvalidate.01"
          />
        </div>
      </div>
      <div>
        <label className="form-label">robots.txt thêm (tuỳ chọn)</label>
        <textarea
          className="form-control"
          rows={4}
          value={site.robotsExtra}
          onChange={(e) => patchSite({ robotsExtra: e.target.value })}
        />
      </div>
    </div>
  );
}

export function SeoSitemapPanel({ seo, stories }: { seo: SeoDoc; stories: Story[] }) {
  const origin = seo.site.canonicalOrigin;
  const pagesUrl = publicUrl(origin, "/sitemap-pages.xml");
  const storiesUrl = publicUrl(origin, "/sitemap-stories.xml");
  const indexUrl = publicUrl(origin, "/sitemap.xml");
  const workerIndex = `${MA_API_URL}/sitemap.xml`;
  const indexedPages = SEO_FIXED_PAGES.filter((item) => isIndexable(seo, item.path));
  const indexedStories = stories.filter((story) => isIndexable(seo, storySeoPath(story.slug)));

  return (
    <div className="d-grid gap-3">
      <p className="text-secondary small mb-0">
        Sitemap index kiểu WordPress. Google đọc file trên Pages sau mỗi deploy. Worker phục vụ bản live để preview.
      </p>
      <div className="border rounded p-3">
        <p className="fw-bold mb-2">GSC — nộp URL này</p>
        <code className="d-block mb-2">{indexUrl}</code>
        <p className="small text-secondary mb-0">Preview Worker: {workerIndex}</p>
      </div>
      <ul className="list-group">
        <li className="list-group-item d-flex justify-content-between">
          <span>sitemap-pages.xml</span>
          <span className="text-secondary">{indexedPages.length} URL</span>
        </li>
        <li className="list-group-item d-flex justify-content-between">
          <span>sitemap-stories.xml</span>
          <span className="text-secondary">{indexedStories.length} URL</span>
        </li>
      </ul>
      <p className="small text-secondary mb-0">Pages</p>
      <ul className="small mb-0">
        {indexedPages.map((item) => (
          <li key={item.path}>{publicUrl(origin, item.path)}</li>
        ))}
      </ul>
      <p className="small text-secondary mb-0">Stories</p>
      <ul className="small mb-0">
        {indexedStories.map((story) => (
          <li key={story.slug}>{publicUrl(origin, storySeoPath(story.slug))}</li>
        ))}
      </ul>
      <a className="btn btn-outline-secondary btn-sm" href={workerIndex} target="_blank" rel="noreferrer">
        Mở sitemap Worker
      </a>
    </div>
  );
}
