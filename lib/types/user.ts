export type Role = "admin" | "client";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  clientId?: string;
};
