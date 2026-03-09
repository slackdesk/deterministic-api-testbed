import { NextFunction, Request, Response } from "express";

export function notFound(req: Request, res: Response): void {
  res.status(404).json({
    ok: false,
    error: {
      code: "NOT_FOUND",
      message: `Route not found: ${req.method} ${req.path}`
    }
  });
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  res.status(500).json({
    ok: false,
    error: {
      code: "INTERNAL_ERROR",
      message: err.message || "Unexpected server error"
    }
  });
}