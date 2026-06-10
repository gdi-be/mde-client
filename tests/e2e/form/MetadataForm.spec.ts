import { test, expect } from '@playwright/test';
import { createMetadata, deleteMetadata, highlight } from '../helpers';

test.use({
  storageState: 'tests/e2e/.auth/editor.json'
});

test.describe('Metadata form', () => {
  test('Create test dataset', async ({ page }) => {
    await page.goto('/metadata');

    await createMetadata(page, 'Test dataset (Playwright)');
  });

  test('metadata form page', async ({ page }) => {
    await page.goto('/metadata');

    await page
      .locator('.metadata-card', {
        has: page.getByText('Test dataset (Playwright)')
      })
      .getByTitle('Bearbeiten')
      .click();

    await expect(page.locator('.application-header')).toBeVisible();
    await highlight(page.locator('.application-header'));
    await page.locator('.application-header').hover();
    await expect(page.getByRole('heading', { name: 'Test dataset (Playwright)' })).toBeVisible();
    await highlight(page.getByRole('heading', { name: 'Test dataset (Playwright)' }));
    await page.getByRole('heading', { name: 'Test dataset (Playwright)' }).hover();
    await expect(page.locator('.metadata-form')).toBeVisible();
    await highlight(page.locator('.metadata-form'));
    await page.locator('.metadata-form').hover();
    await expect(page.locator('.form-footer')).toBeVisible();
    await highlight(page.locator('.form-footer'));
    await page.locator('.form-footer').hover();

    await expect(page.getByText('1. Basisangaben')).toBeVisible();
    await highlight(page.getByText('1. Basisangaben'));
    await page.getByText('1. Basisangaben').hover();
    await expect(page.getByText('2. Einordnung')).toBeVisible();
    await highlight(page.getByText('2. Einordnung'));
    await page.getByText('2. Einordnung').hover();
    await expect(page.getByText('3. Zeitliche und Räumliche Angaben')).toBeVisible();
    await highlight(page.getByText('3. Zeitliche und Räumliche Angaben'));
    await page.getByText('3. Zeitliche und Räumliche Angaben').hover();
    await expect(page.getByText('4. Weitere Angaben')).toBeVisible();
    await highlight(page.getByText('4. Weitere Angaben'));
    await page.getByText('4. Weitere Angaben').hover();
    await expect(page.getByText('5. Dienste')).toBeVisible();
    await highlight(page.getByText('5. Dienste'));
    await page.getByText('5. Dienste').hover();
  });

  test('Cleanup: delete test dataset', async ({ page }) => {
    await page.goto('/metadata');

    await deleteMetadata(page, 'Test dataset (Playwright)');
  });
});
