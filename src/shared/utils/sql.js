export const getUpdateSqlWithValues = (sql, keyValueMap) => {
  const values = [];

  const updateString = Object.entries(keyValueMap)
    .filter(([, value]) => typeof value !== "undefined")
    .map(([key, value]) => {
      if (value === "datetime()") {
        return `${key}=${value}`;
      }
      values.push(value);
      return `${key}=?`;
    })
    .join(", ");

  return [sql.replace("%s", updateString), values];
};

const addPermissionsSql = `
  INSERT INTO employee_permission (employee_id, permission_id) 
  VALUES (?, ?);
`;

export const insertUserPermissions = (db, userId, permissions) => {
  const userPermissionsMap = permissions.map((p) => [userId, p]);
  const insertPermissions = db.prepare(addPermissionsSql);

  userPermissionsMap.forEach((row) => {
    insertPermissions.run(...row);
  });
};
