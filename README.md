# Nodematik — Frontend

Panel web para la plataforma **Nodematik**: convierte problemas de negocio en soluciones operables con supervisión humana. Construido con Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4.

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16.2 (App Router) |
| UI | React 19 + Tailwind CSS 4 |
| Iconos | lucide-react |
| HTTP | `fetch` nativo vía `lib/api.ts` |
| Sesión | `localStorage` (`lib/auth.ts`) |
| Tests | Vitest 4 + React Testing Library |

---

## Rutas

### Públicas
| Ruta | Descripción |
|---|---|
| `/` | Landing page |
| `/auth` | Login / Registro |
| `/config` | Configuración del asistente LLM (después del registro) |

### Panel operador (`/office/*`) — requiere sesión
| Ruta | Descripción |
|---|---|
| `/office` | Dashboard principal con soluciones activas y aprobaciones |
| `/office/solicitudes` | Tabla de todas las solicitudes con filtros y búsqueda |
| `/office/aprobaciones` | Solicitudes esperando aprobación — aprobar / rechazar |
| `/office/soluciones` | Grid de todas las soluciones |
| `/office/loops` | Soluciones en ejecución continua |
| `/office/resultados` | Entregables de solicitudes completadas |
| `/office/nueva-solucion` | Chat conversacional para crear una nueva solución |
| `/office/solucion/[id]` | Detalle de una solución: propuesta, aprobación, info |
| `/office/solucion/[id]/chat` | Chat directo con la solución activa |

### Admin (`/admin`) — acceso superadmin
| Ruta | Descripción |
|---|---|
| `/admin` | Consola administrativa: KPIs, pipeline FORGE, loops, workers, auditoría |

---

## Estructura de archivos

```
app/
  page.tsx                      — Landing
  auth/page.tsx                 — Login / Registro
  config/page.tsx               — Configuración LLM
  admin/page.tsx                — Consola admin
  office/
    layout.tsx                  — Sidebar + topbar compartidos
    page.tsx                    — Dashboard operador
    solicitudes/page.tsx
    aprobaciones/page.tsx
    soluciones/page.tsx
    loops/page.tsx
    resultados/page.tsx
    nueva-solucion/page.tsx
    solucion/[id]/
      page.tsx                  — Detalle
      chat/page.tsx             — Chat B con la solución

components/ui/
  Badge.tsx                     — Variantes: ok | warn | err | info | gold | …
  Button.tsx                    — Variantes: gold | indigo | outline | ghost | …
  Input.tsx                     — Con label, hint, error y modo dark/light
  Modal.tsx                     — Dialog accesible con ESC y backdrop-click
  Spinner.tsx                   — Indicador de carga (sm / md / lg)

lib/
  api.ts                        — Todos los llamados HTTP al backend
  auth.ts                       — Sesión en localStorage (token, orgId, botId…)
  types.ts                      — Tipos compartidos (Solicitud, Bot, Loop…)
  utils.ts                      — cn() para merge de clases Tailwind

__tests__/
  lib/utils.test.ts
  lib/auth.test.ts
  lib/api.test.ts
  components/Badge.test.tsx
  components/Button.test.tsx
  components/Input.test.tsx
  components/Modal.test.tsx
  components/Spinner.test.tsx
```

---

## Variables de entorno

Crea un archivo `.env.local` en la raíz:

```env
# URL del backend (por defecto apunta a Railway)
NEXT_PUBLIC_API_URL=https://nodematik-production.up.railway.app
```

Para desarrollo local con el backend corriendo en tu máquina:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## Desarrollo local

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev
# → http://localhost:3001 (o el puerto libre que Next.js elija)

# Linter
npm run lint

# Verificación de tipos
npx tsc --noEmit
```

---

## Tests

```bash
# Ejecutar todos los tests una vez
npm test

# Modo watch (desarrollo)
npm run test:watch
```

**81 tests · 8 suites** — unitarios con Vitest + jsdom + React Testing Library.

| Suite | Qué cubre |
|---|---|
| `lib/utils` | `cn()` — merge y deduplicación Tailwind |
| `lib/auth` | getToken / setToken / clearToken / saveSession / getBotId / isLlmConfigured |
| `lib/api` | fetchApi, login, register, updateBot, getSolicitudes, header Authorization |
| `ui/Badge` | 7 variantes de color + className extra |
| `ui/Spinner` | 3 tamaños, modo light/dark, animación |
| `ui/Button` | Variantes, sizes, loading, disabled, onClick |
| `ui/Input` | Label, hint, error, dark/light, ref, onChange |
| `ui/Modal` | Open/close, ESC, backdrop click, título, footer, icono |

---

## Build de producción

```bash
npm run build
npm start
```

---

## Conexión con el backend

El frontend consume la API REST de [Nodematik](https://github.com/CePCCo-Asesores/Nodematik). Todos los llamados pasan por `lib/api.ts`, que adjunta automáticamente el `Authorization: Bearer <token>` guardado en `localStorage`.

Flujo de autenticación:

```
/auth (login/registro)
  → guarda token + orgId + botId en localStorage (lib/auth.ts saveSession)
  → si llmConfigured → /office
  → si no           → /config (configura proveedor LLM y clave API)
```

Flujo de una solicitud:

```
/office/nueva-solucion  →  crearSolicitud(pregunta)
                        →  responderSolicitud(id, respuesta)  (preguntas de clarificación)
                        →  estado: esperando_aprobacion
/office/aprobaciones    →  responderSolicitud(id, "Apruebo…") / "Rechaza…"
                        →  estado: operando | paused
/office/solucion/[id]/chat  →  chatWithBot(botId, mensaje, conversationId)
```
