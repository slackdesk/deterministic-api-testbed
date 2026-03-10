import express from "express";

export function createApp() {
  const app = express();

  app.use(express.json());

  // simple request logger
  app.use((req, _res, next) => {
    const now = new Date().toISOString();
    console.log(`[${now}] ${req.method} ${req.url}`);
    next();
  });

  // -----------------------------
  // HEALTH
  // -----------------------------

  app.get("/health", (_req, res) => {
    res.status(200).json({
      ok: true,
      service: "deterministic-api-testbed",
      status: "healthy",
      timestamp: new Date().toISOString()
    });
  });

  // -----------------------------
  // USERS
  // -----------------------------

  const users = [
    { id: 1, name: "Alice", role: "admin" },
    { id: 2, name: "Bob", role: "user" },
    { id: 3, name: "Charlie", role: "tester" }
  ];

  app.get("/users", (_req, res) => {
    res.json(users);
  });

  app.get("/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const user = users.find(u => u.id === id);

    if (!user) {
      return res.status(404).json({
        ok: false,
        error: "user_not_found"
      });
    }

    res.json(user);
  });

  // -----------------------------
  // AUTH
  // -----------------------------

  app.post("/auth/login", (req, res) => {
    const { username, password } = req.body;

    if (username === "tester" && password === "password123") {
      return res.json({
        ok: true,
        token: "deterministic-token",
        user: {
          id: 99,
          username: "tester"
        }
      });
    }

    res.status(401).json({
      ok: false,
      error: "invalid_credentials"
    });
  });

  // -----------------------------
  // TICKETS
  // -----------------------------

  const tickets = [
    { id: 101, title: "Login bug", status: "open" },
    { id: 102, title: "Broken API", status: "closed" },
    { id: 103, title: "UI glitch", status: "open" }
  ];

  app.get("/tickets", (_req, res) => {
    res.json(tickets);
  });

  app.post("/tickets", (req, res) => {
    const { title } = req.body;

    const ticket = {
      id: Date.now(),
      title,
      status: "open"
    };

    tickets.push(ticket);

    res.status(201).json(ticket);
  });

  // -----------------------------
  // DEBUG ENDPOINTS (great for testing)
  // -----------------------------

  app.get("/debug/echo", (req, res) => {
    res.json({
      query: req.query,
      headers: req.headers
    });
  });

  app.get("/debug/delay/:ms", async (req, res) => {
    const ms = Number(req.params.ms) || 1000;

    await new Promise(r => setTimeout(r, ms));

    res.json({
      ok: true,
      delayed: ms
    });
  });

  app.get("/debug/error", (_req, res) => {
    res.status(500).json({
      ok: false,
      error: "intentional_error"
    });
  });

  return app;
}

// ----------------------------------
// START SERVER
// ----------------------------------

if (require.main === module) {
  console.log("server.ts: starting");

  const app = createApp();

  const port = Number(process.env.PORT || 3001);

  const server = app.listen(port, "0.0.0.0", () => {
    console.log(`deterministic-api-testbed listening on port ${port}`);
  });

  server.on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      console.error(`Port ${port} already in use.`);
    } else {
      console.error(err);
    }
  });
}