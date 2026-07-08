import Link from "next/link";

const CONTACT_EMAIL = "paigespierce@gmail.com";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__brand">
          <img src="/logo.png" alt="Peak State Skincare logo" />
          <span>Peak State Skincare</span>
        </div>

        <nav className="site-footer__nav">
          <Link href="/shipping">Shipping Policy</Link>
          <Link href="/returns">Return Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <a href={`mailto:${CONTACT_EMAIL}`}>Contact</a>
        </nav>

        <div className="site-footer__legal">
          <p>
            These statements have not been evaluated by the Food and Drug
            Administration. These products are not intended to diagnose,
            treat, cure, or prevent any disease. Results may vary from person
            to person.
          </p>
          <p>
            Questions? Email us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </p>
          <p>
            &copy; {new Date().getFullYear()} Peak State Skincare. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
