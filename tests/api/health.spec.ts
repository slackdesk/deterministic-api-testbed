import { test, expect } from "@playwright/test";

const baseURL = process.env.API_BASE_URL || "https://api.slackdesk.org";

test.describe("health API", () => {
  test("GET /health returns healthy response", async ({ request }) => {
    const res = await request.get(`${baseURL}/health`);
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.service).toBe("deterministic-api-testbed");
    expect(body.status).toBe("healthy");
    expect(typeof body.timestamp).toBe("string");
  });
});