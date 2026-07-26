import Image from 'next/image';
import Link from 'next/link';

import { AuditTimeline } from '../components/audit-timeline';
import { LandingExperience } from '../components/landing-experience';
import { SiteNav } from '../components/site-nav';

export default function HomePage() {
  return <LandingExperience><main id="main-content">
    <SiteNav />
    <section className="hero-grid">
      <div className="hero-content">
        <p className="eyebrow" data-hero-enter>Private disclosure protocol</p>
        <h1 data-hero-enter>Fix more.<br /><em>Reveal less.</em></h1>
        <p className="hero-copy" data-hero-enter>Vulna binds a confidential report to an auditable lifecycle. The report stays off-chain and outside application infrastructure.</p>
        <div className="hero-actions" data-hero-enter>
          <Link className="button button-primary" href="/researcher">Start a private report</Link>
          <Link className="button button-quiet" href="/bounties">Browse bounty board</Link>
        </div>
      </div>
      <figure className="hero-media" data-hero-enter>
        <Image src="/images/sealed-dossier.png" alt="A sealed black dossier on textured stone" fill priority sizes="(max-width: 760px) 100vw, 52vw" />
        <figcaption>Confidential by construction</figcaption>
      </figure>
    </section>

    <section className="manifesto" aria-labelledby="manifesto-title">
      <div className="manifesto-heading" data-stack-reveal>
        <p className="eyebrow">The boundary matters</p>
        <h2 id="manifesto-title">A report has two lives.</h2>
      </div>
      <div className="manifesto-copy" data-stack-reveal>
        <p>One is confidential: detail, evidence, and the keys to understand it. The other is verifiable: a commitment, status, and controlled proof of progress.</p>
      </div>
      <ol className="principle-ledger" aria-label="Privacy properties">
        <li data-stack-reveal><span>Local</span><strong>Encrypt before upload</strong><p>Plaintext stays in browser memory until authenticated encryption completes.</p></li>
        <li data-stack-reveal><span>Public</span><strong>Commit, not disclose</strong><p>Midnight receives a commitment and lifecycle state, never report contents.</p></li>
        <li data-stack-reveal><span>Selective</span><strong>Verify before decrypt</strong><p>An authorized reviewer verifies the stored artifact before opening it locally.</p></li>
      </ol>
    </section>

    <section className="evidence-stack" data-evidence-stack aria-labelledby="evidence-title">
      <figure className="evidence-media" data-evidence-media>
        <Image src="/images/evidence-envelope.png" alt="A charcoal evidence envelope tied with a moss green thread" fill sizes="(max-width: 959px) 100vw, 42vw" />
      </figure>
      <div className="evidence-copy">
        <div data-stack-reveal><p className="eyebrow">Designed for responsible disclosure</p><h2 id="evidence-title">Privacy is a workflow, not a promise.</h2></div>
        <article data-stack-reveal><span>Before storage</span><h3>Encrypt locally</h3><p>A fresh content key protects each report revision. Storage receives ciphertext and safe metadata only.</p></article>
        <article data-stack-reveal><span>Before review</span><h3>Verify the artifact</h3><p>The reviewer checks the stored ciphertext and envelope hashes against the chain before decryption.</p></article>
        <article data-stack-reveal><span>During settlement</span><h3>Keep the record honest</h3><p>Preview records a receipt-linked acknowledgment. It does not present transparent payment as shielded escrow.</p></article>
      </div>
    </section>

    <section className="protocol-section" aria-labelledby="protocol-title">
      <div data-stack-reveal><p className="eyebrow">Public evidence</p><h2 id="protocol-title">An auditable lifecycle with a private center.</h2></div>
      <AuditTimeline />
    </section>
    <section className="landing-cta" data-stack-reveal>
      <p className="eyebrow">Use the fictional demo only</p>
      <h2>Make the first disclosure safely.</h2>
      <Link className="button button-primary" href="/researcher">Open researcher workspace</Link>
    </section>
    <footer>Vulna MVP. Fictional demo data only. No third-party analytics on private routes.</footer>
  </main></LandingExperience>;
}
