"use client";

import { useEffect, useRef } from "react";

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
      const { initMaDance } = await import("@/lib/ma-dance-runtime.js");
      if (cancelled) return;
      initMaDance();
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
