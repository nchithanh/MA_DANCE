"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  chrome: string;
  footer: string;
  children: ReactNode;
};

/** Same top-bar / header / mobile menu / rails / footer as homepage. */
export function SiteFrame({ chrome, footer, children }: Props) {
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
    <div className="ma-dance-root page-inner">
      <div dangerouslySetInnerHTML={{ __html: chrome }} />
      {children}
      <div dangerouslySetInnerHTML={{ __html: footer }} />
    </div>
  );
}
