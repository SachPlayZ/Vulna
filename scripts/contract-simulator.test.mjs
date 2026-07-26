import assert from 'node:assert/strict';
import test from 'node:test';

import {
  CompactTypeBytes,
  CompactTypeVector,
  createCircuitContext,
  createConstructorContext,
  dummyContractAddress,
  persistentCommit,
  persistentHash,
} from '@midnight-ntwrk/compact-runtime';
import { Contract, BountyStatus, OwnerAction, ResearcherAction, ReviewerAction, SubmissionStatus, ledger } from '../contracts/managed/hello-world/contract/index.js';

const bytes = (fill) => new Uint8Array(32).fill(fill);
const ZERO = bytes(0);
const ownerSecret = bytes(1);
const reviewerSecret = bytes(2);
const researcherSecret = bytes(3);
const attackerSecret = bytes(4);
const bytes32 = new CompactTypeBytes(32);
const vector2 = new CompactTypeVector(2, bytes32);
const vector3 = new CompactTypeVector(3, bytes32);
const vector4 = new CompactTypeVector(4, bytes32);
const vector6 = new CompactTypeVector(6, bytes32);

function pad32(value) {
  const encoded = new TextEncoder().encode(value);
  assert.ok(encoded.length <= 32, 'domain separator must fit in Bytes<32>');
  const padded = bytes(0);
  padded.set(encoded);
  return padded;
}

function roleKey(domain, secret) {
  return persistentHash(vector2, [pad32(domain), secret]);
}

function submissionValues(binding, values = {}) {
  const digest = values.digest ?? bytes(10);
  const opening = values.opening ?? bytes(11);
  const severity = values.severity ?? bytes(12);
  const severityOpening = values.severityOpening ?? bytes(13);
  const secret = values.secret ?? researcherSecret;
  const reportCommitment = persistentCommit(vector3, [pad32('vulna:report-commitment:v1'), binding, digest], opening);
  return {
    digest,
    opening,
    reportCommitment,
    severityCommitment: persistentCommit(vector3, [pad32('vulna:severity:v1'), binding, severity], severityOpening),
    ownershipCommitment: persistentHash(vector4, [pad32('vulna:researcher-owner:v1'), secret, binding, reportCommitment]),
    nullifier: persistentHash(vector4, [pad32('vulna:submission-nullifier:v1'), secret, binding, digest]),
  };
}

function supplementValues(binding, previousHeadHash, values = {}) {
  const digest = values.digest ?? bytes(14);
  const opening = values.opening ?? bytes(15);
  const commitment = persistentCommit(vector3, [pad32('vulna:supplement:v1'), binding, digest], opening);
  const artifactHash = values.artifactHash ?? bytes(26);
  const envelopeHash = values.envelopeHash ?? bytes(27);
  return {
    digest,
    opening,
    commitment,
    artifactHash,
    envelopeHash,
    headHash: persistentHash(vector6, [pad32('vulna:supplement-head:v1'), binding, previousHeadHash, commitment, artifactHash, envelopeHash]),
  };
}

function witnesses() {
  return {
    actorSecret: (context) => [context.privateState, context.privateState.actorSecret],
    researcherSecret: (context) => [context.privateState, context.privateState.researcherSecret],
    reportDigest: (context) => [context.privateState, context.privateState.reportDigest],
    reportOpening: (context) => [context.privateState, context.privateState.reportOpening],
    severityValue: (context) => [context.privateState, context.privateState.severityValue],
    severityOpening: (context) => [context.privateState, context.privateState.severityOpening],
    supplementDigest: (context) => [context.privateState, context.privateState.supplementDigest],
    supplementOpening: (context) => [context.privateState, context.privateState.supplementOpening],
  };
}

function createSimulator() {
  const privateState = {
    actorSecret: ownerSecret,
    researcherSecret,
    reportDigest: bytes(10),
    reportOpening: bytes(11),
    severityValue: bytes(12),
    severityOpening: bytes(13),
    supplementDigest: bytes(14),
    supplementOpening: bytes(15),
  };
  const contract = new Contract(witnesses());
  const initial = contract.initialState(createConstructorContext(privateState, { bytes: bytes(99) }));
  let state = initial.currentContractState;
  let currentPrivateState = initial.currentPrivateState;

  return {
    setActor(secret) {
      currentPrivateState = { ...currentPrivateState, actorSecret: secret };
    },
    setResearcher(secret) {
      currentPrivateState = { ...currentPrivateState, researcherSecret: secret };
    },
    setReport(digest, opening) {
      currentPrivateState = { ...currentPrivateState, reportDigest: digest, reportOpening: opening };
    },
    setSeverity(value, opening) {
      currentPrivateState = { ...currentPrivateState, severityValue: value, severityOpening: opening };
    },
    setSupplement(digest, opening) {
      currentPrivateState = { ...currentPrivateState, supplementDigest: digest, supplementOpening: opening };
    },
    call(circuit, ...args) {
      const context = createCircuitContext(
        dummyContractAddress(),
        { bytes: bytes(99) },
        state,
        currentPrivateState,
        undefined,
        undefined,
        0,
      );
      const result = contract.circuits[circuit](context, ...args);
      state = result.context.currentQueryContext.state;
      currentPrivateState = result.context.currentPrivateState;
      return result.result;
    },
    state() {
      return ledger(state);
    },
  };
}

function expectFailure(action, message) {
  assert.throws(action, (error) => error instanceof Error && error.message.includes(message));
}

test('generated Compact lifecycle enforces roles, replay prevention, and reveal opening', () => {
  const sim = createSimulator();
  const binding = bytes(20);
  const reviewerKey = roleKey('vulna:reviewer:v1', reviewerSecret);
  const metadataHash = bytes(22);
  const scopeHash = bytes(23);
  const artifactHash = bytes(24);
  const envelopeHash = bytes(25);
  const submission = submissionValues(binding);

  expectFailure(
    () => sim.call('createBounty', reviewerKey, binding, metadataHash, scopeHash, 0n),
    'reward must be positive',
  );
  const bountyId = sim.call('createBounty', reviewerKey, binding, metadataHash, scopeHash, 100n);
  assert.equal(bountyId, 1n);
  assert.equal(sim.state().bounties.lookup(bountyId).status, BountyStatus.DRAFT);

  sim.setActor(attackerSecret);
  expectFailure(() => sim.call('fundBounty', bountyId), 'owner only');
  sim.setActor(ownerSecret);
  sim.call('fundBounty', bountyId);
  assert.equal(sim.state().bounties.lookup(bountyId).status, BountyStatus.OPEN);
  expectFailure(() => sim.call('fundBounty', bountyId), 'bounty not draft');

  expectFailure(
    () => sim.call('submitDisclosure', bountyId, bytes(200), artifactHash, submission.severityCommitment, submission.ownershipCommitment, submission.nullifier),
    'report commitment invalid',
  );
  const submissionId = sim.call(
    'submitDisclosure',
    bountyId,
    submission.reportCommitment,
    artifactHash,
    submission.severityCommitment,
    submission.ownershipCommitment,
    submission.nullifier,
  );
  assert.equal(submissionId, 1n);
  assert.equal(sim.state().submissions.lookup(submissionId).status, SubmissionStatus.COMMITTED);
  expectFailure(
    () => sim.call('submitDisclosure', bountyId, submission.reportCommitment, artifactHash, submission.severityCommitment, submission.ownershipCommitment, submission.nullifier),
    'nullifier used',
  );
  const delayed = submissionValues(binding, {
    digest: bytes(60), opening: bytes(61), severity: bytes(62), severityOpening: bytes(63),
  });
  sim.setReport(delayed.digest, delayed.opening);
  sim.setSeverity(bytes(62), bytes(63));
  const delayedSubmissionId = sim.call(
    'submitDisclosure', bountyId, delayed.reportCommitment, bytes(64), delayed.severityCommitment, delayed.ownershipCommitment, delayed.nullifier,
  );
  sim.setReport(submission.digest, submission.opening);
  sim.setSeverity(bytes(12), bytes(13));

  sim.setResearcher(attackerSecret);
  expectFailure(() => sim.call('researcherTransition', submissionId, ResearcherAction.GRANT_ACCESS, envelopeHash, ZERO, ZERO, ZERO, ZERO), 'researcher only');
  sim.setResearcher(researcherSecret);
  sim.call('researcherTransition', submissionId, ResearcherAction.GRANT_ACCESS, envelopeHash, ZERO, ZERO, ZERO, ZERO);
  assert.equal(sim.state().submissions.lookup(submissionId).status, SubmissionStatus.ACCESS_GRANTED);

  sim.setActor(attackerSecret);
  expectFailure(() => sim.call('reviewerTransition', submissionId, ReviewerAction.ACKNOWLEDGE_ACCESS, 0n), 'reviewer only');
  sim.setActor(reviewerSecret);
  sim.call('reviewerTransition', submissionId, ReviewerAction.ACKNOWLEDGE_ACCESS, 0n);
  assert.equal(sim.state().submissions.lookup(submissionId).status, SubmissionStatus.UNDER_REVIEW);
  expectFailure(() => sim.call('reviewerTransition', submissionId, ReviewerAction.REQUEST_MORE_INFO, 0n), 'reason invalid');
  sim.call('reviewerTransition', submissionId, ReviewerAction.REQUEST_MORE_INFO, 2n);
  assert.equal(sim.state().submissions.lookup(submissionId).status, SubmissionStatus.NEEDS_MORE_INFO);

  const nextSupplement = supplementValues(binding, ZERO);
  sim.setResearcher(attackerSecret);
  expectFailure(
    () => sim.call('researcherTransition', submissionId, ResearcherAction.ADD_SUPPLEMENT, ZERO, ZERO, nextSupplement.commitment, nextSupplement.artifactHash, nextSupplement.envelopeHash),
    'researcher only',
  );
  sim.setResearcher(researcherSecret);
  sim.setSupplement(nextSupplement.digest, nextSupplement.opening);
  expectFailure(
    () => sim.call('researcherTransition', submissionId, ResearcherAction.ADD_SUPPLEMENT, ZERO, bytes(250), nextSupplement.commitment, nextSupplement.artifactHash, nextSupplement.envelopeHash),
    'supplement head mismatch',
  );
  const supplementId = sim.call('researcherTransition', submissionId, ResearcherAction.ADD_SUPPLEMENT, ZERO, ZERO, nextSupplement.commitment, nextSupplement.artifactHash, nextSupplement.envelopeHash);
  assert.equal(supplementId, 1n);
  assert.equal(sim.state().supplements.lookup(supplementId).headHash.toString(), nextSupplement.headHash.toString());
  assert.equal(sim.state().submissions.lookup(submissionId).status, SubmissionStatus.UNDER_REVIEW);

  sim.setActor(reviewerSecret);
  expectFailure(() => sim.call('reviewerTransition', submissionId, ReviewerAction.ACCEPT, 0n), 'severity invalid');
  expectFailure(() => sim.call('reviewerTransition', submissionId, ReviewerAction.ACCEPT, 5n), 'severity invalid');
  sim.call('reviewerTransition', submissionId, ReviewerAction.ACCEPT, 3n);
  assert.equal(sim.state().submissions.lookup(submissionId).status, SubmissionStatus.ACCEPTED);
  assert.equal(sim.state().bounties.lookup(bountyId).acceptedSubmissionId, submissionId);
  expectFailure(() => sim.call('reviewerTransition', submissionId, ReviewerAction.ACCEPT, 3n), 'wrong submission state');
  sim.setResearcher(researcherSecret);
  expectFailure(() => sim.call('researcherTransition', delayedSubmissionId, ResearcherAction.GRANT_ACCESS, bytes(65), ZERO, ZERO, ZERO, ZERO), 'wrong submission state');

  sim.setActor(attackerSecret);
  expectFailure(() => sim.call('ownerTransition', bountyId, submissionId, OwnerAction.MARK_PATCHED, bytes(28)), 'owner only');
  sim.setActor(ownerSecret);
  sim.call('ownerTransition', bountyId, submissionId, OwnerAction.MARK_PATCHED, bytes(28));
  assert.equal(sim.state().submissions.lookup(submissionId).status, SubmissionStatus.PATCHED);
  expectFailure(() => sim.call('ownerTransition', bountyId, 0n, OwnerAction.CANCEL_BOUNTY, ZERO), 'bounty cannot cancel');

  sim.setReport(bytes(29), submission.opening);
  expectFailure(() => sim.call('researcherTransition', submissionId, ResearcherAction.REVEAL, ZERO, ZERO, ZERO, ZERO, ZERO), 'report opening invalid');
  sim.setReport(submission.digest, submission.opening);
  sim.call('researcherTransition', submissionId, ResearcherAction.REVEAL, ZERO, ZERO, ZERO, ZERO, ZERO);
  const disclosed = sim.state().submissions.lookup(submissionId);
  assert.equal(disclosed.status, SubmissionStatus.DISCLOSED);
  assert.equal(disclosed.revealedReportDigest.toString(), submission.digest.toString());
});

test('generated Compact prevents rejected and withdrawn submission revival and unsafe cancellation', () => {
  const sim = createSimulator();
  const reviewerKey = roleKey('vulna:reviewer:v1', reviewerSecret);

  const cancelableId = sim.call('createBounty', reviewerKey, bytes(30), bytes(31), bytes(32), 1n);
  sim.call('fundBounty', cancelableId);
  sim.call('ownerTransition', cancelableId, 0n, OwnerAction.CANCEL_BOUNTY, ZERO);
  assert.equal(sim.state().bounties.lookup(cancelableId).status, BountyStatus.CANCELLED);
  expectFailure(() => sim.call('submitDisclosure', cancelableId, bytes(33), bytes(34), bytes(35), bytes(36), bytes(37)), 'bounty not open');

  const rejectedBinding = bytes(40);
  const rejectedId = sim.call('createBounty', reviewerKey, rejectedBinding, bytes(41), bytes(42), 2n);
  sim.call('fundBounty', rejectedId);
  const rejected = submissionValues(rejectedBinding, { digest: bytes(43), opening: bytes(44), severity: bytes(45), severityOpening: bytes(46) });
  sim.setReport(rejected.digest, rejected.opening);
  sim.setSeverity(bytes(45), bytes(46));
  sim.setResearcher(researcherSecret);
  const rejectedSubmissionId = sim.call('submitDisclosure', rejectedId, rejected.reportCommitment, bytes(47), rejected.severityCommitment, rejected.ownershipCommitment, rejected.nullifier);
  sim.call('researcherTransition', rejectedSubmissionId, ResearcherAction.GRANT_ACCESS, bytes(48), ZERO, ZERO, ZERO, ZERO);
  sim.setActor(reviewerSecret);
  sim.call('reviewerTransition', rejectedSubmissionId, ReviewerAction.ACKNOWLEDGE_ACCESS, 0n);
  sim.call('reviewerTransition', rejectedSubmissionId, ReviewerAction.REJECT, 1n);
  assert.equal(sim.state().submissions.lookup(rejectedSubmissionId).status, SubmissionStatus.REJECTED);
  expectFailure(() => sim.call('reviewerTransition', rejectedSubmissionId, ReviewerAction.ACCEPT, 2n), 'wrong submission state');
  sim.setResearcher(researcherSecret);
  expectFailure(() => sim.call('researcherTransition', rejectedSubmissionId, ResearcherAction.WITHDRAW, ZERO, ZERO, ZERO, ZERO, ZERO), 'wrong submission state');

  const withdrawnBinding = bytes(50);
  sim.setActor(ownerSecret);
  const withdrawnId = sim.call('createBounty', reviewerKey, withdrawnBinding, bytes(51), bytes(52), 3n);
  sim.call('fundBounty', withdrawnId);
  const withdrawn = submissionValues(withdrawnBinding, { digest: bytes(53), opening: bytes(54), severity: bytes(55), severityOpening: bytes(56) });
  sim.setReport(withdrawn.digest, withdrawn.opening);
  sim.setSeverity(bytes(55), bytes(56));
  const withdrawnSubmissionId = sim.call('submitDisclosure', withdrawnId, withdrawn.reportCommitment, bytes(57), withdrawn.severityCommitment, withdrawn.ownershipCommitment, withdrawn.nullifier);
  sim.call('researcherTransition', withdrawnSubmissionId, ResearcherAction.WITHDRAW, ZERO, ZERO, ZERO, ZERO, ZERO);
  assert.equal(sim.state().submissions.lookup(withdrawnSubmissionId).status, SubmissionStatus.WITHDRAWN);
  expectFailure(() => sim.call('researcherTransition', withdrawnSubmissionId, ResearcherAction.GRANT_ACCESS, bytes(58), ZERO, ZERO, ZERO, ZERO), 'wrong submission state');
});
