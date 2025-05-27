import bcrypt from "bcrypt";
import { getUpdateSqlWithValues } from "../../../shared/utils/sql.js";
import { normalizeUser } from "../users.utils.js";
import { getUserPermissions } from "./get-user-permissions.service.js";

const updateUserSql = "UPDATE employee SET %s WHERE id = ? RETURNING *";

const removeUserPermissionsSql = "DELETE FROM employee_permission WHERE employee_id = ?";

const addUserPermissionsSql =
  "INSERT INTO employee_permission (employee_id, permission_id) VALUES (?, ?)";

export const updateUser = async (db, id, { name, email, password, permissions }, raiseNotFound) => {
  if (!process.env.SALT_ROUNDS) {
    throw new Error("SALT_ROUNDS should exist in env");
  }

  const hashedPassword = password
    ? await bcrypt.hash(password, Number(process.env.SALT_ROUNDS))
    : undefined;

  return db.transaction(() => {
    const [sql, values] = getUpdateSqlWithValues(updateUserSql, {
      name,
      email,
      password: hashedPassword,
      token_expired_at: permissions ? "datetime()" : undefined,
    });
    const updatedUser = db.prepare(sql).get(...values, id);

    if (!updatedUser) {
      raiseNotFound();
    }

    if (permissions) {
      db.prepare(removeUserPermissionsSql).run(id);

      const userPermissionsMap = permissions.map((p) => [id, p]);
      const insertPermissions = db.prepare(addUserPermissionsSql);
      userPermissionsMap.forEach((row) => {
        insertPermissions.run(...row);
      });
    }

    let currentPermissions = [];
    if (!permissions) {
      currentPermissions = getUserPermissions(db, id);
    }

    return normalizeUser({
      ...updatedUser,
      permissions: permissions || currentPermissions,
    });
  })();
};
