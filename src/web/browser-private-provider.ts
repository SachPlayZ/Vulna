import type { ContractAddress, SigningKey } from '@midnight-ntwrk/compact-runtime';
import type {
  ExportPrivateStatesOptions, ExportSigningKeysOptions, ImportPrivateStatesOptions, ImportPrivateStatesResult,
  ImportSigningKeysOptions, ImportSigningKeysResult, PrivateStateExport, PrivateStateProvider, SigningKeyExport,
} from '@midnight-ntwrk/midnight-js-types';

import { BrowserWitnessStateRepository } from '../crypto/browser-witness-state.js';
import { type VulnaPrivateState } from '../vulna-witnesses.js';

/** Browser adapter used only for witness state; signing-key export is intentionally unsupported in the dApp. */
export class BrowserVulnaPrivateStateProvider implements PrivateStateProvider<'vulnaPrivateState', VulnaPrivateState> {
  #contractAddress: string | null = null;

  constructor(private readonly repository: BrowserWitnessStateRepository) {}

  setContractAddress(address: ContractAddress): void {
    this.#contractAddress = String(address);
  }

  async set(_privateStateId: 'vulnaPrivateState', state: VulnaPrivateState): Promise<void> {
    await this.repository.save(this.address(), state);
  }

  async get(_privateStateId: 'vulnaPrivateState'): Promise<VulnaPrivateState | null> {
    return this.repository.get(this.address());
  }

  async remove(_privateStateId: 'vulnaPrivateState'): Promise<void> { throw new Error('Witness-state removal is not available in the browser.'); }
  async clear(): Promise<void> { throw new Error('Witness-state removal is not available in the browser.'); }
  async setSigningKey(_address: ContractAddress, _signingKey: SigningKey): Promise<void> { throw new Error('Contract maintenance keys are not stored by Vulna.'); }
  async getSigningKey(_address: ContractAddress): Promise<SigningKey | null> { return null; }
  async removeSigningKey(_address: ContractAddress): Promise<void> { throw new Error('Contract maintenance keys are not stored by Vulna.'); }
  async clearSigningKeys(): Promise<void> { throw new Error('Contract maintenance keys are not stored by Vulna.'); }
  async exportPrivateStates(_options?: ExportPrivateStatesOptions): Promise<PrivateStateExport> { throw new Error('Use encrypted browser backup instead.'); }
  async importPrivateStates(_data: PrivateStateExport, _options?: ImportPrivateStatesOptions): Promise<ImportPrivateStatesResult> { throw new Error('Use encrypted browser backup instead.'); }
  async exportSigningKeys(_options?: ExportSigningKeysOptions): Promise<SigningKeyExport> { throw new Error('Contract maintenance keys are not stored by Vulna.'); }
  async importSigningKeys(_data: SigningKeyExport, _options?: ImportSigningKeysOptions): Promise<ImportSigningKeysResult> { throw new Error('Contract maintenance keys are not stored by Vulna.'); }

  private address(): string {
    if (!this.#contractAddress) throw new Error('Contract address is required for private state.');
    return this.#contractAddress;
  }
}
