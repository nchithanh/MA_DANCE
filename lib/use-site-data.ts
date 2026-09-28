"use client";

import { useEffect, useState } from "react";
import { fetchCatalog, type Catalog } from "@/lib/ma-api";

export function useSiteData() {
  const [data, setData] = useState<Catalog | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchCatalog()
      .then((catalog) => {
        if (cancelled) return;
        setData(catalog);
        setError(null);
        setReady(true);
      })
      .catch((err) => {
        if (cancelled) return;
        setData(null);
        setError(err instanceof Error ? err.message : "catalog_failed");
        setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, error, ready };
}
