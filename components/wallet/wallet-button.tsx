'use client';

import { maskAddress } from '../../src/web/midnight-wallet';
import { useWallet } from './wallet-provider';

export function WalletButton() {
  const { address, connectedWallet, connect, disconnect, error, isConnected, isConnecting, status, wallets } = useWallet();

  if (isConnected && address) {
    return <div className="wallet-connected">
      <span title={address}>{connectedWallet?.name ?? 'Wallet'} {maskAddress(address)}</span>
      <button className="wallet-button wallet-disconnect" type="button" onClick={disconnect}>Disconnect</button>
    </div>;
  }

  return <div className="wallet-control">
    <div className="wallet-actions">
      {wallets.length > 1 ? wallets.map((wallet) => <button className="wallet-button" type="button" disabled={isConnecting} key={wallet.id} onClick={() => void connect(wallet.id)}>
        {isConnecting ? 'Connecting' : `Connect ${wallet.name}`}
      </button>) : <button className="wallet-button" type="button" disabled={isConnecting || status === 'checking'} onClick={() => void connect()}>
        {isConnecting ? 'Connecting' : 'Connect wallet'}
      </button>}
    </div>
    {status === 'unavailable' && <span className="wallet-hint">Install or unlock a Midnight wallet extension.</span>}
    {error && <span className="wallet-error" role="alert">{error}</span>}
  </div>;
}
