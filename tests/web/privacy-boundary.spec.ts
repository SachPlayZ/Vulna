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

test('researcher encryption keeps the sentinel out of requests and browser persistence', async ({ page }) => {
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
  await page.getByRole('button', { name: 'Encrypt & stage ciphertext' }).click();
  await expect(page.getByRole('status')).toContainText('Ciphertext is staged locally');

  expect(requestBodies.join('\n')).not.toContain(sentinel);
  const persisted = await page.evaluate(async () => {
    const local = `${localStorage.toString()}${sessionStorage.toString()}${document.cookie}`;
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const open = indexedDB.open('vulna-ciphertext');
      open.onsuccess = () => resolve(open.result);
      open.onerror = () => reject(open.error);
    });
    const blobs = await new Promise<unknown[]>((resolve, reject) => {
      const transaction = database.transaction('blobs', 'readonly');
      const getAll = transaction.objectStore('blobs').getAll();
      getAll.onsuccess = () => resolve(getAll.result);
      getAll.onerror = () => reject(getAll.error);
    });
    return { local, blobs: blobs.map((blob) => Array.from(new Uint8Array(blob as ArrayBuffer))) };
  });
  expect(persisted.local).not.toContain(sentinel);
  expect(new TextDecoder().decode(new Uint8Array(persisted.blobs[0]))).not.toContain(sentinel);
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
