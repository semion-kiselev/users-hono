const getUserTokenExpirationTimeSql = `SELECT token_expired_at FROM employee WHERE id = ?`;

export const getUserTokenExpirationTime = (db, userId) => {
  const result = db.prepare(getUserTokenExpirationTimeSql).get(userId);
  if (!result) {
    return null;
  }

  return Math.ceil(new Date(result.token_expired_at + "Z").getTime() / 1000);
};
