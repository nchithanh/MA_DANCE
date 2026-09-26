import {
  branches,
  courses,
  packages,
  type Branch,
  type Course,
  type Package,
} from "@/lib/discovery-data";
import { STORIES, type Story } from "@/lib/stories";

export const SITE_DATA_KEY = "ma-site-data";
export const SITE_DATA_VERSION = 1 as const;

export type SiteData = {
  version: typeof SITE_DATA_VERSION;
  courses: Course[];
  packages: Package[];
  branches: Branch[];
  stories: Story[];
};

export function seedSiteData(): SiteData {
  return {
    version: SITE_DATA_VERSION,
    courses: structuredClone(courses),
    packages: structuredClone(packages),
    branches: structuredClone(branches),
    stories: structuredClone(STORIES),
  };
}

export const SEED_STORY_SLUGS = new Set(STORIES.map((story) => story.slug));

export function storyPublicHref(slug: string) {
  return SEED_STORY_SLUGS.has(slug)
    ? `/stories/${slug}/`
    : `/stories/preview/?slug=${encodeURIComponent(slug)}`;
}

export function loadSiteData(): SiteData {
  const seed = seedSiteData();
  if (typeof window === "undefined") return seed;
  try {
    const raw = localStorage.getItem(SITE_DATA_KEY);
    if (!raw) return seed;
    const parsed = JSON.parse(raw) as Partial<SiteData>;
    if (parsed.version !== SITE_DATA_VERSION) return seed;
    return {
      version: SITE_DATA_VERSION,
      courses: Array.isArray(parsed.courses) ? parsed.courses : seed.courses,
      packages: Array.isArray(parsed.packages) ? parsed.packages : seed.packages,
      branches: Array.isArray(parsed.branches) ? parsed.branches : seed.branches,
      stories: Array.isArray(parsed.stories) ? parsed.stories : seed.stories,
    };
  } catch {
    return seed;
  }
}

export function saveSiteData(data: SiteData) {
  localStorage.setItem(
    SITE_DATA_KEY,
    JSON.stringify({ ...data, version: SITE_DATA_VERSION }),
  );
}

export function resetSiteData() {
  localStorage.removeItem(SITE_DATA_KEY);
}
