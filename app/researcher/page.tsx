import { ReportComposer } from '../../components/report-composer';
import { SiteNav } from '../../components/site-nav';

export default function ResearcherPage() {
  return <main className="app-shell"><SiteNav /><section className="page-heading"><p className="eyebrow">Researcher workspace</p><h1>Prepare a confidential disclosure</h1><p>Use only the fictional Acme Notes demo. Report plaintext is never put on-chain or sent to Vulna infrastructure.</p></section><ReportComposer /></main>;
}
