import { test, expect } from '@playwright/test';
import { createMetadata, deleteMetadata, testFormField } from '../helpers';

test.use({
  storageState: 'tests/e2e/.auth/editor.json'
});

test.describe('Metadata form - Temp and Spatial section', () => {
  const title = 'Test dataset TempAndSpatial (Playwright)';

  test('Create test dataset', async ({ page }) => {
    await page.goto('/metadata');

    await createMetadata(page, title);
  });

  test('fill temp and spatial tab', async ({ page }) => {
    const progressBar = page
      .locator('.tab-container', {
        has: page.getByText('3. Zeitliche und Räumliche Angaben')
      })
      .locator('.mdc-linear-progress__bar.mdc-linear-progress__primary-bar');

    await page.goto('/metadata');

    await page
      .locator('.metadata-card', {
        has: page.getByText(title)
      })
      .getByTitle('Bearbeiten')
      .click();

    await page.getByRole('button', { name: '3. Zeitliche und Räumliche Angaben' }).click();
    await expect(page.locator('section#temp_and_spatial')).toBeVisible();

    await testFormField(page, '.date-time-field', {
      label: 'Erstellungsdatum',
      value: '2025-06-05',
      checkForHelp: true,
      checkForCopy: true
    });

    await testFormField(page, '.published-field', {
      label: 'Veröffentlichungsdatum',
      value: '2026-01-01',
      checkForHelp: true,
      checkForCopy: true
    });

    await testFormField(page, '.maintenance-frequency-field', {
      label: 'Pflegeintervall',
      selectOptionText: 'monatlich',
      checkForHelp: true,
      checkForCopy: true
    });

    await testFormField(page, '.last-updated-field', {
      label: 'letzte Aktualisierung',
      value: '2024-06-21',
      checkForHelp: true,
      checkForCopy: true
    });

    const validityRangeField = page.locator('.validity-range-field');
    await expect(validityRangeField).toBeVisible();

    const validFromLabel = validityRangeField.locator('legend', { hasText: 'gültig ab' });
    await expect(validFromLabel).toBeVisible();
    const validFromInput = validityRangeField.locator('input[type="date"]').first();
    await validFromInput.fill('2025-01-01');

    const validToLabel = validityRangeField.locator('legend', { hasText: 'gültig bis' });
    await expect(validToLabel).toBeVisible();
    const validToInput = validityRangeField.locator('input[type="date"]').last();
    await validToInput.fill('2025-12-31');

    await testFormField(page, '.delivered-crs-field', {
      label: 'geliefertes Koordinatensystem',
      value: 'EPSG:25833',
      checkForHelp: true,
      checkForCopy: true,
      progressBar: {
        expectedIncrease: 0.2,
        element: progressBar
      }
    });

    await testFormField(page, '.crs-field', {
      label: 'abzugebendes Koordinatensystem',
      selectOptionText: 'EPSG:4326',
      checkForHelp: true,
      checkForCopy: true
    });

    const extentField = page.locator('.extent-field');
    await expect(extentField).toBeVisible();
    const extentInputs = extentField.locator('input[type="text"]');
    await extentInputs.nth(0).fill('13');
    await extentInputs.nth(0).evaluate((el) => (el as HTMLElement).blur());
    await extentInputs.nth(1).fill('14');
    await extentInputs.nth(1).evaluate((el) => (el as HTMLElement).blur());
    await extentInputs.nth(2).fill('52');
    await extentInputs.nth(2).evaluate((el) => (el as HTMLElement).blur());
    await extentInputs.nth(3).fill('53');
    await extentInputs.nth(3).evaluate((el) => (el as HTMLElement).blur());

    await testFormField(page, '.resolution-field', {
      label: 'Räumliche Auflösung',
      checkForHelp: true
    });

    await testFormField(page, '.spatial-representation-field', {
      label: 'Räumliche Darstellungsart',
      selectOptionText: 'Raster',
      checkForHelp: true,
      checkForCopy: true
    });
  });

  test('verify read-only', async ({ page }) => {
    await page.goto('/metadata');

    await page
      .locator('.metadata-card', {
        has: page.getByText(title)
      })
      .click();

    await expect(page.getByRole('heading', { name: title })).toBeVisible();
    await page.getByRole('heading', { name: title }).hover();

    const tempAndSpatialSection = page.locator('section#temp_and_spatial');
    await expect(tempAndSpatialSection).toBeVisible();

    const createdField = page.locator('section#temp_and_spatial .display-field', {
      has: page.locator('strong', { hasText: 'Erstellungsdatum' })
    });
    await expect(createdField.locator('.value')).toContainText('2025');
    await createdField.hover();

    const publishedField = page.locator('section#temp_and_spatial .display-field', {
      has: page.locator('strong', { hasText: 'Veröffentlichungsdatum' })
    });
    await expect(publishedField.locator('.value')).toContainText('2026');
    await publishedField.hover();

    const maintenanceFrequencyField = page.locator('section#temp_and_spatial .display-field', {
      has: page.locator('strong', { hasText: 'Pflegeintervall' })
    });
    await expect(maintenanceFrequencyField.locator('.value')).toContainText('monatlich');
    await maintenanceFrequencyField.hover();

    const lastUpdatedField = page.locator('section#temp_and_spatial .display-field', {
      has: page.locator('strong', { hasText: 'letzte Aktualisierung' })
    });
    await expect(lastUpdatedField.locator('.value')).toContainText('2024');
    await lastUpdatedField.hover();

    const validFromField = page.locator('section#temp_and_spatial .display-field', {
      has: page.locator('strong', { hasText: 'gültig ab' })
    });
    await expect(validFromField.locator('.value')).toContainText('2025');
    await validFromField.hover();

    const validToField = page.locator('section#temp_and_spatial .display-field', {
      has: page.locator('strong', { hasText: 'gültig bis' })
    });
    await expect(validToField.locator('.value')).toContainText('2025');
    await validToField.hover();

    const deliveredCrsField = page.locator('section#temp_and_spatial .display-field', {
      has: page.locator('strong', { hasText: 'geliefertes Koordinatensystem' })
    });
    await expect(deliveredCrsField.locator('.value')).toContainText('EPSG:25833');
    await deliveredCrsField.hover();

    const crsField = page.locator('section#temp_and_spatial .display-field', {
      has: page.locator('strong', { hasText: 'abzugebendes Koordinatensystem' })
    });
    await expect(crsField.locator('.value')).toContainText('EPSG:4326');
    await crsField.hover();

    const spatialRepresentationField = page.locator('section#temp_and_spatial .display-field', {
      has: page.locator('strong', { hasText: 'Räumliche Darstellungsart' })
    });
    await expect(spatialRepresentationField.locator('.value')).toContainText('Raster');
    await spatialRepresentationField.hover();
  });

  test('Cleanup: delete test dataset', async ({ page }) => {
    await page.goto('/metadata');

    await deleteMetadata(page, title);
  });
});
