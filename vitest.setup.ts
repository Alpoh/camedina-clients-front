import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// RTL's own auto-cleanup only registers via a global `afterEach`, which we
// don't have since `test.globals` is off — unmount manually instead so DOM
// from one test doesn't leak into the next within the same file.
afterEach(() => {
  cleanup();
});
