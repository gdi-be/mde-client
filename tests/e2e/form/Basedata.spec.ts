import { test, expect } from '@playwright/test';
import { createMetadata, deleteMetadata, testFormField } from '../helpers';

test.use({
  storageState: 'tests/e2e/.auth/editor.json'
});

test.describe('Metadata form - Basedata section', () => {
  test('Create test dataset', async ({ page }) => {
    await page.goto('/metadata');

    await createMetadata(page, 'Test dataset (Playwright)');
  });

  test('fill basedata tab', async ({ page }) => {
    await page.goto('/metadata');

    const progressBar = page
      .locator('.tab-container', {
        has: page.getByText('1. Basisangaben')
      })
      .locator('.mdc-linear-progress__bar.mdc-linear-progress__primary-bar');

    await page
      .locator('.metadata-card', {
        has: page.getByText('Test dataset (Playwright)')
      })
      .getByTitle('Bearbeiten')
      .click();

    await testFormField(page, '.title-field', {
      label: 'Titel',
      value: 'Test Title',
      checkForHelp: true,
      checkForCopy: true,
      maxLength: 250,
      required: true,
      progressBar: {
        expectedIncrease: 0.2,
        element: progressBar
      }
    });

    await testFormField(page, '.description-field', {
      label: 'Beschreibung',
      value: 'Test description',
      checkForHelp: true,
      checkForCopy: true,
      maxLength: 500,
      required: true,
      progressBar: {
        expectedIncrease: 0.2,
        element: progressBar
      }
    });

    await testFormField(page, '.keywords-field', {
      label: 'Schlagwörter',
      selectOptionText: 'Test',
      checkForHelp: true,
      checkForCopy: true,
      required: true
    });

    await testFormField(page, '.preview-field', {
      label: 'Vorschaubild',
      value: 'https://example.com/preview.png',
      checkForHelp: true,
      checkForCopy: true,
      required: true,
      progressBar: {
        expectedIncrease: 0.2,
        element: progressBar
      }
    });

    const addContactButton = page.getByTitle('Kontakt hinzufügen');
    await expect(addContactButton).toBeVisible();
    await addContactButton.click();

    const contactFieldsets = page.locator('.contacts-field fieldset.contact');
    await expect(contactFieldsets).toHaveCount(1);

    await page.locator('[id="isoMetadata.pointsOfContact-0-name"]').click();
    await page.locator('[id="isoMetadata.pointsOfContact-0-name"]').fill('Test Contact');
    await page.locator('[id="isoMetadata.pointsOfContact-0-organisation"]').click();
    await page
      .locator('[id="isoMetadata.pointsOfContact-0-organisation"]')
      .fill('Test Organisation');
    await page.locator('[id="isoMetadata.pointsOfContact-0-phone"]').click();
    await page.locator('[id="isoMetadata.pointsOfContact-0-phone"]').fill('Test Phone');
    await page.locator('[id="isoMetadata.pointsOfContact-0-email"]').click();
    await page.locator('[id="isoMetadata.pointsOfContact-0-email"]').click();
    await page.locator('[id="isoMetadata.pointsOfContact-0-email"]').fill('test@example.com');

    await page.getByRole('heading').click();

    await expect(progressBar).toHaveAttribute('style', /transform: scaleX\(1\)/);
  });

  test('verify read-only', async ({ page }) => {
    await page.goto('/metadata');

    await page
      .locator('.metadata-card', {
        has: page.getByText('Test Title')
      })
      .click();

    await expect(page.getByRole('heading', { name: 'Test Title' })).toBeVisible();
    await page.getByRole('heading', { name: 'Test Title' }).hover();

    const basedataSection = page.locator('section#basedata');
    await expect(basedataSection).toBeVisible();

    const titleField = page.locator('section#basedata .display-field', {
      has: page.locator('strong', { hasText: 'Titel' })
    });
    await expect(titleField.locator('.value')).toContainText('Test Title');
    await titleField.hover();

    const descriptionField = page.locator('section#basedata .display-field', {
      has: page.locator('strong', { hasText: 'Kurzbeschreibung des Datenbestandes' })
    });
    await expect(descriptionField.locator('.value')).toContainText('Test description');
    await descriptionField.hover();

    const keywordsField = page.locator('section#basedata .display-field', {
      has: page.locator('strong', { hasText: 'Schlagwörter' })
    });
    await expect(keywordsField.locator('.value')).toContainText('Test');
    await keywordsField.hover();

    const previewField = page.locator('section#basedata .display-field', {
      has: page.locator('strong', { hasText: 'Vorschaubild' })
    });
    await expect(previewField.locator('.value')).toContainText('https://example.com/preview.png');
    await previewField.hover();

    const contactField = page.locator('section#basedata .display-field', {
      has: page.locator('strong', { hasText: 'Kontaktangaben' })
    });
    await expect(contactField.locator('.list-item-value').nth(0)).toContainText('Test Contact');
    await expect(contactField.locator('.list-item-value').nth(1)).toContainText(
      'Test Organisation'
    );
    await expect(contactField.locator('.list-item-value').nth(2)).toContainText('Test Phone');
    await expect(contactField.locator('.list-item-value').nth(3)).toContainText('test@example.com');
    await contactField.hover();
  });

  test('delete contact', async ({ page }) => {
    await page.goto('/metadata');

    await page
      .locator('.metadata-card', {
        has: page.getByText('Test Title')
      })
      .getByTitle('Bearbeiten')
      .click();

    const deleteButton = page
      .locator('.contacts-field fieldset.contact button[title="Löschen"]')
      .first();
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();

    const deleteConfirmButton = page.locator('.popconfirm button', { hasText: 'Löschen' });
    await expect(deleteConfirmButton).toBeVisible();
    await deleteConfirmButton.click();

    const contactFieldsets = page.locator('.contacts-field fieldset.contact');
    await expect(contactFieldsets).toHaveCount(0);
  });

  test('Cleanup: delete test dataset', async ({ page }) => {
    await page.goto('/metadata');

    await deleteMetadata(page, 'Test Title');
  });
});
