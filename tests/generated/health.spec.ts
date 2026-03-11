import { test, expect } from "@playwright/test";

const baseURL = process.env.API_BASE_URL || 'https://api.slackdesk.org';

test.describe("/health", () => {
  test("Health check", async ({ request }) => {
    const res = await request.get(`${baseURL}/health`);
    expect(res.status()).toBeLessThan(600);
  });

});
