const deleteUserSql = "DELETE FROM employee WHERE id = ?";

export const deleteUser = (db, id, raiseNotFound) => {
  const { changes } = db.prepare(deleteUserSql).run(id);

  if (changes === 0) {
    raiseNotFound();
  }

  return { ok: true };
};
