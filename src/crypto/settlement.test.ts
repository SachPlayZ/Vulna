import assert from 'node:assert/strict';
import test from 'node:test';

import { payoutRecipientCommitment, settlementReceiptHash } from './settlement.js';

test('settlement bindings are deterministic and salted', async () => {
  const destination = 'mn_addr_undeployed1fixture';
  const first = await payoutRecipientCommitment(destination, '11'.repeat(32));
  assert.equal(first, await payoutRecipientCommitment(destination, '11'.repeat(32)));
  assert.notEqual(first, await payoutRecipientCommitment(destination, '12'.repeat(32)));
  assert.match(await settlementReceiptHash('wallet-sdk:fixture'), /^[0-9a-f]{64}$/);
});

test('settlement bindings reject unsafe inputs', async () => {
  await assert.rejects(() => payoutRecipientCommitment('', '11'.repeat(32)), /Invalid payout recipient/);
  await assert.rejects(() => settlementReceiptHash(''), /Invalid settlement transaction/);
});
