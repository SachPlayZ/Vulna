import assert from 'node:assert/strict';
import test from 'node:test';

import {
  EncryptedPrivateStateRepository,
  generatePrivateStateKey,
  MemoryEncryptedPrivateStateStore,
  PrivateStateUnavailableError,
} from './private-state.js';
import { VulnaCryptoError } from './report-crypto.js';

const accountId = 'researcher-account-1';
const submissionId = '220c0c8c-a39d-48c5-a3ca-36d2ffdcf07e';
const sentinel = 'VULNA_PRIVATE_SENTINEL_7F3A';

function submission() {
  return {
    bountyId: '42',
    reportDigest: '11'.repeat(32),
    reportCommitmentOpening: '22'.repeat(32),
    severityValue: '33'.repeat(32),
    severityCommitmentOpening: '44'.repeat(32),
    artifactLocator: `ciphertext:${sentinel}`,
    artifactHash: '55'.repeat(32),
    envelopeHash: '66'.repeat(32),
  };
}

test('encrypted account-scoped recovery state round-trips and exports ciphertext only', async () => {
  const key = await generatePrivateStateKey();
  const store = new MemoryEncryptedPrivateStateStore();
  const repository = new EncryptedPrivateStateRepository(accountId, key, store);
  await repository.initialize('aa'.repeat(32));
  await repository.saveSubmissionOpening(submissionId, submission());

  assert.deepEqual(await repository.getSubmissionOpening(submissionId), submission());
  const backup = await repository.exportEncryptedBackup();
  assert.equal(new TextDecoder().decode(backup).includes(sentinel), false);
  assert.equal(store.valuesForTest().some((value) => new TextDecoder().decode(value).includes(sentinel)), false);

  const restoredStore = new MemoryEncryptedPrivateStateStore();
  const restored = new EncryptedPrivateStateRepository(accountId, key, restoredStore);
  await restored.importEncryptedBackup(backup);
  assert.deepEqual(await restored.getSubmissionOpening(submissionId), submission());
});

test('private-state recovery fails closed for missing, wrong-account, or wrong-key data', async () => {
  const key = await generatePrivateStateKey();
  const sourceStore = new MemoryEncryptedPrivateStateStore();
  const source = new EncryptedPrivateStateRepository(accountId, key, sourceStore);
  await assert.rejects(() => source.exportEncryptedBackup(), PrivateStateUnavailableError);
  await source.initialize('aa'.repeat(32));
  const backup = await source.exportEncryptedBackup();

  const differentAccount = new EncryptedPrivateStateRepository('researcher-account-2', key, new MemoryEncryptedPrivateStateStore());
  await assert.rejects(() => differentAccount.importEncryptedBackup(backup), (error: unknown) =>
    error instanceof VulnaCryptoError && error.code === 'DECRYPTION_FAILED',
  );

  const differentKey = await generatePrivateStateKey();
  const wrongKey = new EncryptedPrivateStateRepository(accountId, differentKey, new MemoryEncryptedPrivateStateStore());
  await assert.rejects(() => wrongKey.importEncryptedBackup(backup), (error: unknown) =>
    error instanceof VulnaCryptoError && error.code === 'DECRYPTION_FAILED',
  );
});
