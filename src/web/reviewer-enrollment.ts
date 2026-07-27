'use client';

import type { ConnectedAPI } from '@midnight-ntwrk/dapp-connector-api';

import { deriveBrowserWitnessKey } from '../crypto/browser-witness-state.js';
import { EncryptedReviewerEnrollmentRepository, reviewerEnrollmentPublic, type ReviewerEnrollmentPublic } from '../crypto/reviewer-enrollment.js';
import { IndexedDbEncryptedPrivateStateStore } from '../crypto/private-state.js';

/** Creates or restores local reviewer credentials; only the returned bundle may leave the browser. */
export async function enrollReviewer(api: ConnectedAPI, accountId: string): Promise<ReviewerEnrollmentPublic> {
  const encryptionKey = await deriveBrowserWitnessKey(api, accountId);
  const repository = new EncryptedReviewerEnrollmentRepository(
    accountId,
    encryptionKey,
    new IndexedDbEncryptedPrivateStateStore('vulna-reviewer-enrollment'),
  );
  return reviewerEnrollmentPublic(await repository.getOrCreate());
}
