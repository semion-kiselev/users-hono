import { createMiddleware } from "hono/factory";
import { verify } from "hono/jwt";
import { raiseForbidden, raiseServerError, raiseUnauthorized } from "../../shared/utils/errors.js";
import { getUserTokenExpirationTime } from "../users/users.services/get-user-token-expiration-time.service.js";

export const authGuardMiddleware = (requiredPermissions) =>
  createMiddleware(async (c, next) => {
    const { ACCESS_TOKEN_SECRET } = process.env;
    if (!ACCESS_TOKEN_SECRET) {
      raiseServerError();
    }

    const authHeader = c.req.header("Authorization");
    const [type, token] = authHeader?.split(" ") ?? [];
    if (!type || !token || type !== "Bearer") {
      raiseUnauthorized();
    }

    const payload = await verify(token, ACCESS_TOKEN_SECRET).catch(() => {
      raiseUnauthorized();
    });

    if (!payload) {
      raiseServerError();
      return;
    }

    const user = {
      id: payload.sub,
      name: payload.username,
      email: payload.email,
      permissions: payload.permissions,
    };

    const userTokenExpiredTime = getUserTokenExpirationTime(c.var.db, user.id);

    if (userTokenExpiredTime && payload.iat <= userTokenExpiredTime) {
      raiseUnauthorized();
    }

    c.set("user", user);

    if (Array.isArray(requiredPermissions) && requiredPermissions.length === 0) {
      await next();
      return;
    }

    const areAllPermissionsExist = requiredPermissions.every((permission) =>
      user.permissions.includes(permission)
    );

    if (areAllPermissionsExist) {
      await next();
      return;
    }

    raiseForbidden();
  });
