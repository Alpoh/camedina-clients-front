import { beforeEach, describe, expect, it, vi } from "vitest";

const createProjectMock = vi.fn();
const redirectMock = vi.fn();

vi.mock("@/lib/api/projects", () => ({
  createProject: createProjectMock,
}));
vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}));

const { createProjectAction } = await import("@/app/actions/projects");

function formData(fields: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.append(key, value);
  return data;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("createProjectAction", () => {
  it("returns a field error for a missing name without calling the backend", async () => {
    const state = await createProjectAction(
      "client-acme",
      undefined,
      formData({ name: "", status: "planning" }),
    );
    expect(state?.errors?.name).toBeDefined();
    expect(createProjectMock).not.toHaveBeenCalled();
  });

  it("returns a field error for an invalid status", async () => {
    const state = await createProjectAction(
      "client-acme",
      undefined,
      formData({ name: "New site", status: "not-a-status" }),
    );
    expect(state?.errors?.status).toBeDefined();
    expect(createProjectMock).not.toHaveBeenCalled();
  });

  it("returns a generic message when the backend call fails", async () => {
    createProjectMock.mockRejectedValue(new Error("backend down"));
    const state = await createProjectAction(
      "client-acme",
      undefined,
      formData({ name: "New site", status: "planning" }),
    );
    expect(state?.message).toBe(
      "Something went wrong creating the project. Please try again.",
    );
    expect(redirectMock).not.toHaveBeenCalled();
  });

  it("creates the project scoped to the client and redirects to it", async () => {
    createProjectMock.mockResolvedValue({ id: "project-1" });
    await createProjectAction(
      "client-acme",
      undefined,
      formData({
        name: "New site",
        status: "in_progress",
        description: "Rebuild the marketing site",
      }),
    );
    expect(createProjectMock).toHaveBeenCalledWith("client-acme", {
      name: "New site",
      status: "in_progress",
      description: "Rebuild the marketing site",
    });
    expect(redirectMock).toHaveBeenCalledWith("/admin/projects/project-1");
  });
});
