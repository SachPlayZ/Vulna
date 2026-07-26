import type { Witnesses } from '../contracts/managed/hello-world/contract/index.js';

export const VULNA_PRIVATE_STATE_ID = 'vulnaPrivateState' as const;

export type VulnaPrivateState = Readonly<{
  actorSecret: Uint8Array;
  researcherSecret: Uint8Array;
  reportDigest: Uint8Array;
  reportOpening: Uint8Array;
  severityValue: Uint8Array;
  severityOpening: Uint8Array;
  supplementDigest: Uint8Array;
  supplementOpening: Uint8Array;
}>;

export class VulnaWitnessStateError extends Error {
  constructor() {
    super('Required Vulna private state is unavailable or invalid.');
    this.name = 'VulnaWitnessStateError';
  }
}

function requireBytes32(value: Uint8Array): Uint8Array {
  if (!(value instanceof Uint8Array) || value.length !== 32) throw new VulnaWitnessStateError();
  return new Uint8Array(value);
}

function value<K extends keyof VulnaPrivateState>(
  context: Parameters<Witnesses<VulnaPrivateState>[K]>[0],
  key: K,
): [VulnaPrivateState, Uint8Array] {
  const state = context.privateState;
  return [state, requireBytes32(state[key])];
}

/**
 * Witnesses only read encrypted, account-scoped private state. Missing values
 * fail closed: a caller must recover the original state instead of minting a
 * replacement secret/opening and losing ownership of an existing disclosure.
 */
export const vulnaWitnesses: Witnesses<VulnaPrivateState> = {
  actorSecret: (context) => value(context, 'actorSecret'),
  researcherSecret: (context) => value(context, 'researcherSecret'),
  reportDigest: (context) => value(context, 'reportDigest'),
  reportOpening: (context) => value(context, 'reportOpening'),
  severityValue: (context) => value(context, 'severityValue'),
  severityOpening: (context) => value(context, 'severityOpening'),
  supplementDigest: (context) => value(context, 'supplementDigest'),
  supplementOpening: (context) => value(context, 'supplementOpening'),
};

/** Explicit initialization only; never call this as recovery fallback. */
export function createInitialVulnaPrivateState(randomBytes: (length: number) => Uint8Array): VulnaPrivateState {
  const next = (): Uint8Array => requireBytes32(randomBytes(32));
  return {
    actorSecret: next(),
    researcherSecret: next(),
    reportDigest: next(),
    reportOpening: next(),
    severityValue: next(),
    severityOpening: next(),
    supplementDigest: next(),
    supplementOpening: next(),
  };
}
