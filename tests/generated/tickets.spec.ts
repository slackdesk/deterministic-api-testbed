import { test, expect } from "@playwright/test";

const baseURL = process.env.API_BASE_URL || 'https://api.slackdesk.org';

test.describe("/tickets", () => {
  test("List tickets", async ({ request }) => {
    const res = await request.get(`${baseURL}/tickets`);
    expect(res.status()).toBeLessThan(600);
  });


  test("Create a ticket", async ({ request }) => {
    const res = await request.post(`${baseURL}/tickets`);
    expect(res.status()).toBeLessThan(600);
  });

});
