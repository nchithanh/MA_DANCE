"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { mediaUrl } from "@/lib/media";
import { formatStoryDate } from "@/lib/stories";
import { useSiteData } from "@/lib/use-site-data";

export function StoryPreviewClient() {
  const params = useSearchParams();
  const slug = params.get("slug") || "";
  const { data, ready } = useSiteData();
  const story = data.stories.find((item) => item.slug === slug);

  if (!ready) return <p>Đang tải…</p>;
  if (!story) {
    return (
      <p className="ma-empty">
        Không thấy story <code>{slug}</code>. <Link href="/stories/">Về Stories</Link>
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
