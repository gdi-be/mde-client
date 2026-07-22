// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  reporter: [['list'], ['html', { outputFolder: 'test-results/', open: 'never' }]],
  workers: 1,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'https://sensw-geoportal-berlin-mde.intranet.terrestris.de',
    headless: true,
    launchOptions: {
      slowMo: 200
    }
  },

  projects: [
    {
      name: 'setup',
      testMatch: /auth.setup\.ts/
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome']
      },
      dependencies: ['setup']
    }
    // {
    //   name: 'firefox',
    //   use: {
    //     ...devices['Desktop Firefox']
    //   },
    //   dependencies: ['setup']
    // },
    // {
    //   name: 'webkit',
    //   use: {
    //     ...devices['Desktop Safari']
    //   },
    //   dependencies: ['setup']
    // }
  ]
});
