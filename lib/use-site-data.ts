"use client";

import { useEffect, useState } from "react";
import { loadSiteData, seedSiteData, type SiteData } from "@/lib/site-data";

export function useSiteData() {
  const [data, setData] = useState<SiteData>(seedSiteData);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setData(loadSiteData());
    setReady(true);
  }, []);

  return { data, ready };
}
