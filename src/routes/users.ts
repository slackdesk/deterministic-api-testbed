import { Router } from "express";
import { users } from "../data/seed";
import { requireAuth } from "../middleware/auth";

export const usersRouter = Router();

usersRouter.get("/", requireAuth, (req, res) => {
  const role = typeof req.query.role === "string" ? req.query.role : "";
  const filtered = role ? users.filter((u) => u.role === role) : users;

  res.status(200).json({
    ok: true,
    count: filtered.length,
    data: filtered
  });
});

usersRouter.get("/:id", requireAuth, (req, res) => {
  const user = users.find((u) => u.id === req.params.id);

  if (!user) {
    res.status(404).json({
      ok: false,
      error: {
        code: "USER_NOT_FOUND",
        message: `User ${req.params.id} was not found.`
      }
    });
    return;
  }

  res.status(200).json({
    ok: true,
    data: user
  });
});