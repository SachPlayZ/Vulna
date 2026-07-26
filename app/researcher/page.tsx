import { ResearcherWorkspace } from '../../components/researcher-workspace';
import { SiteNav } from '../../components/site-nav';

export default function ResearcherPage() {
  return <main id="main-content" className="app-shell"><SiteNav /><section className="page-heading"><p className="eyebrow">Researcher workspace</p><h1>Prepare a confidential disclosure</h1><p>Use only the fictional Acme Notes demo. Connect a Preview Midnight wallet to authorize a proof flow. Report plaintext is never put on-chain or sent to Vulna infrastructure.</p></section><ResearcherWorkspace /></main>;
}
