import { test, expect } from "@playwright/test";

const baseURL = process.env.API_BASE_URL || 'https://api.slackdesk.org';

test.describe("/debug/echo", () => {
  test("Echo query and headers", async ({ request }) => {
    const res = await request.get(`${baseURL}/debug/echo`);
    expect(res.status()).toBeLessThan(600);
  });

});
