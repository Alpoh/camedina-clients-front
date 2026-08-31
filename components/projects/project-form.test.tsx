import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

const createProjectActionMock = vi.fn();

vi.mock("@/app/actions/projects", () => ({
  createProjectAction: createProjectActionMock,
}));

const { ProjectForm } = await import("@/components/projects/project-form");

beforeEach(() => {
  vi.clearAllMocks();
});

describe("ProjectForm", () => {
  it("renders the name, status, and description fields", () => {
    render(<ProjectForm clientId="client-acme" />);
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Status")).toHaveValue("planning");
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
  });

  it("shows the message the action returns on failure", async () => {
    createProjectActionMock.mockResolvedValue({
      message: "Something went wrong creating the project. Please try again.",
    });
    render(<ProjectForm clientId="client-acme" />);

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "New site" },
    });
    fireEvent.click(screen.getByRole("button", { name: /create project/i }));

    expect(
      await screen.findByText(
        "Something went wrong creating the project. Please try again.",
      ),
    ).toBeInTheDocument();
    expect(createProjectActionMock).toHaveBeenCalledWith(
      "client-acme",
      undefined,
      expect.any(FormData),
    );
  });
});
