import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { AUTH_KEYS } from "@/lib/auth";

// Must mock fetch before importing api functions
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

// Import after stubbing
const { login, register, updateBot, getSolicitudes, getSolicitud, crearSolicitud, responderSolicitud } =
  await import("@/lib/api");

function mockOk(body: unknown) {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: async () => body,
  } as Response);
}

function mockErr(status: number, body: unknown) {
  mockFetch.mockResolvedValueOnce({
    ok: false,
    status,
    json: async () => body,
  } as Response);
}

beforeEach(() => {
  localStorage.clear();
  mockFetch.mockReset();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("login()", () => {
  it("POSTs to /auth/login and returns response", async () => {
    const payload = { token: "t", orgId: "o", userId: "u", role: "admin", botId: "b", llmConfigured: true };
    mockOk(payload);

    const result = await login("user@test.com", "pass123");

    expect(mockFetch).toHaveBeenCalledOnce();
    const [url, opts] = mockFetch.mock.calls[0];
    expect(url).toMatch(/\/auth\/login$/);
    expect(opts.method).toBe("POST");
    expect(JSON.parse(opts.body)).toEqual({ email: "user@test.com", password: "pass123" });
    expect(result).toEqual(payload);
  });

  it("throws on non-OK response with server error message", async () => {
    mockErr(401, { error: "Credenciales incorrectas" });
    await expect(login("x@x.com", "wrong")).rejects.toThrow("Credenciales incorrectas");
  });

  it("throws a generic error when server body is not parseable", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => { throw new Error("bad json"); },
    } as unknown as Response);
    await expect(login("x@x.com", "p")).rejects.toThrow("Error 500");
  });
});

describe("register()", () => {
  it("POSTs to /auth/register with orgName, email, password", async () => {
    const payload = { token: "t", orgId: "o", userId: "u", botId: "b" };
    mockOk(payload);

    const result = await register("Acme", "a@acme.com", "secret123");

    const [url, opts] = mockFetch.mock.calls[0];
    expect(url).toMatch(/\/auth\/register$/);
    expect(JSON.parse(opts.body)).toEqual({ orgName: "Acme", email: "a@acme.com", password: "secret123" });
    expect(result).toEqual(payload);
  });
});

describe("Authorization header", () => {
  it("includes Bearer token when one is stored", async () => {
    localStorage.setItem(AUTH_KEYS.token, "my-jwt-token");
    mockOk([]);

    await getSolicitudes();

    const [, opts] = mockFetch.mock.calls[0];
    expect((opts.headers as Record<string, string>)["Authorization"]).toBe("Bearer my-jwt-token");
  });

  it("omits Authorization header when no token is stored", async () => {
    mockOk([]);
    await getSolicitudes();

    const [, opts] = mockFetch.mock.calls[0];
    expect((opts.headers as Record<string, string>)["Authorization"]).toBeUndefined();
  });
});

describe("updateBot()", () => {
  it("PUTs to /admin/bots/:id", async () => {
    const bot = { id: "bot-1", name: "Asistente", status: "active", orgId: "o" };
    mockOk(bot);

    await updateBot("bot-1", { llmProvider: "openai", llmModel: "gpt-4o" });

    const [url, opts] = mockFetch.mock.calls[0];
    expect(url).toMatch(/\/admin\/bots\/bot-1$/);
    expect(opts.method).toBe("PUT");
    expect(JSON.parse(opts.body)).toMatchObject({ llmProvider: "openai", llmModel: "gpt-4o" });
  });
});

describe("getSolicitudes()", () => {
  it("GETs /admin/operador/solicitudes", async () => {
    mockOk([{ id: "s-1", estado: "pendiente", pregunta: "¿Hola?" }]);
    const result = await getSolicitudes();

    const [url, opts] = mockFetch.mock.calls[0];
    expect(url).toMatch(/\/admin\/operador\/solicitudes$/);
    expect(opts.method).toBeUndefined();
    expect(result).toHaveLength(1);
  });
});

describe("getSolicitud()", () => {
  it("GETs /admin/operador/solicitudes/:id", async () => {
    mockOk({ id: "s-99", estado: "procesando", pregunta: "Pregunta" });
    await getSolicitud("s-99");

    const [url] = mockFetch.mock.calls[0];
    expect(url).toMatch(/\/admin\/operador\/solicitudes\/s-99$/);
  });
});

describe("crearSolicitud()", () => {
  it("POSTs botId+problema to /admin/operador/solicitudes", async () => {
    mockOk({ id: "s-new", estado: "pendiente", respuesta: "Primera pregunta" });
    await crearSolicitud("¿Cuál es el plazo?");

    const [url, opts] = mockFetch.mock.calls[0];
    expect(url).toMatch(/\/admin\/operador\/solicitudes$/);
    expect(opts.method).toBe("POST");
    const body = JSON.parse(opts.body);
    expect(body.problema).toBe("¿Cuál es el plazo?");
    expect(body).toHaveProperty("botId");
  });
});

describe("responderSolicitud()", () => {
  it("POSTs mensaje to /admin/operador/solicitudes/:id/responder", async () => {
    mockOk({ id: "s-1", estado: "completado", problema: "Q", respuesta: "A" });
    await responderSolicitud("s-1", "Mi respuesta");

    const [url, opts] = mockFetch.mock.calls[0];
    expect(url).toMatch(/\/admin\/operador\/solicitudes\/s-1\/responder$/);
    expect(JSON.parse(opts.body)).toEqual({ mensaje: "Mi respuesta" });
  });
});
