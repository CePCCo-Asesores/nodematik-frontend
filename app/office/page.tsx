"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSolicitudes } from "@/lib/api";
import type { Solicitud } from "@/lib/types";
import { Zap, ChevronRight, ArrowRight } from "lucide-react";

type SolucionCard = {
  id: string;
  nombre: string;
  icon: string;
  estado: "ok" | "pending" | "building" | "done" | "paused";
  rl?: string;
  rv?: string;
  meta?: string;
  paso?: number;
  total?: number;
};

const ESTADO_LABELS: Record<string, string> = {
  ok: "Operando",
  operando: "Operando",
  pending: "Esperando tu aprobación",
  esperando_aprobacion: "Esperando tu aprobación",
  building: "Construyéndose",
  construyendo: "Construyéndose",
  done: "Lista",
  lista: "Lista",
  paused: "En pausa",
};

function mapEstado(estado: string): "ok" | "pending" | "building" | "done" | "paused" {
  if (["operando", "ok"].includes(estado)) return "ok";
  if (["esperando_aprobacion", "pending"].includes(estado)) return "pending";
  if (["construyendo", "building"].includes(estado)) return "building";
  if (["lista", "done"].includes(estado)) return "done";
  return "paused";
}

const DEMO_SOLUCIONES: SolucionCard[] = [
  { id: "1", nombre: "Vigilancia de marca", icon: "🛡", estado: "ok", rl: "Último resultado", rv: "3 menciones detectadas", meta: "hace 18 min" },
  { id: "2", nombre: "Análisis de competencia", icon: "📊", estado: "pending", rl: "Último resultado", rv: "Informe comparativo listo", meta: "hace 1 h" },
  { id: "3", nombre: "Seguimiento de leads", icon: "👥", estado: "building", paso: 3, total: 5, meta: "Paso 3 de 5" },
  { id: "4", nombre: "Control documental", icon: "📄", estado: "ok", rl: "Último resultado", rv: "12 documentos analizados", meta: "hace 45 min" },
];

function StatusDot({ estado }: { estado: "ok" | "pending" | "building" | "done" | "paused" }) {
  const colors = {
    ok: { color: "#1F9D57", bg: "#EAF7F0" },
    pending: { color: "#C8911A", bg: "#FBF3DC" },
    building: { color: "#3B6FC4", bg: "#E9F0FB" },
    done: { color: "#2D3480", bg: "#EEF0FB" },
    paused: { color: "#6B7280", bg: "#F1F2F6" },
  };
  const c = colors[estado];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12.5, fontWeight: 600, color: c.color }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: c.color, boxShadow: `0 0 0 3px ${c.bg}`, display: "inline-block" }} />
      {ESTADO_LABELS[estado] || estado}
    </span>
  );
}

function SolucionCard({ sol, onRevisar }: { sol: SolucionCard; onRevisar: (id: string) => void }) {
  return (
    <div
      draggable
      style={{
        background: "#FFFFFF",
        border: "1px solid #EAECF4",
        borderRadius: 18,
        boxShadow: "0 2px 10px rgba(20,22,46,.05),0 1px 3px rgba(20,22,46,.03)",
        padding: 18,
        cursor: "grab",
        transition: ".2s",
      }}
    >
      <div style={{ width: 42, height: 42, borderRadius: 12, background: "#EEF0FB", border: "1px solid #EEF0FB", display: "grid", placeItems: "center", fontSize: 19, marginBottom: 13 }}>
        {sol.icon}
      </div>
      <div style={{ fontWeight: 700, fontSize: 15.5, color: "#1B1F5A", letterSpacing: "-0.01em", lineHeight: 1.25, minHeight: 38 }}>
        {sol.nombre}
      </div>
      <div style={{ margin: "11px 0 14px" }}>
        <StatusDot estado={sol.estado} />
      </div>
      <hr style={{ border: "none", borderTop: "1px solid #EAECF4", margin: "0 0 12px" }} />
      {sol.estado === "building" ? (
        <>
          <div style={{ fontSize: 11, color: "#9094AC", marginBottom: 3 }}>Progreso</div>
          <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
            {Array.from({ length: sol.total || 5 }, (_, i) => (
              <span key={i} style={{ width: 11, height: 11, borderRadius: "50%", background: i < (sol.paso || 0) ? "#2D3480" : "#DCDFEC", display: "inline-block" }} />
            ))}
          </div>
          <div style={{ fontSize: 12, color: "#9094AC", fontFamily: "monospace" }}>{sol.meta}</div>
        </>
      ) : sol.estado === "pending" ? (
        <>
          <div style={{ fontSize: 11, color: "#9094AC", marginBottom: 3 }}>{sol.rl}</div>
          <div style={{ fontSize: 13.5, color: "#14162E", fontWeight: 600, lineHeight: 1.35 }}>{sol.rv}</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
            <span style={{ fontSize: 12, color: "#9094AC", fontFamily: "monospace" }}>{sol.meta}</span>
            <button
              onClick={() => onRevisar(sol.id)}
              style={{ background: "#1B1F5A", color: "#fff", border: "none", borderRadius: 9, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
            >
              Revisar
            </button>
          </div>
        </>
      ) : (
        <>
          <div style={{ fontSize: 11, color: "#9094AC", marginBottom: 3 }}>{sol.rl}</div>
          <div style={{ fontSize: 13.5, color: "#14162E", fontWeight: 600, lineHeight: 1.35 }}>{sol.rv}</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
            <span style={{ fontSize: 12, color: "#9094AC", fontFamily: "monospace" }}>{sol.meta}</span>
            <Link
              href={`/office/solucion/${sol.id}`}
              style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid #DCDFEC", background: "#FFFFFF", display: "grid", placeItems: "center", color: "#54586F", fontSize: 14, textDecoration: "none", transition: ".15s" }}
            >
              →
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default function OfficePage() {
  const router = useRouter();
  const [soluciones, setSoluciones] = useState<SolucionCard[]>(DEMO_SOLUCIONES);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const fetchSoluciones = useCallback(async () => {
    try {
      const data = await getSolicitudes();
      if (data && data.length > 0) {
        const mapped: SolucionCard[] = data.map((s: Solicitud) => ({
          id: s.id,
          nombre: s.nombre || s.pregunta?.slice(0, 40) || "Solución",
          icon: "⚡",
          estado: mapEstado(s.estado),
          rl: "Último estado",
          rv: s.respuesta || s.estado,
          meta: s.updatedAt ? new Date(s.updatedAt).toLocaleString("es-MX") : "",
        }));
        setSoluciones(mapped);
      }
    } catch {
      // Use demo data on error
    }
  }, []);

  useEffect(() => {
    fetchSoluciones();
    const interval = setInterval(fetchSoluciones, 30000);
    return () => clearInterval(interval);
  }, [fetchSoluciones]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  }

  function handleRevisar(id: string) {
    router.push(`/office/solucion/${id}`);
  }

  return (
    <div style={{ padding: "8px 30px 50px", flex: 1 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24, alignItems: "start", maxWidth: 1560 }}>
        {/* COLUMNA PRINCIPAL */}
        <div>
          {/* HERO BANNER */}
          <div style={{ position: "relative", borderRadius: 22, overflow: "hidden", background: "linear-gradient(120deg,#12153D,#252A78)", padding: "38px 40px", marginBottom: 30, minHeight: 172, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            {/* City SVG */}
            <svg style={{ position: "absolute", right: 36, bottom: 0, top: 0, width: 300, opacity: 0.9, pointerEvents: "none" }} viewBox="0 0 300 180" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="150" cy="95" r="86" stroke="#C9A227" strokeOpacity=".35" strokeWidth="1.5" />
              <circle cx="236" cy="60" r="3" fill="#C9A227" />
              <circle cx="64" cy="120" r="3" fill="#C9A227" />
              <circle cx="150" cy="9" r="3" fill="#C9A227" />
              <rect x="112" y="78" width="34" height="90" rx="2" fill="#2D3480" />
              <rect x="146" y="58" width="40" height="110" rx="2" fill="#3D45A0" />
              <rect x="92" y="100" width="22" height="68" rx="2" fill="#252A78" />
              <rect x="120" y="88" width="5" height="6" fill="#E3C65B" />
              <rect x="131" y="88" width="5" height="6" fill="#E3C65B" />
              <rect x="120" y="102" width="5" height="6" fill="#E3C65B" />
              <rect x="131" y="102" width="5" height="6" fill="#C9A227" />
              <rect x="154" y="70" width="5" height="6" fill="#E3C65B" />
              <rect x="165" y="70" width="5" height="6" fill="#C9A227" />
              <rect x="176" y="70" width="5" height="6" fill="#E3C65B" />
              <rect x="154" y="84" width="5" height="6" fill="#C9A227" />
              <rect x="165" y="84" width="5" height="6" fill="#E3C65B" />
              <rect x="176" y="84" width="5" height="6" fill="#E3C65B" />
            </svg>
            <h2 style={{ color: "#fff", fontSize: 32, fontWeight: 800, letterSpacing: "-0.03em", position: "relative", zIndex: 1 }}>Tu oficina virtual</h2>
            <p style={{ color: "#C6CAEE", fontSize: 15.5, marginTop: 10, maxWidth: 440, position: "relative", zIndex: 1, lineHeight: 1.55 }}>
              Nodematik convierte problemas en soluciones operables. Tú mantienes el control.
            </p>
          </div>

          {/* SOLUCIONES ACTIVAS */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "0 0 16px" }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1B1F5A", letterSpacing: "-0.02em", display: "flex", alignItems: "center", gap: 9 }}>
              <span style={{ width: 26, height: 26, borderRadius: 8, background: "#EEF0FB", display: "grid", placeItems: "center", fontSize: 13 }}><Zap size={13} color="#252A78" /></span>
              Soluciones activas
            </h3>
            <Link href="/office/soluciones" style={{ fontSize: 13.5, color: "#2D3480", fontWeight: 600, textDecoration: "none" }}>Ver todas →</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(232px,1fr))", gap: 16, marginBottom: 32 }}>
            {soluciones.map((sol) => (
              <SolucionCard key={sol.id} sol={sol} onRevisar={handleRevisar} />
            ))}
          </div>

          {/* COMO TRABAJA */}
          <div style={{ background: "#FFFFFF", border: "1px solid #EAECF4", borderRadius: 22, boxShadow: "0 2px 10px rgba(20,22,46,.05)", padding: "26px 28px" }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1B1F5A", marginBottom: 24, letterSpacing: "-0.02em" }}>Como trabaja Nodematik</h3>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", position: "relative" }}>
              <div style={{ position: "absolute", top: 21, left: "8%", right: "8%", height: 2, background: "#DCDFEC", zIndex: 1 }} />
              <div style={{ position: "absolute", top: 21, right: "8%", width: "16%", height: 2, background: "#C9A227", zIndex: 1 }} />
              {[
                { label: "Comprende", desc: "Entiende el problema y los objetivos", done: true },
                { label: "Encuentra fuentes", desc: "Localiza datos y contexto relevante", done: true },
                { label: "Extrae", desc: "Obtiene la información clave", done: true },
                { label: "Analiza", desc: "Detecta patrones y genera insights", done: true },
                { label: "Diseña solución", desc: "Crea una propuesta de solución", done: true },
                { label: "Espera aprobación", desc: "Tú decides que continúa", done: false, last: true },
              ].map((step, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", flex: 1, position: "relative", zIndex: 2 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: "50%", display: "grid", placeItems: "center",
                    fontSize: step.last ? 16 : 16,
                    fontWeight: 700,
                    fontFamily: "monospace",
                    marginBottom: 12,
                    background: step.last ? "#FFFFFF" : "#1B1F5A",
                    color: step.last ? "#A8861C" : "#fff",
                    border: step.last ? "2px solid #C9A227" : "none",
                  }}>
                    {step.last ? "6" : "✓"}
                  </div>
                  <b style={{ fontSize: 13.5, color: "#1B1F5A", fontWeight: 700, marginBottom: 4, lineHeight: 1.2 }}>{step.label}</b>
                  <span style={{ fontSize: 11.5, color: "#9094AC", lineHeight: 1.4, maxWidth: 120, display: "block" }}>{step.desc}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 24, background: "#FBF3D6", borderRadius: 11, padding: "13px 16px", fontSize: 13, color: "#A8861C", display: "flex", alignItems: "center", gap: 9 }}>
              ✦ Nodematik opera 24/7 para ti, con procesos trazables y bajo tu supervisión.
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20, position: "sticky", top: 90 }}>
          {/* APROBACIONES */}
          <div style={{ background: "#FFFFFF", border: "1px solid #EAECF4", borderRadius: 22, boxShadow: "0 2px 10px rgba(20,22,46,.05)", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 14px" }}>
              <h3 style={{ fontSize: 15.5, fontWeight: 700, color: "#1B1F5A", display: "flex", alignItems: "center", gap: 9 }}>
                Aprobaciones pendientes
                <span style={{ fontSize: 11, fontWeight: 700, background: "#C9A227", color: "#070920", minWidth: 20, height: 20, borderRadius: 7, display: "grid", placeItems: "center", padding: "0 5px" }}>2</span>
              </h3>
              <Link href="/office/aprobaciones" style={{ color: "#9094AC", textDecoration: "none", fontSize: 16 }}>→</Link>
            </div>
            <div style={{ margin: "0 16px 16px", border: "1px solid #DCDFEC", borderRadius: 14, padding: 16, background: "#FAFBFE" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 11 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: "#EEF0FB", display: "grid", placeItems: "center", fontSize: 17, flexShrink: 0 }}>📢</div>
                <span style={{ fontSize: 10.5, fontFamily: "monospace", fontWeight: 600, color: "#A8861C", background: "#FBF3D6", padding: "3px 9px", borderRadius: 6, textTransform: "uppercase" as const, letterSpacing: ".04em" }}>Nueva solución propuesta</span>
              </div>
              <h4 style={{ fontSize: 16, fontWeight: 700, color: "#1B1F5A", letterSpacing: "-0.02em", margin: "4px 0 8px" }}>Monitoreo de redes sociales</h4>
              <p style={{ fontSize: 13, color: "#54586F", lineHeight: 1.5, marginBottom: 13 }}>Detecta conversaciones relevantes sobre tu marca en tiempo real y genera alertas con resúmenes automatizados.</p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 7, marginBottom: 16 }}>
                {[
                  "Fuentes: X, LinkedIn, Instagram, TikTok",
                  "Frecuencia: cada 15 minutos",
                  "Entregables: alertas + resumen diario",
                ].map((spec) => (
                  <li key={spec} style={{ fontSize: 12.5, color: "#54586F", display: "flex", gap: 8, alignItems: "baseline" }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#C9A227", flexShrink: 0, display: "inline-block", transform: "translateY(-2px)" }} />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
                <button onClick={() => showToast("Solución aprobada y activada")} style={{ padding: 11, borderRadius: 10, fontWeight: 600, fontSize: 13.5, border: "none", background: "#1B1F5A", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>✓ Aprobar</button>
                <button onClick={() => showToast("Solución rechazada")} style={{ padding: 11, borderRadius: 10, fontWeight: 600, fontSize: 13.5, border: "1px solid #DCDFEC", background: "#FFFFFF", color: "#14162E", cursor: "pointer" }}>✕ Rechazar</button>
              </div>
            </div>
            <div style={{ padding: "0 20px 18px" }}>
              <Link href="/office/aprobaciones" style={{ fontSize: 13, color: "#2D3480", fontWeight: 600, textDecoration: "none" }}>Ver todas las aprobaciones →</Link>
            </div>
          </div>

          {/* RESULTADOS RECIENTES */}
          <div style={{ background: "#FFFFFF", border: "1px solid #EAECF4", borderRadius: 22, boxShadow: "0 2px 10px rgba(20,22,46,.05)", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 14px" }}>
              <h3 style={{ fontSize: 15.5, fontWeight: 700, color: "#1B1F5A" }}>Resultados recientes</h3>
              <Link href="/office/resultados" style={{ fontSize: 13, color: "#2D3480", fontWeight: 600, textDecoration: "none" }}>Ver todos →</Link>
            </div>
            {[
              { icon: "🛡", title: "Alerta de reputación", sub: "3 menciones detectadas sobre tu marca", time: "hace 18 min" },
              { icon: "📊", title: "Reporte de competencia", sub: "Análisis de precios y campañas Q2", time: "hace 1 h" },
              { icon: "👥", title: "Resumen ejecutivo", sub: "Leads calificados esta semana", time: "hace 2 h" },
              { icon: "📄", title: "Análisis documental", sub: "12 documentos procesados", time: "hace 3 h" },
            ].map((r) => (
              <div key={r.title} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "13px 20px", borderTop: "1px solid #EAECF4", transition: ".15s", cursor: "pointer" }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: "#EEF0FB", display: "grid", placeItems: "center", fontSize: 15, flexShrink: 0 }}>{r.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1B1F5A" }}>{r.title}</div>
                  <div style={{ fontSize: 12, color: "#9094AC", marginTop: 1 }}>{r.sub}</div>
                </div>
                <span style={{ fontSize: 11, color: "#9094AC", fontFamily: "monospace", whiteSpace: "nowrap" }}>{r.time}</span>
              </div>
            ))}
            <div style={{ padding: "14px 20px 18px", borderTop: "1px solid #EAECF4" }}>
              <Link href="/office/resultados" style={{ fontSize: 13, color: "#2D3480", fontWeight: 600, textDecoration: "none" }}>Ir a resultados →</Link>
            </div>
          </div>
        </div>
      </div>

      {/* TOAST */}
      {toast && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "#12153D", color: "#fff", padding: "12px 20px", borderRadius: 11, fontSize: 14, fontWeight: 500, boxShadow: "0 40px 90px rgba(27,31,90,.24)", zIndex: 200, display: "flex", alignItems: "center", gap: 9 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#D4AF37", display: "inline-block" }} />
          {toast}
        </div>
      )}
    </div>
  );
}
