import { NextFunction, Request, Response } from "express";
import { isValidToken } from "../utils/token";

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!isValidToken(req.header("authorization"))) {
    res.status(401).json({
      ok: false,
      error: {
        code: "UNAUTHORIZED",
        message: "A valid Bearer token is required."
      }
    });
    return;
  }

  next();
}