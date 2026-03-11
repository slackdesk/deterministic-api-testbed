import { test, expect } from "@playwright/test";

const baseURL = process.env.API_BASE_URL || 'https://api.slackdesk.org';

test.describe("/debug/error", () => {
  test("Intentional server error response", async ({ request }) => {
    const res = await request.get(`${baseURL}/debug/error`);
    expect(res.status()).toBeLessThan(600);
  });

});
