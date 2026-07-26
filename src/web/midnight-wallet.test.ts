import test from 'node:test';
import assert from 'node:assert/strict';

import { listWallets, maskAddress, VULNA_NETWORK_ID, walletById } from './midnight-wallet.js';

const firstWallet = {
  name: 'Example Wallet',
  rdns: 'example.wallet',
  icon: '',
  apiVersion: '4.0.1',
  connect: async () => ({}) as never,
};

test('wallet discovery enumerates injected wallet IDs without hardcoding a provider key', () => {
  const wallets = listWallets({ 'extension-uuid': firstWallet });
  assert.deepEqual(wallets, [{ id: 'extension-uuid', name: 'Example Wallet', rdns: 'example.wallet' }]);
  assert.equal(walletById({ 'extension-uuid': firstWallet }, 'extension-uuid'), firstWallet);
  assert.equal(walletById({ 'extension-uuid': firstWallet }, 'missing'), null);
  assert.equal(VULNA_NETWORK_ID, 'preview');
});

test('wallet address display is abbreviated without changing the source address', () => {
  assert.equal(maskAddress('mn_addr_preview1abcdefghijklmnopqrstuvwxyz'), 'mn_addr_pr…uvwxyz');
  assert.equal(maskAddress('short-address'), 'short-address');
});
