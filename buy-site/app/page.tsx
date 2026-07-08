import { SiteHeader } from "@/app/components/SiteHeader";
import { SiteFooter } from "@/app/components/SiteFooter";

type Product = {
  id: string;
  name: string;
  tag: string;
  description: string;
  price: string;
};

const products: Product[] = [
  {
    id: "engine",
    name: "The Engine",
    tag: "Rapid Renewal",
    description:
      "A fast-acting rejuvenation serum that accelerates cellular turnover, visibly smoothing texture and restoring radiance in record time.",
    price: "$215",
  },
  {
    id: "architect",
    name: "The Architect",
    tag: "Scar Repair",
    description:
      "Formulated to support the skin's natural repair process, helping soften the look of scars and rebuild smoother, more even texture.",
    price: "$105",
  },
  {
    id: "shield",
    name: "The Shield",
    tag: "Blemish Defense",
    description:
      "A protective daily formula that helps guard against breakouts, congestion, and everyday environmental stress.",
    price: "$145",
  },
  {
    id: "restorer",
    name: "The Restorer",
    tag: "Collagen + Strength",
    description:
      "Supports collagen production to help strengthen nails, revitalize hair, and firm the look of skin over time.",
    price: "$85",
  },
];

export default function Page() {
  return (
    <div>
      <SiteHeader />

      <main id="top">
        <section className="hero">
          <span className="hero__glow hero__glow--one" />
          <span className="hero__glow hero__glow--two" />
          <div className="container">
            <span className="eyebrow">
              <span className="eyebrow__dot" />
              PEAK STATE SKINCARE
            </span>
            <h1>Four Formulas. One Standard.</h1>
            <p>
              Purpose-built skincare for renewal, repair, protection, and
              strength — crafted with the same standard behind everything
              Peak State makes.
            </p>
          </div>
        </section>

        <section className="products" id="products">
          <div className="container">
            <div className="products__heading">
              <h2>Shop The Collection</h2>
              <p>Four targeted formulas, each built to do one job well.</p>
            </div>

            <div className="product-grid">
              {products.map((product) => (
                <div className="product-card" key={product.id}>
                  <span className="product-card__tag">
                    <span className="product-card__tag-dot" />
                    {product.tag}
                  </span>
                  <h3>{product.name}</h3>
                  <p className="product-card__desc">{product.description}</p>
                  <div className="product-card__footer">
                    <p className="product-card__price">{product.price}</p>
                    <button type="button" className="btn-primary product-card__buy">
                      Add to Cart
                    </button>
                    <p className="product-card__note">
                      Checkout coming soon — payment setup in progress.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
