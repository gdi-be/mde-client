import { test, expect } from '@playwright/test';
import { createMetadata, deleteMetadata } from './helpers';

test.use({
  storageState: 'tests/e2e/.auth/editor.json'
});

test.describe('Metadata overview page', () => {
  test('metadata overview page as editor', async ({ page }) => {
    await page.goto('/');

    await page.locator('[href="/metadata"]').click();

    await expect(page.locator('.metadata-overview')).toBeVisible();
    await page.locator('.metadata-overview').hover();

    await expect(page.getByText('Metadaten Editor')).toBeVisible();
    await page.getByText('Metadaten Editor').hover();

    await expect(page.locator('.user-menu-wrapper')).toBeVisible();
    await page.locator('.user-menu-wrapper').hover();

    await expect(page.getByText('Neuerfassung')).toBeVisible();
    await page.getByText('Neuerfassung').hover();

    await expect(page.locator('.search-container')).toBeVisible();
    await page.locator('.search-container').hover();

    await expect(page.getByRole('checkbox', { name: 'zu bearbeiten' })).toBeVisible();
    await page.getByRole('checkbox', { name: 'zu bearbeiten' }).hover();
    await expect(page.getByRole('checkbox', { name: 'Meine Metadaten' })).toBeVisible();
    await page.getByRole('checkbox', { name: 'Meine Metadaten' }).hover();
    await expect(page.getByRole('checkbox', { name: 'Geprüft' })).toBeVisible();
    await page.getByRole('checkbox', { name: 'Geprüft' }).hover();
    await expect(page.getByRole('checkbox', { name: 'Redaktion' })).toBeVisible();
    await page.getByRole('checkbox', { name: 'Redaktion' }).hover();

    await expect(page.locator('.metadata-list')).toBeVisible();
    await page.locator('.metadata-list').hover();

    await expect(page.locator('.metadata-card').nth(0)).toBeVisible();
    await page.locator('.metadata-card').nth(0).hover();
    await expect(page.locator('.preview-image').nth(0)).toBeVisible();
    await page.locator('.preview-image').nth(0).hover();

    await expect(page.getByRole('button', { name: 'Metadatensatz Löschen' }).first()).toBeVisible();
    await page.getByRole('button', { name: 'Metadatensatz Löschen' }).first().hover();
    await expect(page.getByRole('button', { name: 'Kommentare anzeigen' }).first()).toBeVisible();
    await page.getByRole('button', { name: 'Kommentare anzeigen' }).first().hover();
    await expect(page.getByRole('button', { name: 'Drucken' }).first()).toBeVisible();
    await page.getByRole('button', { name: 'Drucken' }).first().hover();
    await expect(page.getByRole('button', { name: 'Bearbeiten' }).first()).toBeVisible();
    await page.getByRole('button', { name: 'Bearbeiten' }).first().hover();

    await expect(page.locator('.pagination')).toBeVisible();
    await page.locator('.pagination').hover();
  });

  test.describe('data owner tests', () => {
    test.use({
      storageState: 'tests/e2e/.auth/data-owner.json'
    });

    test('metadata overview page as data owner', async ({ page }) => {
      await page.goto('/');

      await page.locator('[href="/metadata"]').click();

      await expect(page.locator('.metadata-overview')).toBeVisible();
      await page.locator('.metadata-overview').hover();

      await expect(page.getByRole('checkbox', { name: 'zu bearbeiten' })).toBeVisible();
      await page.getByRole('checkbox', { name: 'zu bearbeiten' }).hover();
      await expect(page.getByRole('checkbox', { name: 'Meine Metadaten' })).toBeVisible();
      await page.getByRole('checkbox', { name: 'Meine Metadaten' }).hover();
      await expect(page.getByRole('checkbox', { name: 'Geprüft' })).not.toBeVisible();
      await expect(page.getByRole('checkbox', { name: 'Redaktion' })).not.toBeVisible();

      await expect(page.locator('.metadata-list')).toBeVisible();
      await page.locator('.metadata-list').hover();

      await expect(page.getByRole('button', { name: 'Metadatensatz Löschen' })).not.toBeVisible();
      await expect(page.getByRole('button', { name: 'Kommentare anzeigen' }).first()).toBeVisible();
      await page.getByRole('button', { name: 'Kommentare anzeigen' }).first().hover();
      await expect(page.getByRole('button', { name: 'Drucken' }).first()).toBeVisible();
      await page.getByRole('button', { name: 'Drucken' }).first().hover();
      await expect(page.getByRole('button', { name: 'Bearbeiten' }).first()).toBeVisible();
      await page.getByRole('button', { name: 'Bearbeiten' }).first().hover();
    });
  });

  test.describe('quality tests', () => {
    test.use({
      storageState: 'tests/e2e/.auth/quality.json'
    });

    test('metadata overview page as quality', async ({ page }) => {
      await page.goto('/');

      await page.locator('[href="/metadata"]').click();

      await expect(page.locator('.metadata-overview')).toBeVisible();
      await page.locator('.metadata-overview').hover();

      await expect(page.getByRole('checkbox', { name: 'zu bearbeiten' })).toBeVisible();
      await page.getByRole('checkbox', { name: 'zu bearbeiten' }).hover();
      await expect(page.getByRole('checkbox', { name: 'Meine Metadaten' })).toBeVisible();
      await page.getByRole('checkbox', { name: 'Meine Metadaten' }).hover();
      await expect(page.getByRole('checkbox', { name: 'Geprüft' })).toBeVisible();
      await page.getByRole('checkbox', { name: 'Geprüft' }).hover();
      await expect(page.getByRole('checkbox', { name: 'Qualitätssicherung' })).toBeVisible();
      await page.getByRole('checkbox', { name: 'Qualitätssicherung' }).hover();
      await expect(page.getByRole('checkbox', { name: 'Redaktion' })).not.toBeVisible();

      await expect(page.locator('.metadata-list')).toBeVisible();
      await page.locator('.metadata-list').hover();

      await expect(page.getByRole('button', { name: 'Metadatensatz Löschen' })).not.toBeVisible();
      await expect(page.getByRole('button', { name: 'Kommentare anzeigen' }).first()).toBeVisible();
      await page.getByRole('button', { name: 'Kommentare anzeigen' }).first().hover();
      await expect(page.getByRole('button', { name: 'Drucken' }).first()).toBeVisible();
      await page.getByRole('button', { name: 'Drucken' }).first().hover();
      await expect(page.getByRole('button', { name: 'Bearbeiten' })).not.toBeVisible();
    });
  });

  test('metadata creation', async ({ page }) => {
    await page.goto('/metadata');

    await createMetadata(page, 'Test (Playwright)');

    await page.getByText('Neuerfassung').click();
    await page.getByRole('textbox', { name: 'Titel*' }).fill('Test (Playwright)');
    await page.getByRole('button', { name: 'Metadaten anlegen' }).click();

    await expect(
      await page.getByText('Ein Datensatz mit diesem Titel existiert bereits.')
    ).toBeVisible();
  });

  test('metadata deletion', async ({ page }) => {
    await page.goto('/metadata');

    await deleteMetadata(page, 'Test (Playwright)');
  });
});
