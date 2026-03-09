import { Router } from "express";
import { tickets, users } from "../data/seed";
import { requireAuth } from "../middleware/auth";

export const searchRouter = Router();

searchRouter.get("/", requireAuth, (req, res) => {
  const q = typeof req.query.q === "string" ? req.query.q.trim().toLowerCase() : "";

  if (!q) {
    res.status(200).json({
      ok: true,
      query: "",
      users: [],
      tickets: []
    });
    return;
  }

  const matchedUsers = users.filter(
    (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
  );

  const matchedTickets = tickets.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.status.toLowerCase().includes(q)
  );

  res.status(200).json({
    ok: true,
    query: q,
    users: matchedUsers,
    tickets: matchedTickets
  });
});