import { beforeEach, describe, expect, it, vi } from "vitest";

const authenticateMock = vi.fn();
const registerClientMock = vi.fn();
const createSessionMock = vi.fn();
const deleteSessionMock = vi.fn();
const clearBackendTokenMock = vi.fn();
const redirectMock = vi.fn();

vi.mock("@/lib/api/auth", () => ({
  authenticate: authenticateMock,
  registerClient: registerClientMock,
}));
vi.mock("@/lib/api/http", () => ({
  clearBackendToken: clearBackendTokenMock,
}));
vi.mock("@/lib/session", () => ({
  createSession: createSessionMock,
  deleteSession: deleteSessionMock,
}));
vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}));

const { login, signup, logout } = await import("@/app/actions/auth");

function formData(fields: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.append(key, value);
  return data;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("login", () => {
  it("returns a field error for an invalid email without calling the backend", async () => {
    const state = await login(
      undefined,
      formData({ email: "not-an-email", password: "demo1234" }),
    );
    expect(state?.errors?.email).toBeDefined();
    expect(authenticateMock).not.toHaveBeenCalled();
  });

  it("returns a generic message when credentials are invalid", async () => {
    authenticateMock.mockResolvedValue(null);
    const state = await login(
      undefined,
      formData({ email: "dana@camedina.com", password: "wrong" }),
    );
    expect(state?.message).toBe("Invalid email or password.");
    expect(createSessionMock).not.toHaveBeenCalled();
  });

  it("creates a session and redirects to the role's home on success", async () => {
    authenticateMock.mockResolvedValue({
      id: "user-admin-1",
      role: "admin",
      name: "Dana Reyes",
      email: "dana@camedina.com",
    });
    await login(
      undefined,
      formData({ email: "dana@camedina.com", password: "demo1234" }),
    );
    expect(createSessionMock).toHaveBeenCalledWith("user-admin-1", "admin");
    expect(redirectMock).toHaveBeenCalledWith("/admin");
  });
});

describe("signup", () => {
  it("returns a message when the email is already taken", async () => {
    registerClientMock.mockResolvedValue(null);
    const state = await signup(
      undefined,
      formData({
        name: "Dana Reyes",
        company: "Acme",
        email: "dana@camedina.com",
        password: "demo1234",
      }),
    );
    expect(state?.message).toBe(
      "An account with this email already exists.",
    );
    expect(createSessionMock).not.toHaveBeenCalled();
  });

  it("creates a session and redirects to /portal for a new client", async () => {
    registerClientMock.mockResolvedValue({
      id: "user-client-acme",
      role: "client",
      name: "Dana Reyes",
      email: "dana@camedina.com",
      clientId: "some-uuid",
    });
    await signup(
      undefined,
      formData({
        name: "Dana Reyes",
        company: "Acme",
        email: "dana@camedina.com",
        password: "demo1234",
      }),
    );
    expect(createSessionMock).toHaveBeenCalledWith(
      "user-client-acme",
      "client",
    );
    expect(redirectMock).toHaveBeenCalledWith("/portal");
  });
});

describe("logout", () => {
  it("clears both the app session and the backend token, then redirects to /login", async () => {
    await logout();
    expect(deleteSessionMock).toHaveBeenCalled();
    expect(clearBackendTokenMock).toHaveBeenCalled();
    expect(redirectMock).toHaveBeenCalledWith("/login");
  });
});
