const events = [
  ['01', 'Bounty opened', 'Public scope and reward policy indexed'],
  ['02', 'Report committed', 'Commitment only. Report never enters public state.'],
  ['03', 'Selective review', 'Authorized reviewer decrypts locally'],
  ['04', 'Patch recorded', 'Project records a public patch commitment'],
  ['05', 'Settlement acknowledged', 'Receipt-linked, non-atomic settlement'],
] as const;

export function AuditTimeline() {
  return (
    <ol className="timeline" aria-label="Vulna protocol lifecycle">
      {events.map(([index, title, detail]) => (
        <li key={index}>
          <span>{index}</span>
          <div><strong>{title}</strong><p>{detail}</p></div>
        </li>
      ))}
    </ol>
  );
}
