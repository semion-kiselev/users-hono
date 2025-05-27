import { HTTPException } from "hono/http-exception";
import { getReasonPhrase } from "http-status-codes";

const raiseHttpException = (status, data = {}) => {
  const body = JSON.stringify({
    message: getReasonPhrase(status),
    ...data,
  });
  const res = new Response(body, { status });
  throw new HTTPException(status, { res });
};

export const raiseBadRequest = (issues) => raiseHttpException(400, { issues });
export const raiseUnauthorized = () => raiseHttpException(401);
export const raiseForbidden = () => raiseHttpException(403);
export const raiseNotFound = () => raiseHttpException(404);
export const raiseConflict = () => raiseHttpException(409);
export const raiseServerError = () => raiseHttpException(500);

export const handleAppErrors = (err, c) => {
  console.error("error ", JSON.parse(JSON.stringify(err)));
  console.error(`error message "${err.message}"`);

  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  if ("code" in err && err.code === "SQLITE_CONSTRAINT_UNIQUE") {
    return c.json({ message: getReasonPhrase(409) }, 409);
  }

  if ("code" in err && err.code === "SQLITE_CONSTRAINT_FOREIGNKEY") {
    return c.json({ message: getReasonPhrase(400) }, 400);
  }

  return c.json({ message: getReasonPhrase(500) }, 500);
};
