import * as __compactRuntime from '@midnight-ntwrk/compact-runtime';
__compactRuntime.checkRuntimeVersion('0.16.0');

export var BountyStatus;
(function (BountyStatus) {
  BountyStatus[BountyStatus['DRAFT'] = 0] = 'DRAFT';
  BountyStatus[BountyStatus['OPEN'] = 1] = 'OPEN';
  BountyStatus[BountyStatus['ACCEPTED'] = 2] = 'ACCEPTED';
  BountyStatus[BountyStatus['PATCHED'] = 3] = 'PATCHED';
  BountyStatus[BountyStatus['PAID'] = 4] = 'PAID';
  BountyStatus[BountyStatus['CANCELLED'] = 5] = 'CANCELLED';
})(BountyStatus || (BountyStatus = {}));

export var SubmissionStatus;
(function (SubmissionStatus) {
  SubmissionStatus[SubmissionStatus['COMMITTED'] = 0] = 'COMMITTED';
  SubmissionStatus[SubmissionStatus['ACCESS_GRANTED'] = 1] = 'ACCESS_GRANTED';
  SubmissionStatus[SubmissionStatus['UNDER_REVIEW'] = 2] = 'UNDER_REVIEW';
  SubmissionStatus[SubmissionStatus['NEEDS_MORE_INFO'] = 3] = 'NEEDS_MORE_INFO';
  SubmissionStatus[SubmissionStatus['ACCEPTED'] = 4] = 'ACCEPTED';
  SubmissionStatus[SubmissionStatus['REJECTED'] = 5] = 'REJECTED';
  SubmissionStatus[SubmissionStatus['PATCHED'] = 6] = 'PATCHED';
  SubmissionStatus[SubmissionStatus['PAID'] = 7] = 'PAID';
  SubmissionStatus[SubmissionStatus['DISCLOSED'] = 8] = 'DISCLOSED';
  SubmissionStatus[SubmissionStatus['WITHDRAWN'] = 9] = 'WITHDRAWN';
})(SubmissionStatus || (SubmissionStatus = {}));

export var ResearcherAction;
(function (ResearcherAction) {
  ResearcherAction[ResearcherAction['GRANT_ACCESS'] = 0] = 'GRANT_ACCESS';
  ResearcherAction[ResearcherAction['ADD_SUPPLEMENT'] = 1] = 'ADD_SUPPLEMENT';
  ResearcherAction[ResearcherAction['WITHDRAW'] = 2] = 'WITHDRAW';
  ResearcherAction[ResearcherAction['ACKNOWLEDGE_SETTLEMENT'] = 3] = 'ACKNOWLEDGE_SETTLEMENT';
  ResearcherAction[ResearcherAction['REVEAL'] = 4] = 'REVEAL';
})(ResearcherAction || (ResearcherAction = {}));

export var ReviewerAction;
(function (ReviewerAction) {
  ReviewerAction[ReviewerAction['ACKNOWLEDGE_ACCESS'] = 0] = 'ACKNOWLEDGE_ACCESS';
  ReviewerAction[ReviewerAction['REQUEST_MORE_INFO'] = 1] = 'REQUEST_MORE_INFO';
  ReviewerAction[ReviewerAction['ACCEPT'] = 2] = 'ACCEPT';
  ReviewerAction[ReviewerAction['REJECT'] = 3] = 'REJECT';
})(ReviewerAction || (ReviewerAction = {}));

export var OwnerAction;
(function (OwnerAction) {
  OwnerAction[OwnerAction['MARK_PATCHED'] = 0] = 'MARK_PATCHED';
  OwnerAction[OwnerAction['CANCEL_BOUNTY'] = 1] = 'CANCEL_BOUNTY';
})(OwnerAction || (OwnerAction = {}));

const _descriptor_0 = new __compactRuntime.CompactTypeUnsignedInteger(18446744073709551615n, 8);

const _descriptor_1 = new __compactRuntime.CompactTypeBytes(32);

const _descriptor_2 = new __compactRuntime.CompactTypeUnsignedInteger(255n, 1);

const _descriptor_3 = new __compactRuntime.CompactTypeEnum(9, 1);

class _Submission_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_2.alignment().concat(_descriptor_2.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_3.alignment()))))))))))))));
  }
  fromValue(value_0) {
    return {
      bountyId: _descriptor_0.fromValue(value_0),
      reportCommitment: _descriptor_1.fromValue(value_0),
      artifactHash: _descriptor_1.fromValue(value_0),
      accessEnvelopeHash: _descriptor_1.fromValue(value_0),
      severityCommitment: _descriptor_1.fromValue(value_0),
      ownershipCommitment: _descriptor_1.fromValue(value_0),
      nullifier: _descriptor_1.fromValue(value_0),
      supplementHeadHash: _descriptor_1.fromValue(value_0),
      latestSupplementId: _descriptor_0.fromValue(value_0),
      supplementCount: _descriptor_0.fromValue(value_0),
      moreInfoReasonCode: _descriptor_2.fromValue(value_0),
      acceptedSeverity: _descriptor_2.fromValue(value_0),
      patchCommitment: _descriptor_1.fromValue(value_0),
      revealedReportDigest: _descriptor_1.fromValue(value_0),
      status: _descriptor_3.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.bountyId).concat(_descriptor_1.toValue(value_0.reportCommitment).concat(_descriptor_1.toValue(value_0.artifactHash).concat(_descriptor_1.toValue(value_0.accessEnvelopeHash).concat(_descriptor_1.toValue(value_0.severityCommitment).concat(_descriptor_1.toValue(value_0.ownershipCommitment).concat(_descriptor_1.toValue(value_0.nullifier).concat(_descriptor_1.toValue(value_0.supplementHeadHash).concat(_descriptor_0.toValue(value_0.latestSupplementId).concat(_descriptor_0.toValue(value_0.supplementCount).concat(_descriptor_2.toValue(value_0.moreInfoReasonCode).concat(_descriptor_2.toValue(value_0.acceptedSeverity).concat(_descriptor_1.toValue(value_0.patchCommitment).concat(_descriptor_1.toValue(value_0.revealedReportDigest).concat(_descriptor_3.toValue(value_0.status)))))))))))))));
  }
}

const _descriptor_4 = new _Submission_0();

const _descriptor_5 = __compactRuntime.CompactTypeBoolean;

const _descriptor_6 = new __compactRuntime.CompactTypeEnum(5, 1);

class _Bounty_0 {
  alignment() {
    return _descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_0.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_0.alignment().concat(_descriptor_6.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment()))))))))));
  }
  fromValue(value_0) {
    return {
      owner: _descriptor_1.fromValue(value_0),
      reviewer: _descriptor_1.fromValue(value_0),
      reviewerEncryptionPublicKey: _descriptor_1.fromValue(value_0),
      reviewerKeyVersion: _descriptor_0.fromValue(value_0),
      binding: _descriptor_1.fromValue(value_0),
      metadataHash: _descriptor_1.fromValue(value_0),
      scopeHash: _descriptor_1.fromValue(value_0),
      rewardAmount: _descriptor_0.fromValue(value_0),
      status: _descriptor_6.fromValue(value_0),
      submissionCount: _descriptor_0.fromValue(value_0),
      acceptedSubmissionId: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_1.toValue(value_0.owner).concat(_descriptor_1.toValue(value_0.reviewer).concat(_descriptor_1.toValue(value_0.reviewerEncryptionPublicKey).concat(_descriptor_0.toValue(value_0.reviewerKeyVersion).concat(_descriptor_1.toValue(value_0.binding).concat(_descriptor_1.toValue(value_0.metadataHash).concat(_descriptor_1.toValue(value_0.scopeHash).concat(_descriptor_0.toValue(value_0.rewardAmount).concat(_descriptor_6.toValue(value_0.status).concat(_descriptor_0.toValue(value_0.submissionCount).concat(_descriptor_0.toValue(value_0.acceptedSubmissionId)))))))))));
  }
}

const _descriptor_7 = new _Bounty_0();

const _descriptor_8 = new __compactRuntime.CompactTypeEnum(3, 1);

const _descriptor_9 = new __compactRuntime.CompactTypeEnum(1, 1);

const _descriptor_10 = new __compactRuntime.CompactTypeUnsignedInteger(65535n, 2);

class _Supplement_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment())))));
  }
  fromValue(value_0) {
    return {
      submissionId: _descriptor_0.fromValue(value_0),
      commitment: _descriptor_1.fromValue(value_0),
      artifactHash: _descriptor_1.fromValue(value_0),
      envelopeHash: _descriptor_1.fromValue(value_0),
      previousHeadHash: _descriptor_1.fromValue(value_0),
      headHash: _descriptor_1.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.submissionId).concat(_descriptor_1.toValue(value_0.commitment).concat(_descriptor_1.toValue(value_0.artifactHash).concat(_descriptor_1.toValue(value_0.envelopeHash).concat(_descriptor_1.toValue(value_0.previousHeadHash).concat(_descriptor_1.toValue(value_0.headHash))))));
  }
}

const _descriptor_11 = new _Supplement_0();

const _descriptor_12 = new __compactRuntime.CompactTypeEnum(4, 1);

const _descriptor_13 = new __compactRuntime.CompactTypeVector(3, _descriptor_1);

const _descriptor_14 = new __compactRuntime.CompactTypeVector(4, _descriptor_1);

const _descriptor_15 = new __compactRuntime.CompactTypeVector(2, _descriptor_1);

const _descriptor_16 = new __compactRuntime.CompactTypeVector(6, _descriptor_1);

class _Either_0 {
  alignment() {
    return _descriptor_5.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment()));
  }
  fromValue(value_0) {
    return {
      is_left: _descriptor_5.fromValue(value_0),
      left: _descriptor_1.fromValue(value_0),
      right: _descriptor_1.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_5.toValue(value_0.is_left).concat(_descriptor_1.toValue(value_0.left).concat(_descriptor_1.toValue(value_0.right)));
  }
}

const _descriptor_17 = new _Either_0();

const _descriptor_18 = new __compactRuntime.CompactTypeUnsignedInteger(340282366920938463463374607431768211455n, 16);

class _ContractAddress_0 {
  alignment() {
    return _descriptor_1.alignment();
  }
  fromValue(value_0) {
    return {
      bytes: _descriptor_1.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_1.toValue(value_0.bytes);
  }
}

const _descriptor_19 = new _ContractAddress_0();

export class Contract {
  witnesses;
  constructor(...args_0) {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`Contract constructor: expected 1 argument, received ${args_0.length}`);
    }
    const witnesses_0 = args_0[0];
    if (typeof(witnesses_0) !== 'object') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor is not an object');
    }
    if (typeof(witnesses_0.actorSecret) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named actorSecret');
    }
    if (typeof(witnesses_0.researcherSecret) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named researcherSecret');
    }
    if (typeof(witnesses_0.reportDigest) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named reportDigest');
    }
    if (typeof(witnesses_0.reportOpening) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named reportOpening');
    }
    if (typeof(witnesses_0.severityValue) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named severityValue');
    }
    if (typeof(witnesses_0.severityOpening) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named severityOpening');
    }
    if (typeof(witnesses_0.supplementDigest) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named supplementDigest');
    }
    if (typeof(witnesses_0.supplementOpening) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named supplementOpening');
    }
    this.witnesses = witnesses_0;
    this.circuits = {
      createBounty: (...args_1) => {
        if (args_1.length !== 8) {
          throw new __compactRuntime.CompactError(`createBounty: expected 8 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const reviewer_0 = args_1[1];
        const reviewerEncryptionPublicKey_0 = args_1[2];
        const reviewerKeyVersion_0 = args_1[3];
        const binding_0 = args_1[4];
        const metadataHash_0 = args_1[5];
        const scopeHash_0 = args_1[6];
        const rewardAmount_0 = args_1[7];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('createBounty',
                                     'argument 1 (as invoked from Typescript)',
                                     'hello-world.compact line 105 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(reviewer_0.buffer instanceof ArrayBuffer && reviewer_0.BYTES_PER_ELEMENT === 1 && reviewer_0.length === 32)) {
          __compactRuntime.typeError('createBounty',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'hello-world.compact line 105 char 1',
                                     'Bytes<32>',
                                     reviewer_0)
        }
        if (!(reviewerEncryptionPublicKey_0.buffer instanceof ArrayBuffer && reviewerEncryptionPublicKey_0.BYTES_PER_ELEMENT === 1 && reviewerEncryptionPublicKey_0.length === 32)) {
          __compactRuntime.typeError('createBounty',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'hello-world.compact line 105 char 1',
                                     'Bytes<32>',
                                     reviewerEncryptionPublicKey_0)
        }
        if (!(typeof(reviewerKeyVersion_0) === 'bigint' && reviewerKeyVersion_0 >= 0n && reviewerKeyVersion_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('createBounty',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'hello-world.compact line 105 char 1',
                                     'Uint<0..18446744073709551616>',
                                     reviewerKeyVersion_0)
        }
        if (!(binding_0.buffer instanceof ArrayBuffer && binding_0.BYTES_PER_ELEMENT === 1 && binding_0.length === 32)) {
          __compactRuntime.typeError('createBounty',
                                     'argument 4 (argument 5 as invoked from Typescript)',
                                     'hello-world.compact line 105 char 1',
                                     'Bytes<32>',
                                     binding_0)
        }
        if (!(metadataHash_0.buffer instanceof ArrayBuffer && metadataHash_0.BYTES_PER_ELEMENT === 1 && metadataHash_0.length === 32)) {
          __compactRuntime.typeError('createBounty',
                                     'argument 5 (argument 6 as invoked from Typescript)',
                                     'hello-world.compact line 105 char 1',
                                     'Bytes<32>',
                                     metadataHash_0)
        }
        if (!(scopeHash_0.buffer instanceof ArrayBuffer && scopeHash_0.BYTES_PER_ELEMENT === 1 && scopeHash_0.length === 32)) {
          __compactRuntime.typeError('createBounty',
                                     'argument 6 (argument 7 as invoked from Typescript)',
                                     'hello-world.compact line 105 char 1',
                                     'Bytes<32>',
                                     scopeHash_0)
        }
        if (!(typeof(rewardAmount_0) === 'bigint' && rewardAmount_0 >= 0n && rewardAmount_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('createBounty',
                                     'argument 7 (argument 8 as invoked from Typescript)',
                                     'hello-world.compact line 105 char 1',
                                     'Uint<0..18446744073709551616>',
                                     rewardAmount_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_1.toValue(reviewer_0).concat(_descriptor_1.toValue(reviewerEncryptionPublicKey_0).concat(_descriptor_0.toValue(reviewerKeyVersion_0).concat(_descriptor_1.toValue(binding_0).concat(_descriptor_1.toValue(metadataHash_0).concat(_descriptor_1.toValue(scopeHash_0).concat(_descriptor_0.toValue(rewardAmount_0))))))),
            alignment: _descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_0.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_0.alignment()))))))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._createBounty_0(context,
                                              partialProofData,
                                              reviewer_0,
                                              reviewerEncryptionPublicKey_0,
                                              reviewerKeyVersion_0,
                                              binding_0,
                                              metadataHash_0,
                                              scopeHash_0,
                                              rewardAmount_0);
        partialProofData.output = { value: _descriptor_0.toValue(result_0), alignment: _descriptor_0.alignment() };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      openBounty: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`openBounty: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const bountyId_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('openBounty',
                                     'argument 1 (as invoked from Typescript)',
                                     'hello-world.compact line 125 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(bountyId_0) === 'bigint' && bountyId_0 >= 0n && bountyId_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('openBounty',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'hello-world.compact line 125 char 1',
                                     'Uint<0..18446744073709551616>',
                                     bountyId_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(bountyId_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._openBounty_0(context,
                                            partialProofData,
                                            bountyId_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      submitDisclosure: (...args_1) => {
        if (args_1.length !== 8) {
          throw new __compactRuntime.CompactError(`submitDisclosure: expected 8 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const bountyId_0 = args_1[1];
        const reportCommitment_0 = args_1[2];
        const artifactHash_0 = args_1[3];
        const severityCommitment_0 = args_1[4];
        const ownershipCommitment_0 = args_1[5];
        const nullifier_0 = args_1[6];
        const payoutRecipientCommitment_0 = args_1[7];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('submitDisclosure',
                                     'argument 1 (as invoked from Typescript)',
                                     'hello-world.compact line 136 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(bountyId_0) === 'bigint' && bountyId_0 >= 0n && bountyId_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('submitDisclosure',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'hello-world.compact line 136 char 1',
                                     'Uint<0..18446744073709551616>',
                                     bountyId_0)
        }
        if (!(reportCommitment_0.buffer instanceof ArrayBuffer && reportCommitment_0.BYTES_PER_ELEMENT === 1 && reportCommitment_0.length === 32)) {
          __compactRuntime.typeError('submitDisclosure',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'hello-world.compact line 136 char 1',
                                     'Bytes<32>',
                                     reportCommitment_0)
        }
        if (!(artifactHash_0.buffer instanceof ArrayBuffer && artifactHash_0.BYTES_PER_ELEMENT === 1 && artifactHash_0.length === 32)) {
          __compactRuntime.typeError('submitDisclosure',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'hello-world.compact line 136 char 1',
                                     'Bytes<32>',
                                     artifactHash_0)
        }
        if (!(severityCommitment_0.buffer instanceof ArrayBuffer && severityCommitment_0.BYTES_PER_ELEMENT === 1 && severityCommitment_0.length === 32)) {
          __compactRuntime.typeError('submitDisclosure',
                                     'argument 4 (argument 5 as invoked from Typescript)',
                                     'hello-world.compact line 136 char 1',
                                     'Bytes<32>',
                                     severityCommitment_0)
        }
        if (!(ownershipCommitment_0.buffer instanceof ArrayBuffer && ownershipCommitment_0.BYTES_PER_ELEMENT === 1 && ownershipCommitment_0.length === 32)) {
          __compactRuntime.typeError('submitDisclosure',
                                     'argument 5 (argument 6 as invoked from Typescript)',
                                     'hello-world.compact line 136 char 1',
                                     'Bytes<32>',
                                     ownershipCommitment_0)
        }
        if (!(nullifier_0.buffer instanceof ArrayBuffer && nullifier_0.BYTES_PER_ELEMENT === 1 && nullifier_0.length === 32)) {
          __compactRuntime.typeError('submitDisclosure',
                                     'argument 6 (argument 7 as invoked from Typescript)',
                                     'hello-world.compact line 136 char 1',
                                     'Bytes<32>',
                                     nullifier_0)
        }
        if (!(payoutRecipientCommitment_0.buffer instanceof ArrayBuffer && payoutRecipientCommitment_0.BYTES_PER_ELEMENT === 1 && payoutRecipientCommitment_0.length === 32)) {
          __compactRuntime.typeError('submitDisclosure',
                                     'argument 7 (argument 8 as invoked from Typescript)',
                                     'hello-world.compact line 136 char 1',
                                     'Bytes<32>',
                                     payoutRecipientCommitment_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(bountyId_0).concat(_descriptor_1.toValue(reportCommitment_0).concat(_descriptor_1.toValue(artifactHash_0).concat(_descriptor_1.toValue(severityCommitment_0).concat(_descriptor_1.toValue(ownershipCommitment_0).concat(_descriptor_1.toValue(nullifier_0).concat(_descriptor_1.toValue(payoutRecipientCommitment_0))))))),
            alignment: _descriptor_0.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment()))))))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._submitDisclosure_0(context,
                                                  partialProofData,
                                                  bountyId_0,
                                                  reportCommitment_0,
                                                  artifactHash_0,
                                                  severityCommitment_0,
                                                  ownershipCommitment_0,
                                                  nullifier_0,
                                                  payoutRecipientCommitment_0);
        partialProofData.output = { value: _descriptor_0.toValue(result_0), alignment: _descriptor_0.alignment() };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      researcherTransition: (...args_1) => {
        if (args_1.length !== 9) {
          throw new __compactRuntime.CompactError(`researcherTransition: expected 9 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const submissionId_0 = args_1[1];
        const action_0 = args_1[2];
        const accessEnvelopeHash_0 = args_1[3];
        const previousHeadHash_0 = args_1[4];
        const supplementCommitment_0 = args_1[5];
        const artifactHash_0 = args_1[6];
        const envelopeHash_0 = args_1[7];
        const settlementReceiptHash_0 = args_1[8];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('researcherTransition',
                                     'argument 1 (as invoked from Typescript)',
                                     'hello-world.compact line 174 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(submissionId_0) === 'bigint' && submissionId_0 >= 0n && submissionId_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('researcherTransition',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'hello-world.compact line 174 char 1',
                                     'Uint<0..18446744073709551616>',
                                     submissionId_0)
        }
        if (!(typeof(action_0) === 'number' && action_0 >= 0 && action_0 <= 4)) {
          __compactRuntime.typeError('researcherTransition',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'hello-world.compact line 174 char 1',
                                     'Enum<ResearcherAction, GRANT_ACCESS, ADD_SUPPLEMENT, WITHDRAW, ACKNOWLEDGE_SETTLEMENT, REVEAL>',
                                     action_0)
        }
        if (!(accessEnvelopeHash_0.buffer instanceof ArrayBuffer && accessEnvelopeHash_0.BYTES_PER_ELEMENT === 1 && accessEnvelopeHash_0.length === 32)) {
          __compactRuntime.typeError('researcherTransition',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'hello-world.compact line 174 char 1',
                                     'Bytes<32>',
                                     accessEnvelopeHash_0)
        }
        if (!(previousHeadHash_0.buffer instanceof ArrayBuffer && previousHeadHash_0.BYTES_PER_ELEMENT === 1 && previousHeadHash_0.length === 32)) {
          __compactRuntime.typeError('researcherTransition',
                                     'argument 4 (argument 5 as invoked from Typescript)',
                                     'hello-world.compact line 174 char 1',
                                     'Bytes<32>',
                                     previousHeadHash_0)
        }
        if (!(supplementCommitment_0.buffer instanceof ArrayBuffer && supplementCommitment_0.BYTES_PER_ELEMENT === 1 && supplementCommitment_0.length === 32)) {
          __compactRuntime.typeError('researcherTransition',
                                     'argument 5 (argument 6 as invoked from Typescript)',
                                     'hello-world.compact line 174 char 1',
                                     'Bytes<32>',
                                     supplementCommitment_0)
        }
        if (!(artifactHash_0.buffer instanceof ArrayBuffer && artifactHash_0.BYTES_PER_ELEMENT === 1 && artifactHash_0.length === 32)) {
          __compactRuntime.typeError('researcherTransition',
                                     'argument 6 (argument 7 as invoked from Typescript)',
                                     'hello-world.compact line 174 char 1',
                                     'Bytes<32>',
                                     artifactHash_0)
        }
        if (!(envelopeHash_0.buffer instanceof ArrayBuffer && envelopeHash_0.BYTES_PER_ELEMENT === 1 && envelopeHash_0.length === 32)) {
          __compactRuntime.typeError('researcherTransition',
                                     'argument 7 (argument 8 as invoked from Typescript)',
                                     'hello-world.compact line 174 char 1',
                                     'Bytes<32>',
                                     envelopeHash_0)
        }
        if (!(settlementReceiptHash_0.buffer instanceof ArrayBuffer && settlementReceiptHash_0.BYTES_PER_ELEMENT === 1 && settlementReceiptHash_0.length === 32)) {
          __compactRuntime.typeError('researcherTransition',
                                     'argument 8 (argument 9 as invoked from Typescript)',
                                     'hello-world.compact line 174 char 1',
                                     'Bytes<32>',
                                     settlementReceiptHash_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(submissionId_0).concat(_descriptor_12.toValue(action_0).concat(_descriptor_1.toValue(accessEnvelopeHash_0).concat(_descriptor_1.toValue(previousHeadHash_0).concat(_descriptor_1.toValue(supplementCommitment_0).concat(_descriptor_1.toValue(artifactHash_0).concat(_descriptor_1.toValue(envelopeHash_0).concat(_descriptor_1.toValue(settlementReceiptHash_0)))))))),
            alignment: _descriptor_0.alignment().concat(_descriptor_12.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment())))))))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._researcherTransition_0(context,
                                                      partialProofData,
                                                      submissionId_0,
                                                      action_0,
                                                      accessEnvelopeHash_0,
                                                      previousHeadHash_0,
                                                      supplementCommitment_0,
                                                      artifactHash_0,
                                                      envelopeHash_0,
                                                      settlementReceiptHash_0);
        partialProofData.output = { value: _descriptor_0.toValue(result_0), alignment: _descriptor_0.alignment() };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      reviewerTransition: (...args_1) => {
        if (args_1.length !== 4) {
          throw new __compactRuntime.CompactError(`reviewerTransition: expected 4 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const submissionId_0 = args_1[1];
        const action_0 = args_1[2];
        const value_0 = args_1[3];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('reviewerTransition',
                                     'argument 1 (as invoked from Typescript)',
                                     'hello-world.compact line 231 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(submissionId_0) === 'bigint' && submissionId_0 >= 0n && submissionId_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('reviewerTransition',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'hello-world.compact line 231 char 1',
                                     'Uint<0..18446744073709551616>',
                                     submissionId_0)
        }
        if (!(typeof(action_0) === 'number' && action_0 >= 0 && action_0 <= 3)) {
          __compactRuntime.typeError('reviewerTransition',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'hello-world.compact line 231 char 1',
                                     'Enum<ReviewerAction, ACKNOWLEDGE_ACCESS, REQUEST_MORE_INFO, ACCEPT, REJECT>',
                                     action_0)
        }
        if (!(typeof(value_0) === 'bigint' && value_0 >= 0n && value_0 <= 255n)) {
          __compactRuntime.typeError('reviewerTransition',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'hello-world.compact line 231 char 1',
                                     'Uint<0..256>',
                                     value_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(submissionId_0).concat(_descriptor_8.toValue(action_0).concat(_descriptor_2.toValue(value_0))),
            alignment: _descriptor_0.alignment().concat(_descriptor_8.alignment().concat(_descriptor_2.alignment()))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._reviewerTransition_0(context,
                                                    partialProofData,
                                                    submissionId_0,
                                                    action_0,
                                                    value_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      ownerTransition: (...args_1) => {
        if (args_1.length !== 5) {
          throw new __compactRuntime.CompactError(`ownerTransition: expected 5 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const bountyId_0 = args_1[1];
        const submissionId_0 = args_1[2];
        const action_0 = args_1[3];
        const patchCommitment_0 = args_1[4];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('ownerTransition',
                                     'argument 1 (as invoked from Typescript)',
                                     'hello-world.compact line 255 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(bountyId_0) === 'bigint' && bountyId_0 >= 0n && bountyId_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('ownerTransition',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'hello-world.compact line 255 char 1',
                                     'Uint<0..18446744073709551616>',
                                     bountyId_0)
        }
        if (!(typeof(submissionId_0) === 'bigint' && submissionId_0 >= 0n && submissionId_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('ownerTransition',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'hello-world.compact line 255 char 1',
                                     'Uint<0..18446744073709551616>',
                                     submissionId_0)
        }
        if (!(typeof(action_0) === 'number' && action_0 >= 0 && action_0 <= 1)) {
          __compactRuntime.typeError('ownerTransition',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'hello-world.compact line 255 char 1',
                                     'Enum<OwnerAction, MARK_PATCHED, CANCEL_BOUNTY>',
                                     action_0)
        }
        if (!(patchCommitment_0.buffer instanceof ArrayBuffer && patchCommitment_0.BYTES_PER_ELEMENT === 1 && patchCommitment_0.length === 32)) {
          __compactRuntime.typeError('ownerTransition',
                                     'argument 4 (argument 5 as invoked from Typescript)',
                                     'hello-world.compact line 255 char 1',
                                     'Bytes<32>',
                                     patchCommitment_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(bountyId_0).concat(_descriptor_0.toValue(submissionId_0).concat(_descriptor_9.toValue(action_0).concat(_descriptor_1.toValue(patchCommitment_0)))),
            alignment: _descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_9.alignment().concat(_descriptor_1.alignment())))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._ownerTransition_0(context,
                                                 partialProofData,
                                                 bountyId_0,
                                                 submissionId_0,
                                                 action_0,
                                                 patchCommitment_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      }
    };
    this.impureCircuits = {
      createBounty: this.circuits.createBounty,
      openBounty: this.circuits.openBounty,
      submitDisclosure: this.circuits.submitDisclosure,
      researcherTransition: this.circuits.researcherTransition,
      reviewerTransition: this.circuits.reviewerTransition,
      ownerTransition: this.circuits.ownerTransition
    };
    this.provableCircuits = {
      createBounty: this.circuits.createBounty,
      openBounty: this.circuits.openBounty,
      submitDisclosure: this.circuits.submitDisclosure,
      researcherTransition: this.circuits.researcherTransition,
      reviewerTransition: this.circuits.reviewerTransition,
      ownerTransition: this.circuits.ownerTransition
    };
  }
  initialState(...args_0) {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
    }
    const constructorContext_0 = args_0[0];
    if (typeof(constructorContext_0) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'constructorContext' in argument 1 (as invoked from Typescript) to be an object`);
    }
    if (!('initialPrivateState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialPrivateState' in argument 1 (as invoked from Typescript)`);
    }
    if (!('initialZswapLocalState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript)`);
    }
    if (typeof(constructorContext_0.initialZswapLocalState) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript) to be an object`);
    }
    const state_0 = new __compactRuntime.ContractState();
    let stateValue_0 = __compactRuntime.StateValue.newArray();
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    state_0.data = new __compactRuntime.ChargedState(stateValue_0);
    state_0.setOperation('createBounty', new __compactRuntime.ContractOperation());
    state_0.setOperation('openBounty', new __compactRuntime.ContractOperation());
    state_0.setOperation('submitDisclosure', new __compactRuntime.ContractOperation());
    state_0.setOperation('researcherTransition', new __compactRuntime.ContractOperation());
    state_0.setOperation('reviewerTransition', new __compactRuntime.ContractOperation());
    state_0.setOperation('ownerTransition', new __compactRuntime.ContractOperation());
    const context = __compactRuntime.createCircuitContext(__compactRuntime.dummyContractAddress(), constructorContext_0.initialZswapLocalState.coinPublicKey, state_0.data, constructorContext_0.initialPrivateState);
    const partialProofData = {
      input: { value: [], alignment: [] },
      output: undefined,
      publicTranscript: [],
      privateTranscriptOutputs: []
    };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(0n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(1n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(2n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(3n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(4n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(5n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(6n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(0n),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(7n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(0n),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(8n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(0n),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    state_0.data = new __compactRuntime.ChargedState(context.currentQueryContext.state.state);
    return {
      currentContractState: state_0,
      currentPrivateState: context.currentPrivateState,
      currentZswapLocalState: context.currentZswapLocalState
    }
  }
  _persistentHash_0(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_16, value_0);
    return result_0;
  }
  _persistentHash_1(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_14, value_0);
    return result_0;
  }
  _persistentHash_2(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_15, value_0);
    return result_0;
  }
  _persistentCommit_0(value_0, rand_0) {
    const result_0 = __compactRuntime.persistentCommit(_descriptor_13,
                                                       value_0,
                                                       rand_0);
    return result_0;
  }
  _actorSecret_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.actorSecret(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 32)) {
      __compactRuntime.typeError('actorSecret',
                                 'return value',
                                 'hello-world.compact line 62 char 1',
                                 'Bytes<32>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_1.toValue(result_0),
      alignment: _descriptor_1.alignment()
    });
    return result_0;
  }
  _researcherSecret_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.researcherSecret(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 32)) {
      __compactRuntime.typeError('researcherSecret',
                                 'return value',
                                 'hello-world.compact line 63 char 1',
                                 'Bytes<32>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_1.toValue(result_0),
      alignment: _descriptor_1.alignment()
    });
    return result_0;
  }
  _reportDigest_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.reportDigest(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 32)) {
      __compactRuntime.typeError('reportDigest',
                                 'return value',
                                 'hello-world.compact line 64 char 1',
                                 'Bytes<32>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_1.toValue(result_0),
      alignment: _descriptor_1.alignment()
    });
    return result_0;
  }
  _reportOpening_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.reportOpening(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 32)) {
      __compactRuntime.typeError('reportOpening',
                                 'return value',
                                 'hello-world.compact line 65 char 1',
                                 'Bytes<32>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_1.toValue(result_0),
      alignment: _descriptor_1.alignment()
    });
    return result_0;
  }
  _severityValue_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.severityValue(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 32)) {
      __compactRuntime.typeError('severityValue',
                                 'return value',
                                 'hello-world.compact line 66 char 1',
                                 'Bytes<32>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_1.toValue(result_0),
      alignment: _descriptor_1.alignment()
    });
    return result_0;
  }
  _severityOpening_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.severityOpening(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 32)) {
      __compactRuntime.typeError('severityOpening',
                                 'return value',
                                 'hello-world.compact line 67 char 1',
                                 'Bytes<32>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_1.toValue(result_0),
      alignment: _descriptor_1.alignment()
    });
    return result_0;
  }
  _supplementDigest_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.supplementDigest(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 32)) {
      __compactRuntime.typeError('supplementDigest',
                                 'return value',
                                 'hello-world.compact line 68 char 1',
                                 'Bytes<32>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_1.toValue(result_0),
      alignment: _descriptor_1.alignment()
    });
    return result_0;
  }
  _supplementOpening_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.supplementOpening(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 32)) {
      __compactRuntime.typeError('supplementOpening',
                                 'return value',
                                 'hello-world.compact line 69 char 1',
                                 'Bytes<32>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_1.toValue(result_0),
      alignment: _descriptor_1.alignment()
    });
    return result_0;
  }
  _roleKey_0(domain_0, secret_0) {
    return this._persistentHash_2([domain_0, secret_0]);
  }
  _reportCommitmentFor_0(binding_0, digest_0, opening_0) {
    return this._persistentCommit_0([new Uint8Array([118, 117, 108, 110, 97, 58, 114, 101, 112, 111, 114, 116, 45, 99, 111, 109, 109, 105, 116, 109, 101, 110, 116, 58, 118, 49, 0, 0, 0, 0, 0, 0]),
                                     binding_0,
                                     digest_0],
                                    opening_0);
  }
  _severityCommitmentFor_0(binding_0, severity_0, opening_0) {
    return this._persistentCommit_0([new Uint8Array([118, 117, 108, 110, 97, 58, 115, 101, 118, 101, 114, 105, 116, 121, 58, 118, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                     binding_0,
                                     severity_0],
                                    opening_0);
  }
  _supplementCommitmentFor_0(binding_0, digest_0, opening_0) {
    return this._persistentCommit_0([new Uint8Array([118, 117, 108, 110, 97, 58, 115, 117, 112, 112, 108, 101, 109, 101, 110, 116, 58, 118, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                     binding_0,
                                     digest_0],
                                    opening_0);
  }
  _ownershipCommitmentFor_0(binding_0, secret_0, reportCommitment_0) {
    return this._persistentHash_1([new Uint8Array([118, 117, 108, 110, 97, 58, 114, 101, 115, 101, 97, 114, 99, 104, 101, 114, 45, 111, 119, 110, 101, 114, 58, 118, 49, 0, 0, 0, 0, 0, 0, 0]),
                                   secret_0,
                                   binding_0,
                                   reportCommitment_0]);
  }
  _nullifierFor_0(binding_0, secret_0, digest_0) {
    return this._persistentHash_1([new Uint8Array([118, 117, 108, 110, 97, 58, 115, 117, 98, 109, 105, 115, 115, 105, 111, 110, 45, 110, 117, 108, 108, 105, 102, 105, 101, 114, 58, 118, 49, 0, 0, 0]),
                                   secret_0,
                                   binding_0,
                                   digest_0]);
  }
  _supplementHeadFor_0(binding_0,
                       previousHeadHash_0,
                       commitment_0,
                       artifactHash_0,
                       envelopeHash_0)
  {
    return this._persistentHash_0([new Uint8Array([118, 117, 108, 110, 97, 58, 115, 117, 112, 112, 108, 101, 109, 101, 110, 116, 45, 104, 101, 97, 100, 58, 118, 49, 0, 0, 0, 0, 0, 0, 0, 0]),
                                   binding_0,
                                   previousHeadHash_0,
                                   commitment_0,
                                   artifactHash_0,
                                   envelopeHash_0]);
  }
  _createBounty_0(context,
                  partialProofData,
                  reviewer_0,
                  reviewerEncryptionPublicKey_0,
                  reviewerKeyVersion_0,
                  binding_0,
                  metadataHash_0,
                  scopeHash_0,
                  rewardAmount_0)
  {
    __compactRuntime.assert(rewardAmount_0 > 0n, 'reward must be positive');
    __compactRuntime.assert(!this._equal_0(reviewerEncryptionPublicKey_0,
                                           new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])),
                            'reviewer encryption key missing');
    __compactRuntime.assert(reviewerKeyVersion_0 > 0n,
                            'reviewer key version missing');
    const tmp_0 = 1n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(6n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { addi: { immediate: parseInt(__compactRuntime.valueToBigInt(
                                                              { value: _descriptor_10.toValue(tmp_0),
                                                                alignment: _descriptor_10.alignment() }
                                                                .value
                                                            )) } },
                                       { ins: { cached: true, n: 1 } }]);
    const bountyId_0 = _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                 partialProofData,
                                                                                 [
                                                                                  { dup: { n: 0 } },
                                                                                  { idx: { cached: false,
                                                                                           pushPath: false,
                                                                                           path: [
                                                                                                  { tag: 'value',
                                                                                                    value: { value: _descriptor_2.toValue(6n),
                                                                                                             alignment: _descriptor_2.alignment() } }] } },
                                                                                  { popeq: { cached: true,
                                                                                             result: undefined } }]).value);
    const owner_0 = this._roleKey_0(new Uint8Array([118, 117, 108, 110, 97, 58, 111, 119, 110, 101, 114, 58, 118, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                    this._actorSecret_0(context,
                                                        partialProofData));
    const tmp_1 = { owner: owner_0,
                    reviewer: reviewer_0,
                    reviewerEncryptionPublicKey: reviewerEncryptionPublicKey_0,
                    reviewerKeyVersion: reviewerKeyVersion_0,
                    binding: binding_0,
                    metadataHash: metadataHash_0,
                    scopeHash: scopeHash_0,
                    rewardAmount: rewardAmount_0,
                    status: 0,
                    submissionCount: 0n,
                    acceptedSubmissionId: 0n };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(0n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(bountyId_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(tmp_1),
                                                                                              alignment: _descriptor_7.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return bountyId_0;
  }
  _openBounty_0(context, partialProofData, bountyId_0) {
    const id_0 = bountyId_0;
    __compactRuntime.assert(_descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_2.toValue(0n),
                                                                                                                  alignment: _descriptor_2.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(id_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'bounty missing');
    const bounty_0 = _descriptor_7.fromValue(__compactRuntime.queryLedgerState(context,
                                                                               partialProofData,
                                                                               [
                                                                                { dup: { n: 0 } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_2.toValue(0n),
                                                                                                           alignment: _descriptor_2.alignment() } }] } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_0.toValue(id_0),
                                                                                                           alignment: _descriptor_0.alignment() } }] } },
                                                                                { popeq: { cached: false,
                                                                                           result: undefined } }]).value);
    __compactRuntime.assert(this._equal_1(bounty_0.owner,
                                          this._roleKey_0(new Uint8Array([118, 117, 108, 110, 97, 58, 111, 119, 110, 101, 114, 58, 118, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                                          this._actorSecret_0(context,
                                                                              partialProofData))),
                            'owner only');
    __compactRuntime.assert(bounty_0.status === 0, 'bounty not draft');
    const tmp_0 = { owner: bounty_0.owner,
                    reviewer: bounty_0.reviewer,
                    reviewerEncryptionPublicKey:
                      bounty_0.reviewerEncryptionPublicKey,
                    reviewerKeyVersion: bounty_0.reviewerKeyVersion,
                    binding: bounty_0.binding,
                    metadataHash: bounty_0.metadataHash,
                    scopeHash: bounty_0.scopeHash,
                    rewardAmount: bounty_0.rewardAmount,
                    status: 1,
                    submissionCount: bounty_0.submissionCount,
                    acceptedSubmissionId: bounty_0.acceptedSubmissionId };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(0n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(id_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(tmp_0),
                                                                                              alignment: _descriptor_7.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _submitDisclosure_0(context,
                      partialProofData,
                      bountyId_0,
                      reportCommitment_0,
                      artifactHash_0,
                      severityCommitment_0,
                      ownershipCommitment_0,
                      nullifier_0,
                      payoutRecipientCommitment_0)
  {
    const id_0 = bountyId_0;
    __compactRuntime.assert(_descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_2.toValue(0n),
                                                                                                                  alignment: _descriptor_2.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(id_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'bounty missing');
    const bounty_0 = _descriptor_7.fromValue(__compactRuntime.queryLedgerState(context,
                                                                               partialProofData,
                                                                               [
                                                                                { dup: { n: 0 } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_2.toValue(0n),
                                                                                                           alignment: _descriptor_2.alignment() } }] } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_0.toValue(id_0),
                                                                                                           alignment: _descriptor_0.alignment() } }] } },
                                                                                { popeq: { cached: false,
                                                                                           result: undefined } }]).value);
    __compactRuntime.assert(bounty_0.status === 1, 'bounty not open');
    __compactRuntime.assert(!_descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_2.toValue(3n),
                                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(nullifier_0),
                                                                                                                                               alignment: _descriptor_1.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'nullifier used');
    const secret_0 = this._researcherSecret_0(context, partialProofData);
    const digest_0 = this._reportDigest_0(context, partialProofData);
    __compactRuntime.assert(this._equal_2(reportCommitment_0,
                                          this._reportCommitmentFor_0(bounty_0.binding,
                                                                      digest_0,
                                                                      this._reportOpening_0(context,
                                                                                            partialProofData))),
                            'report commitment invalid');
    __compactRuntime.assert(this._equal_3(severityCommitment_0,
                                          this._severityCommitmentFor_0(bounty_0.binding,
                                                                        this._severityValue_0(context,
                                                                                              partialProofData),
                                                                        this._severityOpening_0(context,
                                                                                                partialProofData))),
                            'severity commitment invalid');
    __compactRuntime.assert(this._equal_4(ownershipCommitment_0,
                                          this._ownershipCommitmentFor_0(bounty_0.binding,
                                                                         secret_0,
                                                                         reportCommitment_0)),
                            'ownership invalid');
    __compactRuntime.assert(this._equal_5(nullifier_0,
                                          this._nullifierFor_0(bounty_0.binding,
                                                               secret_0,
                                                               digest_0)),
                            'nullifier invalid');
    __compactRuntime.assert(!this._equal_6(payoutRecipientCommitment_0,
                                           new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])),
                            'payout recipient missing');
    const tmp_0 = 1n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(7n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { addi: { immediate: parseInt(__compactRuntime.valueToBigInt(
                                                              { value: _descriptor_10.toValue(tmp_0),
                                                                alignment: _descriptor_10.alignment() }
                                                                .value
                                                            )) } },
                                       { ins: { cached: true, n: 1 } }]);
    const submissionId_0 = _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                     partialProofData,
                                                                                     [
                                                                                      { dup: { n: 0 } },
                                                                                      { idx: { cached: false,
                                                                                               pushPath: false,
                                                                                               path: [
                                                                                                      { tag: 'value',
                                                                                                        value: { value: _descriptor_2.toValue(7n),
                                                                                                                 alignment: _descriptor_2.alignment() } }] } },
                                                                                      { popeq: { cached: true,
                                                                                                 result: undefined } }]).value);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(3n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(nullifier_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newNull().encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(4n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(submissionId_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(payoutRecipientCommitment_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_1 = { bountyId: id_0,
                    reportCommitment: reportCommitment_0,
                    artifactHash: artifactHash_0,
                    accessEnvelopeHash:
                      new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                    severityCommitment: severityCommitment_0,
                    ownershipCommitment: ownershipCommitment_0,
                    nullifier: nullifier_0,
                    supplementHeadHash:
                      new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                    latestSupplementId: 0n,
                    supplementCount: 0n,
                    moreInfoReasonCode: 0n,
                    acceptedSeverity: 0n,
                    patchCommitment:
                      new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                    revealedReportDigest:
                      new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                    status: 0 };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(submissionId_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(tmp_1),
                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_2 = { owner: bounty_0.owner,
                    reviewer: bounty_0.reviewer,
                    reviewerEncryptionPublicKey:
                      bounty_0.reviewerEncryptionPublicKey,
                    reviewerKeyVersion: bounty_0.reviewerKeyVersion,
                    binding: bounty_0.binding,
                    metadataHash: bounty_0.metadataHash,
                    scopeHash: bounty_0.scopeHash,
                    rewardAmount: bounty_0.rewardAmount,
                    status: bounty_0.status,
                    submissionCount:
                      ((t1) => {
                        if (t1 > 18446744073709551615n) {
                          throw new __compactRuntime.CompactError('hello-world.compact line 163 char 35: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 18446744073709551615');
                        }
                        return t1;
                      })(bounty_0.submissionCount + 1n),
                    acceptedSubmissionId: bounty_0.acceptedSubmissionId };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(0n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(id_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(tmp_2),
                                                                                              alignment: _descriptor_7.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return submissionId_0;
  }
  _researcherTransition_0(context,
                          partialProofData,
                          submissionId_0,
                          action_0,
                          accessEnvelopeHash_0,
                          previousHeadHash_0,
                          supplementCommitment_0,
                          artifactHash_0,
                          envelopeHash_0,
                          settlementReceiptHash_0)
  {
    const id_0 = submissionId_0;
    __compactRuntime.assert(_descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_2.toValue(1n),
                                                                                                                  alignment: _descriptor_2.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(id_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'submission missing');
    const submission_0 = _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                   partialProofData,
                                                                                   [
                                                                                    { dup: { n: 0 } },
                                                                                    { idx: { cached: false,
                                                                                             pushPath: false,
                                                                                             path: [
                                                                                                    { tag: 'value',
                                                                                                      value: { value: _descriptor_2.toValue(1n),
                                                                                                               alignment: _descriptor_2.alignment() } }] } },
                                                                                    { idx: { cached: false,
                                                                                             pushPath: false,
                                                                                             path: [
                                                                                                    { tag: 'value',
                                                                                                      value: { value: _descriptor_0.toValue(id_0),
                                                                                                               alignment: _descriptor_0.alignment() } }] } },
                                                                                    { popeq: { cached: false,
                                                                                               result: undefined } }]).value);
    let tmp_0;
    const bounty_0 = (tmp_0 = submission_0.bountyId,
                      _descriptor_7.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                partialProofData,
                                                                                [
                                                                                 { dup: { n: 0 } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_2.toValue(0n),
                                                                                                            alignment: _descriptor_2.alignment() } }] } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_0.toValue(tmp_0),
                                                                                                            alignment: _descriptor_0.alignment() } }] } },
                                                                                 { popeq: { cached: false,
                                                                                            result: undefined } }]).value));
    __compactRuntime.assert(this._equal_7(submission_0.ownershipCommitment,
                                          this._ownershipCommitmentFor_0(bounty_0.binding,
                                                                         this._researcherSecret_0(context,
                                                                                                  partialProofData),
                                                                         submission_0.reportCommitment)),
                            'researcher only');
    const operation_0 = action_0;
    if (operation_0 === 0) {
      let tmp_1;
      return __compactRuntime.assert(submission_0.status === 0
                                     &&
                                     bounty_0.status === 1,
                                     'wrong submission state'),
             (tmp_1 = { bountyId: submission_0.bountyId,
                        reportCommitment: submission_0.reportCommitment,
                        artifactHash: submission_0.artifactHash,
                        accessEnvelopeHash: accessEnvelopeHash_0,
                        severityCommitment: submission_0.severityCommitment,
                        ownershipCommitment: submission_0.ownershipCommitment,
                        nullifier: submission_0.nullifier,
                        supplementHeadHash: submission_0.supplementHeadHash,
                        latestSupplementId: submission_0.latestSupplementId,
                        supplementCount: submission_0.supplementCount,
                        moreInfoReasonCode: submission_0.moreInfoReasonCode,
                        acceptedSeverity: submission_0.acceptedSeverity,
                        patchCommitment: submission_0.patchCommitment,
                        revealedReportDigest: submission_0.revealedReportDigest,
                        status: 1 },
              __compactRuntime.queryLedgerState(context,
                                                partialProofData,
                                                [
                                                 { idx: { cached: false,
                                                          pushPath: true,
                                                          path: [
                                                                 { tag: 'value',
                                                                   value: { value: _descriptor_2.toValue(1n),
                                                                            alignment: _descriptor_2.alignment() } }] } },
                                                 { push: { storage: false,
                                                           value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(id_0),
                                                                                                        alignment: _descriptor_0.alignment() }).encode() } },
                                                 { push: { storage: true,
                                                           value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(tmp_1),
                                                                                                        alignment: _descriptor_4.alignment() }).encode() } },
                                                 { ins: { cached: false, n: 1 } },
                                                 { ins: { cached: true, n: 1 } }])),
             0n;
    } else {
      if (operation_0 === 1) {
        __compactRuntime.assert(submission_0.status === 3,
                                'wrong submission state');
        __compactRuntime.assert(this._equal_8(previousHeadHash_0,
                                              submission_0.supplementHeadHash),
                                'supplement head mismatch');
        __compactRuntime.assert(this._equal_9(supplementCommitment_0,
                                              this._supplementCommitmentFor_0(bounty_0.binding,
                                                                              this._supplementDigest_0(context,
                                                                                                       partialProofData),
                                                                              this._supplementOpening_0(context,
                                                                                                        partialProofData))),
                                'supplement commitment invalid');
        const headHash_0 = this._supplementHeadFor_0(bounty_0.binding,
                                                     previousHeadHash_0,
                                                     supplementCommitment_0,
                                                     artifactHash_0,
                                                     envelopeHash_0);
        const tmp_2 = 1n;
        __compactRuntime.queryLedgerState(context,
                                          partialProofData,
                                          [
                                           { idx: { cached: false,
                                                    pushPath: true,
                                                    path: [
                                                           { tag: 'value',
                                                             value: { value: _descriptor_2.toValue(8n),
                                                                      alignment: _descriptor_2.alignment() } }] } },
                                           { addi: { immediate: parseInt(__compactRuntime.valueToBigInt(
                                                                  { value: _descriptor_10.toValue(tmp_2),
                                                                    alignment: _descriptor_10.alignment() }
                                                                    .value
                                                                )) } },
                                           { ins: { cached: true, n: 1 } }]);
        const supplementId_0 = _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                         partialProofData,
                                                                                         [
                                                                                          { dup: { n: 0 } },
                                                                                          { idx: { cached: false,
                                                                                                   pushPath: false,
                                                                                                   path: [
                                                                                                          { tag: 'value',
                                                                                                            value: { value: _descriptor_2.toValue(8n),
                                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                                          { popeq: { cached: true,
                                                                                                     result: undefined } }]).value);
        const tmp_3 = { submissionId: id_0,
                        commitment: supplementCommitment_0,
                        artifactHash: artifactHash_0,
                        envelopeHash: envelopeHash_0,
                        previousHeadHash: previousHeadHash_0,
                        headHash: headHash_0 };
        __compactRuntime.queryLedgerState(context,
                                          partialProofData,
                                          [
                                           { idx: { cached: false,
                                                    pushPath: true,
                                                    path: [
                                                           { tag: 'value',
                                                             value: { value: _descriptor_2.toValue(2n),
                                                                      alignment: _descriptor_2.alignment() } }] } },
                                           { push: { storage: false,
                                                     value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(supplementId_0),
                                                                                                  alignment: _descriptor_0.alignment() }).encode() } },
                                           { push: { storage: true,
                                                     value: __compactRuntime.StateValue.newCell({ value: _descriptor_11.toValue(tmp_3),
                                                                                                  alignment: _descriptor_11.alignment() }).encode() } },
                                           { ins: { cached: false, n: 1 } },
                                           { ins: { cached: true, n: 1 } }]);
        const tmp_4 = { bountyId: submission_0.bountyId,
                        reportCommitment: submission_0.reportCommitment,
                        artifactHash: submission_0.artifactHash,
                        accessEnvelopeHash: submission_0.accessEnvelopeHash,
                        severityCommitment: submission_0.severityCommitment,
                        ownershipCommitment: submission_0.ownershipCommitment,
                        nullifier: submission_0.nullifier,
                        supplementHeadHash: headHash_0,
                        latestSupplementId: supplementId_0,
                        supplementCount:
                          ((t1) => {
                            if (t1 > 18446744073709551615n) {
                              throw new __compactRuntime.CompactError('hello-world.compact line 203 char 146: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 18446744073709551615');
                            }
                            return t1;
                          })(submission_0.supplementCount + 1n),
                        moreInfoReasonCode: 0n,
                        acceptedSeverity: submission_0.acceptedSeverity,
                        patchCommitment: submission_0.patchCommitment,
                        revealedReportDigest: submission_0.revealedReportDigest,
                        status: 2 };
        __compactRuntime.queryLedgerState(context,
                                          partialProofData,
                                          [
                                           { idx: { cached: false,
                                                    pushPath: true,
                                                    path: [
                                                           { tag: 'value',
                                                             value: { value: _descriptor_2.toValue(1n),
                                                                      alignment: _descriptor_2.alignment() } }] } },
                                           { push: { storage: false,
                                                     value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(id_0),
                                                                                                  alignment: _descriptor_0.alignment() }).encode() } },
                                           { push: { storage: true,
                                                     value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(tmp_4),
                                                                                                  alignment: _descriptor_4.alignment() }).encode() } },
                                           { ins: { cached: false, n: 1 } },
                                           { ins: { cached: true, n: 1 } }]);
        return supplementId_0;
      } else {
        let tmp_8, tmp_9, tmp_6, tmp_7, digest_0, tmp_5;
        return operation_0 === 2 ?
               (__compactRuntime.assert(submission_0.status === 0
                                        ||
                                        submission_0.status === 3,
                                        'wrong submission state'),
                (tmp_8 = { bountyId: submission_0.bountyId,
                           reportCommitment: submission_0.reportCommitment,
                           artifactHash: submission_0.artifactHash,
                           accessEnvelopeHash: submission_0.accessEnvelopeHash,
                           severityCommitment: submission_0.severityCommitment,
                           ownershipCommitment: submission_0.ownershipCommitment,
                           nullifier: submission_0.nullifier,
                           supplementHeadHash: submission_0.supplementHeadHash,
                           latestSupplementId: submission_0.latestSupplementId,
                           supplementCount: submission_0.supplementCount,
                           moreInfoReasonCode: submission_0.moreInfoReasonCode,
                           acceptedSeverity: submission_0.acceptedSeverity,
                           patchCommitment: submission_0.patchCommitment,
                           revealedReportDigest:
                             submission_0.revealedReportDigest,
                           status: 9 },
                 __compactRuntime.queryLedgerState(context,
                                                   partialProofData,
                                                   [
                                                    { idx: { cached: false,
                                                             pushPath: true,
                                                             path: [
                                                                    { tag: 'value',
                                                                      value: { value: _descriptor_2.toValue(1n),
                                                                               alignment: _descriptor_2.alignment() } }] } },
                                                    { push: { storage: false,
                                                              value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(id_0),
                                                                                                           alignment: _descriptor_0.alignment() }).encode() } },
                                                    { push: { storage: true,
                                                              value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(tmp_8),
                                                                                                           alignment: _descriptor_4.alignment() }).encode() } },
                                                    { ins: { cached: false, n: 1 } },
                                                    { ins: { cached: true, n: 1 } }])),
                0n)
               :
               operation_0 === 3 ?
               (__compactRuntime.assert(submission_0.status === 6
                                        &&
                                        bounty_0.status === 3,
                                        'wrong submission state'),
                __compactRuntime.assert(_descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                  partialProofData,
                                                                                                  [
                                                                                                   { dup: { n: 0 } },
                                                                                                   { idx: { cached: false,
                                                                                                            pushPath: false,
                                                                                                            path: [
                                                                                                                   { tag: 'value',
                                                                                                                     value: { value: _descriptor_2.toValue(4n),
                                                                                                                              alignment: _descriptor_2.alignment() } }] } },
                                                                                                   { push: { storage: false,
                                                                                                             value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(id_0),
                                                                                                                                                          alignment: _descriptor_0.alignment() }).encode() } },
                                                                                                   'member',
                                                                                                   { popeq: { cached: true,
                                                                                                              result: undefined } }]).value),
                                        'payout recipient missing'),
                __compactRuntime.assert(!_descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                   partialProofData,
                                                                                                   [
                                                                                                    { dup: { n: 0 } },
                                                                                                    { idx: { cached: false,
                                                                                                             pushPath: false,
                                                                                                             path: [
                                                                                                                    { tag: 'value',
                                                                                                                      value: { value: _descriptor_2.toValue(5n),
                                                                                                                               alignment: _descriptor_2.alignment() } }] } },
                                                                                                    { push: { storage: false,
                                                                                                              value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(id_0),
                                                                                                                                                           alignment: _descriptor_0.alignment() }).encode() } },
                                                                                                    'member',
                                                                                                    { popeq: { cached: true,
                                                                                                               result: undefined } }]).value),
                                        'payout receipt used'),
                __compactRuntime.assert(!this._equal_10(settlementReceiptHash_0,
                                                        new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])),
                                        'payout receipt missing'),
                __compactRuntime.queryLedgerState(context,
                                                  partialProofData,
                                                  [
                                                   { idx: { cached: false,
                                                            pushPath: true,
                                                            path: [
                                                                   { tag: 'value',
                                                                     value: { value: _descriptor_2.toValue(5n),
                                                                              alignment: _descriptor_2.alignment() } }] } },
                                                   { push: { storage: false,
                                                             value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(id_0),
                                                                                                          alignment: _descriptor_0.alignment() }).encode() } },
                                                   { push: { storage: true,
                                                             value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(settlementReceiptHash_0),
                                                                                                          alignment: _descriptor_1.alignment() }).encode() } },
                                                   { ins: { cached: false, n: 1 } },
                                                   { ins: { cached: true, n: 1 } }]),
                (tmp_9 = { bountyId: submission_0.bountyId,
                           reportCommitment: submission_0.reportCommitment,
                           artifactHash: submission_0.artifactHash,
                           accessEnvelopeHash: submission_0.accessEnvelopeHash,
                           severityCommitment: submission_0.severityCommitment,
                           ownershipCommitment: submission_0.ownershipCommitment,
                           nullifier: submission_0.nullifier,
                           supplementHeadHash: submission_0.supplementHeadHash,
                           latestSupplementId: submission_0.latestSupplementId,
                           supplementCount: submission_0.supplementCount,
                           moreInfoReasonCode: submission_0.moreInfoReasonCode,
                           acceptedSeverity: submission_0.acceptedSeverity,
                           patchCommitment: submission_0.patchCommitment,
                           revealedReportDigest:
                             submission_0.revealedReportDigest,
                           status: 7 },
                 __compactRuntime.queryLedgerState(context,
                                                   partialProofData,
                                                   [
                                                    { idx: { cached: false,
                                                             pushPath: true,
                                                             path: [
                                                                    { tag: 'value',
                                                                      value: { value: _descriptor_2.toValue(1n),
                                                                               alignment: _descriptor_2.alignment() } }] } },
                                                    { push: { storage: false,
                                                              value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(id_0),
                                                                                                           alignment: _descriptor_0.alignment() }).encode() } },
                                                    { push: { storage: true,
                                                              value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(tmp_9),
                                                                                                           alignment: _descriptor_4.alignment() }).encode() } },
                                                    { ins: { cached: false, n: 1 } },
                                                    { ins: { cached: true, n: 1 } }])),
                (tmp_6 = submission_0.bountyId,
                 (tmp_7 = { owner: bounty_0.owner,
                            reviewer: bounty_0.reviewer,
                            reviewerEncryptionPublicKey:
                              bounty_0.reviewerEncryptionPublicKey,
                            reviewerKeyVersion: bounty_0.reviewerKeyVersion,
                            binding: bounty_0.binding,
                            metadataHash: bounty_0.metadataHash,
                            scopeHash: bounty_0.scopeHash,
                            rewardAmount: bounty_0.rewardAmount,
                            status: 4,
                            submissionCount: bounty_0.submissionCount,
                            acceptedSubmissionId: bounty_0.acceptedSubmissionId },
                  __compactRuntime.queryLedgerState(context,
                                                    partialProofData,
                                                    [
                                                     { idx: { cached: false,
                                                              pushPath: true,
                                                              path: [
                                                                     { tag: 'value',
                                                                       value: { value: _descriptor_2.toValue(0n),
                                                                                alignment: _descriptor_2.alignment() } }] } },
                                                     { push: { storage: false,
                                                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_6),
                                                                                                            alignment: _descriptor_0.alignment() }).encode() } },
                                                     { push: { storage: true,
                                                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(tmp_7),
                                                                                                            alignment: _descriptor_7.alignment() }).encode() } },
                                                     { ins: { cached: false,
                                                              n: 1 } },
                                                     { ins: { cached: true, n: 1 } }]))),
                0n)
               :
               operation_0 === 4 ?
               (__compactRuntime.assert(submission_0.status === 6
                                        ||
                                        submission_0.status === 7,
                                        'wrong submission state'),
                (digest_0 = this._reportDigest_0(context, partialProofData),
                 (__compactRuntime.assert(this._equal_11(submission_0.reportCommitment,
                                                         this._reportCommitmentFor_0(bounty_0.binding,
                                                                                     digest_0,
                                                                                     this._reportOpening_0(context,
                                                                                                           partialProofData))),
                                          'report opening invalid'),
                  (tmp_5 = { bountyId: submission_0.bountyId,
                             reportCommitment: submission_0.reportCommitment,
                             artifactHash: submission_0.artifactHash,
                             accessEnvelopeHash: submission_0.accessEnvelopeHash,
                             severityCommitment: submission_0.severityCommitment,
                             ownershipCommitment:
                               submission_0.ownershipCommitment,
                             nullifier: submission_0.nullifier,
                             supplementHeadHash: submission_0.supplementHeadHash,
                             latestSupplementId: submission_0.latestSupplementId,
                             supplementCount: submission_0.supplementCount,
                             moreInfoReasonCode: submission_0.moreInfoReasonCode,
                             acceptedSeverity: submission_0.acceptedSeverity,
                             patchCommitment: submission_0.patchCommitment,
                             revealedReportDigest: digest_0,
                             status: 8 },
                   __compactRuntime.queryLedgerState(context,
                                                     partialProofData,
                                                     [
                                                      { idx: { cached: false,
                                                               pushPath: true,
                                                               path: [
                                                                      { tag: 'value',
                                                                        value: { value: _descriptor_2.toValue(1n),
                                                                                 alignment: _descriptor_2.alignment() } }] } },
                                                      { push: { storage: false,
                                                                value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(id_0),
                                                                                                             alignment: _descriptor_0.alignment() }).encode() } },
                                                      { push: { storage: true,
                                                                value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(tmp_5),
                                                                                                             alignment: _descriptor_4.alignment() }).encode() } },
                                                      { ins: { cached: false,
                                                               n: 1 } },
                                                      { ins: { cached: true,
                                                               n: 1 } }])),
                  0n)))
               :
               (__compactRuntime.assert(false, 'action invalid'), 0n);
      }
    }
  }
  _reviewerTransition_0(context,
                        partialProofData,
                        submissionId_0,
                        action_0,
                        value_0)
  {
    const id_0 = submissionId_0;
    __compactRuntime.assert(_descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_2.toValue(1n),
                                                                                                                  alignment: _descriptor_2.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(id_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'submission missing');
    const submission_0 = _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                   partialProofData,
                                                                                   [
                                                                                    { dup: { n: 0 } },
                                                                                    { idx: { cached: false,
                                                                                             pushPath: false,
                                                                                             path: [
                                                                                                    { tag: 'value',
                                                                                                      value: { value: _descriptor_2.toValue(1n),
                                                                                                               alignment: _descriptor_2.alignment() } }] } },
                                                                                    { idx: { cached: false,
                                                                                             pushPath: false,
                                                                                             path: [
                                                                                                    { tag: 'value',
                                                                                                      value: { value: _descriptor_0.toValue(id_0),
                                                                                                               alignment: _descriptor_0.alignment() } }] } },
                                                                                    { popeq: { cached: false,
                                                                                               result: undefined } }]).value);
    let tmp_0;
    const bounty_0 = (tmp_0 = submission_0.bountyId,
                      _descriptor_7.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                partialProofData,
                                                                                [
                                                                                 { dup: { n: 0 } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_2.toValue(0n),
                                                                                                            alignment: _descriptor_2.alignment() } }] } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_0.toValue(tmp_0),
                                                                                                            alignment: _descriptor_0.alignment() } }] } },
                                                                                 { popeq: { cached: false,
                                                                                            result: undefined } }]).value));
    __compactRuntime.assert(this._equal_12(bounty_0.reviewer,
                                           this._roleKey_0(new Uint8Array([118, 117, 108, 110, 97, 58, 114, 101, 118, 105, 101, 119, 101, 114, 58, 118, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                                           this._actorSecret_0(context,
                                                                               partialProofData))),
                            'reviewer only');
    const operation_0 = action_0;
    if (operation_0 === 0) {
      __compactRuntime.assert(submission_0.status === 1,
                              'wrong submission state');
      const tmp_1 = { bountyId: submission_0.bountyId,
                      reportCommitment: submission_0.reportCommitment,
                      artifactHash: submission_0.artifactHash,
                      accessEnvelopeHash: submission_0.accessEnvelopeHash,
                      severityCommitment: submission_0.severityCommitment,
                      ownershipCommitment: submission_0.ownershipCommitment,
                      nullifier: submission_0.nullifier,
                      supplementHeadHash: submission_0.supplementHeadHash,
                      latestSupplementId: submission_0.latestSupplementId,
                      supplementCount: submission_0.supplementCount,
                      moreInfoReasonCode: submission_0.moreInfoReasonCode,
                      acceptedSeverity: submission_0.acceptedSeverity,
                      patchCommitment: submission_0.patchCommitment,
                      revealedReportDigest: submission_0.revealedReportDigest,
                      status: 2 };
      __compactRuntime.queryLedgerState(context,
                                        partialProofData,
                                        [
                                         { idx: { cached: false,
                                                  pushPath: true,
                                                  path: [
                                                         { tag: 'value',
                                                           value: { value: _descriptor_2.toValue(1n),
                                                                    alignment: _descriptor_2.alignment() } }] } },
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(id_0),
                                                                                                alignment: _descriptor_0.alignment() }).encode() } },
                                         { push: { storage: true,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(tmp_1),
                                                                                                alignment: _descriptor_4.alignment() }).encode() } },
                                         { ins: { cached: false, n: 1 } },
                                         { ins: { cached: true, n: 1 } }]);
    } else {
      if (operation_0 === 1 || operation_0 === 3) {
        __compactRuntime.assert(submission_0.status === 2 && value_0 > 0n
                                &&
                                value_0 < 16n,
                                'reason invalid');
        const nextStatus_0 = operation_0 === 1 ? 3 : 5;
        const tmp_2 = { bountyId: submission_0.bountyId,
                        reportCommitment: submission_0.reportCommitment,
                        artifactHash: submission_0.artifactHash,
                        accessEnvelopeHash: submission_0.accessEnvelopeHash,
                        severityCommitment: submission_0.severityCommitment,
                        ownershipCommitment: submission_0.ownershipCommitment,
                        nullifier: submission_0.nullifier,
                        supplementHeadHash: submission_0.supplementHeadHash,
                        latestSupplementId: submission_0.latestSupplementId,
                        supplementCount: submission_0.supplementCount,
                        moreInfoReasonCode: value_0,
                        acceptedSeverity: submission_0.acceptedSeverity,
                        patchCommitment: submission_0.patchCommitment,
                        revealedReportDigest: submission_0.revealedReportDigest,
                        status: nextStatus_0 };
        __compactRuntime.queryLedgerState(context,
                                          partialProofData,
                                          [
                                           { idx: { cached: false,
                                                    pushPath: true,
                                                    path: [
                                                           { tag: 'value',
                                                             value: { value: _descriptor_2.toValue(1n),
                                                                      alignment: _descriptor_2.alignment() } }] } },
                                           { push: { storage: false,
                                                     value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(id_0),
                                                                                                  alignment: _descriptor_0.alignment() }).encode() } },
                                           { push: { storage: true,
                                                     value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(tmp_2),
                                                                                                  alignment: _descriptor_4.alignment() }).encode() } },
                                           { ins: { cached: false, n: 1 } },
                                           { ins: { cached: true, n: 1 } }]);
      } else {
        if (operation_0 === 2) {
          __compactRuntime.assert(submission_0.status === 2,
                                  'wrong submission state');
          __compactRuntime.assert(value_0 > 0n && value_0 < 5n,
                                  'severity invalid');
          __compactRuntime.assert(this._equal_13(bounty_0.acceptedSubmissionId,
                                                 0n),
                                  'winner exists');
          const tmp_3 = { bountyId: submission_0.bountyId,
                          reportCommitment: submission_0.reportCommitment,
                          artifactHash: submission_0.artifactHash,
                          accessEnvelopeHash: submission_0.accessEnvelopeHash,
                          severityCommitment: submission_0.severityCommitment,
                          ownershipCommitment: submission_0.ownershipCommitment,
                          nullifier: submission_0.nullifier,
                          supplementHeadHash: submission_0.supplementHeadHash,
                          latestSupplementId: submission_0.latestSupplementId,
                          supplementCount: submission_0.supplementCount,
                          moreInfoReasonCode: submission_0.moreInfoReasonCode,
                          acceptedSeverity: value_0,
                          patchCommitment: submission_0.patchCommitment,
                          revealedReportDigest:
                            submission_0.revealedReportDigest,
                          status: 4 };
          __compactRuntime.queryLedgerState(context,
                                            partialProofData,
                                            [
                                             { idx: { cached: false,
                                                      pushPath: true,
                                                      path: [
                                                             { tag: 'value',
                                                               value: { value: _descriptor_2.toValue(1n),
                                                                        alignment: _descriptor_2.alignment() } }] } },
                                             { push: { storage: false,
                                                       value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(id_0),
                                                                                                    alignment: _descriptor_0.alignment() }).encode() } },
                                             { push: { storage: true,
                                                       value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(tmp_3),
                                                                                                    alignment: _descriptor_4.alignment() }).encode() } },
                                             { ins: { cached: false, n: 1 } },
                                             { ins: { cached: true, n: 1 } }]);
          const tmp_4 = submission_0.bountyId;
          const tmp_5 = { owner: bounty_0.owner,
                          reviewer: bounty_0.reviewer,
                          reviewerEncryptionPublicKey:
                            bounty_0.reviewerEncryptionPublicKey,
                          reviewerKeyVersion: bounty_0.reviewerKeyVersion,
                          binding: bounty_0.binding,
                          metadataHash: bounty_0.metadataHash,
                          scopeHash: bounty_0.scopeHash,
                          rewardAmount: bounty_0.rewardAmount,
                          status: 2,
                          submissionCount: bounty_0.submissionCount,
                          acceptedSubmissionId: id_0 };
          __compactRuntime.queryLedgerState(context,
                                            partialProofData,
                                            [
                                             { idx: { cached: false,
                                                      pushPath: true,
                                                      path: [
                                                             { tag: 'value',
                                                               value: { value: _descriptor_2.toValue(0n),
                                                                        alignment: _descriptor_2.alignment() } }] } },
                                             { push: { storage: false,
                                                       value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_4),
                                                                                                    alignment: _descriptor_0.alignment() }).encode() } },
                                             { push: { storage: true,
                                                       value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(tmp_5),
                                                                                                    alignment: _descriptor_7.alignment() }).encode() } },
                                             { ins: { cached: false, n: 1 } },
                                             { ins: { cached: true, n: 1 } }]);
        } else {
          __compactRuntime.assert(false, 'action invalid');
        }
      }
    }
    return [];
  }
  _ownerTransition_0(context,
                     partialProofData,
                     bountyId_0,
                     submissionId_0,
                     action_0,
                     patchCommitment_0)
  {
    const bountyIdPublic_0 = bountyId_0;
    __compactRuntime.assert(_descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_2.toValue(0n),
                                                                                                                  alignment: _descriptor_2.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(bountyIdPublic_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'bounty missing');
    const bounty_0 = _descriptor_7.fromValue(__compactRuntime.queryLedgerState(context,
                                                                               partialProofData,
                                                                               [
                                                                                { dup: { n: 0 } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_2.toValue(0n),
                                                                                                           alignment: _descriptor_2.alignment() } }] } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_0.toValue(bountyIdPublic_0),
                                                                                                           alignment: _descriptor_0.alignment() } }] } },
                                                                                { popeq: { cached: false,
                                                                                           result: undefined } }]).value);
    __compactRuntime.assert(this._equal_14(bounty_0.owner,
                                           this._roleKey_0(new Uint8Array([118, 117, 108, 110, 97, 58, 111, 119, 110, 101, 114, 58, 118, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                                           this._actorSecret_0(context,
                                                                               partialProofData))),
                            'owner only');
    const operation_0 = action_0;
    if (operation_0 === 0) {
      const id_0 = submissionId_0;
      __compactRuntime.assert(_descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                        partialProofData,
                                                                                        [
                                                                                         { dup: { n: 0 } },
                                                                                         { idx: { cached: false,
                                                                                                  pushPath: false,
                                                                                                  path: [
                                                                                                         { tag: 'value',
                                                                                                           value: { value: _descriptor_2.toValue(1n),
                                                                                                                    alignment: _descriptor_2.alignment() } }] } },
                                                                                         { push: { storage: false,
                                                                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(id_0),
                                                                                                                                                alignment: _descriptor_0.alignment() }).encode() } },
                                                                                         'member',
                                                                                         { popeq: { cached: true,
                                                                                                    result: undefined } }]).value),
                              'submission missing');
      const submission_0 = _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                     partialProofData,
                                                                                     [
                                                                                      { dup: { n: 0 } },
                                                                                      { idx: { cached: false,
                                                                                               pushPath: false,
                                                                                               path: [
                                                                                                      { tag: 'value',
                                                                                                        value: { value: _descriptor_2.toValue(1n),
                                                                                                                 alignment: _descriptor_2.alignment() } }] } },
                                                                                      { idx: { cached: false,
                                                                                               pushPath: false,
                                                                                               path: [
                                                                                                      { tag: 'value',
                                                                                                        value: { value: _descriptor_0.toValue(id_0),
                                                                                                                 alignment: _descriptor_0.alignment() } }] } },
                                                                                      { popeq: { cached: false,
                                                                                                 result: undefined } }]).value);
      __compactRuntime.assert(this._equal_15(submission_0.bountyId,
                                             bountyIdPublic_0)
                              &&
                              submission_0.status === 4
                              &&
                              this._equal_16(bounty_0.acceptedSubmissionId, id_0),
                              'wrong submission state');
      const tmp_0 = { bountyId: submission_0.bountyId,
                      reportCommitment: submission_0.reportCommitment,
                      artifactHash: submission_0.artifactHash,
                      accessEnvelopeHash: submission_0.accessEnvelopeHash,
                      severityCommitment: submission_0.severityCommitment,
                      ownershipCommitment: submission_0.ownershipCommitment,
                      nullifier: submission_0.nullifier,
                      supplementHeadHash: submission_0.supplementHeadHash,
                      latestSupplementId: submission_0.latestSupplementId,
                      supplementCount: submission_0.supplementCount,
                      moreInfoReasonCode: submission_0.moreInfoReasonCode,
                      acceptedSeverity: submission_0.acceptedSeverity,
                      patchCommitment: patchCommitment_0,
                      revealedReportDigest: submission_0.revealedReportDigest,
                      status: 6 };
      __compactRuntime.queryLedgerState(context,
                                        partialProofData,
                                        [
                                         { idx: { cached: false,
                                                  pushPath: true,
                                                  path: [
                                                         { tag: 'value',
                                                           value: { value: _descriptor_2.toValue(1n),
                                                                    alignment: _descriptor_2.alignment() } }] } },
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(id_0),
                                                                                                alignment: _descriptor_0.alignment() }).encode() } },
                                         { push: { storage: true,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(tmp_0),
                                                                                                alignment: _descriptor_4.alignment() }).encode() } },
                                         { ins: { cached: false, n: 1 } },
                                         { ins: { cached: true, n: 1 } }]);
      const tmp_1 = { owner: bounty_0.owner,
                      reviewer: bounty_0.reviewer,
                      reviewerEncryptionPublicKey:
                        bounty_0.reviewerEncryptionPublicKey,
                      reviewerKeyVersion: bounty_0.reviewerKeyVersion,
                      binding: bounty_0.binding,
                      metadataHash: bounty_0.metadataHash,
                      scopeHash: bounty_0.scopeHash,
                      rewardAmount: bounty_0.rewardAmount,
                      status: 3,
                      submissionCount: bounty_0.submissionCount,
                      acceptedSubmissionId: bounty_0.acceptedSubmissionId };
      __compactRuntime.queryLedgerState(context,
                                        partialProofData,
                                        [
                                         { idx: { cached: false,
                                                  pushPath: true,
                                                  path: [
                                                         { tag: 'value',
                                                           value: { value: _descriptor_2.toValue(0n),
                                                                    alignment: _descriptor_2.alignment() } }] } },
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(bountyIdPublic_0),
                                                                                                alignment: _descriptor_0.alignment() }).encode() } },
                                         { push: { storage: true,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(tmp_1),
                                                                                                alignment: _descriptor_7.alignment() }).encode() } },
                                         { ins: { cached: false, n: 1 } },
                                         { ins: { cached: true, n: 1 } }]);
    } else {
      if (operation_0 === 1) {
        __compactRuntime.assert(bounty_0.status === 0
                                ||
                                bounty_0.status === 1
                                &&
                                this._equal_17(bounty_0.submissionCount, 0n),
                                'bounty cannot cancel');
        const tmp_2 = { owner: bounty_0.owner,
                        reviewer: bounty_0.reviewer,
                        reviewerEncryptionPublicKey:
                          bounty_0.reviewerEncryptionPublicKey,
                        reviewerKeyVersion: bounty_0.reviewerKeyVersion,
                        binding: bounty_0.binding,
                        metadataHash: bounty_0.metadataHash,
                        scopeHash: bounty_0.scopeHash,
                        rewardAmount: bounty_0.rewardAmount,
                        status: 5,
                        submissionCount: bounty_0.submissionCount,
                        acceptedSubmissionId: bounty_0.acceptedSubmissionId };
        __compactRuntime.queryLedgerState(context,
                                          partialProofData,
                                          [
                                           { idx: { cached: false,
                                                    pushPath: true,
                                                    path: [
                                                           { tag: 'value',
                                                             value: { value: _descriptor_2.toValue(0n),
                                                                      alignment: _descriptor_2.alignment() } }] } },
                                           { push: { storage: false,
                                                     value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(bountyIdPublic_0),
                                                                                                  alignment: _descriptor_0.alignment() }).encode() } },
                                           { push: { storage: true,
                                                     value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(tmp_2),
                                                                                                  alignment: _descriptor_7.alignment() }).encode() } },
                                           { ins: { cached: false, n: 1 } },
                                           { ins: { cached: true, n: 1 } }]);
      } else {
        __compactRuntime.assert(false, 'action invalid');
      }
    }
    return [];
  }
  _equal_0(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_1(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_2(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_3(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_4(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_5(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_6(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_7(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_8(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_9(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_10(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_11(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_12(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_13(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_14(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_15(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_16(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_17(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
}
export function ledger(stateOrChargedState) {
  const state = stateOrChargedState instanceof __compactRuntime.StateValue ? stateOrChargedState : stateOrChargedState.state;
  const chargedState = stateOrChargedState instanceof __compactRuntime.StateValue ? new __compactRuntime.ChargedState(stateOrChargedState) : stateOrChargedState;
  const context = {
    currentQueryContext: new __compactRuntime.QueryContext(chargedState, __compactRuntime.dummyContractAddress()),
    costModel: __compactRuntime.CostModel.initialCostModel()
  };
  const partialProofData = {
    input: { value: [], alignment: [] },
    output: undefined,
    publicTranscript: [],
    privateTranscriptOutputs: []
  };
  return {
    bounties: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(0n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(0n),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(0n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(typeof(key_0) === 'bigint' && key_0 >= 0n && key_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'hello-world.compact line 51 char 1',
                                     'Uint<0..18446744073709551616>',
                                     key_0)
        }
        return _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(0n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(typeof(key_0) === 'bigint' && key_0 >= 0n && key_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'hello-world.compact line 51 char 1',
                                     'Uint<0..18446744073709551616>',
                                     key_0)
        }
        return _descriptor_7.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(0n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_0.toValue(key_0),
                                                                                                     alignment: _descriptor_0.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[0];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_7.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    submissions: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(1n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(0n),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(1n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(typeof(key_0) === 'bigint' && key_0 >= 0n && key_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'hello-world.compact line 52 char 1',
                                     'Uint<0..18446744073709551616>',
                                     key_0)
        }
        return _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(1n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(typeof(key_0) === 'bigint' && key_0 >= 0n && key_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'hello-world.compact line 52 char 1',
                                     'Uint<0..18446744073709551616>',
                                     key_0)
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(1n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_0.toValue(key_0),
                                                                                                     alignment: _descriptor_0.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[1];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_4.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    supplements: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(2n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(0n),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(2n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(typeof(key_0) === 'bigint' && key_0 >= 0n && key_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'hello-world.compact line 53 char 1',
                                     'Uint<0..18446744073709551616>',
                                     key_0)
        }
        return _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(2n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(typeof(key_0) === 'bigint' && key_0 >= 0n && key_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'hello-world.compact line 53 char 1',
                                     'Uint<0..18446744073709551616>',
                                     key_0)
        }
        return _descriptor_11.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_2.toValue(2n),
                                                                                                      alignment: _descriptor_2.alignment() } }] } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_0.toValue(key_0),
                                                                                                      alignment: _descriptor_0.alignment() } }] } },
                                                                           { popeq: { cached: false,
                                                                                      result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[2];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_11.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    usedNullifiers: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(3n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(0n),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(3n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const elem_0 = args_0[0];
        if (!(elem_0.buffer instanceof ArrayBuffer && elem_0.BYTES_PER_ELEMENT === 1 && elem_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'hello-world.compact line 54 char 1',
                                     'Bytes<32>',
                                     elem_0)
        }
        return _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(3n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(elem_0),
                                                                                                                                 alignment: _descriptor_1.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[3];
        return self_0.asMap().keys().map((elem) => _descriptor_1.fromValue(elem.value))[Symbol.iterator]();
      }
    },
    payoutRecipientCommitments: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(4n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(0n),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(4n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(typeof(key_0) === 'bigint' && key_0 >= 0n && key_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'hello-world.compact line 56 char 1',
                                     'Uint<0..18446744073709551616>',
                                     key_0)
        }
        return _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(4n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(typeof(key_0) === 'bigint' && key_0 >= 0n && key_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'hello-world.compact line 56 char 1',
                                     'Uint<0..18446744073709551616>',
                                     key_0)
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(4n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_0.toValue(key_0),
                                                                                                     alignment: _descriptor_0.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[4];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_1.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    payoutReceiptHashes: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(5n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(0n),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(5n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(typeof(key_0) === 'bigint' && key_0 >= 0n && key_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'hello-world.compact line 57 char 1',
                                     'Uint<0..18446744073709551616>',
                                     key_0)
        }
        return _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(5n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(typeof(key_0) === 'bigint' && key_0 >= 0n && key_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'hello-world.compact line 57 char 1',
                                     'Uint<0..18446744073709551616>',
                                     key_0)
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(5n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_0.toValue(key_0),
                                                                                                     alignment: _descriptor_0.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[5];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_1.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    get bountyCount() {
      return _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(6n),
                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                        { popeq: { cached: true,
                                                                                   result: undefined } }]).value);
    },
    get submissionCount() {
      return _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(7n),
                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                        { popeq: { cached: true,
                                                                                   result: undefined } }]).value);
    },
    get supplementCount() {
      return _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(8n),
                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                        { popeq: { cached: true,
                                                                                   result: undefined } }]).value);
    }
  };
}
const _emptyContext = {
  currentQueryContext: new __compactRuntime.QueryContext(new __compactRuntime.ContractState().data, __compactRuntime.dummyContractAddress())
};
const _dummyContract = new Contract({
  actorSecret: (...args) => undefined,
  researcherSecret: (...args) => undefined,
  reportDigest: (...args) => undefined,
  reportOpening: (...args) => undefined,
  severityValue: (...args) => undefined,
  severityOpening: (...args) => undefined,
  supplementDigest: (...args) => undefined,
  supplementOpening: (...args) => undefined
});
export const pureCircuits = {};
export const contractReferenceLocations =
  { tag: 'publicLedgerArray', indices: { } };
//# sourceMappingURL=index.js.map
