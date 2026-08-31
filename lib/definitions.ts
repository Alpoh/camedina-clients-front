import * as z from "zod";
import { PROJECT_STATUSES, PROJECT_DESCRIPTION_MAX_LENGTH } from "@/lib/types/project";

export const LoginFormSchema = z.object({
  email: z.email({ error: "Enter a valid email." }).trim(),
  password: z.string().min(1, { error: "Password is required." }),
});

export type LoginFormState =
  | {
      errors?: {
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export const SignupFormSchema = z.object({
  name: z.string().min(2, { error: "Enter your name." }).trim(),
  company: z.string().min(2, { error: "Enter your business name." }).trim(),
  email: z.email({ error: "Enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters." }),
});

export type SignupFormState =
  | {
      errors?: {
        name?: string[];
        company?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export const ProjectFormSchema = z.object({
  name: z.string().min(2, { error: "Enter a project name." }).trim(),
  status: z.enum(PROJECT_STATUSES, { error: "Choose a status." }),
  description: z
    .string()
    .trim()
    .max(PROJECT_DESCRIPTION_MAX_LENGTH, {
      error: `Description must be ${PROJECT_DESCRIPTION_MAX_LENGTH} characters or fewer.`,
    })
    .nullish(),
});

export type ProjectFormState =
  | {
      errors?: {
        name?: string[];
        status?: string[];
        description?: string[];
      };
      message?: string;
    }
  | undefined;
