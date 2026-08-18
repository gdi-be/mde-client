import { test, expect } from '@playwright/test';
import { createMetadata, deleteMetadata, highlight, testFormField } from '../helpers';

test.use({
  storageState: 'tests/e2e/.auth/editor.json'
});

test.describe('Metadata form - Additional section', () => {
  const title = 'Test dataset Additional (Playwright)';

  test('create test dataset', async ({ page }) => {
    await page.goto('/metadata');

    await createMetadata(page, title);
  });

  test('fill additional tab', async ({ page }) => {
    const progressBar = page
      .locator('.tab-container', {
        has: page.getByText('4. Weitere Angaben')
      })
      .locator('.mdc-linear-progress__bar.mdc-linear-progress__primary-bar');

    await page.goto('/metadata');

    await page
      .locator('.metadata-card', {
        has: page.getByText(title)
      })
      .getByTitle('Bearbeiten')
      .click();

    await page.getByRole('button', { name: '4. Weitere Angaben' }).click();
    await expect(page.locator('section#additional')).toBeVisible();

    await testFormField(
      page,
      'section#additional .content-description-field:has(legend:has-text("Inhaltliche Beschreibung"))',
      {
        label: 'Inhaltliche Beschreibung',
        value: 'Dies ist eine inhaltliche Beschreibung',
        checkForHelp: true,
        checkForCopy: true
      }
    );

    await testFormField(
      page,
      'section#additional .technical-description-field:has-text("Technische Beschreibung")',
      {
        label: 'Technische Beschreibung',
        value: 'Dies ist eine technische Beschreibung',
        checkForHelp: true,
        checkForCopy: true
      }
    );

    const addLineageButton = page.getByTitle('Daten hinzufügen');
    await expect(addLineageButton).toBeVisible();
    await addLineageButton.click();

    const lineagesField = page.locator('.lineages-field');
    const lineageFieldset = lineagesField.locator('fieldset.lineage').first();
    await expect(lineageFieldset).toBeVisible();

    const lineageTitleInput = lineageFieldset.locator('[id="isoMetadata.lineage-0-title"]');
    await lineageTitleInput.fill('Test Lineage Title');
    await lineageTitleInput.evaluate((el) => (el as HTMLElement).blur());

    const publishDateInput = lineageFieldset.locator('input[type="date"]');
    await publishDateInput.click();
    await publishDateInput.type('2026');
    await publishDateInput.click();
    await publishDateInput.press('Tab');
    await publishDateInput.type('01');
    await publishDateInput.click();
    await publishDateInput.press('Tab');
    await publishDateInput.press('Tab');
    await publishDateInput.type('01');
    await page.waitForTimeout(300);
    await publishDateInput.evaluate((el) => (el as HTMLElement).blur());
    await page.waitForTimeout(300);

    const lineageSourceInput = lineageFieldset.locator('[id="isoMetadata.lineage-0-identifier"]');
    await lineageSourceInput.fill('Test Identifier');
    await lineageSourceInput.evaluate((el) => (el as HTMLElement).blur());

    await page.getByRole('heading').click();

    const addContentDescriptionButton = page.getByTitle('Information hinzufügen');
    await expect(addContentDescriptionButton).toBeVisible();
    await addContentDescriptionButton.click();

    const contentDescriptionField = page.locator('.contentDescriptions-field');
    const contentDescriptionFieldset = contentDescriptionField
      .locator('fieldset.contentDescription')
      .first();
    await expect(contentDescriptionFieldset).toBeVisible();

    const descriptionInput = contentDescriptionFieldset.locator('input[type="text"]').first();
    await descriptionInput.fill('Test Information Title');
    await descriptionInput.evaluate((el) => (el as HTMLElement).blur());

    const urlInput = contentDescriptionField.locator('.url-field input[type="text"]').first();
    await urlInput.fill('https://example.com/info');
    await urlInput.evaluate((el) => (el as HTMLElement).blur());

    await expect(progressBar).toHaveAttribute('style', /transform: scaleX\(1\)/);
    await highlight(
      page.locator('.tab-container', {
        has: page.getByText('4. Weitere Angaben')
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

    const additionalSection = page.locator('section#additional');
    await expect(additionalSection).toBeVisible();

    const contentDescriptionField = page.locator('section#additional .display-field', {
      has: page.locator('strong', { hasText: 'Inhaltliche Beschreibung' })
    });
    await expect(contentDescriptionField.locator('.value')).toContainText(
      'Dies ist eine inhaltliche Beschreibung'
    );
    await highlight(contentDescriptionField);
    await contentDescriptionField.hover();

    const technicalDescriptionField = page.locator('section#additional .display-field', {
      has: page.locator('strong', { hasText: 'Technische Beschreibung' })
    });
    await expect(technicalDescriptionField.locator('.value')).toContainText(
      'Dies ist eine technische Beschreibung'
    );
    await highlight(technicalDescriptionField);
    await technicalDescriptionField.hover();

    const lineageField = page.locator('section#additional .display-field', {
      has: page.locator('strong', { hasText: 'Herkunft der Daten' })
    });
    await expect(lineageField).toBeVisible();
    await expect(lineageField.locator('.list-item-value').nth(0)).toContainText(
      'Test Lineage Title'
    );
    await expect(lineageField.locator('.list-item-value').nth(1)).toContainText(
      '2026-01-01T00:00:00Z'
    );
    await expect(lineageField.locator('.list-item-value').nth(2)).toContainText('Test Identifier');
    await highlight(lineageField);
    await lineageField.hover();

    const additionalInformationField = page.locator('section#additional .display-field', {
      has: page.locator('strong', { hasText: 'Weitere Informationen' })
    });
    await expect(additionalInformationField).toBeVisible();
    await expect(additionalInformationField.locator('.list-item-value').nth(0)).toContainText(
      'Test Information Title'
    );
    await expect(additionalInformationField.locator('.list-item-value').nth(1)).toContainText(
      'Information'
    );
    await expect(additionalInformationField.locator('.list-item-value').nth(2)).toContainText(
      'https://example.com/info'
    );
    await highlight(additionalInformationField);
    await additionalInformationField.hover();
  });

  test('Cleanup: delete test dataset', async ({ page }) => {
    await page.goto('/metadata');

    await deleteMetadata(page, title);
  });
});
