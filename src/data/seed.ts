import { Ticket, User } from "../types";

export const users: User[] = [
  {
    id: "u_001",
    name: "Harry Slack",
    email: "harry@slackdesk.org",
    role: "admin"
  },
  {
    id: "u_002",
    name: "Dana Rivera",
    email: "dana@slackdesk.org",
    role: "manager"
  },
  {
    id: "u_003",
    name: "Mina Patel",
    email: "mina@slackdesk.org",
    role: "member"
  }
];

export const tickets: Ticket[] = [
  {
    id: "t_1001",
    title: "Homepage smoke regression",
    description: "Investigate intermittent smoke failure on homepage.",
    status: "open",
    priority: "high",
    ownerId: "u_001",
    createdAt: "2026-03-08T08:00:00.000Z"
  },
  {
    id: "t_1002",
    title: "Playground button alignment",
    description: "Button alignment looks off on tablet viewport.",
    status: "in_progress",
    priority: "medium",
    ownerId: "u_002",
    createdAt: "2026-03-08T08:15:00.000Z"
  },
  {
    id: "t_1003",
    title: "Newsletter validation copy",
    description: "Improve inline validation copy for newsletter form.",
    status: "resolved",
    priority: "low",
    ownerId: "u_003",
    createdAt: "2026-03-08T08:30:00.000Z"
  }
];