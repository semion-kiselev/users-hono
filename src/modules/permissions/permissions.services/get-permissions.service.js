export const getPermissions = (db) => db.prepare("SELECT id, name FROM permission").all();
