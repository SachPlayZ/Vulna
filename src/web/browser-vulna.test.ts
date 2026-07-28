import assert from 'node:assert/strict';
import test from 'node:test';

import { BountyStatus } from '../../contracts/managed/hello-world/contract/index.js';
import { normalizeBountyStatus } from './browser-vulna.js';

test('public bounty status normalizes generated runtime values before UI comparison', () => {
  assert.equal(normalizeBountyStatus(1), BountyStatus.OPEN);
  assert.equal(normalizeBountyStatus(1n), BountyStatus.OPEN);
  assert.throws(() => normalizeBountyStatus(99), /invalid status/);
});
