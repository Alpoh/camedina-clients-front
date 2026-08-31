"use server";

import { redirect } from "next/navigation";
import { ProjectFormSchema, type ProjectFormState } from "@/lib/definitions";
import { createProject } from "@/lib/api/projects";

export async function createProjectAction(
  clientId: string,
  _state: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const validatedFields = ProjectFormSchema.safeParse({
    name: formData.get("name"),
    status: formData.get("status"),
    description: formData.get("description"),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const { name, status, description } = validatedFields.data;
  let project;
  try {
    project = await createProject(clientId, {
      name,
      status,
      description: description || undefined,
    });
  } catch {
    return {
      message: "Something went wrong creating the project. Please try again.",
    };
  }

  redirect(`/admin/projects/${project.id}`);
}
