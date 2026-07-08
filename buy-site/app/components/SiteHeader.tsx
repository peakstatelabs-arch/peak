import Link from "next/link";
import { CartLink } from "@/app/components/CartLink";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link href="/" className="brand">
          <img src="/logo.png" alt="Peak State Skincare logo" />
          <span>Peak State Skincare</span>
        </Link>
        <nav className="header-nav">
          <Link href="/#products">Shop</Link>
          <CartLink />
        </nav>
      </div>
    </header>
  );
}
