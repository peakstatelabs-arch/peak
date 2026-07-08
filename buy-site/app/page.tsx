type Product = {
  id: string;
  name: string;
  tag: string;
  description: string;
  price: string;
  icon: React.ReactNode;
};

const iconProps = {
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  strokeWidth: 1.5,
} as const;

const products: Product[] = [
  {
    id: "engine",
    name: "The Engine",
    tag: "Rapid Renewal",
    description:
      "A fast-acting rejuvenation serum that accelerates cellular turnover, visibly smoothing texture and restoring radiance in record time.",
    price: "$215",
    icon: (
      <svg {...iconProps}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  },
  {
    id: "architect",
    name: "The Architect",
    tag: "Scar Repair",
    description:
      "Formulated to support the skin's natural repair process, helping soften the look of scars and rebuild smoother, more even texture.",
    price: "$105",
    icon: (
      <svg {...iconProps}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661V18a2.25 2.25 0 002.25 2.25h15a2.25 2.25 0 002.25-2.25v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H15M9 3.75V9m0-5.25h6M9 9h6M9 9L6 9m9 0h3m-3 0v-5.25"
        />
      </svg>
    ),
  },
  {
    id: "shield",
    name: "The Shield",
    tag: "Blemish Defense",
    description:
      "A protective daily formula that helps guard against breakouts, congestion, and everyday environmental stress.",
    price: "$145",
    icon: (
      <svg {...iconProps}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
        />
      </svg>
    ),
  },
  {
    id: "restorer",
    name: "The Restorer",
    tag: "Collagen + Strength",
    description:
      "Supports collagen production to help strengthen nails, revitalize hair, and firm the look of skin over time.",
    price: "$85",
    icon: (
      <svg {...iconProps}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
        />
      </svg>
    ),
  },
];

export default function Page() {
  return (
    <div>
      <header className="site-header">
        <div className="container site-header__inner">
          <a href="#top" className="brand">
            <img src="/logo.png" alt="Peak State Labs logo" />
            <span>Peak State Labs</span>
          </a>
          <nav className="header-nav">
            <a href="#products">Shop</a>
            <a href="#faq">FAQ</a>
          </nav>
        </div>
      </header>

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
                  <div className="product-card__image">{product.icon}</div>
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

      <footer className="site-footer">
        <div className="container site-footer__inner">
          <div className="site-footer__brand">
            <img src="/logo.png" alt="Peak State Labs logo" />
            <span>Peak State Labs</span>
          </div>
          <div className="site-footer__legal">
            <p>
              These statements have not been evaluated by the Food and Drug
              Administration. These products are not intended to diagnose,
              treat, cure, or prevent any disease. Results may vary from
              person to person.
            </p>
            <p>
              &copy; {new Date().getFullYear()} Peak State Labs. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
