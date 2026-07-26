export const submissionStatuses = [
  'Committed',
  'AccessGranted',
  'UnderReview',
  'NeedsMoreInfo',
  'Accepted',
  'Rejected',
  'Patched',
  'Paid',
  'Disclosed',
  'Withdrawn',
] as const;

export type SubmissionStatus = (typeof submissionStatuses)[number];

export const bountyStatuses = ['Draft', 'Open', 'UnderReview', 'Accepted', 'Patched', 'Paid', 'Cancelled', 'Refunded'] as const;
export type BountyStatus = (typeof bountyStatuses)[number];

export const protocolRoles = ['owner', 'reviewer', 'researcher'] as const;
export type ProtocolRole = (typeof protocolRoles)[number];

const transitions = {
  Committed: ['AccessGranted', 'Withdrawn'],
  AccessGranted: ['UnderReview', 'Withdrawn'],
  UnderReview: ['NeedsMoreInfo', 'Accepted', 'Rejected'],
  NeedsMoreInfo: ['UnderReview', 'Withdrawn'],
  Accepted: ['Patched'],
  Rejected: [],
  Patched: ['Paid'],
  Paid: ['Disclosed'],
  Disclosed: [],
  Withdrawn: [],
} as const satisfies Record<SubmissionStatus, readonly SubmissionStatus[]>;

export const submissionTransitions: Readonly<Record<SubmissionStatus, readonly SubmissionStatus[]>> = transitions;

type ValidSubmissionTransition = {
  [From in SubmissionStatus]: `${From}->${(typeof transitions)[From][number]}`
}[SubmissionStatus];

export const transitionRole: Readonly<Record<ValidSubmissionTransition, ProtocolRole>> = {
  'Committed->AccessGranted': 'researcher',
  'Committed->Withdrawn': 'researcher',
  'AccessGranted->UnderReview': 'reviewer',
  'AccessGranted->Withdrawn': 'researcher',
  'UnderReview->NeedsMoreInfo': 'reviewer',
  'UnderReview->Accepted': 'reviewer',
  'UnderReview->Rejected': 'reviewer',
  'NeedsMoreInfo->UnderReview': 'researcher',
  'NeedsMoreInfo->Withdrawn': 'researcher',
  'Accepted->Patched': 'owner',
  'Patched->Paid': 'researcher',
  'Paid->Disclosed': 'researcher',
} as const;

export function canTransitionSubmission(from: SubmissionStatus, to: SubmissionStatus): boolean {
  return submissionTransitions[from].includes(to);
}

export function assertSubmissionTransition(from: SubmissionStatus, to: SubmissionStatus): void {
  if (!canTransitionSubmission(from, to)) {
    throw new Error(`Invalid Vulna submission transition: ${from} -> ${to}`);
  }
}
