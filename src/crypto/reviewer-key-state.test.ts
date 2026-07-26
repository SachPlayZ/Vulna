import assert from 'node:assert/strict';
import test from 'node:test';

import { createReviewerKeyPair } from './report-crypto.js';
import { generatePrivateStateKey, MemoryEncryptedPrivateStateStore } from './private-state.js';
import { EncryptedReviewerKeyRepository } from './reviewer-key-state.js';

test('reviewer key state encrypts versioned key material and isolates accounts', async () => {
  const store = new MemoryEncryptedPrivateStateStore();
  const key = await generatePrivateStateKey();
  const reviewer = await createReviewerKeyPair(2);
  const repository = new EncryptedReviewerKeyRepository('reviewer-a', key, store);
  await repository.save(reviewer);

  const restored = await repository.get(reviewer.keyId, 2);
  assert.deepEqual(restored?.publicKey, reviewer.publicKey);
  assert.deepEqual(restored?.privateKey, reviewer.privateKey);
  assert.equal(await repository.get(reviewer.keyId, 1), null);
  assert.equal(await new EncryptedReviewerKeyRepository('reviewer-b', key, store).get(reviewer.keyId, 2), null);
  assert.equal(store.valuesForTest().some((value) => new TextDecoder().decode(value).includes(reviewer.keyId)), false);
});

test('reviewer key state fails closed with the wrong encryption key', async () => {
  const store = new MemoryEncryptedPrivateStateStore();
  const reviewer = await createReviewerKeyPair();
  const repository = new EncryptedReviewerKeyRepository('reviewer-a', await generatePrivateStateKey(), store);
  await repository.save(reviewer);
  await assert.rejects(
    () => new EncryptedReviewerKeyRepository('reviewer-a', new Uint8Array(32).fill(7), store).get(reviewer.keyId, 1),
    /could not be decrypted/,
  );
});
