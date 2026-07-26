import Link from 'next/link';

import { SiteNav } from '../../components/site-nav';

const bounties = [
  { id: 'acme-notes', project: 'Acme Notes', title: 'Authentication and authorization issues', reward: '1 NIGHT', status: 'Open', tags: ['Web app', 'Auth'] },
];

export default function BountiesPage() {
  return <main className="app-shell"><SiteNav /><section className="page-heading"><p className="eyebrow">Public programs</p><h1>Bounty board</h1><p>Public terms and protocol state. Researcher identities and report content never appear here.</p></section><section className="bounty-list">{bounties.map((bounty) => <Link className="bounty-row" key={bounty.id} href={`/bounties/${bounty.id}`}><div><p>{bounty.project}</p><h2>{bounty.title}</h2><span>{bounty.tags.join(' · ')}</span></div><div className="bounty-meta"><strong>{bounty.reward}</strong><span className="status-dot">{bounty.status}</span></div></Link>)}</section></main>;
}
