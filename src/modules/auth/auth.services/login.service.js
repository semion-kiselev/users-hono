import { getUserByCredentials } from "../../users/users.services/get-user-by-credentials.service.js";

export const login = async (db, { email, password }, raiseNotAuthorized, signToken) => {
  const user = await getUserByCredentials(db, email, password);

  if (!user) {
    raiseNotAuthorized();
  }

  const payload = {
    sub: user.id,
    username: user.name,
    email: user.email,
    permissions: user.permissions,
  };

  const token = await signToken(payload);

  return { token };
};
