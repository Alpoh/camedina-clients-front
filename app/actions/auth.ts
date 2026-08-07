"use server";

import { redirect } from "next/navigation";
import { LoginFormSchema, type LoginFormState } from "@/lib/definitions";
import { authenticate } from "@/lib/api/auth";
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

  await createSession(user.id, user.role);
  redirect(homeForRole(user.role));
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
