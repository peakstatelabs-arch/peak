import { SiteHeader } from "@/app/components/SiteHeader";
import { SiteFooter } from "@/app/components/SiteFooter";
import { AddToCartButton } from "@/app/components/AddToCartButton";
import { products, formatPrice } from "@/app/lib/products";

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
                    <p className="product-card__price">
                      {formatPrice(product.price)}
                    </p>
                    <AddToCartButton productId={product.id} />
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
