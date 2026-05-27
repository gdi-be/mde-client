import { test, expect, type Page } from '@playwright/test';
import { createMetadata, deleteMetadata, highlight, testFormField } from '../helpers';

test.use({
  storageState: 'tests/e2e/.auth/editor.json'
});

test.describe('Metadata form - Services section', () => {
  const title = `Test dataset Services (Playwright)`;

  const openServicesTabForEditing = async (page: Page) => {
    await page.goto('/metadata');

    await page
      .locator('.metadata-card', {
        has: page.getByText(title)
      })
      .getByTitle('Bearbeiten')
      .click();

    await page.getByRole('button', { name: '5. Dienste' }).click();
    await expect(page.locator('section#services')).toBeVisible();
  };

  const fillCommonServiceFields = async (
    page: Page,
    opts: {
      serviceType: 'ATOM' | 'WMS' | 'WFS';
      serviceTitle: string;
      serviceDescription: string;
      serviceId: string;
      previewUrl: string;
    }
  ) => {
    const progressBar = page
      .locator('.tab-container', {
        has: page.getByText('5. Dienste')
      })
      .locator('.mdc-linear-progress__bar.mdc-linear-progress__primary-bar');

    const addServiceButton = page.getByTitle('Dienst hinzufügen');
    await expect(addServiceButton).toBeVisible();
    await addServiceButton.click();

    await testFormField(page, '.service-type-field', {
      label: 'Typ',
      selectOptionText: opts.serviceType,
      checkForHelp: false,
      checkForCopy: true
    });

    await testFormField(page, '.service-title-field', {
      label: 'Titel',
      value: opts.serviceTitle,
      checkForHelp: true,
      checkForCopy: true,
      progressBar: {
        element: progressBar
      }
    });

    await testFormField(page, '.service-description-field', {
      label: 'Kurzbeschreibung des Dienstes',
      value: opts.serviceDescription,
      checkForHelp: true,
      checkForCopy: true,
      progressBar: {
        element: progressBar
      }
    });

    await testFormField(page, '.service-id-field', {
      label: 'Dienst-ID',
      value: opts.serviceId,
      checkForHelp: true,
      checkForCopy: true
    });

    await testFormField(page, '.service-preview-field', {
      label: 'Vorschau des Dienstes',
      value: opts.previewUrl,
      checkForHelp: true,
      checkForCopy: true
    });

    await page.getByRole('heading').click();
  };

  test('create test dataset', async ({ page }) => {
    await page.goto('/metadata');

    await createMetadata(page, title);
  });

  test('fill atom service tab', async ({ page }) => {
    await openServicesTabForEditing(page);

    await fillCommonServiceFields(page, {
      serviceType: 'ATOM',
      serviceTitle: 'Test ATOM Service Title',
      serviceDescription: 'Test ATOM Service Description',
      serviceId: 'TestATOMIdentifier',
      previewUrl: 'https://example.com/atom-preview.png'
    });

    const progressBar = page
      .locator('.tab-container', {
        has: page.getByText('5. Dienste')
      })
      .locator('.mdc-linear-progress__bar.mdc-linear-progress__primary-bar');

    await expect(progressBar).toHaveAttribute('style', /transform: scaleX\(1\)/);
    await highlight(page
      .locator('.tab-container', {
        has: page.getByText('5. Dienste')
      }));
    await progressBar.hover();
  });

  test('fill wms service tab', async ({ page }) => {
    await openServicesTabForEditing(page);

    await fillCommonServiceFields(page, {
      serviceType: 'WMS',
      serviceTitle: 'Test WMS Service Title',
      serviceDescription: 'Test WMS Service Description',
      serviceId: 'TestWMSIdentifier',
      previewUrl: 'https://example.com/wms-preview.png'
    });

    const legendUrlInput = page.locator('.legend-fieldset .legend-text-fields .field-wrapper').first().locator('input');
    await legendUrlInput.fill('https://example.com/wms-legend.png');
    await legendUrlInput.evaluate((el) => (el as HTMLElement).blur());

    const legendFormatInput = page.locator('.legend-fieldset .legend-text-fields .field-wrapper').nth(1).locator('input');
    await legendFormatInput.fill('image/png');
    await legendFormatInput.evaluate((el) => (el as HTMLElement).blur());

    const legendWidthInput = page.locator('.legend-fieldset .legend-size-fields .field-wrapper').first().locator('input');
    await legendWidthInput.fill('200');
    await legendWidthInput.evaluate((el) => (el as HTMLElement).blur());

    const legendHeightInput = page.locator('.legend-fieldset .legend-size-fields .field-wrapper').nth(1).locator('input');
    await legendHeightInput.fill('200');
    await legendHeightInput.evaluate((el) => (el as HTMLElement).blur());

    await expect(page.locator('.layers-form')).toBeVisible({ timeout: 10000 });

    const addLayerButton = page.getByTitle('Layer hinzufügen');
    await expect(addLayerButton).toBeVisible();
    for (let attempt = 0; attempt < 3; attempt++) {
      await addLayerButton.click();
      const tabCount = await page.locator('.layers-form .tab-container .tab').count();
      if (tabCount > 0) {
        break;
      }
      await page.waitForTimeout(500);
    }

    const createdLayerTab = page.locator('.layers-form .tab-container .tab').first();
    await expect(createdLayerTab).toBeVisible({ timeout: 10000 });
    await createdLayerTab.click();

    await expect(page.locator('.layer-title-field')).toBeVisible({ timeout: 10000 });

    await testFormField(page, '.layer-title-field', {
      label: 'Titel der Kartenebene',
      value: 'Test WMS Layer Title',
      checkForHelp: true,
      checkForCopy: true
    });

    await testFormField(page, '.layer-name-field', {
      label: 'Name der Kartenebene',
      value: 'Test WMS Layer Name',
      checkForHelp: true,
      checkForCopy: true
    });

    await testFormField(page, '.layer-style-name-field', {
      label: 'Name des Styles',
      value: 'Test Style Name',
      checkForHelp: true,
      checkForCopy: true
    });

    await testFormField(page, '.layer-legend-image-field', {
      label: 'Legende',
      value: 'https://example.com/wms-legend.png',
      checkForHelp: true,
      checkForCopy: true
    });

    await testFormField(page, '.layers-form .layer-short-description-field:has(legend:has-text("Kurzbeschreibung"))', {
      label: 'Kurzbeschreibung',
      value: 'Test WMS Layer Description',
      checkForHelp: true,
      checkForCopy: true
    });

    await testFormField(page, '.layers-form .layer-short-description-field:has(legend:has-text("Ablageort der Daten"))', {
      label: 'Ablageort der Daten',
      value: 'https://example.com/wms/datasource',
      checkForHelp: true,
      checkForCopy: true
    });

    await testFormField(page, '.layers-form .layer-short-description-field:has(legend:has-text("Sekundäre Datenhaltung"))', {
      label: 'Sekundäre Datenhaltung',
      value: 'https://example.com/wms/secondary-datasource',
      checkForHelp: true,
      checkForCopy: true
    });

    const progressBar = page
      .locator('.tab-container', {
        has: page.getByText('5. Dienste')
      })
      .locator('.mdc-linear-progress__bar.mdc-linear-progress__primary-bar');

    await expect(progressBar).toHaveAttribute('style', /transform: scaleX\(1\)/);
    await highlight(page
      .locator('.tab-container', {
        has: page.getByText('5. Dienste')
      }));
    await progressBar.hover();
  });

  test('fill wfs service tab', async ({ page }) => {
    await openServicesTabForEditing(page);

    await fillCommonServiceFields(page, {
      serviceType: 'WFS',
      serviceTitle: 'Test WFS Service Title',
      serviceDescription: 'Test WFS Service Description',
      serviceId: 'TestWFSIdentifier',
      previewUrl: 'https://example.com/wfs-preview.png',
    });

    await expect(page.locator('.featuretypes-form')).toBeVisible({ timeout: 10000 });

    const addFeatureTypeButton = page.getByTitle('Featuretype hinzufügen');
    await expect(addFeatureTypeButton).toBeVisible();
    await addFeatureTypeButton.click();

    await testFormField(page, '.featuretype-title-field', {
      label: 'Titel des FeatureTypes',
      value: 'Test WFS FeatureType Title',
      checkForHelp: true,
      checkForCopy: true
    });

    await testFormField(page, '.featuretype-name-field', {
      label: 'Name des FeatureTypes',
      value: 'TestWFSFeatureTypeName',
      checkForHelp: true,
      checkForCopy: true
    });

    await testFormField(page, '.featuretype-short-description-field', {
      label: 'Kurzbeschreibung des FeatureTypes',
      value: 'Test WFS FeatureType Description',
      checkForHelp: true,
      checkForCopy: true
    });

    const addAttributeButton = page.getByTitle('Attribut hinzufügen');
    await expect(addAttributeButton).toBeVisible();
    await addAttributeButton.click();

    await testFormField(page, '.attribute-name-field', {
      label: 'Attribut-Name',
      value: 'Test Attribute Name',
      checkForHelp: true,
      checkForCopy: true
    });

    await testFormField(page, '.attribute-alias-field', {
      label: 'Attribut-Alias',
      value: 'Test Attribute Alias',
      checkForHelp: true,
      checkForCopy: true
    });

    await testFormField(page, '.attribute-type-field', {
      label: 'Attribut-Datentyp',
      selectOptionText: 'Text',
      checkForHelp: true,
      checkForCopy: true
    });

    const progressBar = page
      .locator('.tab-container', {
        has: page.getByText('5. Dienste')
      })
      .locator('.mdc-linear-progress__bar.mdc-linear-progress__primary-bar');

    await expect(progressBar).toHaveAttribute('style', /transform: scaleX\(1\)/);
    await highlight(page
      .locator('.tab-container', {
        has: page.getByText('5. Dienste')
      }));
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

    const servicesSection = page.locator('section#services');
    await expect(servicesSection).toBeVisible();

    const servicesField = page.locator('section#services .display-field', {
      has: page.locator('strong', { hasText: 'Dienste' })
    });
    await expect(servicesField).toBeVisible();
    await highlight(servicesField);
    await servicesField.hover();
    await expect(servicesField).toContainText('Anzahl: 3');

    await expect(servicesField).toContainText('Test ATOM Service Title');
    await expect(servicesField).toContainText('ATOM');
    await expect(servicesField).toContainText('Test ATOM Service Description');
    await expect(servicesField).toContainText('https://example.com/atom-preview.png');

    await expect(servicesField).toContainText('Test WMS Service Title');
    await expect(servicesField).toContainText('WMS');
    await expect(servicesField).toContainText('Test WMS Service Description');
    await expect(servicesField).toContainText('https://example.com/wms-preview.png');
    await expect(servicesField).toContainText('Kartenebenen (1)');
    await expect(servicesField).toContainText('Test WMS Layer Title');

    await expect(servicesField).toContainText('Test WFS Service Title');
    await expect(servicesField).toContainText('WFS');
    await expect(servicesField).toContainText('Test WFS Service Description');
    await expect(servicesField).toContainText('https://example.com/wfs-preview.png');
    await expect(servicesField).toContainText('FeatureTypes (1)');
    await expect(servicesField).toContainText('TestWFSFeatureTypeName');
    await highlight(servicesField);
    await servicesField.hover();
  });

  test('Cleanup: delete test dataset', async ({ page }) => {
    await page.goto('/metadata');

    await deleteMetadata(page, title);
  });
});
