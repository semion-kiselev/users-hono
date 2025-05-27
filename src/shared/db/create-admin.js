import bcrypt from "bcrypt";
import Database from "better-sqlite3";
import { resolve } from "node:path";

if (!process.env.DB_ADMIN_PASSWORD || !process.env.SALT_ROUNDS) {
  throw new Error("DB_ADMIN_PASSWORD & SALT_ROUNDS should exist in env");
}

const dbPath = resolve(import.meta.dirname, "./users.db");
const db = new Database(dbPath);
const hashedPassword = await bcrypt.hash(
  process.env.DB_ADMIN_PASSWORD,
  Number(process.env.SALT_ROUNDS)
);

db.transaction(() => {
  const adminResult = db
    .prepare("INSERT INTO employee (name, email, password) VALUES (?, ?, ?) RETURNING id")
    .get(process.env.DB_ADMIN_NAME, process.env.DB_ADMIN_EMAIL, hashedPassword);

  if (!adminResult) {
    throw new Error("Admin was not created");
  }

  const { id: adminId } = adminResult;

  const permissionsResult = db.prepare("SELECT id from permission").all();
  const permissions = permissionsResult.map(({ id }) => id);

  if (permissions.length === 0) {
    throw new Error("No permissions for admin");
  }

  const userPermissionsMap = permissions.map((p) => [adminId, p]);

  const insertPermissions = db.prepare(
    "INSERT INTO employee_permission (employee_id, permission_id) VALUES (?, ?)"
  );
  userPermissionsMap.forEach((row) => {
    insertPermissions.run(...row);
  });
})();
