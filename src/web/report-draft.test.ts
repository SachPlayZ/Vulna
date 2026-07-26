import assert from 'node:assert/strict';
import test from 'node:test';

import { createReviewerKeyPair } from '../crypto/report-crypto.js';
import { prepareLocalDisclosure, reportDraftFormSchema } from './report-draft.js';

const sentinel = 'BLACKBOX_PRIVATE_SENTINEL_7F3A';

test('local report preparation exposes only encrypted safe references', async () => {
  const reviewer = await createReviewerKeyPair();
  const prepared = await prepareLocalDisclosure({
    title: 'Fictional authorization gap',
    summary: `A harmless local demo report containing ${sentinel}.`,
    affectedComponent: 'Demo role route',
    severity: 'high',
    reproduction: 'Open the fictional demo route and observe the harmless mocked response.',
    impact: 'An authorized role boundary could be bypassed in the fictional scenario.',
    remediation: 'Require the authorization middleware before the route handler.',
  }, reviewer);
  const publicJson = JSON.stringify(prepared.publicReference);
  assert.equal(publicJson.includes(sentinel), false);
  assert.equal(prepared.bundle.artifactHash.length, 64);
  assert.equal(prepared.bundle.envelopeHash.length, 64);
});

test('local report preparation rejects unsafe incomplete drafts', () => {
  assert.throws(() => reportDraftFormSchema.parse({
    title: 'short', summary: '', affectedComponent: '', severity: 'high', reproduction: '', impact: '', remediation: '',
  }));
});
