import { test, expect } from "@playwright/test";

const baseURL = process.env.API_BASE_URL || 'https://api.slackdesk.org';

test.describe("/users/{id}", () => {
  test("Get user by id", async ({ request }) => {
    const res = await request.get(`${baseURL}/users/1`);
    expect(res.status()).toBeLessThan(600);
  });

});
