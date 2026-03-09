import { Router } from "express";
import { users } from "../data/seed";
import { DEMO_TOKEN } from "../utils/token";
import { LoginRequestBody } from "../types";

export const authRouter = Router();

authRouter.post("/login", (req, res) => {
  const body = req.body as LoginRequestBody;

  if (body.email === "demo@slackdesk.org" && body.password === "Password123!") {
    const demoUser = users[0];

    res.status(200).json({
      ok: true,
      token: DEMO_TOKEN,
      user: demoUser
    });
    return;
  }

  res.status(401).json({
    ok: false,
    error: {
      code: "INVALID_CREDENTIALS",
      message: "Email or password is incorrect."
    }
  });
});