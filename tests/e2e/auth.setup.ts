import { test as setup } from '@playwright/test';
import { login } from './helpers';

const editorFile = 'tests/e2e/.auth/editor.json';
const adminFile = 'tests/e2e/.auth/admin.json';
const dhsFile = 'tests/e2e/.auth/data-owner.json';
const qualityFile = 'tests/e2e/.auth/quality.json';
const userFile = 'tests/e2e/.auth/user.json';

setup('authenticate as editor', async ({ page }) => {
  await login(page, editorFile, 'editor', 'editor');
});

setup('authenticate as admin', async ({ page }) => {
  await login(page, adminFile, 'admin', 'admin');
});

setup('authenticate as dhs', async ({ page }) => {
  await login(page, dhsFile, 'dhs', 'dhs');
});

setup('authenticate as quality', async ({ page }) => {
  await login(page, qualityFile, 'quality', 'quality');
});

setup('authenticate as user', async ({ page }) => {
  await login(page, userFile, 'mde', 'mde');
});
