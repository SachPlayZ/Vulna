import { expect, test } from '@playwright/test';

const sentinel = 'BLACKBOX_PRIVATE_SENTINEL_7F3A';

test('public routes send restrictive headers and never render a report sentinel', async ({ page, request }) => {
  for (const route of ['/', '/bounties', '/bounties/acme-notes', '/researcher', '/reviewer']) {
    const response = await request.get(route);
    expect(response.ok()).toBeTruthy();
    expect(await response.text()).not.toContain(sentinel);
  }
  const response = await request.get('/researcher');
  expect(response.headers()['content-security-policy']).toContain("default-src 'self'");
  expect(response.headers()['referrer-policy']).toBe('no-referrer');
  expect(response.headers()['x-content-type-options']).toBe('nosniff');

  await page.goto('/researcher');
  await page.getByRole('link', { name: 'Skip to content' }).focus();
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
});

test('researcher flow presents bounty selection before advanced contract configuration', async ({ page }) => {
  await page.goto('/researcher');

  await expect(page.getByRole('heading', { name: 'Choose an open bounty' })).toBeVisible();
  await expect(page.getByText('Connect your Preview wallet to load available bounties.')).toBeVisible();
  await expect(page.getByLabel('V2 contract address')).not.toBeVisible();
  await page.getByText('Use another contract').click();
  await expect(page.getByLabel('V2 contract address')).toBeVisible();
});

test('researcher flow auto-loads public bounties without private wallet setup', async ({ page }) => {
  await page.route('https://example.invalid/**', (route) => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ data: {} }) }));
  await page.addInitScript(() => {
    const state = { configurationReads: 0, shieldedReads: 0 };
    (globalThis as typeof globalThis & { __vulnaBountyPickerState: typeof state }).__vulnaBountyPickerState = state;
    window.midnight = {
      'public-reader-wallet': {
        name: 'Public Reader Wallet', rdns: 'example.wallet', icon: '', apiVersion: '4.0.1',
        connect: async () => ({
          getConfiguration: async () => {
            state.configurationReads += 1;
            return { networkId: 'preview', indexerUri: 'https://example.invalid/graphql', indexerWsUri: 'wss://example.invalid/graphql', substrateNodeUri: 'wss://example.invalid' };
          },
          getUnshieldedAddress: async () => ({ unshieldedAddress: 'mn_addr_preview1publicreaderabcdefghijklmnopqrstuvwxyz' }),
          getShieldedAddresses: async () => { state.shieldedReads += 1; throw new Error('not needed for public reads'); },
        }),
      },
    };
  });
  await page.goto('/researcher');
  await page.getByRole('button', { name: 'Connect wallet' }).click();
  await expect.poll(() => page.evaluate(() => (globalThis as typeof globalThis & { __vulnaBountyPickerState: { configurationReads: number } }).__vulnaBountyPickerState.configurationReads)).toBeGreaterThan(1);
  await expect.poll(() => page.evaluate(() => (globalThis as typeof globalThis & { __vulnaBountyPickerState: { shieldedReads: number } }).__vulnaBountyPickerState.shieldedReads)).toBe(0);
});

test('researcher draft keeps the sentinel out of requests and browser persistence', async ({ page }) => {
  const requestBodies: string[] = [];
  page.on('request', (request) => {
    const body = request.postData();
    if (body) requestBodies.push(body);
  });

  await page.goto('/researcher');
  await page.getByLabel('Report title').fill('Fictional authorization boundary');
  await page.getByLabel('Affected demo component').fill('Demo role route');
  await page.getByLabel('Summary').fill(`Harmless demo description ${sentinel}; never use real credentials.`);
  await page.getByLabel('Safe reproduction').fill('Open the fictional route and observe a harmless mocked response.');
  await page.getByLabel('Impact').fill('The fictional demo could cross an authorization boundary.');
  expect(requestBodies.join('\n')).not.toContain(sentinel);
  const persisted = await page.evaluate(() => `${localStorage.toString()}${sessionStorage.toString()}${document.cookie}`);
  expect(persisted).not.toContain(sentinel);
});

test('theme toggle persists a non-sensitive display preference', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');

  const themeToggle = page.getByRole('button', { name: 'Switch to light mode' });
  await expect(themeToggle).toBeVisible();
  await themeToggle.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.getByRole('button', { name: 'Switch to dark mode' })).toBeVisible();
});

test('wallet connector authorizes only a Preview wallet and exposes a public address', async ({ page }) => {
  await page.addInitScript(() => {
    window.midnight = {
      'example-wallet-id': {
        name: 'Example Wallet',
        rdns: 'example.wallet',
        icon: '',
        apiVersion: '4.0.1',
        connect: async () => ({
          hintUsage: async () => undefined,
          getConfiguration: async () => ({ networkId: 'preview', indexerUri: 'https://example.invalid/graphql', indexerWsUri: 'wss://example.invalid/graphql', substrateNodeUri: 'wss://example.invalid' }),
          getConnectionStatus: async () => ({ status: 'connected', networkId: 'preview' }),
          getUnshieldedAddress: async () => ({ unshieldedAddress: 'mn_addr_preview1abcdefghijklmnopqrstuvwxyz' }),
        }),
      },
    };
  });
  await page.goto('/researcher');
  await page.getByRole('button', { name: 'Connect wallet' }).click();
  await expect(page.getByRole('button', { name: 'Disconnect' })).toBeVisible();
  await expect(page.getByText('Example Wallet mn_addr_pr…uvwxyz')).toBeVisible();
});

test('wallet connector does not require optional wallet hints or status checks', async ({ page }) => {
  await page.addInitScript(() => {
    window.midnight = {
      'partial-wallet-id': {
        name: 'Partial Wallet',
        rdns: 'example.wallet',
        icon: '',
        apiVersion: '4.0.1',
        connect: async () => ({
          hintUsage: async () => { throw new Error('hint method unavailable'); },
          getConfiguration: async () => ({ networkId: 'preview', indexerUri: 'https://example.invalid/graphql', indexerWsUri: 'wss://example.invalid/graphql', substrateNodeUri: 'wss://example.invalid' }),
          getConnectionStatus: async () => { throw new Error('status method unavailable'); },
          getUnshieldedAddress: async () => ({ unshieldedAddress: 'mn_addr_preview1partialwalletabcdefghijklmnopqrstuvwxyz' }),
        }),
      },
    };
  });
  await page.goto('/reviewer');
  await page.getByRole('button', { name: 'Connect wallet' }).click();
  await expect(page.getByRole('button', { name: 'Disconnect' })).toBeVisible();
  await expect(page.getByText('Partial Wallet mn_addr_pr…uvwxyz')).toBeVisible();
});

test('wallet connector fails closed when a wallet reports the wrong network', async ({ page }) => {
  await page.addInitScript(() => {
    window.midnight = {
      'wrong-network-wallet': {
        name: 'Wrong Network Wallet',
        rdns: 'example.wallet',
        icon: '',
        apiVersion: '4.0.1',
        connect: async () => ({
          hintUsage: async () => undefined,
          getConfiguration: async () => ({ networkId: 'preprod', indexerUri: 'https://example.invalid/graphql', indexerWsUri: 'wss://example.invalid/graphql', substrateNodeUri: 'wss://example.invalid' }),
          getConnectionStatus: async () => ({ status: 'connected', networkId: 'preprod' }),
          getUnshieldedAddress: async () => ({ unshieldedAddress: 'mn_addr_preprod1abcdefghijklmnopqrstuvwxyz' }),
        }),
      },
    };
  });
  await page.goto('/researcher');
  await page.getByRole('button', { name: 'Connect wallet' }).click();
  await expect(page.locator('.wallet-error')).toContainText('Wallet is on the wrong network. Select Preview Midnight');
  await expect(page.getByRole('button', { name: 'Disconnect' })).not.toBeVisible();
});
