"use client";

import { useEffect, useRef } from "react";
import { hydrateHomeFromCatalog, showHomeCatalogError } from "@/lib/home-catalog";
import { hydrateHomepage, showHomepageError } from "@/lib/home-hydrate";
import { pickI18n, type Homepage } from "@/lib/homepage-data";
import { fetchCatalog, fetchHomepage, type Catalog } from "@/lib/ma-api";

type Props = {
  html: string;
};

/**
 * Homepage shell from `products/MA/ma-dance` template.
 * Markup: content/body.html · behaviour: lib/ma-dance-runtime.js
 */
export function MaDanceHome({ html }: Props) {
  const booted = useRef(false);

  useEffect(() => {
    if (booted.current) return;
    booted.current = true;
    let cancelled = false;

    void (async () => {
      const {
        initMaDance,
        getMaDanceLang,
        onMaLanguageChange,
        refreshImpactCounts,
        refreshHomeChrome,
      } = await import("@/lib/ma-dance-runtime.js");
      if (cancelled) return;
      initMaDance();

      let homepage: Homepage | null = null;
      let catalog: Catalog | null = null;
      try {
        homepage = await fetchHomepage();
      } catch {
        if (!cancelled) showHomepageError();
      }
      try {
        catalog = await fetchCatalog();
      } catch {
        if (!cancelled) showHomeCatalogError();
      }
      if (cancelled) return;

      const apply = (lang: string) => {
        if (homepage) {
          hydrateHomepage(homepage, lang);
          if (catalog) {
            hydrateHomeFromCatalog(catalog, {
              formHref: homepage.formHref,
              ctaLabel: pickI18n(homepage.hero.cta1, lang),
              mapLabel: pickI18n(homepage.branchesHead.map, lang),
            });
          }
        } else if (catalog) {
          hydrateHomeFromCatalog(catalog);
        }
        refreshImpactCounts();
        refreshHomeChrome();
      };

      apply(getMaDanceLang());
      onMaLanguageChange((lang) => {
        if (cancelled) return;
        apply(lang);
      });
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      className="ma-dance-root"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
