import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";

import {
  DEMO_EMAIL,
  DEMO_PASSWORD,
  demoSignIn,
  demoSignOut,
  demoSignUp,
  getDemoSession,
} from "./auth.ts";

class MemoryStorage implements Storage {
  private values = new Map<string, string>();

  get length() {
    return this.values.size;
  }

  clear() {
    this.values.clear();
  }

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  key(index: number) {
    return [...this.values.keys()][index] ?? null;
  }

  removeItem(key: string) {
    this.values.delete(key);
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

const storage = new MemoryStorage();
Object.defineProperty(globalThis, "localStorage", { value: storage });
Object.defineProperty(globalThis, "window", {
  value: { localStorage: storage, dispatchEvent: () => true },
});

describe("demo mode authentication", () => {
  beforeEach(() => storage.clear());

  it("signs in with the preloaded presentation account", async () => {
    const session = await demoSignIn(DEMO_EMAIL, DEMO_PASSWORD);
    assert.equal(session.email, DEMO_EMAIL);
    assert.equal(getDemoSession()?.mode, "demo");
  });

  it("rejects an invalid fictitious password", async () => {
    await assert.rejects(() => demoSignIn(DEMO_EMAIL, "senha-errada"), /inválidos/);
  });

  it("creates a local account and persists the session", async () => {
    const session = await demoSignUp({
      email: "recrutador@example.com",
      password: "senha123",
      displayName: "Recrutador",
    });
    assert.equal(session.displayName, "Recrutador");
    assert.equal(getDemoSession()?.email, "recrutador@example.com");
  });

  it("removes only the local session on logout", async () => {
    await demoSignIn(DEMO_EMAIL, DEMO_PASSWORD);
    demoSignOut();
    assert.equal(getDemoSession(), null);
    await demoSignIn(DEMO_EMAIL, DEMO_PASSWORD);
    assert.equal(getDemoSession()?.email, DEMO_EMAIL);
  });
});
