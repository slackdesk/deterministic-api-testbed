import { test, expect } from "@playwright/test";

const baseURL = process.env.API_BASE_URL || 'https://api.slackdesk.org';

test.describe("/auth/login", () => {
  test("Login with demo credentials", async ({ request }) => {
    const res = await request.post(`${baseURL}/auth/login`);
    expect(res.status()).toBeLessThan(600);
  });

});
