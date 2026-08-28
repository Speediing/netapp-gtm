import { BrandLockup } from "./BrandLockup";

export function SiteNav() {
  return (
    <header className="site-header site-header-over">
      <a href="#top" className="nav-brand">
        <BrandLockup size="sm" />
      </a>
      <nav className="header-actions" aria-label="On this page">
        <a className="text-button" href="#agent-fleet">
          Agent fleet
        </a>
        <a className="text-button" href="#jobs">
          Workflows
        </a>
      </nav>
    </header>
  );
}
