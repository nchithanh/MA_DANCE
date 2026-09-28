"use client";

import Link from "next/link";
import { CatalogStatus } from "@/components/CatalogStatus";
import { mediaUrl } from "@/lib/media";
import { formatStoryDate } from "@/lib/stories";
import { useSiteData } from "@/lib/use-site-data";

export function StoryDetailClient({ slug }: { slug: string }) {
  const { data, ready, error } = useSiteData();

  if (!data) {
    return <CatalogStatus ready={ready} error={error} />;
  }

  const story = data.stories.find((item) => item.slug === slug) ?? null;

  if (!story) {
    return (
      <p className="ma-empty">
        Không thấy story này trên Worker.{" "}
        <Link href="/stories/">Về danh sách</Link>
      </p>
    );
  }

  return (
    <article className="story-detail">
      <nav className="story-crumb" aria-label="Breadcrumb">
        <Link href="/stories/">Stories</Link>
        <span aria-hidden="true"> / </span>
        <span>{story.title}</span>
      </nav>
      <p className="story-detail__meta">
        <time dateTime={story.date}>{formatStoryDate(story.date)}</time>
        <span> · {story.kindLabel}</span>
      </p>
      <div className="story-detail__hero-wrap">
        <img
          className="story-detail__hero"
          src={mediaUrl(story.image)}
          alt={story.imageAlt}
          width={960}
          height={600}
        />
      </div>
      {story.body.map((p) => (
        <p key={p}>{p}</p>
      ))}
      {story.watchHref ? (
        <p className="story-detail__watch">
          <a
            className="btn btn-primary"
            href={story.watchHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            {story.watchLabel}
          </a>
        </p>
      ) : null}
    </article>
  );
}
