import { omit, toCamelCase } from "../../shared/utils/lib.js";

export const normalizeUser = (user, { omitCredProps = true } = {}) => {
  const omittedUser = omitCredProps ? omit(user, ["token_expired_at", "password"]) : user;

  const userWithPermissions = {
    ...omittedUser,
    permissions:
      typeof omittedUser.permissions === "string"
        ? JSON.parse(omittedUser.permissions)
        : omittedUser.permissions,
  };

  return toCamelCase(userWithPermissions);
};
