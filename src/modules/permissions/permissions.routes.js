import { Hono } from "hono";
import { getPermissions } from "./permissions.services/get-permissions.service.js";

export const permissions = new Hono();

permissions.get("/", async (c) => {
  const permissions = getPermissions(c.var.db);
  return c.json(permissions);
});
