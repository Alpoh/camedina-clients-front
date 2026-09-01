"use server";

import { redirect } from "next/navigation";
import {
  LoginFormSchema,
  SignupFormSchema,
  type LoginFormState,
  type SignupFormState,
} from "@/lib/definitions";
import { authenticate, registerClient } from "@/lib/api/auth";
import { clearBackendToken } from "@/lib/api/http";
import { createSession, deleteSession } from "@/lib/session";
import { homeForRole } from "@/lib/auth-routes";

export async function login(
  _state: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const { email, password } = validatedFields.data;
  const user = await authenticate(email, password);

  if (!user) {
    return { message: "Invalid email or password." };
  }

  await createSession(user);
  redirect(homeForRole(user.role));
}

export async function signup(
  _state: SignupFormState,
  formData: FormData,
): Promise<SignupFormState> {
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    company: formData.get("company"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  let user;
  try {
    user = await registerClient(validatedFields.data);
  } catch {
    return {
      message: "Something went wrong creating your account. Please try again.",
    };
  }

  if (!user) {
    return { message: "An account with this email already exists." };
  }

  await createSession(user);
  redirect(homeForRole(user.role));
}

export async function logout() {
  await deleteSession();
  await clearBackendToken();
  redirect("/login");
}
