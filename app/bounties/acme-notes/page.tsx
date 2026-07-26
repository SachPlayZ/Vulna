import Link from 'next/link';

import { AuditTimeline } from '../../../components/audit-timeline';
import { SiteNav } from '../../../components/site-nav';

export default function AcmeNotesBountyPage() {
  return <main id="main-content" className="app-shell"><SiteNav /><section className="detail-head"><div><p className="eyebrow">Acme Notes · Open bounty</p><h1>Authentication and authorization issues</h1><p>Fictional demo program for harmless authorization reports. Never test real systems through this demo.</p></div><aside><span>Reward</span><strong>1 NIGHT</strong><small>PATCH policy · transparent receipt-linked settlement</small></aside></section><div className="detail-grid"><section><h2>Scope</h2><p>Demo authentication routes and role checks within the Acme Notes sample application.</p><h2>Safe harbor</h2><p>Use only the fictional demo target. Do not access, alter, or retain real user data.</p><h2>Reviewer key</h2><code>Registered encryption key · version 1</code></section><aside className="side-panel"><h2>Submit responsibly</h2><p>Your report is encrypted in-browser before ciphertext is staged. No plaintext is sent to Vulna infrastructure.</p><Link className="button button-primary" href="/researcher">Start a private report</Link></aside></div><section className="audit-panel"><h2>Public audit trail</h2><AuditTimeline /></section></main>;
}
