import { z } from "zod";
import { UserIdSchema } from "../users/users.schemas.js";

export const LoginSchema = z.object({
  email: z.string().email({ message: "Please, enter correct email" }),
  password: z.string().max(255),
});

export const LogoutSchema = z.object({
  id: UserIdSchema,
});
