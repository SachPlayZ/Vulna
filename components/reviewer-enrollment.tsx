'use client';

import { useState } from 'react';

import type { ReviewerEnrollmentPublic } from '../src/crypto/reviewer-enrollment';
import { enrollReviewer } from '../src/web/reviewer-enrollment';
import { useWallet } from './wallet/wallet-provider';

export function ReviewerEnrollment() {
  const { api, address, isConnected } = useWallet();
  const [bundle, setBundle] = useState<ReviewerEnrollmentPublic | null>(null);
  const [notice, setNotice] = useState('Connect your Preview wallet to create encrypted reviewer credentials in this browser.');

  const enroll = async () => {
    if (!api || !address) {
      setNotice('Connect a Preview wallet first.');
      return;
    }
    try {
      setNotice('Approve the wallet authorization request to protect local reviewer credentials…');
      const next = await enrollReviewer(api, address);
      setBundle(next);
      setNotice('Enrollment ready. Copy only this public bundle for the bounty operator.');
    } catch {
      setNotice('Reviewer enrollment was not completed. Unlock the Preview wallet and try again.');
    }
  };

  const copyBundle = async () => {
    if (!bundle || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(bundle));
      setNotice('Public enrollment bundle copied. It contains no private key or role secret.');
    } catch {
      setNotice('Could not copy the bundle. Select it manually; do not export private browser data.');
    }
  };

  return <section className="composer-shell"><div className="privacy-banner"><span>REVIEWER ENROLLMENT</span><p>Your Curve25519 private key and reviewer role secret are encrypted in this browser. The operator receives only a public role commitment and public encryption key.</p></div><div className="composer-footer"><p role="status" aria-live="polite">{notice}</p><button className="button button-primary" disabled={!isConnected} type="button" onClick={() => void enroll()}>Create or restore reviewer enrollment</button>{bundle && <button className="button button-secondary" type="button" onClick={() => void copyBundle()}>Copy public bundle</button>}</div>{bundle && <pre className="safe-references" aria-label="Public reviewer enrollment bundle">{JSON.stringify(bundle, null, 2)}</pre>}</section>;
}
