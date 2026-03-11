import { test, expect } from "@playwright/test";

const baseURL = process.env.API_BASE_URL || "https://api.slackdesk.org";

test.describe("auth API", () => {
  test("POST /auth/login succeeds with valid credentials", async ({ request }) => {
    const res = await request.post(`${baseURL}/auth/login`, {
      data: {
        username: "tester",
        password: "password123"
      }
    });

    expect(res.status()).toBe(200);
    const body = await res.json();

    expect(body.ok).toBe(true);
    expect(body.token).toBeTruthy();
    expect(body.user).toBeTruthy();
    expect(body.user.username).toBe("tester");
  });

  test("POST /auth/login fails with invalid credentials", async ({ request }) => {
    const res = await request.post(`${baseURL}/auth/login`, {
      data: {
        username: "tester",
        password: "wrong-password"
      }
    });

    expect(res.status()).toBe(401);
    const body = await res.json();

    expect(body.ok).toBe(false);
    expect(body.error).toBe("invalid_credentials");
  });
});