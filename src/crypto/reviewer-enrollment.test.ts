import assert from 'node:assert/strict';
import test from 'node:test';

import { bytesToHex } from '../protocol/canonicalize.js';
import { roleKey } from './compact-commitments.js';
import { generatePrivateStateKey, MemoryEncryptedPrivateStateStore } from './private-state.js';
import { EncryptedReviewerEnrollmentRepository, reviewerEnrollmentPublic, reviewerEnrollmentPublicSchema } from './reviewer-enrollment.js';

test('reviewer enrollment encrypts secrets and exports only the public role bundle', async () => {
  const store = new MemoryEncryptedPrivateStateStore();
  const key = await generatePrivateStateKey();
  const repository = new EncryptedReviewerEnrollmentRepository('preview:reviewer-a', key, store);
  const enrollment = await repository.getOrCreate();
  const recovered = await repository.get();
  const bundle = reviewerEnrollmentPublic(enrollment);

  assert.deepEqual(recovered?.actorSecret, enrollment.actorSecret);
  assert.deepEqual(recovered?.reviewer.privateKey, enrollment.reviewer.privateKey);
  assert.equal(bundle.reviewerRoleCommitment, roleKey('vulna:reviewer:v1', bytesToHex(enrollment.actorSecret)));
  assert.equal(bundle.reviewerEncryptionPublicKey, bytesToHex(enrollment.reviewer.publicKey));
  assert.equal(JSON.stringify(bundle).includes(bytesToHex(enrollment.actorSecret)), false);
  assert.equal(JSON.stringify(bundle).includes(bytesToHex(enrollment.reviewer.privateKey)), false);
  assert.equal(store.valuesForTest().some((value) => new TextDecoder().decode(value).includes(bytesToHex(enrollment.actorSecret))), false);
  assert.equal(store.valuesForTest().some((value) => new TextDecoder().decode(value).includes(bytesToHex(enrollment.reviewer.privateKey))), false);
  assert.throws(() => reviewerEnrollmentPublicSchema.parse({ ...bundle, privateKey: '00'.repeat(32) }));
});

test('reviewer enrollment fails closed with an incorrect account encryption key', async () => {
  const store = new MemoryEncryptedPrivateStateStore();
  const repository = new EncryptedReviewerEnrollmentRepository('preview:reviewer-a', await generatePrivateStateKey(), store);
  await repository.getOrCreate();
  await assert.rejects(
    () => new EncryptedReviewerEnrollmentRepository('preview:reviewer-a', new Uint8Array(32).fill(7), store).get(),
    /could not be decrypted/,
  );
});
