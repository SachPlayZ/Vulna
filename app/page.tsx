import Link from 'next/link';

import { AuditTimeline } from '../components/audit-timeline';
import { SiteNav } from '../components/site-nav';

export default function HomePage() {
  return (
    <main id="main-content">
      <SiteNav />
      <section className="hero">
        <p className="eyebrow">Private-by-default security workflow</p>
        <h1>Prove the disclosure.<br /><em>Not the exploit.</em></h1>
        <p className="hero-copy">Vulna binds a confidential report to a verifiable lifecycle without putting vulnerability details on-chain or through application infrastructure.</p>
        <div className="hero-actions">
          <Link className="button button-primary" href="/researcher">Create private report</Link>
          <Link className="button button-quiet" href="/bounties">View bounty board</Link>
        </div>
      </section>
      <section className="principles" aria-label="Privacy properties">
        <article><span>01</span><h2>Encrypt locally</h2><p>Report text stays in browser memory until authenticated encryption completes.</p></article>
        <article><span>02</span><h2>Commit precisely</h2><p>Midnight records a commitment, state and integrity references — never the report.</p></article>
        <article><span>03</span><h2>Disclose selectively</h2><p>Only the designated reviewer can decrypt and verify the original package.</p></article>
      </section>
      <section className="protocol-section">
        <div><p className="eyebrow">Audit without exposure</p><h2>A public lifecycle with a private center.</h2></div>
        <AuditTimeline />
      </section>
      <footer>Vulna MVP · Fictional demo data only · No third-party analytics on private routes</footer>
    </main>
  );
}
