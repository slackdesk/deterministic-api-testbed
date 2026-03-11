import { test, expect } from "@playwright/test";

const baseURL = process.env.API_BASE_URL || "https://api.slackdesk.org";

test.describe("tickets API", () => {
  test("GET /tickets returns tickets list", async ({ request }) => {
    const res = await request.get(`${baseURL}/tickets`);
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    expect(body[0]).toHaveProperty("id");
    expect(body[0]).toHaveProperty("title");
    expect(body[0]).toHaveProperty("status");
  });

  test("POST /tickets creates a ticket", async ({ request }) => {
    const res = await request.post(`${baseURL}/tickets`, {
      data: {
        title: "Generated regression ticket"
      }
    });

    expect(res.status()).toBe(201);

    const body = await res.json();
    expect(body.title).toBe("Generated regression ticket");
    expect(body.status).toBe("open");
    expect(body.id).toBeTruthy();
  });

  test("POST /tickets rejects missing title", async ({ request }) => {
    const res = await request.post(`${baseURL}/tickets`, {
      data: {}
    });

    expect(res.status()).toBe(422);

    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error).toBe("title_required");
  });
});