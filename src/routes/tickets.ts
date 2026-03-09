import { Router } from "express";
import { tickets } from "../data/seed";
import { requireAuth } from "../middleware/auth";
import { Ticket, TicketStatus } from "../types";

export const ticketsRouter = Router();

ticketsRouter.get("/", requireAuth, (req, res) => {
  const status = typeof req.query.status === "string" ? req.query.status : "";
  const filtered = status ? tickets.filter((t) => t.status === status) : tickets;

  res.status(200).json({
    ok: true,
    count: filtered.length,
    data: filtered
  });
});

ticketsRouter.post("/", requireAuth, (req, res) => {
  const { title, description, priority = "medium", ownerId = "u_001" } = req.body as Partial<Ticket>;

  if (!title || !description) {
    res.status(422).json({
      ok: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "title and description are required."
      }
    });
    return;
  }

  const nextTicket: Ticket = {
    id: `t_${1000 + tickets.length + 1}`,
    title,
    description,
    status: "open",
    priority: priority as Ticket["priority"],
    ownerId,
    createdAt: "2026-03-08T12:34:56.000Z"
  };

  tickets.push(nextTicket);

  res.status(201).json({
    ok: true,
    data: nextTicket
  });
});

ticketsRouter.patch("/:id/status", requireAuth, (req, res) => {
  const { status } = req.body as { status?: TicketStatus };
  const ticket = tickets.find((t) => t.id === req.params.id);

  if (!ticket) {
    res.status(404).json({
      ok: false,
      error: {
        code: "TICKET_NOT_FOUND",
        message: `Ticket ${req.params.id} was not found.`
      }
    });
    return;
  }

  const allowed: TicketStatus[] = ["open", "in_progress", "resolved"];
  if (!status || !allowed.includes(status)) {
    res.status(422).json({
      ok: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "status must be one of: open, in_progress, resolved."
      }
    });
    return;
  }

  ticket.status = status;

  res.status(200).json({
    ok: true,
    data: ticket
  });
});