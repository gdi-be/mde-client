import { test, expect, type Locator } from '@playwright/test';
import { createMetadata, deleteMetadata, highlight, testFormField } from '../helpers';

test.use({
  storageState: 'tests/e2e/.auth/editor.json'
});

test.describe('Metadata form - Temp and Spatial section', () => {
  const title = 'Test dataset TempAndSpatial (Playwright)';

  test('create test dataset', async ({ page }) => {
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

    await expect(progressBar).not.toHaveAttribute('style', /transform: scaleX\(1\)/);
    await highlight(
      page.locator('.tab-container', {
        has: page.getByText('3. Zeitliche und Räumliche Angaben')
      })
    );
    await progressBar.hover();

    await testFormField(page, '.date-time-field:has(input[name="isoMetadata.created"])', {
      label: 'Erstellungsdatum',
      value: '2025-06-05',
      checkForHelp: true,
      checkForCopy: true
    });

    await testFormField(page, '.published-field:has(input[name="isoMetadata.published"])', {
      label: 'Veröffentlichungsdatum',
      value: '2026-01-01',
      checkForHelp: true,
      checkForCopy: true
    });

    await testFormField(page, 'section#temp_and_spatial .maintenance-frequency-field', {
      label: 'Pflegeintervall',
      selectOptionText: 'monatlich',
      checkForHelp: true,
      checkForCopy: true
    });

    await testFormField(page, '.last-updated-field:has(input[name="isoMetadata.modified"])', {
      label: 'letzte Aktualisierung',
      value: '2025-12-31',
      checkForHelp: true,
      checkForCopy: true
    });

    const validityRangeField = page.locator('.validity-range-field');
    await expect(validityRangeField).toBeVisible();

    await testFormField(
      page,
      'section#temp_and_spatial .delivered-crs-field:has(legend:has-text("geliefertes Koordinatensystem"))',
      {
        label: 'geliefertes Koordinatensystem',
        value: 'EPSG:25833',
        checkForHelp: true,
        checkForCopy: true
      }
    );

    await testFormField(
      page,
      'section#temp_and_spatial .crs-field:has(legend:has-text("abzugebendes Koordinatensystem"))',
      {
        label: 'abzugebendes Koordinatensystem',
        selectOptionText: 'EPSG:4326',
        checkForHelp: true,
        checkForCopy: true
      }
    );

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

    await page.getByRole('button', { name: 'Berlin' }).click();

    await testFormField(
      page,
      'section#temp_and_spatial .resolution-field:has(legend:has-text("Räumliche Auflösung"))',
      {
        label: 'Räumliche Auflösung',
        radioOptionLabel: 'Bodenauflösung in Metern',
        value: 10,
        checkForHelp: true,
        progressBar: {
          element: progressBar
        }
      }
    );

    await testFormField(page, '.spatial-representation-field', {
      label: 'Räumliche Darstellungsart',
      selectOptionText: 'Raster',
      checkForHelp: true,
      checkForCopy: true
    });

    await expect(progressBar).toHaveAttribute('style', /transform: scaleX\(1\)/);
    await highlight(
      page.locator('.tab-container', {
        has: page.getByText('3. Zeitliche und Räumliche Angaben')
      })
    );
    await progressBar.hover();
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
    await highlight(createdField);
    await createdField.hover();

    const publishedField = page.locator('section#temp_and_spatial .display-field', {
      has: page.locator('strong', { hasText: 'Veröffentlichungsdatum' })
    });
    await expect(publishedField.locator('.value')).toContainText('2026');
    await highlight(publishedField);
    await publishedField.hover();

    const maintenanceFrequencyField = page.locator('section#temp_and_spatial .display-field', {
      has: page.locator('strong', { hasText: 'Pflegeintervall' })
    });
    await expect(maintenanceFrequencyField.locator('.value')).toContainText('monatlich');
    await highlight(maintenanceFrequencyField);
    await maintenanceFrequencyField.hover();

    const lastUpdatedField = page.locator('section#temp_and_spatial .display-field', {
      has: page.locator('strong', { hasText: 'letzte Aktualisierung' })
    });
    await expect(lastUpdatedField.locator('.value')).toContainText('12/31/2025');
    await highlight(lastUpdatedField);
    await lastUpdatedField.hover();

    const deliveredCrsField = page.locator('section#temp_and_spatial .display-field', {
      has: page.locator('strong', { hasText: 'geliefertes Koordinatensystem' })
    });
    await expect(deliveredCrsField.locator('.value')).toContainText('EPSG:25833');
    await highlight(deliveredCrsField);
    await deliveredCrsField.hover();

    const crsField = page.locator('section#temp_and_spatial .display-field', {
      has: page.locator('strong', { hasText: 'abzugebendes Koordinatensystem' })
    });
    await expect(crsField.locator('.value')).toContainText('EPSG:4326');
    await highlight(crsField);
    await crsField.hover();

    const spatialResolutionField = page.locator('section#temp_and_spatial .display-field', {
      has: page.locator('strong', { hasText: 'Räumliche Auflösung' })
    });
    await expect(spatialResolutionField.locator('.value')).toContainText('10');
    await highlight(spatialResolutionField);
    await spatialResolutionField.hover();

    const spatialRepresentationField = page.locator('section#temp_and_spatial .display-field', {
      has: page.locator('strong', { hasText: 'Räumliche Darstellungsart' })
    });
    await expect(spatialRepresentationField.locator('.value')).toContainText('Raster');
    await highlight(spatialRepresentationField);
    await spatialRepresentationField.hover();
  });

  test('clear date fields via calendar button and verify cleared values', async ({ page }) => {
    const clearDateFieldViaCalendarButton = async (inputTarget: string | Locator) => {
      const input = typeof inputTarget === 'string' ? page.locator(inputTarget) : inputTarget;
      await expect(input).toBeVisible();

      const box = await input.boundingBox();
      if (!box) {
        throw new Error('Could not determine bounding box for date input.');
      }

      await page.mouse.click(box.x + box.width - 6, box.y + box.height / 2);
      await input.evaluate((el) => {
        const dateInput = el as HTMLInputElement;
        dateInput.value = '';
        dateInput.dispatchEvent(new Event('input', { bubbles: true }));
        dateInput.dispatchEvent(new Event('change', { bubbles: true }));
        dateInput.blur();
      });
      await expect(input).toHaveValue('');
    };

    await page.goto('/metadata');

    await page
      .locator('.metadata-card', {
        has: page.getByText(title)
      })
      .getByTitle('Bearbeiten')
      .click();

    await page.getByRole('button', { name: '3. Zeitliche und Räumliche Angaben' }).click();
    await expect(page.locator('section#temp_and_spatial')).toBeVisible();

    await clearDateFieldViaCalendarButton(
      'section#temp_and_spatial .date-time-field:has(input[name="isoMetadata.created"]) input[type="date"]'
    );
    await clearDateFieldViaCalendarButton(
      'section#temp_and_spatial .published-field:has(input[name="isoMetadata.published"]) input[type="date"]'
    );
    await clearDateFieldViaCalendarButton(
      'section#temp_and_spatial .last-updated-field:has(input[name="isoMetadata.modified"]) input[type="date"]'
    );

    const validityRangeField = page.locator('section#temp_and_spatial .validity-range-field');
    const validFromInput = validityRangeField.locator('input[type="date"]').first();
    const validToInput = validityRangeField.locator('input[type="date"]').last();

    await expect(validFromInput).toBeVisible();
    await expect(validToInput).toBeVisible();

    await clearDateFieldViaCalendarButton(validFromInput);
    await clearDateFieldViaCalendarButton(validToInput);

    await expect(validFromInput).toHaveValue('');
    await expect(validToInput).toHaveValue('');
  });

  test('Cleanup: delete test dataset', async ({ page }) => {
    await page.goto('/metadata');

    await deleteMetadata(page, title);
  });
});
