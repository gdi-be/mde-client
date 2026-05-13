import { test, expect } from '@playwright/test';
import { createMetadata, deleteMetadata, testFormField } from '../helpers';

test.use({
  storageState: 'tests/e2e/.auth/editor.json',
});

test.describe('Metadata form - Classification section', () => {
  const title = 'Test dataset Classification (Playwright)';
  test('Create test dataset', async ({ page }) => {
    await page.goto('/metadata');

    await createMetadata(page, title);
  });

  test('fill classification tab - ISO', async ({ page }) => {
    await page.goto('/metadata');

    await page
      .locator('.metadata-card', {
        has: page.getByText(title)
      })
      .getByTitle('Bearbeiten')
      .click();

    await page.getByRole('button', { name: '2. Einordnung' }).click();
    await expect(page.locator('section#classification')).toBeVisible();

    await testFormField(page, '.metadata-type-field', {
      label: 'Metadaten-Typ',
      selectOptionText: 'ISO',
      checkForHelp: true,
      checkForCopy: true,
    });

    await testFormField(page, '.data-protection-field', {
      label: 'Datenschutz-Einstellungen',
      radioOptionLabel: 'Schutz von persönlichen Daten bei natürlichen Personen',
      checkForHelp: true,
      checkForCopy: true,
    });

    await testFormField(page, '.terms-of-use-field', {
      label: 'Nutzungsbestimmungen',
      selectOptionText: 'Dienstgebrauch',
      required: true,
      checkForHelp: true,
      checkForCopy: true,
    });

    await expect(page.locator('.high-value-dataset-check-field')).toBeVisible();
    await page.getByRole('switch').click();
    await expect(page.getByRole('switch')).toBeChecked();
    await expect(page.getByText('HVD Kategorien')).toBeVisible();

    await testFormField(page, '.high-value-dataset-check-field', {
      label: 'HVD Kategorien',
      selectOptionText: 'Meteorologie',
      required: true,
      checkForHelp: true,
    });

    await testFormField(page, '.topic-category-field', {
      label: 'Themenkategorie',
      selectOptionText: 'Geowissenschaften',
      required: true,
      checkForHelp: true,
      checkForCopy: true,
    });

    await expect(page.locator('.annex-theme-field')).not.toBeVisible();
    await expect(page.locator('.inspire-annex-version-field')).not.toBeVisible();
    await expect(page.locator('.inspire-format-name-field')).not.toBeVisible();
    await expect(page.locator('.quality-report-check-field')).not.toBeVisible();
  });

  test('fill classification tab - INSPIRE_HARMONISED', async ({ page }) => {
    await page.goto('/metadata');

    await page
      .locator('.metadata-card', {
        has: page.getByText(title)
      })
      .getByTitle('Bearbeiten')
      .click();

    await page.getByRole('button', { name: '2. Einordnung' }).click();
    await expect(page.locator('section#classification')).toBeVisible();

    const metadataTypeField = page.locator('.metadata-type-field');
    const typeSelect = metadataTypeField.locator('.mdc-select');
    await typeSelect.click();
    await page.getByRole('option', { name: /INSPIRE harmonisiert/ }).click();
    await expect(page.locator('.annex-theme-field')).toBeVisible({ timeout: 10000 });

    await testFormField(page, '.annex-theme-field', {
      label: 'INSPIRE Annex Thema',
      selectOptionText: 'Boden',
      checkForHelp: true,
      checkForCopy: true,
    });

    await testFormField(page, '.inspire-format-name-field', {
      label: 'INSPIRE Schema Name',
      selectOptionText: 'Soil GML Application Schema',
      checkForHelp: true,
      checkForCopy: true,
    });

    await testFormField(page, '.inspire-annex-version-field', {
      label: 'Schema-Version des INSPIRE Themas',
      value: '2.0',
      checkForHelp: true,
      checkForCopy: true,
    });

    await expect(page.locator('.quality-report-check-field')).toBeVisible();
    await expect(page.getByText('Überprüfung des Qualitätsberichts')).toBeVisible();
    const qualityReportCheck = page.getByRole('switch', { name: 'Überprüft' });
    await qualityReportCheck.click();
    await expect(qualityReportCheck).toBeChecked();
  });

  test('verify read-only', async ({ page }) => {
    await page.goto('/metadata');

    await page
      .locator('.metadata-card', {
        has: page.getByText(title)
      }).click();

    await expect(page.getByRole('heading', { name: title })).toBeVisible();
    await page.getByRole('heading', { name: title }).hover();

    const classificationSection = page.locator('section#classification');
    await expect(classificationSection).toBeVisible();

    const typeField = page.locator('section#classification .display-field', {
      has: page.locator('strong', { hasText: 'Metadaten-Typ' })
    });
    await expect(typeField.locator('.value')).toContainText('INSPIRE harmonisiert');
    await typeField.hover();

    const termsOfUseField = page.locator('section#classification .display-field', {
      has: page.locator('strong', { hasText: 'Nutzungsbestimmungen' })
    });
    await expect(termsOfUseField.locator('.value')).toContainText('Dienstgebrauch');
    await termsOfUseField.hover();

    const topicCategoryField = page.locator('section#classification .display-field', {
      has: page.locator('strong', { hasText: 'Themenkategorie' })
    });
    await expect(topicCategoryField.locator('.value')).toContainText('Geowissenschaften');
    await topicCategoryField.hover();

    const dataProtectionField = page.locator('section#classification .display-field', {
      has: page.locator('strong', { hasText: 'INSPIRE Annex Thema' })
    });
    await expect(dataProtectionField.locator('.value')).toContainText('Boden');
    await dataProtectionField.hover();

    const inspireFormatNameField = page.locator('section#classification .display-field', {
      has: page.locator('strong', { hasText: 'INSPIRE Schema Name' })
    });
    await expect(inspireFormatNameField.locator('.value')).toContainText('Soil GML Application Schema');
    await inspireFormatNameField.hover();

    const inspireAnnexVersionField = page.locator('section#classification .display-field', {
      has: page.locator('strong', { hasText: 'Schema-Version des INSPIRE Themas' })
    });
    await expect(inspireAnnexVersionField.locator('.value')).toContainText('2.0');
    await inspireAnnexVersionField.hover();

    const qualityReportCheckField = page.locator('section#classification .display-field', {
      has: page.locator('strong', { hasText: 'Überprüfung des Qualitätsberichts' })
    });
    await expect(qualityReportCheckField.locator('.value')).toContainText('Ja');
    await qualityReportCheckField.hover();

    const hvdField = page.locator('section#classification .display-field', {
      has: page.locator('strong', { hasText: 'HVD Kategorien' })
    });
    await expect(hvdField.locator('.value')).toContainText('Meteorologie');
    await hvdField.hover();
  });

  test('verify INSPIRE field visibility', async ({ page }) => {
    await page.goto('/metadata');

    await page
      .locator('.metadata-card', {
        has: page.getByText(title)
      })
      .getByTitle('Bearbeiten')
      .click();

    await page.getByRole('button', { name: '2. Einordnung' }).click();
    await expect(page.locator('section#classification')).toBeVisible();

    const metadataTypeField = page.locator('.metadata-type-field');
    const typeSelect = metadataTypeField.locator('.mdc-select');
    await typeSelect.click();
    await page.getByRole('option', { name: /ISO/ }).click();

    await expect(page.locator('.annex-theme-field')).not.toBeVisible();
    await expect(page.locator('.inspire-annex-version-field')).not.toBeVisible();
    await expect(page.locator('.inspire-format-name-field')).not.toBeVisible();
    await expect(page.locator('.quality-report-check-field')).not.toBeVisible();

    await typeSelect.click();
    await page.getByRole('option', { name: /INSPIRE harmonisiert/ }).click();

    await expect(page.locator('.annex-theme-field')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.inspire-annex-version-field')).toBeVisible();
    await expect(page.locator('.inspire-format-name-field')).toBeVisible();
    await expect(page.locator('.quality-report-check-field')).toBeVisible();

    await typeSelect.click();
    await page.getByRole('option', { name: /INSPIRE identifiziert/ }).click();

    await expect(page.locator('.annex-theme-field')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.inspire-annex-version-field')).not.toBeVisible();
    await expect(page.locator('.quality-report-check-field')).not.toBeVisible();

    await typeSelect.click();
    await page.getByRole('option', { name: /^ISO$/ }).click();

    await expect(page.locator('.annex-theme-field')).not.toBeVisible();
    await expect(page.locator('.inspire-annex-version-field')).not.toBeVisible();
    await expect(page.locator('.inspire-format-name-field')).not.toBeVisible();
    await expect(page.locator('.quality-report-check-field')).not.toBeVisible();
  });

  test('verify terms-of-use field options', async ({ page }) => {
    await page.goto('/metadata');

    await page
      .locator('.metadata-card', {
        has: page.getByText(title)
      })
      .getByTitle('Bearbeiten')
      .click();

    await page.getByRole('button', { name: '2. Einordnung' }).click();
    await expect(page.locator('section#classification')).toBeVisible();

    const termsOfUseField = page.locator('.terms-of-use-field');
    const select = termsOfUseField.locator('.mdc-select');
    await select.click();

    const options = ['Dienstgebrauch', 'Baufertigstellungen', 'Dienstgebrauch Aufgaben', 'Dienstgebrauch und PD'];
    for (const optionText of options) {
      const option = page.getByRole('option', { name: optionText, exact: true });
      await expect(option).toBeVisible();
      await option.hover();
    }
  });

  test('verify data-protection field options', async ({ page }) => {
    await page.goto('/metadata');

    await page
      .locator('.metadata-card', {
        has: page.getByText(title)
      })
      .getByTitle('Bearbeiten')
      .click();

    await page.getByRole('button', { name: '2. Einordnung' }).click();
    await expect(page.locator('section#classification')).toBeVisible();

    const options = [
      'Nicht Datenschutz relevant',
      "Schutz von Daten juristischer Personen und deren Interessen - Nutzungsbestimmung 'Nur für den Dienstgebrauch'",
      'Schutz von persönlichen Daten bei natürlichen Personen',
      'Schutz von Daten, die als Kritische Infrastruktur eingestuft werden'
    ];
    for (const optionText of options) {
      const option = page.getByText(optionText);
      await expect(option).toBeVisible();
      await option.hover();
    }
  });

  test('Cleanup: delete test dataset', async ({ page }) => {
    await page.goto('/metadata');
    await deleteMetadata(page, title);
  });
});
