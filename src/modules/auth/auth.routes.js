import { Hono } from "hono";
import { sign } from "hono/jwt";
import { validator } from "hono/validator";
import { raiseServerError, raiseUnauthorized } from "../../shared/utils/errors.js";
import { applyValidation } from "../../shared/utils/validation.js";
import { LoginSchema, LogoutSchema } from "./auth-schemas.js";
import { login } from "./auth.services/login.service.js";
import { logout } from "./auth.services/logout.service.js";

export const auth = new Hono();

auth.post(
  "/login",
  validator("json", (value) => applyValidation(value, LoginSchema)),
  async (c) => {
    const payload = c.req.valid("json");

    const { ACCESS_TOKEN_EXPIRATION_SECONDS, ACCESS_TOKEN_SECRET } = process.env;
    if (!ACCESS_TOKEN_EXPIRATION_SECONDS || !ACCESS_TOKEN_SECRET) {
      raiseServerError();
    }

    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + Number(ACCESS_TOKEN_EXPIRATION_SECONDS);
    const signToken = (payload) => sign({ ...payload, exp, iat }, ACCESS_TOKEN_SECRET);

    const { token } = await login(c.var.db, payload, raiseUnauthorized, signToken);
    return c.json({ token });
  }
);

auth.post(
  "/logout",
  validator("json", (value) => applyValidation(value, LogoutSchema)),
  async (c) => {
    const { id } = c.req.valid("json");
    const result = logout(c.var.db, { id });
    return c.json(result);
  }
);
