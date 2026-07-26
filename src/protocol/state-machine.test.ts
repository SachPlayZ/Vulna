import assert from 'node:assert/strict';
import test from 'node:test';

import { assertSubmissionTransition, canTransitionSubmission, transitionRole } from './state-machine.js';

test('submission lifecycle permits only approved transitions', () => {
  assert.equal(canTransitionSubmission('Committed', 'AccessGranted'), true);
  assert.equal(canTransitionSubmission('AccessGranted', 'UnderReview'), true);
  assert.equal(canTransitionSubmission('AccessGranted', 'Withdrawn'), false);
  assert.equal(canTransitionSubmission('UnderReview', 'Accepted'), true);
  assert.equal(canTransitionSubmission('Accepted', 'Patched'), true);
  assert.equal(canTransitionSubmission('Patched', 'Paid'), true);
  assert.equal(canTransitionSubmission('Paid', 'Disclosed'), true);
  assert.equal(canTransitionSubmission('Rejected', 'Accepted'), false);
  assert.equal(canTransitionSubmission('Withdrawn', 'UnderReview'), false);
});

test('invalid transitions fail loudly', () => {
  assert.throws(() => assertSubmissionTransition('UnderReview', 'Paid'), /Invalid Vulna submission transition/);
});

test('each valid state transition has one protocol role', () => {
  assert.equal(transitionRole['Committed->AccessGranted'], 'researcher');
  assert.equal(transitionRole['AccessGranted->UnderReview'], 'reviewer');
  assert.equal(transitionRole['Accepted->Patched'], 'owner');
  assert.equal(transitionRole['Patched->Paid'], 'researcher');
});
