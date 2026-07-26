import Link from 'next/link';

import { ThemeToggle } from './theme-toggle';
import { WalletButton } from './wallet/wallet-button';

const links = [
  ['Bounties', '/bounties'],
  ['Researcher', '/researcher'],
  ['Reviewer', '/reviewer'],
] as const;

export function SiteNav() {
  return (
    <header className="site-nav">
      <Link className="wordmark" href="/" aria-label="Vulna home">VULNA<span>/</span></Link>
      <nav aria-label="Primary navigation">
        {links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
      </nav>
    <div className="nav-utilities">
      <ThemeToggle />
      <WalletButton />
      <span className="network-pill"><i aria-hidden="true" /> Preview Midnight</span>
      </div>
    </header>
  );
}
