"use client";

import Link from "next/link";
import { mediaUrl } from "@/lib/media";
import { formatStoryDate, type Story } from "@/lib/stories";
import { useSiteData } from "@/lib/use-site-data";

export function StoryDetailClient({
  slug,
  fallback,
}: {
  slug: string;
  fallback: Story;
}) {
  const { data, ready } = useSiteData();
  const story = !ready
    ? fallback
    : data.stories.find((item) => item.slug === slug) ?? null;

  if (ready && !story) {
    return (
      <p className="ma-empty">
        Story đã xóa trên máy này. Reset seed trong Admin để khôi phục, hoặc{" "}
        <Link href="/stories/">về danh sách</Link>.
      </p>
    );
  }

  const view = story ?? fallback;

  return (
    <article className="story-detail">
      <nav className="story-crumb" aria-label="Breadcrumb">
        <Link href="/stories/">Stories</Link>
        <span aria-hidden="true"> / </span>
        <span>{view.title}</span>
      </nav>
      <p className="story-detail__meta">
        <time dateTime={view.date}>{formatStoryDate(view.date)}</time>
        <span> · {view.kindLabel}</span>
      </p>
      <div className="story-detail__hero-wrap">
        <img
          className="story-detail__hero"
          src={mediaUrl(view.image)}
          alt={view.imageAlt}
          width={960}
          height={600}
        />
      </div>
      {view.body.map((p) => (
        <p key={p}>{p}</p>
      ))}
      {view.watchHref ? (
        <p className="story-detail__watch">
          <a
            className="btn btn-primary"
            href={view.watchHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            {view.watchLabel}
          </a>
        </p>
      ) : null}
    </article>
  );
}
