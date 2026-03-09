import express from "express";
import { authRouter } from "./routes/auth";
import { healthRouter } from "./routes/health";
import { searchRouter } from "./routes/search";
import { ticketsRouter } from "./routes/tickets";
import { usersRouter } from "./routes/users";
import { errorHandler, notFound } from "./middleware/errorHandler";
import { requestId } from "./middleware/requestId";
import { simulateRateLimit } from "./middleware/rateLimit";

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(requestId);
  app.use(simulateRateLimit);

  app.get("/", (_req, res) => {
    res.status(200).json({
      ok: true,
      name: "deterministic-api-testbed",
      docs: "/health"
    });
  });

  app.use("/health", healthRouter);
  app.use("/auth", authRouter);
  app.use("/users", usersRouter);
  app.use("/tickets", ticketsRouter);
  app.use("/search", searchRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}