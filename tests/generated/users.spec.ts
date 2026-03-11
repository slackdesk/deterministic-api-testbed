import { test, expect } from "@playwright/test";

const baseURL = process.env.API_BASE_URL || 'https://api.slackdesk.org';

test.describe("/users", () => {
  test("List users", async ({ request }) => {
    const res = await request.get(`${baseURL}/users`);
    expect(res.status()).toBeLessThan(600);
  });

});
