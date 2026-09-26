import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketingSubpage } from "@/components/MarketingSubpage";
import { StoryDetailClient } from "@/components/StoryDetailClient";
import { mediaUrl } from "@/lib/media";
import { STORIES, getStory } from "@/lib/stories";

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
      <StoryDetailClient slug={slug} fallback={story} />
    </MarketingSubpage>
  );
}
