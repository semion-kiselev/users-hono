import { createMiddleware } from "hono/factory";
import { db } from "./connection.js";

export const dbConnectionMiddleware = createMiddleware(async (c, next) => {
  c.set("db", db);
  await next();
});
