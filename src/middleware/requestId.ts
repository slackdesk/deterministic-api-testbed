import { NextFunction, Request, Response } from "express";

export function requestId(req: Request, res: Response, next: NextFunction): void {
  const id = `req_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  res.setHeader("x-request-id", id);
  next();
}