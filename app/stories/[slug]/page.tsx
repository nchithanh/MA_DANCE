import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarketingSubpage } from "@/components/MarketingSubpage";
import { mediaUrl } from "@/lib/media";
import { STORIES, formatStoryDate, getStory } from "@/lib/stories";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return STORIES.map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) return { title: "Stories — MA Dance Studio" };
  return {
    title: `${story.title} — MA Dance Studio`,
    description: story.excerpt,
  };
}

export default async function StoryDetailPage({ params }: Props) {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: story.title,
    datePublished: story.date,
    description: story.excerpt,
    image: mediaUrl(story.image),
    author: { "@type": "Organization", name: "MA Dance Studio" },
  };

  return (
    <MarketingSubpage label={story.kindLabel} title={story.title} lead={story.excerpt}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
    </MarketingSubpage>
  );
}
