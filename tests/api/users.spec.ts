import { test, expect } from "@playwright/test";

const baseURL = process.env.API_BASE_URL || "https://api.slackdesk.org";

test.describe("users API", () => {
  test("GET /users returns user list", async ({ request }) => {
    const res = await request.get(`${baseURL}/users`);
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);

    const first = body[0];
    expect(first).toHaveProperty("id");
    expect(first).toHaveProperty("name");
    expect(first).toHaveProperty("role");
  });

  test("GET /users/:id returns a user", async ({ request }) => {
    const res = await request.get(`${baseURL}/users/1`);
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.id).toBe(1);
    expect(body.name).toBeTruthy();
  });

  test("GET /users/:id returns 404 for missing user", async ({ request }) => {
    const res = await request.get(`${baseURL}/users/99999`);
    expect(res.status()).toBe(404);

    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error).toBe("user_not_found");
  });
});