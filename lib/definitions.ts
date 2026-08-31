import * as z from "zod";

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

// Must match `ProjectStatus` in lib/types/project.ts — zod needs the literal
// tuple at runtime, the type can't be derived from it.
export const ProjectFormSchema = z.object({
  name: z.string().min(2, { error: "Enter a project name." }).trim(),
  status: z.enum(["planning", "in_progress", "blocked", "review", "done"], {
    error: "Choose a status.",
  }),
  // FormData.get() returns null (not undefined) for an absent field —
  // .nullish() accepts that, .optional() alone would reject it.
  description: z.string().trim().nullish(),
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
