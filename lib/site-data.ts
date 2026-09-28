import type { Catalog } from "@/lib/ma-api";
import type { Branch, Course, Package } from "@/lib/discovery-data";
import type { Story } from "@/lib/stories";

export const SITE_DATA_VERSION = 1 as const;

/** Local admin draft only — public pages never read this. */
export type SiteData = {
  version: typeof SITE_DATA_VERSION;
  courses: Course[];
  packages: Package[];
  branches: Branch[];
  stories: Story[];
  midEnroll: Catalog["midEnroll"];
};

export function catalogToSiteData(catalog: Catalog): SiteData {
  return {
    version: SITE_DATA_VERSION,
    courses: catalog.courses,
    packages: catalog.packages,
    branches: catalog.branches,
    stories: catalog.stories,
    midEnroll: catalog.midEnroll,
  };
}

export function emptySiteData(): SiteData {
  return {
    version: SITE_DATA_VERSION,
    courses: [],
    packages: [],
    branches: [],
    stories: [],
    midEnroll: [],
  };
}

export function storyPublicHref(slug: string) {
  return `/stories/${slug}/`;
}
