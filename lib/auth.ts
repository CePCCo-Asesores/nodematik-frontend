export const AUTH_KEYS = {
  token: "nm_token",
  orgId: "nm_org_id",
  userId: "nm_user_id",
  botId: "nm_bot_id",
  llmConfigured: "nm_llm_configured",
  role: "nm_role",
} as const;

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_KEYS.token);
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_KEYS.token, token);
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  Object.values(AUTH_KEYS).forEach((key) => localStorage.removeItem(key));
}

export function getOrgId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_KEYS.orgId);
}

export function getBotId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_KEYS.botId);
}

export function isLlmConfigured(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(AUTH_KEYS.llmConfigured) === "1";
}

export function saveSession(data: {
  token: string;
  orgId?: string;
  userId?: string;
  role?: string;
  botId?: string;
  llmConfigured?: boolean;
}): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_KEYS.token, data.token);
  if (data.orgId) localStorage.setItem(AUTH_KEYS.orgId, data.orgId);
  if (data.userId) localStorage.setItem(AUTH_KEYS.userId, data.userId);
  if (data.role) localStorage.setItem(AUTH_KEYS.role, data.role);
  if (data.botId) localStorage.setItem(AUTH_KEYS.botId, data.botId);
  if (data.llmConfigured) localStorage.setItem(AUTH_KEYS.llmConfigured, "1");
}
