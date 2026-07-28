import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export enum BountyStatus { DRAFT = 0,
                           OPEN = 1,
                           ACCEPTED = 2,
                           PATCHED = 3,
                           PAID = 4,
                           CANCELLED = 5
}

export enum SubmissionStatus { COMMITTED = 0,
                               ACCESS_GRANTED = 1,
                               UNDER_REVIEW = 2,
                               NEEDS_MORE_INFO = 3,
                               ACCEPTED = 4,
                               REJECTED = 5,
                               PATCHED = 6,
                               PAID = 7,
                               DISCLOSED = 8,
                               WITHDRAWN = 9
}

export enum ResearcherAction { GRANT_ACCESS = 0,
                               ADD_SUPPLEMENT = 1,
                               WITHDRAW = 2,
                               ACKNOWLEDGE_SETTLEMENT = 3,
                               REVEAL = 4
}

export enum ReviewerAction { ACKNOWLEDGE_ACCESS = 0,
                             REQUEST_MORE_INFO = 1,
                             ACCEPT = 2,
                             REJECT = 3
}

export enum OwnerAction { MARK_PATCHED = 0, CANCEL_BOUNTY = 1 }

export type Witnesses<PS> = {
  actorSecret(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  researcherSecret(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  reportDigest(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  reportOpening(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  severityValue(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  severityOpening(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  supplementDigest(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  supplementOpening(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
}

export type ImpureCircuits<PS> = {
  createBounty(context: __compactRuntime.CircuitContext<PS>,
               reviewer_0: Uint8Array,
               reviewerEncryptionPublicKey_0: Uint8Array,
               reviewerKeyVersion_0: bigint,
               binding_0: Uint8Array,
               metadataHash_0: Uint8Array,
               scopeHash_0: Uint8Array,
               rewardAmount_0: bigint): __compactRuntime.CircuitResults<PS, bigint>;
  openBounty(context: __compactRuntime.CircuitContext<PS>, bountyId_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  submitDisclosure(context: __compactRuntime.CircuitContext<PS>,
                   bountyId_0: bigint,
                   reportCommitment_0: Uint8Array,
                   artifactHash_0: Uint8Array,
                   severityCommitment_0: Uint8Array,
                   ownershipCommitment_0: Uint8Array,
                   nullifier_0: Uint8Array,
                   payoutRecipientCommitment_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
  researcherTransition(context: __compactRuntime.CircuitContext<PS>,
                       submissionId_0: bigint,
                       action_0: ResearcherAction,
                       accessEnvelopeHash_0: Uint8Array,
                       previousHeadHash_0: Uint8Array,
                       supplementCommitment_0: Uint8Array,
                       artifactHash_0: Uint8Array,
                       envelopeHash_0: Uint8Array,
                       settlementReceiptHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
  reviewerTransition(context: __compactRuntime.CircuitContext<PS>,
                     submissionId_0: bigint,
                     action_0: ReviewerAction,
                     value_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  ownerTransition(context: __compactRuntime.CircuitContext<PS>,
                  bountyId_0: bigint,
                  submissionId_0: bigint,
                  action_0: OwnerAction,
                  patchCommitment_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  createBounty(context: __compactRuntime.CircuitContext<PS>,
               reviewer_0: Uint8Array,
               reviewerEncryptionPublicKey_0: Uint8Array,
               reviewerKeyVersion_0: bigint,
               binding_0: Uint8Array,
               metadataHash_0: Uint8Array,
               scopeHash_0: Uint8Array,
               rewardAmount_0: bigint): __compactRuntime.CircuitResults<PS, bigint>;
  openBounty(context: __compactRuntime.CircuitContext<PS>, bountyId_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  submitDisclosure(context: __compactRuntime.CircuitContext<PS>,
                   bountyId_0: bigint,
                   reportCommitment_0: Uint8Array,
                   artifactHash_0: Uint8Array,
                   severityCommitment_0: Uint8Array,
                   ownershipCommitment_0: Uint8Array,
                   nullifier_0: Uint8Array,
                   payoutRecipientCommitment_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
  researcherTransition(context: __compactRuntime.CircuitContext<PS>,
                       submissionId_0: bigint,
                       action_0: ResearcherAction,
                       accessEnvelopeHash_0: Uint8Array,
                       previousHeadHash_0: Uint8Array,
                       supplementCommitment_0: Uint8Array,
                       artifactHash_0: Uint8Array,
                       envelopeHash_0: Uint8Array,
                       settlementReceiptHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
  reviewerTransition(context: __compactRuntime.CircuitContext<PS>,
                     submissionId_0: bigint,
                     action_0: ReviewerAction,
                     value_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  ownerTransition(context: __compactRuntime.CircuitContext<PS>,
                  bountyId_0: bigint,
                  submissionId_0: bigint,
                  action_0: OwnerAction,
                  patchCommitment_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  createBounty(context: __compactRuntime.CircuitContext<PS>,
               reviewer_0: Uint8Array,
               reviewerEncryptionPublicKey_0: Uint8Array,
               reviewerKeyVersion_0: bigint,
               binding_0: Uint8Array,
               metadataHash_0: Uint8Array,
               scopeHash_0: Uint8Array,
               rewardAmount_0: bigint): __compactRuntime.CircuitResults<PS, bigint>;
  openBounty(context: __compactRuntime.CircuitContext<PS>, bountyId_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  submitDisclosure(context: __compactRuntime.CircuitContext<PS>,
                   bountyId_0: bigint,
                   reportCommitment_0: Uint8Array,
                   artifactHash_0: Uint8Array,
                   severityCommitment_0: Uint8Array,
                   ownershipCommitment_0: Uint8Array,
                   nullifier_0: Uint8Array,
                   payoutRecipientCommitment_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
  researcherTransition(context: __compactRuntime.CircuitContext<PS>,
                       submissionId_0: bigint,
                       action_0: ResearcherAction,
                       accessEnvelopeHash_0: Uint8Array,
                       previousHeadHash_0: Uint8Array,
                       supplementCommitment_0: Uint8Array,
                       artifactHash_0: Uint8Array,
                       envelopeHash_0: Uint8Array,
                       settlementReceiptHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
  reviewerTransition(context: __compactRuntime.CircuitContext<PS>,
                     submissionId_0: bigint,
                     action_0: ReviewerAction,
                     value_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  ownerTransition(context: __compactRuntime.CircuitContext<PS>,
                  bountyId_0: bigint,
                  submissionId_0: bigint,
                  action_0: OwnerAction,
                  patchCommitment_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type Ledger = {
  bounties: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: bigint): boolean;
    lookup(key_0: bigint): { owner: Uint8Array,
                             reviewer: Uint8Array,
                             reviewerEncryptionPublicKey: Uint8Array,
                             reviewerKeyVersion: bigint,
                             binding: Uint8Array,
                             metadataHash: Uint8Array,
                             scopeHash: Uint8Array,
                             rewardAmount: bigint,
                             status: BountyStatus,
                             submissionCount: bigint,
                             acceptedSubmissionId: bigint
                           };
    [Symbol.iterator](): Iterator<[bigint, { owner: Uint8Array,
  reviewer: Uint8Array,
  reviewerEncryptionPublicKey: Uint8Array,
  reviewerKeyVersion: bigint,
  binding: Uint8Array,
  metadataHash: Uint8Array,
  scopeHash: Uint8Array,
  rewardAmount: bigint,
  status: BountyStatus,
  submissionCount: bigint,
  acceptedSubmissionId: bigint
}]>
  };
  submissions: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: bigint): boolean;
    lookup(key_0: bigint): { bountyId: bigint,
                             reportCommitment: Uint8Array,
                             artifactHash: Uint8Array,
                             accessEnvelopeHash: Uint8Array,
                             severityCommitment: Uint8Array,
                             ownershipCommitment: Uint8Array,
                             nullifier: Uint8Array,
                             supplementHeadHash: Uint8Array,
                             latestSupplementId: bigint,
                             supplementCount: bigint,
                             moreInfoReasonCode: bigint,
                             acceptedSeverity: bigint,
                             patchCommitment: Uint8Array,
                             revealedReportDigest: Uint8Array,
                             status: SubmissionStatus
                           };
    [Symbol.iterator](): Iterator<[bigint, { bountyId: bigint,
  reportCommitment: Uint8Array,
  artifactHash: Uint8Array,
  accessEnvelopeHash: Uint8Array,
  severityCommitment: Uint8Array,
  ownershipCommitment: Uint8Array,
  nullifier: Uint8Array,
  supplementHeadHash: Uint8Array,
  latestSupplementId: bigint,
  supplementCount: bigint,
  moreInfoReasonCode: bigint,
  acceptedSeverity: bigint,
  patchCommitment: Uint8Array,
  revealedReportDigest: Uint8Array,
  status: SubmissionStatus
}]>
  };
  supplements: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: bigint): boolean;
    lookup(key_0: bigint): { submissionId: bigint,
                             commitment: Uint8Array,
                             artifactHash: Uint8Array,
                             envelopeHash: Uint8Array,
                             previousHeadHash: Uint8Array,
                             headHash: Uint8Array
                           };
    [Symbol.iterator](): Iterator<[bigint, { submissionId: bigint,
  commitment: Uint8Array,
  artifactHash: Uint8Array,
  envelopeHash: Uint8Array,
  previousHeadHash: Uint8Array,
  headHash: Uint8Array
}]>
  };
  usedNullifiers: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
  payoutRecipientCommitments: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: bigint): boolean;
    lookup(key_0: bigint): Uint8Array;
    [Symbol.iterator](): Iterator<[bigint, Uint8Array]>
  };
  payoutReceiptHashes: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: bigint): boolean;
    lookup(key_0: bigint): Uint8Array;
    [Symbol.iterator](): Iterator<[bigint, Uint8Array]>
  };
  readonly bountyCount: bigint;
  readonly submissionCount: bigint;
  readonly supplementCount: bigint;
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
