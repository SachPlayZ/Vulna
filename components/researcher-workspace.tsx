'use client';

import dynamic from 'next/dynamic';

const ReportComposer = dynamic(
  () => import('./report-composer').then((module) => module.ReportComposer),
  { ssr: false, loading: () => <p className="composer-loading" role="status">Preparing local encryption workspace…</p> },
);

export function ResearcherWorkspace() {
  return <ReportComposer />;
}
