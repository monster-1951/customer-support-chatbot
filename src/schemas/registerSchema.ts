"use client";

import { z } from "zod";

export const userNameValidation = z
  .string()
  .min(2, "Username must be atleast 2 characters")
  .max(30, "Username must be less than 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters");

export const passwordSchema = z
  .string()
  .min(8, "Password must be atleast 8 characters long");

export const registerSchema = z
  .object({
    UserName: userNameValidation,
    Gender:z.string(),
    email: z.string().email({ message: "Invalid email address" }),
    password: passwordSchema,
    confirmPassword: passwordSchema,
    MobileNumber: z
      .string()
      .length(10, "Enter a valid mobile number")
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password and confirm password must be same",
    path: ["ConfirmPassword"],
  });
