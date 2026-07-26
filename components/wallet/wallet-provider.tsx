'use client';

import '@midnight-ntwrk/dapp-connector-api';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { ConnectedAPI, Configuration } from '@midnight-ntwrk/dapp-connector-api';

import { listWallets, VULNA_NETWORK_ID, walletById, walletErrorMessage, type WalletDescriptor } from '../../src/web/midnight-wallet';

type WalletStatus = 'checking' | 'available' | 'unavailable';

type WalletContextValue = Readonly<{
  address: string | null;
  api: ConnectedAPI | null;
  configuration: Configuration | null;
  connectedWallet: WalletDescriptor | null;
  error: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  status: WalletStatus;
  wallets: ReadonlyArray<WalletDescriptor>;
  connect: (walletId?: string) => Promise<void>;
  disconnect: () => void;
  refreshWallets: () => void;
}>;

const WalletContext = createContext<WalletContextValue | null>(null);

function injectedWallets() {
  return typeof window === 'undefined' ? undefined : window.midnight;
}

export function WalletProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [wallets, setWallets] = useState<ReadonlyArray<WalletDescriptor>>([]);
  const [status, setStatus] = useState<WalletStatus>('checking');
  const [address, setAddress] = useState<string | null>(null);
  const [api, setApi] = useState<ConnectedAPI | null>(null);
  const [configuration, setConfiguration] = useState<Configuration | null>(null);
  const [connectedWallet, setConnectedWallet] = useState<WalletDescriptor | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const connecting = useRef(false);

  const disconnect = useCallback(() => {
    setAddress(null);
    setApi(null);
    setConfiguration(null);
    setConnectedWallet(null);
    setIsConnecting(false);
  }, []);

  const refreshWallets = useCallback(() => {
    const available = listWallets(injectedWallets());
    setWallets(available);
    setStatus(available.length > 0 ? 'available' : 'unavailable');
  }, []);

  useEffect(() => {
    refreshWallets();
    const timer = window.setInterval(refreshWallets, 1_500);
    return () => window.clearInterval(timer);
  }, [refreshWallets]);

  const connect = useCallback(async (walletId?: string) => {
    if (connecting.current) return;
    const available = listWallets(injectedWallets());
    const descriptor = walletId ? available.find((wallet) => wallet.id === walletId) : available[0];
    const wallet = descriptor ? walletById(injectedWallets(), descriptor.id) : null;
    if (!wallet || !descriptor) {
      refreshWallets();
      setError('No Midnight wallet was found. Install or unlock a DApp Connector compatible wallet.');
      return;
    }

    connecting.current = true;
    setIsConnecting(true);
    setError(null);
    try {
      const connectedApi = await wallet.connect(VULNA_NETWORK_ID);
      await connectedApi.hintUsage(['getConfiguration', 'getConnectionStatus', 'getUnshieldedAddress']);
      const [nextConfiguration, connectionStatus, unshieldedAddress] = await Promise.all([
        connectedApi.getConfiguration(),
        connectedApi.getConnectionStatus(),
        connectedApi.getUnshieldedAddress(),
      ]);
      if (connectionStatus.status !== 'connected' || connectionStatus.networkId !== VULNA_NETWORK_ID || nextConfiguration.networkId !== VULNA_NETWORK_ID) {
        throw new Error('Unexpected wallet network.');
      }
      setApi(connectedApi);
      setConfiguration(nextConfiguration);
      setAddress(unshieldedAddress.unshieldedAddress);
      setConnectedWallet(descriptor);
    } catch {
      disconnect();
      setError(walletErrorMessage());
    } finally {
      connecting.current = false;
      setIsConnecting(false);
    }
  }, [disconnect, refreshWallets]);

  useEffect(() => {
    if (!api) return;
    let active = true;
    const verifyConnection = async () => {
      try {
        const [connectionStatus, nextConfiguration, nextAddress] = await Promise.all([
          api.getConnectionStatus(),
          api.getConfiguration(),
          api.getUnshieldedAddress(),
        ]);
        if (!active) return;
        if (connectionStatus.status !== 'connected' || connectionStatus.networkId !== VULNA_NETWORK_ID || nextConfiguration.networkId !== VULNA_NETWORK_ID) {
          disconnect();
          setError('Wallet disconnected or changed networks. Reconnect on Preview Midnight to continue.');
          return;
        }
        setConfiguration(nextConfiguration);
        setAddress(nextAddress.unshieldedAddress);
      } catch {
        if (!active) return;
        disconnect();
        setError('Wallet connection was lost. Reconnect to continue.');
      }
    };
    const timer = window.setInterval(verifyConnection, 8_000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [api, disconnect]);

  const value = useMemo<WalletContextValue>(() => ({
    address,
    api,
    configuration,
    connectedWallet,
    error,
    isConnected: api !== null && address !== null,
    isConnecting,
    status,
    wallets,
    connect,
    disconnect,
    refreshWallets,
  }), [address, api, configuration, connectedWallet, connect, disconnect, error, isConnecting, refreshWallets, status, wallets]);

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet(): WalletContextValue {
  const context = useContext(WalletContext);
  if (!context) throw new Error('useWallet must be used within WalletProvider.');
  return context;
}
