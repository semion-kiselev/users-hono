import bcrypt from "bcrypt";
import { insertUserPermissions } from "../../../shared/utils/sql.js";
import { normalizeUser } from "../users.utils.js";

const createUserSql = `
  INSERT INTO employee (name, email, password)
  VALUES (?, ?, ?)
  RETURNING *;
`;

export const createUser = async (db, { name, email, password, permissions }) => {
  if (!process.env.SALT_ROUNDS) {
    throw new Error("SALT_ROUNDS should exist in env");
  }

  const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));

  return db.transaction(() => {
    const user = db.prepare(createUserSql).get(name, email, hashedPassword);

    if (!user) {
      throw new Error("User was not created");
    }

    insertUserPermissions(db, user.id, permissions);

    return normalizeUser({ ...user, permissions: JSON.stringify(permissions) });
  })();
};
