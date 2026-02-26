import { z } from "zod";
import { authValidationMessages } from "@/lib/constants";

const emailSchema = z.string().trim().min(1, authValidationMessages.emailRequired).email(authValidationMessages.emailInvalid);

const passwordSchema = z.string().min(1, authValidationMessages.passwordRequired);

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, authValidationMessages.passwordRequired),
});

export const signUpSchema = z.object({
    name: z.string().trim().min(1, authValidationMessages.nameRequired),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, authValidationMessages.confirmPasswordRequired),
  }).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: authValidationMessages.passwordMismatch,
  });

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;

export const fineSchema = z.object({
  userId: z.number().int().positive("Please select a member"),
  reason: z.string().trim()
    .min(1, "Reason is required").max(120, "Reason must be 120 characters or fewer"),
  amount: z.number().positive("Amount must be greater than 0"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
});

export type FineInput = z.infer<typeof fineSchema>;

export const expenseSchema = z.object({
  description: z.string().trim()
    .min(1, "Description is required").max(200, "Description must be 200 characters or fewer"),
  price: z.number().positive("Price must be greater than 0"),
});

export type ExpenseInput = z.infer<typeof expenseSchema>;
