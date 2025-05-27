import { normalizeUser } from "../users.utils.js";

const getUserSql = `
  SELECT id, name, email, created_at, updated_at, json_group_array(ep.permission_id) as permissions
  FROM employee
    JOIN employee_permission ep on employee.id = ep.employee_id
    WHERE id = ?
    GROUP BY id, name, email, created_at, updated_at;
`;

export const getUser = (db, id, raiseNotFound) => {
  const user = db.prepare(getUserSql).get(id);

  if (!user) {
    raiseNotFound();
  }

  return normalizeUser(user);
};
