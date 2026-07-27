import type { InitialAPI } from '@midnight-ntwrk/dapp-connector-api';

export const VULNA_NETWORK_ID = 'preview' as const;

export type WalletDescriptor = Readonly<{
  id: string;
  name: string;
  rdns: string;
}>;

export function listWallets(injected: Record<string, InitialAPI> | undefined): ReadonlyArray<WalletDescriptor> {
  if (!injected) return [];
  return Object.entries(injected)
    .filter((entry): entry is [string, InitialAPI] => Boolean(entry[1]) && typeof entry[1].connect === 'function')
    .map(([id, wallet]) => ({ id, name: wallet.name || 'Midnight wallet', rdns: wallet.rdns || 'unknown.wallet' }));
}

export function walletById(injected: Record<string, InitialAPI> | undefined, id: string): InitialAPI | null {
  const wallet = injected?.[id];
  return wallet && typeof wallet.connect === 'function' ? wallet : null;
}

export function maskAddress(address: string): string {
  if (address.length <= 18) return address;
  return `${address.slice(0, 10)}…${address.slice(-6)}`;
}

export type WalletConnectionStep = 'connect' | 'configuration' | 'address';

export function walletErrorMessage(error?: unknown, step?: WalletConnectionStep): string {
  const message = error instanceof Error ? error.message.toLowerCase() : '';
  if (message.includes('network') || message.includes('preview')) {
    return 'Wallet is on the wrong network. Select Preview Midnight, then reconnect.';
  }
  if (message.includes('denied') || message.includes('rejected') || message.includes('authorized')) {
    return 'Wallet authorization was not completed. Approve Vulna in the wallet, then reconnect.';
  }
  if (step === 'configuration') {
    return 'Wallet connected but did not expose its Preview configuration. Disconnect Vulna in the wallet, reconnect, then try again.';
  }
  if (step === 'address') {
    return 'Wallet connected but did not expose an unshielded Preview address. Unlock the selected account, then reconnect.';
  }
  return 'Wallet connection failed. Unlock your wallet, select Preview Midnight, then try again.';
}
