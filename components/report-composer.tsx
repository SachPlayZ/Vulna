'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { createReviewerKeyPair } from '../src/crypto/report-crypto';
import { IndexedDbCiphertextByteStore, VerifiedEncryptedBlobStore } from '../src/storage/encrypted-blob-store';
import { prepareLocalDisclosure, reportDraftFormSchema, type ReportDraftForm } from '../src/web/report-draft';

type Stage = 'draft' | 'encrypted' | 'staged';

const stages: ReadonlyArray<{ key: Stage | 'committed' | 'confirmed'; label: string }> = [
  { key: 'draft', label: 'Local draft' },
  { key: 'encrypted', label: 'Encrypted locally' },
  { key: 'staged', label: 'Ciphertext staged locally' },
  { key: 'committed', label: 'Commitment submitted' },
  { key: 'confirmed', label: 'Confirmed on Midnight' },
];

export function ReportComposer() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ReportDraftForm>({
    defaultValues: { severity: 'high', remediation: '' },
  });
  const [stage, setStage] = useState<Stage>('draft');
  const [notice, setNotice] = useState('Draft remains only in this tab.');
  const [references, setReferences] = useState<Readonly<{ artifactHash: string; envelopeHash: string }> | null>(null);

  const submit = handleSubmit(async (values) => {
    setNotice('Validating and encrypting locally…');
    setReferences(null);
    try {
      const parsed = reportDraftFormSchema.parse(values);
      const reviewer = await createReviewerKeyPair(1);
      const prepared = await prepareLocalDisclosure(parsed, reviewer);
      setStage('encrypted');
      const store = new VerifiedEncryptedBlobStore(new IndexedDbCiphertextByteStore());
      await store.put(prepared.bundle.ciphertext, {
        bountyId: '1',
        submissionTempId: prepared.bundle.envelope.publicMetadata.submissionTempId,
        artifactHash: prepared.bundle.artifactHash,
        envelopeHash: prepared.bundle.envelopeHash,
      });
      setStage('staged');
      setReferences({ artifactHash: prepared.publicReference.artifactHash, envelopeHash: prepared.publicReference.envelopeHash });
      reset();
      setNotice('Ciphertext is staged locally. Connect the configured wallet to submit a real proof and wait for indexer confirmation.');
    } catch {
      setStage('draft');
      setNotice('The report could not be encrypted. No report data was uploaded or submitted.');
    }
  });

  return <section className="composer-shell"><div className="privacy-banner"><span>LOCAL ONLY</span><p>Report fields stay in component memory until browser-side encryption succeeds. No server action or analytics path is used.</p></div><ol className="progress" aria-label="Disclosure progress">{stages.map((item, index) => { const activeIndex = stages.findIndex((entry) => entry.key === stage); const current = item.key === stage; const complete = index < activeIndex; return <li className={current ? 'current' : complete ? 'complete' : ''} key={item.key}><b>{String(index + 1).padStart(2, '0')}</b><span>{item.label}</span></li>; })}</ol><form onSubmit={submit} noValidate><div className="form-grid"><label>Report title<input {...register('title', { required: true })} placeholder="Short, non-sensitive summary" autoComplete="off" />{errors.title && <small>{errors.title.message}</small>}</label><label>Affected demo component<input {...register('affectedComponent', { required: true })} placeholder="e.g. role-gated demo route" autoComplete="off" />{errors.affectedComponent && <small>{errors.affectedComponent.message}</small>}</label><label>Severity<select {...register('severity')}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option></select></label><label>Summary<textarea {...register('summary', { required: true })} rows={4} placeholder="Describe the fictional issue. Never include real credentials." />{errors.summary && <small>{errors.summary.message}</small>}</label><label>Safe reproduction<textarea {...register('reproduction', { required: true })} rows={4} placeholder="Use harmless steps for the fictional demo only." />{errors.reproduction && <small>{errors.reproduction.message}</small>}</label><label>Impact<textarea {...register('impact', { required: true })} rows={3} placeholder="Explain the potential impact." />{errors.impact && <small>{errors.impact.message}</small>}</label><label>Suggested remediation <em>(optional)</em><textarea {...register('remediation')} rows={3} placeholder="A safe remediation suggestion." /></label></div><div className="composer-footer"><p role="status">{notice}</p><button className="button button-primary" disabled={isSubmitting} type="submit">{isSubmitting ? 'Encrypting locally…' : 'Encrypt & stage ciphertext'}</button></div></form>{references && <dl className="safe-references"><div><dt>Ciphertext hash</dt><dd>{references.artifactHash.slice(0, 16)}…</dd></div><div><dt>Envelope hash</dt><dd>{references.envelopeHash.slice(0, 16)}…</dd></div></dl>}<p className="boundary-note">This UI does not mark a report committed until a connected wallet submits a proof and the Midnight indexer confirms it.</p></section>;
}
