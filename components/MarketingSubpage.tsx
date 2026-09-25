import type { ReactNode } from "react";
import { SiteFrame } from "@/components/SiteFrame";
import { loadChromeHtml, loadFooterHtml } from "@/lib/site-html";

type Props = {
  label?: string;
  title: string;
  lead?: string;
  children: ReactNode;
};

/** Inner marketing page — same chrome as homepage. */
export function MarketingSubpage({
  label = "MA Dance",
  title,
  lead,
  children,
}: Props) {
  return (
    <SiteFrame chrome={loadChromeHtml()} footer={loadFooterHtml()}>
      <main>
        <section className="about page-hero" aria-labelledby="page-heading">
          <div className="container">
            <p className="label">{label}</p>
            <h1 id="page-heading" className="page-h1">
              {title}
            </h1>
            {lead ? <p className="section-sub">{lead}</p> : null}
          </div>
        </section>
        <section className="services page-body">
          <div className="container">{children}</div>
        </section>
      </main>
    </SiteFrame>
  );
}
