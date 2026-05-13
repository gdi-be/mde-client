import { expect, type Page, type Locator } from '@playwright/test';

export type FormFieldTestOptions = {
  label?: string;
  value?: string | number;
  selectOptionText?: string;
  radioOptionLabel?: string;
  checkForHelp?: boolean;
  checkForCopy?: boolean;
  checkForExplanation?: boolean;
  maxLength?: number;
  required?: boolean;
  fieldSelector?: string;
  progressBar?: {
    element?: Locator;
    expectedIncrease?: number;
    expectedDecrease?: number;
    expectedValue?: number;
  };
};

async function getProgress(
  progressBar: FormFieldTestOptions['progressBar']
): Promise<number | undefined> {
  if (progressBar && progressBar.element) {
    await expect(progressBar.element).toBeVisible();
    const transform = await progressBar.element.getAttribute('style');
    const scaleMatch = transform?.match(/scaleX\(([\d.]+)\)/);
    if (scaleMatch) {
      return parseFloat(scaleMatch[1]);
    }
  }
}

export async function testFormField(
  page: Page,
  fieldClassOrSelector: string,
  options: FormFieldTestOptions = {}
) {
  const {
    label,
    value,
    selectOptionText,
    radioOptionLabel,
    checkForHelp = false,
    checkForCopy = false,
    checkForExplanation = false,
    maxLength,
    required = false,
    fieldSelector,
    progressBar
  } = options;

  const selector = fieldSelector || fieldClassOrSelector;
  const field = page.locator(selector);
  await expect(field).toBeVisible();

  if (label) {
    const labelElement = field.locator(`legend:has-text("${label}")`);
    await expect(labelElement).toBeVisible();
    await labelElement.hover();
  }

  if (checkForHelp) {
    const helpButton = field.locator('button[title="Hilfe zum Feld anzeigen"]');
    await expect(helpButton).toBeVisible();
    await helpButton.hover();
  }

  if (checkForCopy) {
    const copyButton = field.locator(
      'button[title="Wert in Zwischenablage kopieren"], .copy-button'
    );
    await expect(copyButton).toBeVisible();
    await copyButton.hover();
  }

  if (checkForExplanation) {
    const explanation = field.locator('.explanation-text');
    const isVisible = await explanation.isVisible().catch(() => false);
    if (isVisible) {
      await expect(explanation).toBeVisible();
      await explanation.hover();
    }
  }

  let initialProgress = undefined;
  if (value !== undefined) {
    let input: Locator;

    const textInput = field.locator('input[type="text"]');
    const textAreaInput = field.locator('textarea');
    const numberInput = field.locator('input[type="number"]');
    const dateInput = field.locator('input[type="date"]');
    const selectInput = field.locator('select');

    if (await textInput.isVisible().catch(() => false)) {
      input = textInput;
      await input.clear();

      if (required) {
        const requiredIndicator = field.locator('.invalid');
        await expect(requiredIndicator).toBeVisible();
      }

      initialProgress = await getProgress(progressBar);

      await input.fill(String(value));
      await expect(input).toHaveValue(String(value));

      if (maxLength) {
        const counter = field.locator('.character-counter');
        await expect(counter).toContainText(`${String(value).length} / ${maxLength}`);
      }
    } else if (await textAreaInput.isVisible().catch(() => false)) {
      input = textAreaInput;
      await input.clear();

      if (required) {
        const requiredIndicator = field.locator('.invalid');
        await expect(requiredIndicator).toBeVisible();
      }

      initialProgress = await getProgress(progressBar);

      await input.fill(String(value));
      await expect(input).toHaveValue(String(value));

      await input.evaluate((element) => (element as HTMLElement).blur());

      if (maxLength) {
        const counter = field.locator('.character-counter');
        await expect(counter).toContainText(`${String(value).length} / ${maxLength}`);
      }
    } else if (await numberInput.isVisible().catch(() => false)) {
      input = numberInput;
      await input.clear();

      if (required) {
        const requiredIndicator = field.locator('.invalid');
        await expect(requiredIndicator).toBeVisible();
      }

      initialProgress = await getProgress(progressBar);

      await input.fill(String(value));
      await expect(input).toHaveValue(String(value));
      await input.evaluate((element) => (element as HTMLElement).blur());
    } else if (await dateInput.isVisible().catch(() => false)) {
      input = dateInput;
      await input.clear();

      if (required) {
        const requiredIndicator = field.locator('.invalid');
        await expect(requiredIndicator).toBeVisible();
      }

      initialProgress = await getProgress(progressBar);

      await input.fill(String(value));
      await expect(input).toHaveValue(String(value));
      await input.evaluate((element) => (element as HTMLElement).blur());
    } else if (await selectInput.isVisible().catch(() => false)) {
      input = selectInput;

      await input.selectOption(String(value));
      await expect(input).toHaveValue(String(value));
    }
  }

  if (selectOptionText) {
    const autocompleteInput = field.locator('input.mdc-text-field__input');
    const selectField = field.locator('.mdc-select');

    if (await autocompleteInput.isVisible().catch(() => false)) {
      await autocompleteInput.clear();
      await autocompleteInput.fill(selectOptionText);

      await page.waitForTimeout(400);

      const menuList = page
        .locator('ul.mdc-deprecated-list, ul.mdc-list')
        .filter({ hasText: selectOptionText })
        .first();
      await expect(menuList).toBeVisible();
      const menuItem = menuList.locator('li').filter({ hasText: selectOptionText }).first();
      await expect(menuItem).toBeVisible();
      await menuItem.click();
      await page.getByRole('heading').click(); // Click outside to close the dropdown

      const chip = field.locator(`.mdc-chip__text:has-text("${selectOptionText}")`);
      await expect(chip).toBeVisible();
    } else if (await selectField.isVisible().catch(() => false)) {
      await selectField.click();
      await page.waitForTimeout(300); // Wait for dropdown to open
      const menuList = page
        .locator('ul.mdc-deprecated-list, ul.mdc-list')
        .filter({ hasText: selectOptionText });
      await expect(menuList).toBeVisible();
      await menuList.locator('li').filter({ hasText: selectOptionText }).first().click();
    }
  }

  if (radioOptionLabel) {
    const radioOption = field.locator('.mdc-form-field').filter({ hasText: radioOptionLabel });
    const input = radioOption.locator('input[type="radio"]');
    await expect(input).toBeVisible();
    await input.click();
    await expect(input).toBeChecked();
  }

  if (progressBar && (value !== undefined || selectOptionText !== undefined)) {
    const finalProgress = await getProgress(progressBar);
    if (finalProgress === undefined) {
      throw new Error('Could not determine progress bar value');
    }
    if (initialProgress === undefined) {
      throw new Error('Could not determine initial progress bar value');
    }
    const progressChange = finalProgress - initialProgress;

    if (progressBar.expectedIncrease !== undefined) {
      expect(progressChange).toBeCloseTo(progressBar.expectedIncrease, 2);
    }
    if (progressBar.expectedDecrease !== undefined) {
      expect(progressChange).toBeCloseTo(-progressBar.expectedDecrease, 2);
    }
    if (progressBar.expectedValue !== undefined) {
      expect(finalProgress).toBeCloseTo(progressBar.expectedValue, 2);
    }
  }
}

export async function login(page: Page, filePath: string, username: string, password: string) {
  await page.goto('/');

  await page.getByRole('link', { name: 'Anmelden' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill(username);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.getByRole('button', { name: 'Sign In' }).click();

  // Save signed-in state
  await page.context().storageState({
    path: filePath
  });

  await page.waitForSelector('.welcome');
}

export async function createMetadata(page: Page, title: string) {
  await page.getByText('Neuerfassung').click();

  await expect(page.locator('.create-metadata')).toBeVisible();
  await page.locator('.create-metadata').hover();

  await page.getByRole('textbox', { name: 'Titel*' }).fill(title);
  await page.getByRole('button', { name: 'Metadaten anlegen' }).click();
  await expect(page.getByRole('heading', { name: title })).toBeVisible();

  await page.getByRole('link', { name: 'Metadaten' }).click();

  await expect(
    page.locator('.metadata-card', {
      has: page.getByText(title)
    })
  ).toBeVisible();
}

export async function deleteMetadata(page: Page, title: string) {
  await page
    .locator('.metadata-card', {
      has: page.getByText(title)
    })
    .getByRole('button', {
      name: 'Metadatensatz Löschen'
    })
    .click();

  await page.getByRole('button', { name: 'Ok' }).click();

  await expect(
    page.locator('.metadata-card', {
      has: page.getByText(title)
    })
  ).not.toBeVisible();
}
