import assert from 'node:assert/strict';
import test from 'node:test';

import { createInitialVulnaPrivateState, vulnaWitnesses, VulnaWitnessStateError } from './vulna-witnesses.js';

test('Vulna witnesses return private values without mutating state', () => {
  const state = createInitialVulnaPrivateState(() => new Uint8Array(32).fill(7));
  const [nextState, value] = vulnaWitnesses.actorSecret({ privateState: state } as never);

  assert.equal(nextState, state);
  assert.deepEqual(value, state.actorSecret);
  assert.notEqual(value, state.actorSecret);
});

test('Vulna witness initialization and reads fail closed on invalid bytes', () => {
  assert.throws(() => createInitialVulnaPrivateState(() => new Uint8Array(31)), VulnaWitnessStateError);

  const badState = createInitialVulnaPrivateState(() => new Uint8Array(32));
  Object.assign(badState, { reportDigest: new Uint8Array(1) });
  assert.throws(() => vulnaWitnesses.reportDigest({ privateState: badState } as never), VulnaWitnessStateError);
});
