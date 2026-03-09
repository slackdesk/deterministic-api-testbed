export type UserRole = "admin" | "manager" | "member";
export type TicketStatus = "open" | "in_progress" | "resolved";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: "low" | "medium" | "high";
  ownerId: string;
  createdAt: string;
}

export interface LoginRequestBody {
  email?: string;
  password?: string;
}