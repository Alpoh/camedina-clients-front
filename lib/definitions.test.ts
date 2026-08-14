import { describe, expect, it } from "vitest";
import { LoginFormSchema, SignupFormSchema } from "@/lib/definitions";

describe("LoginFormSchema", () => {
  it("accepts a well-formed login", () => {
    const result = LoginFormSchema.safeParse({
      email: "dana@camedina.com",
      password: "demo1234",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = LoginFormSchema.safeParse({
      email: "not-an-email",
      password: "demo1234",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an empty password", () => {
    const result = LoginFormSchema.safeParse({
      email: "dana@camedina.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("SignupFormSchema", () => {
  it("accepts a well-formed signup", () => {
    const result = SignupFormSchema.safeParse({
      name: "Dana Reyes",
      company: "Acme",
      email: "dana@camedina.com",
      password: "demo1234",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a password shorter than 8 characters, matching the backend's @Size(min = 8)", () => {
    const result = SignupFormSchema.safeParse({
      name: "Dana Reyes",
      company: "Acme",
      email: "dana@camedina.com",
      password: "short",
    });
    expect(result.success).toBe(false);
  });
});
