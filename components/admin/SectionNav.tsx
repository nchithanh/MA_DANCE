"use client";

import { Badge } from "@/components/admin/ui";

export function SectionNav({
  sections,
  active,
  onSelect,
}: {
  sections: readonly { id: string; title: string; catalog?: boolean }[];
  active: string;
  onSelect: (id: string) => void;
}) {
  return (
    <nav aria-label="Section homepage" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
      {sections.map((item) => {
        const on = active === item.id;
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={() => onSelect(item.id)}
            className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition duration-200 ${
              on
                ? "border-ma-accent bg-ma-accent/15 text-ma-accent"
                : "border-transparent bg-ma-card text-ma-text-secondary hover:border-ma-border-light hover:text-ma-text"
            }`}
          >
            <span className={`size-1.5 rounded-full ${on ? "bg-ma-accent" : "bg-transparent"}`} aria-hidden />
            {item.title}
            {item.catalog ? <Badge tone="accent">Catalog</Badge> : null}
          </a>
        );
      })}
    </nav>
  );
}

export function LangSwitch({
  locales,
  value,
  onChange,
}: {
  locales: readonly string[];
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <div className="inline-flex rounded-2xl border border-ma-border bg-ma-card p-1" role="tablist" aria-label="Locale homepage">
      {locales.map((item) => {
        const on = value === item;
        return (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => onChange(item)}
            className={`rounded-xl px-3 py-1.5 text-xs font-medium tracking-wide transition duration-200 ${
              on ? "bg-ma-accent text-black" : "text-ma-text-secondary hover:text-ma-text"
            }`}
          >
            {item.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
