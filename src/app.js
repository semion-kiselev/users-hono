import { Hono } from "hono";
import { auth } from "./modules/auth/auth.routes.js";
import { permissions } from "./modules/permissions/permissions.routes.js";
import { users } from "./modules/users/users.routes.js";
import { dbConnectionMiddleware } from "./shared/db/db-connection.middleware.js";
import { handleAppErrors } from "./shared/utils/errors.js";

export const app = new Hono();

app.use(dbConnectionMiddleware);

app.route("/auth", auth);
app.route("/users", users);
app.route("/permissions", permissions);

app.onError(handleAppErrors);
