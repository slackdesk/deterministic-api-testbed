import fs from "fs";
import path from "path";
import express, { Express, Request, Response } from "express";
import YAML from "yamljs";
import swaggerUi from "swagger-ui-express";

function createApp(): Express {
  const app = express();

  app.use(express.json());

  app.use((req, _res, next) => {
    const now = new Date().toISOString();
    console.log(`[${now}] ${req.method} ${req.url}`);
    next();
  });

  const openApiPath = path.resolve(process.cwd(), "openapi.yaml");
  console.log(`OpenAPI path resolved to: ${openApiPath}`);

  let swaggerDocument: any = null;
  if (fs.existsSync(openApiPath)) {
    swaggerDocument = YAML.load(openApiPath);
  } else {
    console.warn(`openapi.yaml not found at ${openApiPath}`);
  }

  app.get("/openapi.yaml", (_req: Request, res: Response) => {
    if (!fs.existsSync(openApiPath)) {
      return res.status(404).json({
        ok: false,
        error: "openapi_spec_not_found",
        path: openApiPath
      });
    }

    res.type("application/yaml");
    return res.sendFile(openApiPath);
  });

  if (swaggerDocument) {
    app.use(
      "/docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument, {
        explorer: true,
        customSiteTitle: "deterministic-api-testbed docs"
      })
    );
  } else {
    app.get("/docs", (_req: Request, res: Response) => {
      res.status(404).json({
        ok: false,
        error: "swagger_spec_not_loaded",
        path: openApiPath
      });
    });
  }

  app.get("/", (_req: Request, res: Response) => {
    res.json({
      ok: true,
      name: "deterministic-api-testbed",
      docs: "/docs",
      spec: "/openapi.yaml",
      openApiExists: fs.existsSync(openApiPath)
    });
  });

  app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({
      ok: true,
      service: "deterministic-api-testbed",
      status: "healthy",
      timestamp: new Date().toISOString()
    });
  });

  const users = [
    { id: 1, name: "Alice", role: "admin" },
    { id: 2, name: "Bob", role: "user" },
    { id: 3, name: "Charlie", role: "tester" }
  ];

  app.get("/users", (_req: Request, res: Response) => {
    res.json(users);
  });

  app.get("/users/:id", (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const user = users.find((u) => u.id === id);

    if (!user) {
      return res.status(404).json({
        ok: false,
        error: "user_not_found"
      });
    }

    return res.json(user);
  });

  app.post("/auth/login", (req: Request, res: Response) => {
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

    return res.status(401).json({
      ok: false,
      error: "invalid_credentials"
    });
  });

  const tickets = [
    { id: 101, title: "Login bug", status: "open" },
    { id: 102, title: "Broken API", status: "closed" },
    { id: 103, title: "UI glitch", status: "open" }
  ];

  app.get("/tickets", (_req: Request, res: Response) => {
    res.json(tickets);
  });

  app.post("/tickets", (req: Request, res: Response) => {
    const { title } = req.body;

    if (!title) {
      return res.status(422).json({
        ok: false,
        error: "title_required"
      });
    }

    const ticket = {
      id: Date.now(),
      title,
      status: "open"
    };

    tickets.push(ticket);
    return res.status(201).json(ticket);
  });

  app.get("/debug/echo", (req: Request, res: Response) => {
    res.json({
      query: req.query,
      headers: req.headers
    });
  });

  app.get("/debug/delay/:ms", async (req: Request, res: Response) => {
    const ms = Number(req.params.ms) || 1000;
    await new Promise((resolve) => setTimeout(resolve, ms));

    res.json({
      ok: true,
      delayed: ms
    });
  });

  app.get("/debug/error", (_req: Request, res: Response) => {
    res.status(500).json({
      ok: false,
      error: "intentional_error"
    });
  });

  return app;
}

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

export { createApp };