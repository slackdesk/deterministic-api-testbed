import { NextFunction, Request, Response } from "express";

export function simulateRateLimit(req: Request, res: Response, next: NextFunction): void {
  const trigger = req.query.rateLimit === "true";
  if (trigger) {
    res.status(429).json({
      ok: false,
      error: {
        code: "RATE_LIMITED",
        message: "Too many requests. Please retry later."
      }
    });
    return;
  }

  next();
}