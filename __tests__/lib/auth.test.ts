import { describe, it, expect, beforeEach } from "vitest";
import {
  getToken,
  setToken,
  clearToken,
  getOrgId,
  getBotId,
  isLlmConfigured,
  saveSession,
  AUTH_KEYS,
} from "@/lib/auth";

beforeEach(() => {
  localStorage.clear();
});

describe("getToken / setToken", () => {
  it("returns null when nothing is stored", () => {
    expect(getToken()).toBeNull();
  });

  it("returns the stored token", () => {
    setToken("tok-abc");
    expect(getToken()).toBe("tok-abc");
  });
});

describe("clearToken", () => {
  it("removes all auth keys from localStorage", () => {
    localStorage.setItem(AUTH_KEYS.token, "t");
    localStorage.setItem(AUTH_KEYS.orgId, "o");
    localStorage.setItem(AUTH_KEYS.userId, "u");
    localStorage.setItem(AUTH_KEYS.botId, "b");
    localStorage.setItem(AUTH_KEYS.llmConfigured, "1");
    localStorage.setItem(AUTH_KEYS.role, "admin");

    clearToken();

    Object.values(AUTH_KEYS).forEach((key) => {
      expect(localStorage.getItem(key)).toBeNull();
    });
  });
});

describe("getOrgId", () => {
  it("returns null when not set", () => {
    expect(getOrgId()).toBeNull();
  });

  it("returns stored orgId", () => {
    localStorage.setItem(AUTH_KEYS.orgId, "org-1");
    expect(getOrgId()).toBe("org-1");
  });
});

describe("getBotId", () => {
  it("returns null when not set", () => {
    expect(getBotId()).toBeNull();
  });

  it("returns stored botId", () => {
    localStorage.setItem(AUTH_KEYS.botId, "bot-99");
    expect(getBotId()).toBe("bot-99");
  });
});

describe("isLlmConfigured", () => {
  it("returns false when not set", () => {
    expect(isLlmConfigured()).toBe(false);
  });

  it("returns true when value is '1'", () => {
    localStorage.setItem(AUTH_KEYS.llmConfigured, "1");
    expect(isLlmConfigured()).toBe(true);
  });

  it("returns false for any value other than '1'", () => {
    localStorage.setItem(AUTH_KEYS.llmConfigured, "true");
    expect(isLlmConfigured()).toBe(false);
  });
});

describe("saveSession", () => {
  it("stores token", () => {
    saveSession({ token: "tok-xyz" });
    expect(localStorage.getItem(AUTH_KEYS.token)).toBe("tok-xyz");
  });

  it("stores all provided fields", () => {
    saveSession({
      token: "t",
      orgId: "o",
      userId: "u",
      role: "admin",
      botId: "b",
      llmConfigured: true,
    });
    expect(localStorage.getItem(AUTH_KEYS.token)).toBe("t");
    expect(localStorage.getItem(AUTH_KEYS.orgId)).toBe("o");
    expect(localStorage.getItem(AUTH_KEYS.userId)).toBe("u");
    expect(localStorage.getItem(AUTH_KEYS.role)).toBe("admin");
    expect(localStorage.getItem(AUTH_KEYS.botId)).toBe("b");
    expect(localStorage.getItem(AUTH_KEYS.llmConfigured)).toBe("1");
  });

  it("does not write optional fields when they are undefined", () => {
    saveSession({ token: "t" });
    expect(localStorage.getItem(AUTH_KEYS.orgId)).toBeNull();
    expect(localStorage.getItem(AUTH_KEYS.botId)).toBeNull();
    expect(localStorage.getItem(AUTH_KEYS.llmConfigured)).toBeNull();
  });

  it("does not store llmConfigured when it is false", () => {
    saveSession({ token: "t", llmConfigured: false });
    expect(localStorage.getItem(AUTH_KEYS.llmConfigured)).toBeNull();
  });
});
