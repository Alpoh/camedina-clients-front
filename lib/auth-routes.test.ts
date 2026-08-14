import { describe, expect, it } from "vitest";
import { homeForRole } from "@/lib/auth-routes";

describe("homeForRole", () => {
  it("routes admins to /admin", () => {
    expect(homeForRole("admin")).toBe("/admin");
  });

  it("routes clients to /portal", () => {
    expect(homeForRole("client")).toBe("/portal");
  });
});
