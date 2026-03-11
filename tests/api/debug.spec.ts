import { test, expect } from "@playwright/test";

const baseURL = process.env.API_BASE_URL || "https://api.slackdesk.org";

test.describe("debug API", () => {
  test("GET /debug/echo returns query params", async ({ request }) => {
    const res = await request.get(`${baseURL}/debug/echo?mode=test&suite=api`);
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.query.mode).toBe("test");
    expect(body.query.suite).toBe("api");
  });

  test("GET /debug/delay/:ms returns delayed response", async ({ request }) => {
    const start = Date.now();
    const res = await request.get(`${baseURL}/debug/delay/300`);
    const elapsed = Date.now() - start;

    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.delayed).toBe(300);
    expect(elapsed).toBeGreaterThanOrEqual(250);
  });

  test("GET /debug/error returns intentional error", async ({ request }) => {
    const res = await request.get(`${baseURL}/debug/error`);
    expect(res.status()).toBe(500);

    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error).toBe("intentional_error");
  });
});