import { SiteHeader } from "@/app/components/SiteHeader";
import { SiteFooter } from "@/app/components/SiteFooter";

export function PolicyPage({
  title,
  intro,
  updated,
  children,
}: {
  title: string;
  intro: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <SiteHeader />
      <main>
        <section className="policy-hero">
          <div className="container">
            <h1>{title}</h1>
            <p>{intro}</p>
          </div>
        </section>

        <section className="policy-content">
          <div className="container">
            <div className="policy-content__card">{children}</div>
            <p className="policy-updated">Last updated: {updated}</p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
