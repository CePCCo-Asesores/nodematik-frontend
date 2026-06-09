export interface LoginResponse {
  token: string;
  orgId: string;
  userId: string;
  role: string;
  botId?: string;
  llmConfigured?: boolean;
}

export interface RegisterResponse {
  token: string;
  orgId: string;
  userId: string;
  botId?: string;
  llmConfigured?: boolean;
}

export interface Bot {
  id: string;
  name: string;
  llmProvider?: string;
  llmModel?: string;
  status: string;
  orgId: string;
}

export interface Solicitud {
  id: string;
  estado: string;
  problema: string;
  respuesta?: string;
  siguiente?: string;
  createdAt?: string;
  updatedAt?: string;
  nombre?: string;
  skillId?: string;
  loopId?: string;
}

export interface SolicitudFull extends Solicitud {
  botId?: string;
  orgId?: string;
  tipo?: string;
  resultados?: string;
}

export interface Loop {
  id: string;
  estado: string;
  nombre?: string;
  proxima?: string;
  fallos?: number;
}

export interface Aprobacion {
  id: string;
  ok: boolean;
  accion: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

export interface ChatResponse {
  respuesta: string;
  conversationId?: string;
}

export interface ApiError {
  error: string;
  message?: string;
}

export interface KPI {
  label: string;
  value: string | number;
  delta: string;
  deltaType: "up" | "down" | "flat";
  icon: string;
}
