"use client";

import { useState, useEffect, useCallback } from "react";
import { getSolicitudes, getLoop, postAprobacion } from "@/lib/api";
import type { Solicitud } from "@/lib/types";
import { RefreshCw, Play, Pause } from "lucide-react";

interface LoopRow {
  id: string;
  nombre: string;
  estado: "activo" | "pausado" | "error";
  proxima?: string;
  fallos: number;
  solicitudId: string;
}

export default function LoopsPage() {
  const [loops, setLoops] = useState<LoopRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [acting, setActing] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const solicitudes = await getSolicitudes();
      const activas: Solicitud[] = (solicitudes ?? []).filter((s) => !!s.loopId);
      // Enrich with loop data where available
      const rows: LoopRow[] = await Promise.all(
        activas.map(async (s) => {
          try {
            const loop = await getLoop(s.id) as { id?: string; estado?: string; proxima?: string; fallos?: number };
            return {
              id: loop?.id ?? s.id,
              nombre: s.nombre || s.problema?.slice(0, 50) || "Loop",
              estado: loop?.estado === "pausado" ? "pausado" : loop?.estado === "error" ? "error" : "activo",
              proxima: loop?.proxima,
              fallos: loop?.fallos ?? 0,
              solicitudId: s.id,
            } as LoopRow;
          } catch {
            return {
              id: s.id,
              nombre: s.nombre || s.problema?.slice(0, 50) || "Solución",
              estado: ["operando", "ok"].includes(s.estado) ? "activo" : "pausado",
              fallos: 0,
              solicitudId: s.id,
            } as LoopRow;
          }
        })
      );
      setLoops(rows);
    } catch {
      // keep
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const iv = setInterval(fetchData, 30000);
    return () => clearInterval(iv);
  }, [fetchData]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  }

  async function handleToggle(loop: LoopRow) {
    setActing(loop.id);
    try {
      const ok = loop.estado !== "activo";
      await postAprobacion(loop.id, { ok, accion: ok ? "continuar" : "pausar" });
      setLoops((prev) =>
        prev.map((l) =>
          l.id === loop.id ? { ...l, estado: ok ? "activo" : "pausado" } : l
        )
      );
      showToast(ok ? "Loop activado" : "Loop pausado");
    } catch {
      showToast("No se pudo actualizar el loop");
    } finally {
      setActing(null);
    }
  }

  const estadoConfig = {
    activo:  { label: "Activo",  color: "#1F9D57", bg: "#EAF7F0" },
    pausado: { label: "Pausado", color: "#9094AC", bg: "#F1F2F6" },
    error:   { label: "Error",   color: "#D94F4F", bg: "#FDE9E9" },
  };

  return (
    <div style={{ flex: 1, padding: "28px 30px 50px", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1B1F5A", letterSpacing: "-0.03em" }}>Loops</h1>
          <p style={{ fontSize: 14, color: "#54586F", marginTop: 4 }}>
            Soluciones en ejecución continua — se repiten automáticamente
          </p>
        </div>
        <button
          onClick={() => { setLoading(true); fetchData(); }}
          style={{ padding: "9px 14px", borderRadius: 9, border: "1px solid #DCDFEC", background: "#fff", color: "#54586F", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit" }}
        >
          <RefreshCw size={14} /> Actualizar
        </button>
      </div>

      {/* Explainer */}
      <div style={{ background: "#EEF0FB", border: "1px solid #C6CAEE", borderRadius: 14, padding: "14px 18px", fontSize: 13.5, color: "#2D3480", marginBottom: 28, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 18 }}>↻</span>
        <span>Los loops son soluciones que se ejecutan periódicamente. Puedes pausarlos o reactivarlos en cualquier momento.</span>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
          <div style={{ width: 32, height: 32, border: "3px solid #EAECF4", borderTopColor: "#1B1F5A", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
        </div>
      ) : loops.length === 0 ? (
        <div style={{ textAlign: "center", padding: "70px 20px", background: "#fff", borderRadius: 20, border: "1px solid #EAECF4" }}>
          <div style={{ fontSize: 44, marginBottom: 16 }}>↻</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1B1F5A", marginBottom: 8 }}>No hay loops activos</h3>
          <p style={{ fontSize: 14, color: "#9094AC" }}>
            Cuando una solución se configure como loop continuo, aparecerá aquí.
          </p>
        </div>
      ) : (
        <div style={{ background: "#fff", border: "1px solid #EAECF4", borderRadius: 20, overflow: "hidden", boxShadow: "0 2px 10px rgba(20,22,46,.05)" }}>
          {/* Header row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 160px 80px 130px", padding: "12px 20px", borderBottom: "1px solid #EAECF4", background: "#FAFBFE" }}>
            {["Loop", "Estado", "Próx. ejecución", "Fallos", "Acción"].map((h) => (
              <span key={h} style={{ fontSize: 11.5, fontWeight: 600, color: "#9094AC", textTransform: "uppercase", letterSpacing: ".04em", fontFamily: "monospace" }}>{h}</span>
            ))}
          </div>
          {loops.map((loop) => {
            const sc = estadoConfig[loop.estado];
            return (
              <div
                key={loop.id}
                style={{ display: "grid", gridTemplateColumns: "1fr 120px 160px 80px 130px", padding: "16px 20px", borderTop: "1px solid #EAECF4", alignItems: "center" }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14.5, color: "#1B1F5A", marginBottom: 2 }}>{loop.nombre}</div>
                  <div style={{ fontSize: 11.5, color: "#9094AC", fontFamily: "monospace" }}>ID: {loop.id.slice(0, 14)}…</div>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 7, color: sc.color, background: sc.bg, display: "inline-block", width: "fit-content" }}>
                  {sc.label}
                </span>
                <span style={{ fontSize: 12.5, color: "#9094AC", fontFamily: "monospace" }}>
                  {loop.proxima ?? "—"}
                </span>
                <span style={{ fontSize: 14, fontWeight: 700, color: loop.fallos > 0 ? "#FF6B6B" : "#9094AC" }}>
                  {loop.fallos}
                </span>
                <button
                  onClick={() => handleToggle(loop)}
                  disabled={acting === loop.id}
                  style={{ padding: "8px 14px", borderRadius: 9, border: "1px solid #DCDFEC", background: "#fff", color: loop.estado === "activo" ? "#9094AC" : "#1F9D57", fontSize: 13, fontWeight: 600, cursor: acting === loop.id ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 6, opacity: acting === loop.id ? 0.6 : 1, fontFamily: "inherit" }}
                >
                  {loop.estado === "activo" ? <Pause size={13} /> : <Play size={13} />}
                  {loop.estado === "activo" ? "Pausar" : "Activar"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {toast && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "#12153D", color: "#fff", padding: "12px 20px", borderRadius: 11, fontSize: 14, fontWeight: 500, zIndex: 200, display: "flex", alignItems: "center", gap: 9 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#34D17F", display: "inline-block" }} />
          {toast}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
