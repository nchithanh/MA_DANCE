import type { Metadata } from "next";
import Link from "next/link";
import { MarketingSubpage } from "@/components/MarketingSubpage";
import { mediaUrl } from "@/lib/media";
import { STORIES, formatStoryDate } from "@/lib/stories";

export const metadata: Metadata = {
  title: "Stories — MA Dance Studio",
  description:
    "TikTok, YouTube và case studio MA Dance — cover night, class recap, The New Gene, không gian 3 chi nhánh.",
};

export default function StoriesPage() {
  const [featured, ...rest] = STORIES;
  return (
    <MarketingSubpage
      label="Stories"
      title="Chia sẻ từ studio"
      lead="Clip TikTok / YouTube và ghi chú case — không phải catalog khóa. Giữ chỗ vẫn qua form + Zalo."
    >
      {featured ? (
        <article className="stories-feat stories-feat--page">
          <Link href={`/stories/${featured.slug}/`}>
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
            <Link href={`/stories/${story.slug}/`}>
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
    </MarketingSubpage>
  );
}
