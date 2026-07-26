'use client';

import { useState } from 'react';

import { bytes32FromHex } from '../src/crypto/compact-commitments';
import { bytesToHex, sha256 } from '../src/protocol/canonicalize';
import { createBounty, deployVulnaV2, listIndexedBounties, openBounty, type IndexedBounty } from '../src/web/browser-vulna';
import { useWallet } from './wallet/wallet-provider';

function randomBytes32(): Uint8Array {
  const bytes = new Uint8Array(32);
  globalThis.crypto.getRandomValues(bytes);
  return bytes;
}

export function OwnerBountyConsole() {
  const { api, address, isConnected } = useWallet();
  const [contractAddress, setContractAddress] = useState('');
  const [reviewerRole, setReviewerRole] = useState('');
  const [reviewerKey, setReviewerKey] = useState('');
  const [title, setTitle] = useState('Harmless fictional disclosure');
  const [scope, setScope] = useState('Fictional demo application only');
  const [reward, setReward] = useState('1');
  const [bounties, setBounties] = useState<ReadonlyArray<IndexedBounty>>([]);
  const [notice, setNotice] = useState('Deploy V2 with your connected Preview wallet, then create and open a bounty.');

  const requireWallet = () => {
    if (!api || !address) throw new Error('Connect a Preview wallet first.');
    return { api, address };
  };
  const refresh = async (addressValue = contractAddress) => {
    const wallet = requireWallet();
    const next = await listIndexedBounties(wallet.api, wallet.address, addressValue);
    setBounties(next);
  };
  const deploy = async () => {
    try {
      const wallet = requireWallet();
      setNotice('Approve V2 deployment in your wallet, then wait for the Preview indexer…');
      const next = await deployVulnaV2(wallet.api, wallet.address);
      setContractAddress(next);
      localStorage.setItem('vulna-public-v2-contract', next);
      setNotice(`V2 indexed: ${next}`);
      await refresh(next);
    } catch { setNotice('V2 deployment was not confirmed. Check wallet history and do not retry blindly.'); }
  };
  const create = async () => {
    try {
      const wallet = requireWallet();
      if (!contractAddress || !/^[0-9a-f]{64}$/i.test(reviewerRole) || !/^[0-9a-f]{64}$/i.test(reviewerKey) || !/^[1-9][0-9]*$/.test(reward)) throw new Error('Invalid bounty input.');
      setNotice('Approve create-bounty proof in your wallet…');
      await createBounty(wallet.api, wallet.address, contractAddress, {
        reviewerRole: bytes32FromHex(reviewerRole), reviewerEncryptionPublicKey: bytes32FromHex(reviewerKey), reviewerKeyVersion: 1n,
        binding: randomBytes32(), metadataHash: new Uint8Array(await sha256(new TextEncoder().encode(`vulna:public-metadata:v2:${title}`))),
        scopeHash: new Uint8Array(await sha256(new TextEncoder().encode(`vulna:public-scope:v2:${scope}`))), rewardAmount: BigInt(reward),
      });
      await refresh();
      setNotice('Bounty created as DRAFT. Open it in a separate owner transaction.');
    } catch { setNotice('Bounty creation was not confirmed. Check reviewer enrollment values and wallet history.'); }
  };
  const open = async (id: bigint) => {
    try {
      const wallet = requireWallet();
      setNotice('Approve open-bounty proof in your wallet…');
      await openBounty(wallet.api, wallet.address, contractAddress, id);
      await refresh();
      setNotice(`Bounty #${String(id)} is open on Preview.`);
    } catch { setNotice('Bounty opening was not confirmed. Check wallet history before retrying.'); }
  };

  return <section className="composer-shell"><div className="privacy-banner"><span>OWNER</span><p>Bounty labels are safe public metadata. This contract does not escrow NIGHT; reward is a public policy amount only.</p></div><div className="form-grid"><label>V2 contract address<input value={contractAddress} onChange={(event) => setContractAddress(event.target.value.trim())} placeholder="Deploy or paste the V2 contract ID" /></label><label>Reviewer role commitment<input value={reviewerRole} onChange={(event) => setReviewerRole(event.target.value.trim())} placeholder="32-byte hex from reviewer enrollment" /></label><label>Reviewer X25519 public key<input value={reviewerKey} onChange={(event) => setReviewerKey(event.target.value.trim())} placeholder="32-byte hex from reviewer enrollment" /></label><label>Public bounty label<input value={title} onChange={(event) => setTitle(event.target.value)} /></label><label>Public scope summary<input value={scope} onChange={(event) => setScope(event.target.value)} /></label><label>Reward policy units<input inputMode="numeric" value={reward} onChange={(event) => setReward(event.target.value)} /></label></div><div className="composer-footer"><p role="status" aria-live="polite">{notice}</p><button className="button button-secondary" disabled={!isConnected} type="button" onClick={deploy}>Deploy V2</button><button className="button button-primary" disabled={!isConnected} type="button" onClick={create}>Create bounty</button><button className="button button-secondary" disabled={!isConnected || !contractAddress} type="button" onClick={() => void refresh().catch(() => setNotice('Could not read V2 bounties.'))}>Refresh</button></div><div className="bounty-list">{bounties.map((bounty) => <article className="bounty-row" key={String(bounty.id)}><div><p>V2 bounty #{String(bounty.id)}</p><h2>{bounty.status === 1 ? 'Open' : bounty.status === 0 ? 'Draft' : 'Lifecycle updated'}</h2><span>Reward policy: {String(bounty.rewardAmount)} · reviewer key v{String(bounty.reviewerKeyVersion)}</span></div>{bounty.status === 0 && <button className="button button-primary" type="button" onClick={() => open(bounty.id)}>Open bounty</button>}</article>)}</div></section>;
}
