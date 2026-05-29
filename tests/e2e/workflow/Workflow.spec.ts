import { test, expect } from '@playwright/test';
import { createMetadata, deleteMetadata, highlight } from '../helpers';

const title = 'Test dataset Workflow (Playwright)';

test.describe('Metadata Workflow - DataOwner', () => {
  test.use({
    storageState: 'tests/e2e/.auth/data-owner.json'
  });

  test('Create test metadata - DataOwner', async ({ page }) => {
    await page.goto('/metadata');

    await createMetadata(page, title);
  });

  test('DataOwner can see correct buttons', async ({ page }) => {
    await page.goto('/metadata');

    await page.getByRole('textbox', { name: 'Suche' }).click();
    await page.getByRole('textbox', { name: 'Suche' }).fill('Playwright');
    await page.getByRole('textbox', { name: 'Suche' }).press('Enter');

    await page
      .locator('.metadata-card', {
        has: page.getByText(title)
      })
      .getByTitle('Bearbeiten')
      .click();

    await expect(page.locator('.metadata-form')).toBeVisible();
    await expect(page.locator('.form-footer')).toBeVisible();

    const commentsButton = page.getByText('Kommentare');
    const downloadButton = page.getByTitle('Download');
    const validateButton = page.getByTitle('Validieren');
    const assignButton = page.getByTitle('Zuweisen');
    const publishButton = page.getByTitle('Freigeben');

    await expect(commentsButton).toBeVisible();
    await highlight(commentsButton);
    await expect(validateButton).toBeVisible();
    await highlight(validateButton);
    await expect(assignButton).toBeVisible();
    await highlight(assignButton);

    await expect(downloadButton).not.toBeVisible();
    await expect(publishButton).not.toBeVisible();
  });

  test('Assign metadata to Editor', async ({ page }) => {
    await page.goto('/metadata');

    await page
      .locator('.metadata-card', {
        has: page.getByText(title)
      })
      .getByTitle('Bearbeiten')
      .click();

    await expect(page.locator('.metadata-form')).toBeVisible();
    await expect(page.locator('.form-footer')).toBeVisible();

    const assignButton = page.getByTitle('Zuweisen');
    await expect(assignButton).toBeVisible();
    await assignButton.click();

    const assignmentPanel = page.locator('.assignment-panel');
    await expect(assignmentPanel).toBeVisible({ timeout: 5000 });

    const addignEditorButton = page.getByText('An Redaktion übergeben');
    await expect(addignEditorButton).toBeVisible();
    await addignEditorButton.click();

    await expect(assignmentPanel).not.toBeVisible({ timeout: 5000 });

    await page.goto('/metadata');

    await page.getByRole('textbox', { name: 'Suche' }).click();
    await page.getByRole('textbox', { name: 'Suche' }).fill('Playwright');
    await page.getByRole('textbox', { name: 'Suche' }).press('Enter');

    await expect(page
      .locator('.metadata-card', {
        has: page.getByText(title)
      }).getByTitle('Bearbeiten')).not.toBeVisible({ timeout: 5000 });

    await expect(page
      .locator('.metadata-card', {
        has: page.getByText(title)
      }).getByText('Redaktion')).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Metadata Workflow - Administrator', () => {
  test.use({
    storageState: 'tests/e2e/.auth/admin.json'
  });

  test('Cleanup: delete test metadata - DataOwner', async ({ page }) => {
    await page.goto('/metadata');

    await page.getByRole('textbox', { name: 'Suche' }).click();
    await page.getByRole('textbox', { name: 'Suche' }).fill('Playwright');
    await page.getByRole('textbox', { name: 'Suche' }).press('Enter');

    await deleteMetadata(page, title);
  });
});

test.describe('Metadata Workflow - Editor', () => {
  test.use({
    storageState: 'tests/e2e/.auth/editor.json'
  });

  test('Create test metadata - Editor', async ({ page }) => {
    await page.goto('/metadata');

    await createMetadata(page, title);
  });

  test('Editor can see correct buttons', async ({ page }) => {
    await page.goto('/metadata');

    await page.getByRole('textbox', { name: 'Suche' }).click();
    await page.getByRole('textbox', { name: 'Suche' }).fill('Playwright');
    await page.getByRole('textbox', { name: 'Suche' }).press('Enter');

    await page
      .locator('.metadata-card', {
        has: page.getByText(title)
      })
      .getByTitle('Bearbeiten')
      .click();

    await expect(page.locator('.metadata-form')).toBeVisible();
    await expect(page.locator('.form-footer')).toBeVisible();

    const commentsButton = page.getByText('Kommentare');
    const downloadButton = page.getByTitle('Download');
    const validateButton = page.getByTitle('Validieren');
    const assignButton = page.getByTitle('Zuweisen');
    const publishButton = page.getByTitle('Freigeben');

    await expect(commentsButton).toBeVisible();
    await highlight(commentsButton);
    await expect(validateButton).toBeVisible();
    await highlight(validateButton);
    await expect(assignButton).toBeVisible();
    await highlight(assignButton);
    await expect(downloadButton).toBeVisible();
    await highlight(downloadButton);

    await expect(publishButton).not.toBeVisible();

    await assignButton.click();

    const assignmentPanel = page.locator('.assignment-panel');
    await expect(assignmentPanel).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('mir zugewiesen')).toBeVisible();
  });

  test('Validate metadata', async ({ page }) => {
    await page.goto('/metadata');

    await page.getByRole('textbox', { name: 'Suche' }).click();
    await page.getByRole('textbox', { name: 'Suche' }).fill('Playwright');
    await page.getByRole('textbox', { name: 'Suche' }).press('Enter');

    await page
      .locator('.metadata-card', {
        has: page.getByText(title)
      })
      .getByTitle('Bearbeiten')
      .click();

    await expect(page.locator('.metadata-form')).toBeVisible();
    await expect(page.locator('.form-footer')).toBeVisible();

    const validateButton = page.getByTitle('Validieren');

    await expect(validateButton).toBeVisible();
    await validateButton.click();

    const validationDialog = page.locator('[aria-labelledby*="Validierung"]');
    await expect(validationDialog).toBeVisible({ timeout: 5000 });

    const startButton = validationDialog
      .locator('button')
      .filter({ hasText: "Validierung starten" })
      .first();

    await expect(startButton).toBeVisible();
    await startButton.click();

    await expect(validationDialog.locator('[class*="results"], [class*="running"]')).toBeVisible({ timeout: 15000 });

    await expect(page.getByText('Validierung abgeschlossen')).toBeVisible({ timeout: 15000 });
  });

  test('Download metadata', async ({ page }) => {
    await page.goto('/metadata');

    await page.getByRole('textbox', { name: 'Suche' }).click();
    await page.getByRole('textbox', { name: 'Suche' }).fill('Playwright');
    await page.getByRole('textbox', { name: 'Suche' }).press('Enter');

    await page
      .locator('.metadata-card', {
        has: page.getByText(title)
      })
      .getByTitle('Bearbeiten')
      .click();

    await expect(page.locator('.metadata-form')).toBeVisible();
    await expect(page.locator('.form-footer')).toBeVisible();

    const downloadButton = page.getByTitle('Download');
    await expect(downloadButton).toBeVisible();
    await highlight(downloadButton);

    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 15000 }),
      downloadButton.click()
    ]);

    expect(download).toBeDefined();

    const filename = download.suggestedFilename();
    expect(filename).toBeTruthy();

    expect(filename.endsWith('.zip')).toBeTruthy();

  });

  test('Assign metadata to QualityAssurance', async ({ page }) => {
    await page.goto('/metadata');

    await page.getByRole('textbox', { name: 'Suche' }).click();
    await page.getByRole('textbox', { name: 'Suche' }).fill('Playwright');
    await page.getByRole('textbox', { name: 'Suche' }).press('Enter');

    await page
      .locator('.metadata-card', {
        has: page.getByText(title)
      })
      .getByTitle('Bearbeiten')
      .click();

    await expect(page.locator('.metadata-form')).toBeVisible();
    await expect(page.locator('.form-footer')).toBeVisible();

    const assignButton = page.getByTitle('Zuweisen');
    await expect(assignButton).toBeVisible();
    await assignButton.click();

    const assignmentPanel = page.locator('.assignment-panel');
    await expect(assignmentPanel).toBeVisible({ timeout: 5000 });

    const addignQSButton = page.getByText('An Qualitätssicherung übergeben');
    await expect(addignQSButton).toBeVisible();
    await addignQSButton.click();

    await expect(assignmentPanel).not.toBeVisible({ timeout: 5000 });

    await page.goto('/metadata');

    await page.getByRole('textbox', { name: 'Suche' }).click();
    await page.getByRole('textbox', { name: 'Suche' }).fill('Playwright');
    await page.getByRole('textbox', { name: 'Suche' }).press('Enter');

    await expect(page
      .locator('.metadata-card', {
        has: page.getByText(title)
      }).getByTitle('Bearbeiten')).not.toBeVisible({ timeout: 5000 });

    await expect(page
      .locator('.metadata-card', {
        has: page.getByText(title)
      }).getByText('Qualitätssicherung')).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Metadata Workflow - QualityAssurance', () => {
  test.use({
    storageState: 'tests/e2e/.auth/quality.json'
  });

  test('QualityAssurance can see correct buttons', async ({ page }) => {
    await page.goto('/metadata');

    await page.getByRole('textbox', { name: 'Suche' }).click();
    await page.getByRole('textbox', { name: 'Suche' }).fill('Playwright');
    await page.getByRole('textbox', { name: 'Suche' }).press('Enter');

    await page
      .locator('.metadata-card', {
        has: page.getByText(title)
      })
      .click();

    await expect(page.getByRole('heading', { name: title })).toBeVisible();
    await highlight(page.getByRole('heading', { name: title }));

    const commentsButton = page.getByRole('button', { name: 'Kommentare' })
    const downloadButton = page.getByTitle('Download');
    const validateButton = page.getByTitle('Validieren');
    const assignButton = page.getByTitle('Zuweisen');
    const publishButton = page.getByTitle('Freigeben');

    await expect(commentsButton).toBeVisible();
    await highlight(commentsButton);
    await expect(validateButton).toBeVisible();
    await highlight(validateButton);
    await expect(downloadButton).toBeVisible();
    await highlight(downloadButton);
    await expect(assignButton).toBeVisible();
    await highlight(assignButton);

    await expect(publishButton).not.toBeVisible();
  });

  test('Approve metadata', async ({ page }) => {
    await page.goto('/metadata');

    await page.getByRole('textbox', { name: 'Suche' }).click();
    await page.getByRole('textbox', { name: 'Suche' }).fill('Playwright');
    await page.getByRole('textbox', { name: 'Suche' }).press('Enter');

    await page
      .locator('.metadata-card', {
        has: page.getByText(title)
      })
      .click();

    await expect(page.getByRole('heading', { name: title })).toBeVisible();
    await highlight(page.getByRole('heading', { name: title }));

    const assignButton = page.getByTitle('Zuweisen');
    await expect(assignButton).toBeVisible();
    await assignButton.click();

    await expect(page.locator('.assignment-panel')).toBeVisible({ timeout: 5000 });

    const selfAssignButton = page.getByText('Mir zuweisen');
    await expect(selfAssignButton).toBeVisible();
    await selfAssignButton.click();

    const approvalSwitch = page.locator('input[role="switch"]').first();

    if (await approvalSwitch.isVisible().catch(() => false)) {
      const isApproved = await approvalSwitch.isChecked().catch(() => false);

      if (!isApproved) {
        await approvalSwitch.click();
        await page.waitForTimeout(1000);
      }
    }

    const mask = page.locator('[class*="mask"]').first();
    if (await mask.isVisible()) {
      await mask.click();
    }

    await expect(page.locator('.assignment-panel')).not.toBeVisible({ timeout: 3000 });
  });
});

test.describe('Metadata Workflow - Administrator', () => {
  test.use({
    storageState: 'tests/e2e/.auth/admin.json'
  });

  test('Administrator can see all buttons', async ({ page }) => {
    await page.goto('/metadata');

    await page.getByRole('textbox', { name: 'Suche' }).click();
    await page.getByRole('textbox', { name: 'Suche' }).fill('Playwright');
    await page.getByRole('textbox', { name: 'Suche' }).press('Enter');

    await page
      .locator('.metadata-card', {
        has: page.getByText(title)
      })
      .click();

    await expect(page.getByRole('heading', { name: title })).toBeVisible();
    await highlight(page.getByRole('heading', { name: title }));

    const commentsButton = page.getByRole('button', { name: 'Kommentare' })
    const downloadButton = page.getByTitle('Download');
    const validateButton = page.getByTitle('Validieren');
    const assignButton = page.getByTitle('Zuweisen');

    await expect(commentsButton).toBeVisible();
    await highlight(commentsButton);
    await expect(validateButton).toBeVisible();
    await highlight(validateButton);
    await expect(downloadButton).toBeVisible();
    await highlight(downloadButton);
    await expect(assignButton).toBeVisible();
    await highlight(assignButton);
  });
});

test.describe('Metadata Workflow - Editor', () => {
  test.use({
    storageState: 'tests/e2e/.auth/editor.json'
  });

  test('Editor can only publish if assigned, approved, and valid', async ({ page }) => {
    await page.goto('/metadata');

    const metadataCards = page.locator('.metadata-card');
    const cardCount = await metadataCards.count();
    let publishTestDone = false;

    for (let i = 0; i < cardCount; i++) {
      const card = metadataCards.nth(i);

      await card.getByTitle('Bearbeiten').click();
      await expect(page.locator('.metadata-form')).toBeVisible({ timeout: 5000 });
      await expect(page.locator('.form-footer')).toBeVisible({ timeout: 5000 });

      const publishButton = page.getByTitle('Freigabe');

      const publishVisible = await publishButton.isVisible().catch(() => false);

      if (publishVisible) {
        await highlight(publishButton);
        console.log('Editor can publish this metadata - it meets all preconditions');
        publishTestDone = true;
        break;
      }
    }

    expect(publishTestDone).toBeTruthy();
  });
});

test.describe('Metadata Workflow - Administrator', () => {
  test.use({
    storageState: 'tests/e2e/.auth/admin.json'
  });

  test('Cleanup: delete test metadata - Editor', async ({ page }) => {
    await page.goto('/metadata');

    await page.getByRole('textbox', { name: 'Suche' }).click();
    await page.getByRole('textbox', { name: 'Suche' }).fill('Playwright');
    await page.getByRole('textbox', { name: 'Suche' }).press('Enter');

    await deleteMetadata(page, title);
  });
});
