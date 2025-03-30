import { z } from "zod";
import { passwordSchema } from "./registerSchema";

export const loginSchema = z.object({
    identifier : z.string().email({ message: "Invalid email address" }),
    password:passwordSchema,
})