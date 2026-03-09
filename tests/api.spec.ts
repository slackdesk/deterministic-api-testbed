import { test, expect } from "@playwright/test";

const token = "demo-token";

test.describe("deterministic api testbed", () => {
  test("health endpoint returns healthy", async ({ request }) => {
    const res = await request.get(`/health`);
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.status).toBe("healthy");
  });

  test("login succeeds with demo credentials", async ({ request }) => {
    const res = await request.post(`/auth/login`, {
      data: {
        email: "demo@slackdesk.org",
        password: "Password123!"
      }
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.token).toBe(token);
  });

  test("users endpoint requires auth", async ({ request }) => {
    const res = await request.get(`/users`);
    expect(res.status()).toBe(401);
  });

  test("users endpoint returns list with auth", async ({ request }) => {
    const res = await request.get(`/users`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.count).toBeGreaterThan(0);
    expect(Array.isArray(body.data)).toBe(true);
  });

  test("create ticket validates required fields", async ({ request }) => {
    const res = await request.post(`/tickets`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: {
        title: ""
      }
    });

    expect(res.status()).toBe(422);
  });

  test("create ticket succeeds", async ({ request }) => {
    const res = await request.post(`/tickets`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: {
        title: "API regression example",
        description: "Verify deterministic ticket creation.",
        priority: "high",
        ownerId: "u_001"
      }
    });

    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.data.title).toBe("API regression example");
  });

  test("search returns matched records", async ({ request }) => {
    const res = await request.get(`/search?q=homepage`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(Array.isArray(body.tickets)).toBe(true);
  });

  test("rate limit simulation works", async ({ request }) => {
    const res = await request.get(`/health?rateLimit=true`);
    expect(res.status()).toBe(429);
  });
});