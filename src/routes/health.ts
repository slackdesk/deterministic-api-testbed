import { Router } from "express";

export const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  res.status(200).json({
    ok: true,
    service: "deterministic-api-testbed",
    status: "healthy",
    timestamp: "2026-03-08T12:00:00.000Z",
    version: "0.1.0"
  });
});