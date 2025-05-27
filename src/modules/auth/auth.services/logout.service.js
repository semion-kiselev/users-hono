export const logout = (db, { id }) => {
  db.prepare("UPDATE employee SET token_expired_at=datetime() WHERE id = ? RETURNING *").run(id);
  return { ok: true };
};
