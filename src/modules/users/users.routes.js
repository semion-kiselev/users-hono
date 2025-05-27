import { Hono } from "hono";
import { validator } from "hono/validator";
import { raiseNotFound } from "../../shared/utils/errors.js";
import { applyValidation } from "../../shared/utils/validation.js";
import { authGuardMiddleware } from "../auth/auth-guard.middleware.js";
import { PERMISSION } from "../permissions/permissions.constants.js";
import {
  CreateUserPayloadSchema,
  UpdateUserPayloadSchema,
  UserIdParamSchema,
} from "./users.schemas.js";
import { createUser } from "./users.services/create-user.service.js";
import { deleteUser } from "./users.services/delete-user.service.js";
import { getUser } from "./users.services/get-user.service.js";
import { getUsers } from "./users.services/get-users.service.js";
import { updateUser } from "./users.services/update-user.service.js";

export const users = new Hono();

users.on("GET", "*", authGuardMiddleware([PERMISSION.UR]));
users.on(
  ["POST", "PUT", "PATCH", "DELETE"],
  "*",
  authGuardMiddleware([PERMISSION.UR, PERMISSION.UM])
);

users.get("/", (c) => {
  const users = getUsers(c.var.db);
  return c.json(users);
});

users.get(
  "/:id",
  validator("param", (value) =>
    applyValidation({ ...value, id: Number(value.id) }, UserIdParamSchema)
  ),
  (c) => {
    const { id } = c.req.valid("param");
    const user = getUser(c.var.db, id, raiseNotFound);
    return c.json(user);
  }
);

users.post(
  "/",
  validator("json", (value) => applyValidation(value, CreateUserPayloadSchema)),
  async (c) => {
    const payload = c.req.valid("json");
    const user = await createUser(c.var.db, payload);
    return c.json(user);
  }
);

users.put(
  "/:id",
  validator("param", (value) =>
    applyValidation({ ...value, id: Number(value.id) }, UserIdParamSchema)
  ),
  validator("json", (value) => applyValidation(value, UpdateUserPayloadSchema)),
  async (c) => {
    const { id } = c.req.valid("param");
    const payload = c.req.valid("json");
    const user = await updateUser(c.var.db, id, payload, raiseNotFound);
    return c.json(user);
  }
);

users.delete(
  "/:id",
  validator("param", (value) =>
    applyValidation({ ...value, id: Number(value.id) }, UserIdParamSchema)
  ),
  (c) => {
    const { id } = c.req.valid("param");
    const result = deleteUser(c.var.db, id, raiseNotFound);
    return c.json(result);
  }
);
