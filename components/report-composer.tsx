'use client';

import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { type ReviewerPublicKey } from '../src/crypto/report-crypto';
import { bytes32FromHex } from '../src/crypto/compact-commitments';
import { bytesToHex, sha256 } from '../src/protocol/canonicalize';
import { uploadOpaqueEnvelope } from '../src/storage/opaque-envelope';
import { BountyStatus } from '../contracts/managed/hello-world/contract/index.js';
import { grantReviewerAccess, initializeResearcherWitnessState, listIndexedBounties, saveDisclosureWitnessState, submitDisclosure, type IndexedBounty } from '../src/web/browser-vulna';
import { prepareLocalDisclosure, reportDraftFormSchema, type ReportDraftForm } from '../src/web/report-draft';
import { useWallet } from './wallet/wallet-provider';
import { configuredVulnaV2ContractAddress } from '../src/web/vulna-v2-config';

type Stage = 'draft' | 'encrypted' | 'staged' | 'committed' | 'confirmed';

const stages: ReadonlyArray<{ key: Stage | 'committed' | 'confirmed'; label: string }> = [
  { key: 'draft', label: 'Local draft' },
  { key: 'encrypted', label: 'Encrypted locally' },
  { key: 'staged', label: 'Ciphertext uploaded' },
  { key: 'committed', label: 'Commitment submitted' },
  { key: 'confirmed', label: 'Confirmed on Midnight' },
];

export function ReportComposer() {
  const { address, api, isConnected } = useWallet();
  const { register, handleSubmit, formState: { errors, isDirty, isSubmitting }, reset } = useForm<ReportDraftForm>({
    defaultValues: { severity: 'high', remediation: '' },
  });
  const [stage, setStage] = useState<Stage>('draft');
  const [notice, setNotice] = useState('Draft remains only in this tab.');
  const [references, setReferences] = useState<Readonly<{ artifactHash: string; envelopeHash: string }> | null>(null);
  const [contractAddress, setContractAddress] = useState(configuredVulnaV2ContractAddress);
  const [loadedContractAddress, setLoadedContractAddress] = useState('');
  const [bounties, setBounties] = useState<ReadonlyArray<IndexedBounty>>([]);
  const [selectedBounty, setSelectedBounty] = useState('');
  const [isLoadingBounties, setIsLoadingBounties] = useState(false);

  useEffect(() => {
    const warnOnExit = (event: BeforeUnloadEvent) => {
      if (!isDirty || isSubmitting) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warnOnExit);
    return () => window.removeEventListener('beforeunload', warnOnExit);
  }, [isDirty, isSubmitting]);

  const loadBounties = useCallback(async (targetContractAddress: string) => {
    if (!api || !address || !targetContractAddress.trim()) return;
    setIsLoadingBounties(true);
    setNotice('Loading available Preview bounties…');
    try {
      const next = await listIndexedBounties(api, targetContractAddress.trim());
      const openBounties = next.filter((bounty) => bounty.status === BountyStatus.OPEN);
      setBounties(next);
      setLoadedContractAddress(targetContractAddress.trim());
      setSelectedBounty((current) => openBounties.some((bounty) => String(bounty.id) === current) ? current : (openBounties[0] ? String(openBounties[0].id) : ''));
      setNotice(openBounties.length ? `Bounty #${String(openBounties[0].id)} is ready for a private report.` : 'No open bounties are available on this contract.');
    } catch {
      setBounties([]);
      setSelectedBounty('');
      setLoadedContractAddress('');
      setNotice('Available bounties could not be read. Check the Preview wallet connection and try again.');
    } finally { setIsLoadingBounties(false); }
  }, [address, api]);

  useEffect(() => {
    if (!api || !address || !configuredVulnaV2ContractAddress) {
      setBounties([]);
      setSelectedBounty('');
      setLoadedContractAddress('');
      return;
    }
    void loadBounties(configuredVulnaV2ContractAddress);
  }, [address, api, loadBounties]);

  const submit = handleSubmit(async (values) => {
    setNotice('Validating and encrypting locally…');
    setReferences(null);
    const bounty = bounties.find((candidate) => String(candidate.id) === selectedBounty);
    if (!api || !address || !loadedContractAddress || !bounty) {
      setStage('draft');
      setNotice('Connect a Preview wallet and choose an open bounty first.');
      return;
    }
    try {
      const parsed = reportDraftFormSchema.parse(values);
      const privateState = await initializeResearcherWitnessState(api, address, loadedContractAddress);
      const reviewer: ReviewerPublicKey = { publicKey: bounty.reviewerEncryptionPublicKey, keyId: bytesToHex(await sha256(bounty.reviewerEncryptionPublicKey)), keyVersion: Number(bounty.reviewerKeyVersion) };
      const prepared = await prepareLocalDisclosure(parsed, reviewer, {
        bountyId: String(bounty.id), bountyBinding: bytesToHex(bounty.binding), researcherSecret: bytesToHex(privateState.researcherSecret), payoutRecipientSeed: address,
      });
      setStage('encrypted');
      setNotice('Encrypted locally. Uploading only the opaque envelope…');
      await uploadOpaqueEnvelope(prepared.bundle);
      setStage('staged');
      await saveDisclosureWitnessState(api, address, loadedContractAddress, {
        reportDigest: bytes32FromHex(prepared.witnessValues.reportDigest), reportOpening: bytes32FromHex(prepared.witnessValues.reportOpening),
        severityValue: bytes32FromHex(prepared.witnessValues.severityValue), severityOpening: bytes32FromHex(prepared.witnessValues.severityOpening),
      });
      setNotice('Ciphertext uploaded. Approve the commitment transaction in your wallet…');
      const submissionId = await submitDisclosure(api, address, loadedContractAddress, [bounty.id, bytes32FromHex(prepared.publicReference.reportCommitment), bytes32FromHex(prepared.publicReference.artifactHash), bytes32FromHex(prepared.publicReference.severityCommitment), bytes32FromHex(prepared.witnessValues.ownershipCommitment), bytes32FromHex(prepared.witnessValues.nullifier), bytes32FromHex(prepared.witnessValues.payoutRecipientCommitment)]);
      setStage('committed');
      setNotice('Commitment indexed. Approve the reviewer-access transaction in your wallet…');
      await grantReviewerAccess(api, address, loadedContractAddress, submissionId, bytes32FromHex(prepared.publicReference.envelopeHash));
      setStage('confirmed');
      setReferences({ artifactHash: prepared.publicReference.artifactHash, envelopeHash: prepared.publicReference.envelopeHash });
      reset();
      setNotice('Confirmed on Midnight. The reviewer can fetch and verify the encrypted envelope.');
    } catch {
      setStage('draft');
      setNotice('The report flow stopped. No transaction is marked successful until indexed state confirms it.');
    }
  });

  const openBounties = bounties.filter((bounty) => bounty.status === BountyStatus.OPEN);

  return <section className="composer-shell"><div className="privacy-banner"><span>LOCAL ONLY</span><p>Report fields stay in component memory until browser-side encryption succeeds. No server action or analytics path is used.</p></div><section className="bounty-picker" aria-labelledby="bounty-picker-title"><div><p className="eyebrow">Preview program</p><h2 id="bounty-picker-title">Choose an open bounty</h2><p>Vulna loads the configured Preview program after your wallet connects. Select a bounty before preparing a private report.</p></div>{!isConnected ? <p className="bounty-picker-status">Connect your Preview wallet to load available bounties.</p> : isLoadingBounties ? <p className="bounty-picker-status" role="status">Loading available Preview bounties…</p> : openBounties.length ? <div className="bounty-choice-list" aria-label="Available open bounties">{openBounties.map((bounty) => <button aria-pressed={selectedBounty === String(bounty.id)} className={`bounty-choice${selectedBounty === String(bounty.id) ? ' selected' : ''}`} key={String(bounty.id)} onClick={() => setSelectedBounty(String(bounty.id))} type="button"><span>Open bounty</span><strong>Acme Notes · Bounty #{String(bounty.id)}</strong><small>{String(bounty.rewardAmount)} NIGHT policy reward · reviewer key v{String(bounty.reviewerKeyVersion)}</small></button>)}</div> : <p className="bounty-picker-status" role="status">No open bounties are available right now.</p>}<details className="advanced-contract"><summary>Use another contract</summary><div className="advanced-contract-controls"><label>V2 contract address<input value={contractAddress} onChange={(event) => { setContractAddress(event.target.value.trim()); setBounties([]); setSelectedBounty(''); setLoadedContractAddress(''); }} placeholder="Paste a Preview V2 contract ID…" autoComplete="off" /></label><button className="button button-secondary" disabled={!contractAddress.trim() || isLoadingBounties} type="button" onClick={() => void loadBounties(contractAddress)}>Reload bounties</button></div></details></section><ol className="progress" aria-label="Disclosure progress">{stages.map((item, index) => { const activeIndex = stages.findIndex((entry) => entry.key === stage); const current = item.key === stage; const complete = index < activeIndex; return <li className={current ? 'current' : complete ? 'complete' : ''} key={item.key}><b>{String(index + 1).padStart(2, '0')}</b><span>{item.label}</span></li>; })}</ol><form onSubmit={submit} noValidate><div className="form-grid"><label>Report title<input {...register('title', { required: true })} placeholder="Short, non-sensitive summary…" autoComplete="off" />{errors.title && <small>{errors.title.message}</small>}</label><label>Affected demo component<input {...register('affectedComponent', { required: true })} placeholder="e.g. role-gated demo route…" autoComplete="off" />{errors.affectedComponent && <small>{errors.affectedComponent.message}</small>}</label><label>Severity<select {...register('severity')}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option></select></label><label>Summary<textarea {...register('summary', { required: true })} rows={4} placeholder="Describe the fictional issue. Never include real credentials…" autoComplete="off" />{errors.summary && <small>{errors.summary.message}</small>}</label><label>Safe reproduction<textarea {...register('reproduction', { required: true })} rows={4} placeholder="Use harmless steps for the fictional demo only…" autoComplete="off" />{errors.reproduction && <small>{errors.reproduction.message}</small>}</label><label>Impact<textarea {...register('impact', { required: true })} rows={3} placeholder="Explain the potential impact…" autoComplete="off" />{errors.impact && <small>{errors.impact.message}</small>}</label><label>Suggested remediation <em>(optional)</em><textarea {...register('remediation')} rows={3} placeholder="A safe remediation suggestion…" autoComplete="off" /></label></div><fieldset className="attachment-policy"><legend>Attachments</legend><p>Attachments are disabled in this MVP. Use harmless text in the report only; Vulna never previews or executes active files.</p></fieldset><div className="composer-footer"><p role="status" aria-live="polite">{notice}</p><button className="button button-primary" disabled={isSubmitting || !selectedBounty} type="submit">{isSubmitting ? 'Submitting proof…' : 'Encrypt, upload & submit'}</button></div></form>{references && <dl className="safe-references"><div><dt>Ciphertext hash</dt><dd>{references.artifactHash.slice(0, 16)}…</dd></div><div><dt>Envelope hash</dt><dd>{references.envelopeHash.slice(0, 16)}…</dd></div></dl>}<p className="boundary-note">{isConnected ? 'Wallet connected on Preview. The browser will request two signed proof transactions only after local encryption and Blob verification.' : 'Connect a Preview Midnight wallet before a proof-backed submission can be authorized.'}</p></section>;
}
