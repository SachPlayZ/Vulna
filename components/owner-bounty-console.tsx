'use client';

import { useState } from 'react';

import { listIndexedBounties, type IndexedBounty } from '../src/web/browser-vulna';
import { configuredVulnaV2ContractAddress } from '../src/web/vulna-v2-config';
import { useWallet } from './wallet/wallet-provider';

export function OwnerBountyConsole() {
  const { api, address, isConnected } = useWallet();
  const [bounties, setBounties] = useState<ReadonlyArray<IndexedBounty>>([]);
  const [notice, setNotice] = useState(configuredVulnaV2ContractAddress
    ? 'Configured Preview V2 contract. Connect a wallet to read indexed bounties.'
    : 'No V2 contract is configured yet.');

  const refresh = async () => {
    if (!api || !address || !configuredVulnaV2ContractAddress) {
      setNotice('Connect a Preview wallet after V2 is configured.');
      return;
    }
    try {
      setNotice('Reading indexed V2 bounty state…');
      const next = await listIndexedBounties(api, configuredVulnaV2ContractAddress);
      setBounties(next);
      setNotice(next.length ? 'Indexed V2 bounties loaded.' : 'V2 is indexed; no bounties have been opened yet.');
    } catch {
      setNotice('V2 could not be read. Check the Preview wallet network and try again.');
    }
  };

  return <section className="composer-shell"><div className="privacy-banner"><span>PREVIEW V2</span><p>Configured operator contract: {configuredVulnaV2ContractAddress || 'pending deployment'}. The address is public; its owner witness state remains encrypted locally.</p></div><div className="composer-footer"><p role="status" aria-live="polite">{notice}</p><button className="button button-secondary" disabled={!isConnected || !configuredVulnaV2ContractAddress} type="button" onClick={() => void refresh()}>Refresh bounties</button></div><div className="bounty-list">{bounties.map((bounty) => <article className="bounty-row" key={String(bounty.id)}><div><p>V2 bounty #{String(bounty.id)}</p><h2>{bounty.status === 1 ? 'Open' : bounty.status === 0 ? 'Draft' : 'Lifecycle updated'}</h2><span>Reward policy: {String(bounty.rewardAmount)} · reviewer key v{String(bounty.reviewerKeyVersion)}</span></div></article>)}</div></section>;
}
