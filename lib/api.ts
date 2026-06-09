import { getToken, getBotId } from "./auth";
import type {
  LoginResponse,
  RegisterResponse,
  Solicitud,
  ChatResponse,
  Bot,
} from "./types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://nodematik-production.up.railway.app";

async function fetchApi<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errMsg = `Error ${res.status}`;
    try {
      const data = await res.json();
      errMsg = data.error || data.message || errMsg;
    } catch {
      // ignore
    }
    throw new Error(errMsg);
  }

  return res.json();
}

// Auth
export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  return fetchApi<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function register(
  orgName: string,
  email: string,
  password: string
): Promise<RegisterResponse> {
  return fetchApi<RegisterResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ orgName, email, password }),
  });
}

// Bots
export async function updateBot(
  botId: string,
  data: {
    llmProvider?: string;
    llmModel?: string;
    llmApiKey?: string;
    status?: string;
  }
): Promise<Bot> {
  return fetchApi<Bot>(`/admin/bots/${botId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// Solicitudes (operador)
export async function getSolicitudes(): Promise<Solicitud[]> {
  return fetchApi<Solicitud[]>("/admin/operador/solicitudes");
}

export async function getSolicitud(id: string): Promise<Solicitud> {
  return fetchApi<Solicitud>(`/admin/operador/solicitudes/${id}`);
}

export async function crearSolicitud(pregunta: string): Promise<Solicitud> {
  const botId = getBotId() ?? "";
  return fetchApi<Solicitud>("/admin/operador/solicitudes", {
    method: "POST",
    body: JSON.stringify({ botId, problema: pregunta }),
  });
}

export async function responderSolicitud(
  id: string,
  respuesta: string
): Promise<Solicitud> {
  return fetchApi<Solicitud>(`/admin/operador/solicitudes/${id}/responder`, {
    method: "POST",
    body: JSON.stringify({ mensaje: respuesta }),
  });
}

// Aprobaciones de solicitudes (one-time skills)
export async function aprobacionSolicitud(
  id: string,
  aprobado: boolean
): Promise<{ ok: boolean; accion: string; skillId?: string }> {
  return fetchApi(`/admin/operador/solicitudes/${id}/aprobaciones`, {
    method: "POST",
    body: JSON.stringify({ aprobado }),
  });
}

// Loops
export async function getLoop(loopId: string) {
  return fetchApi(`/admin/operador/loops/${loopId}`);
}

// Aprobaciones de loops (continuous solutions)
export async function postAprobacion(
  loopId: string,
  payload: { ok: boolean; accion: string }
) {
  return fetchApi(`/admin/operador/loops/${loopId}/aprobaciones`, {
    method: "POST",
    body: JSON.stringify({ aprobado: payload.ok }),
  });
}

// Chat B
export async function chatWithBot(
  botId: string,
  message: string,
  conversationId?: string
): Promise<ChatResponse> {
  return fetchApi<ChatResponse>(`/admin/bots/${botId}/chat`, {
    method: "POST",
    body: JSON.stringify({ mensaje: message, conversationId }),
  });
}
