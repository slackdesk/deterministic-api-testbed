import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  use: {
    baseURL: 'http://127.0.0.1:3001'
  },
  webServer: {
    command: 'npm run serve',
    url: 'http://127.0.0.1:3001/health',
    reuseExistingServer: true,
    timeout: 60_000
  }
});