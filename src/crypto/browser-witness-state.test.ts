import assert from 'node:assert/strict';
import test from 'node:test';

import { BrowserWitnessStateRepository } from './browser-witness-state.js';
import { MemoryEncryptedPrivateStateStore } from './private-state.js';
import { createInitialVulnaPrivateState, VulnaWitnessStateError } from '../vulna-witnesses.js';

test('browser witness state is encrypted, contract-scoped, and fails closed', async () => {
  let next = 0;
  const state = createInitialVulnaPrivateState((length) => new Uint8Array(Array.from({ length }, () => ++next)));
  const store = new MemoryEncryptedPrivateStateStore();
  const key = new Uint8Array(32).fill(7);
  const repository = new BrowserWitnessStateRepository('preview:wallet-a', key, store);
  await repository.save('vulna-contract-a', state);

  const recovered = await repository.get('vulna-contract-a');
  assert.deepEqual(recovered, state);
  assert.equal(new TextDecoder().decode(store.valuesForTest()[0]).includes('BLACKBOX_PRIVATE_SENTINEL_7F3A'), false);
  assert.equal(await repository.get('vulna-contract-b'), null);

  const wrong = new BrowserWitnessStateRepository('preview:wallet-a', new Uint8Array(32).fill(8), store);
  await assert.rejects(() => wrong.get('vulna-contract-a'), VulnaWitnessStateError);
});
