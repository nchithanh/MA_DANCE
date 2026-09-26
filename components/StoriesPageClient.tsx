"use client";

import Link from "next/link";
import { mediaUrl } from "@/lib/media";
import { storyPublicHref } from "@/lib/site-data";
import { formatStoryDate } from "@/lib/stories";
import { useSiteData } from "@/lib/use-site-data";

export function StoriesPageClient() {
  const { data } = useSiteData();
  const [featured, ...rest] = data.stories;

  return (
    <>
      {featured ? (
        <article className="stories-feat stories-feat--page">
          <Link href={storyPublicHref(featured.slug)}>
            <img
              src={mediaUrl(featured.image)}
              alt={featured.imageAlt}
              width={960}
              height={600}
            />
            <div className="stories-feat__copy">
              <p className="stories-kicker">{featured.kindLabel}</p>
              <h2>{featured.title}</h2>
              <p>{featured.excerpt}</p>
              <time dateTime={featured.date}>{formatStoryDate(featured.date)}</time>
            </div>
          </Link>
        </article>
      ) : null}

      <div className="stories-list">
        {rest.map((story) => (
          <article key={story.slug} className="stories-row">
            <Link href={storyPublicHref(story.slug)}>
              <img
                src={mediaUrl(story.image)}
                alt={story.imageAlt}
                width={400}
                height={300}
              />
              <div>
                <p className="stories-kicker">{story.kindLabel}</p>
                <h2>{story.title}</h2>
                <p>{story.excerpt}</p>
                <time dateTime={story.date}>{formatStoryDate(story.date)}</time>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </>
  );
}
