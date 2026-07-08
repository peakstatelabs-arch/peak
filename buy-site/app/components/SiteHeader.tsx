export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a href="/" className="brand">
          <img src="/logo.png" alt="Peak State Skincare logo" />
          <span>Peak State Skincare</span>
        </a>
        <nav className="header-nav">
          <a href="/#products">Shop</a>
        </nav>
      </div>
    </header>
  );
}
