import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketingSubpage } from "@/components/MarketingSubpage";
import { StoryDetailClient } from "@/components/StoryDetailClient";
import { fetchCatalog } from "@/lib/ma-api";
import { mediaUrl } from "@/lib/media";
import { routeMetadata } from "@/lib/route-seo";
import { storySeoPath } from "@/lib/seo-data";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const catalog = await fetchCatalog();
  return catalog.stories.map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const catalog = await fetchCatalog();
  const story = catalog.stories.find((item) => item.slug === slug);
  return routeMetadata(storySeoPath(slug), {
    title: story ? `${story.title} — MA Dance Studio` : "Stories — MA Dance Studio",
    description: story?.excerpt || "",
  });
}

export default async function StoryDetailPage({ params }: Props) {
  const { slug } = await params;
  const catalog = await fetchCatalog();
  const story = catalog.stories.find((item) => item.slug === slug);
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
      <StoryDetailClient slug={slug} />
    </MarketingSubpage>
  );
}
