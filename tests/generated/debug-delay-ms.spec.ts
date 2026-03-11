import { test, expect } from "@playwright/test";

const baseURL = process.env.API_BASE_URL || 'https://api.slackdesk.org';

test.describe("/debug/delay/{ms}", () => {
  test("Simulate delayed response", async ({ request }) => {
    const res = await request.get(`${baseURL}/debug/delay/1`);
    expect(res.status()).toBeLessThan(600);
  });

});
