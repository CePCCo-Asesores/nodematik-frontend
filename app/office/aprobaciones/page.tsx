"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getSolicitudes, aprobacionSolicitud } from "@/lib/api";
import type { Solicitud } from "@/lib/types";
import { CheckCircle, XCircle, ExternalLink, RefreshCw } from "lucide-react";

type Action = { id: string; type: "approve" | "reject" };

export default function AprobacionesPage() {
  const router = useRouter();
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState<Action | null>(null);
  const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const all = await getSolicitudes();
      setSolicitudes((all ?? []).filter((s) => ["esperando_aprobacion", "pending"].includes(s.estado)));
    } catch {
      // keep
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const iv = setInterval(fetchData, 20000);
    return () => clearInterval(iv);
  }, [fetchData]);

  function showToast(text: string, ok: boolean) {
    setToast({ text, ok });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleAction(sol: Solicitud, type: "approve" | "reject") {
    setPending({ id: sol.id, type });
    try {
      await aprobacionSolicitud(sol.id, type === "approve");
      showToast(
        type === "approve" ? "Solución aprobada y activada" : "Solución rechazada",
        type === "approve"
      );
      setSolicitudes((prev) => prev.filter((s) => s.id !== sol.id));
    } catch {
      showToast("No se pudo procesar. Intenta de nuevo.", false);
    } finally {
      setPending(null);
    }
  }

  return (
    <div style={{ flex: 1, padding: "28px 30px 50px", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1B1F5A", letterSpacing: "-0.03em" }}>Aprobaciones</h1>
          <p style={{ fontSize: 14, color: "#54586F", marginTop: 4 }}>
            Soluciones propuestas que requieren tu decisión antes de activarse
          </p>
        </div>
        <button
          onClick={() => { setLoading(true); fetchData(); }}
          style={{ padding: "9px 14px", borderRadius: 9, border: "1px solid #DCDFEC", background: "#fff", color: "#54586F", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit" }}
        >
          <RefreshCw size={14} />
          Actualizar
        </button>
      </div>

      {/* Notice */}
      <div style={{ background: "#FBF3D6", border: "1px solid #E3C65B", borderRadius: 14, padding: "14px 18px", fontSize: 13.5, color: "#A8861C", marginBottom: 28, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 18 }}>⚡</span>
        <span>Ninguna solución opera sin tu aprobación. Revisa cada propuesta antes de activarla.</span>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
          <div style={{ width: 32, height: 32, border: "3px solid #EAECF4", borderTopColor: "#1B1F5A", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
        </div>
      ) : solicitudes.length === 0 ? (
        <div style={{ textAlign: "center", padding: "70px 20px", background: "#fff", borderRadius: 20, border: "1px solid #EAECF4" }}>
          <div style={{ fontSize: 44, marginBottom: 16 }}>✅</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1B1F5A", marginBottom: 8 }}>Todo al día</h3>
          <p style={{ fontSize: 14, color: "#9094AC" }}>No hay solicitudes esperando tu aprobación en este momento.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {solicitudes.map((sol) => (
            <div key={sol.id} style={{ background: "#fff", border: "1px solid #EAECF4", borderRadius: 22, overflow: "hidden", boxShadow: "0 2px 10px rgba(20,22,46,.05)" }}>
              {/* Card header */}
              <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #EAECF4", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 11, fontFamily: "monospace", fontWeight: 700, background: "#FBF3D6", color: "#A8861C", padding: "3px 10px", borderRadius: 7, textTransform: "uppercase", letterSpacing: ".05em" }}>
                      Esperando aprobación
                    </span>
                    <span style={{ fontSize: 11.5, color: "#9094AC", fontFamily: "monospace" }}>ID: {sol.id.slice(0, 16)}…</span>
                  </div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1B1F5A", letterSpacing: "-0.02em" }}>
                    {sol.nombre || sol.problema?.slice(0, 80) || "Solución propuesta"}
                  </h2>
                  {sol.createdAt && (
                    <p style={{ fontSize: 12.5, color: "#9094AC", marginTop: 4, fontFamily: "monospace" }}>
                      Creada: {new Date(sol.createdAt).toLocaleString("es-MX")}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => router.push(`/office/solucion/${sol.id}`)}
                  style={{ padding: "8px 14px", borderRadius: 9, border: "1px solid #DCDFEC", background: "#FAFBFE", color: "#54586F", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, flexShrink: 0, fontFamily: "inherit" }}
                >
                  <ExternalLink size={13} /> Ver detalle
                </button>
              </div>

              {/* Propuesta */}
              <div style={{ padding: "18px 24px" }}>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontFamily: "monospace", color: "#9094AC", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 8 }}>Descripción del problema</div>
                  <p style={{ fontSize: 14.5, color: "#14162E", lineHeight: 1.6, background: "#F7F8FC", border: "1px solid #EAECF4", borderRadius: 12, padding: "14px 16px" }}>
                    {sol.problema}
                  </p>
                </div>
                {sol.respuesta && (
                  <div>
                    <div style={{ fontSize: 11, fontFamily: "monospace", color: "#2D3480", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 8 }}>Solución propuesta</div>
                    <p style={{ fontSize: 14.5, color: "#14162E", lineHeight: 1.6, background: "#EEF0FB", border: "1px solid #C6CAEE", borderRadius: 12, padding: "14px 16px" }}>
                      {sol.respuesta}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ padding: "16px 24px 22px", borderTop: "1px solid #EAECF4", display: "flex", gap: 12, alignItems: "center" }}>
                <button
                  onClick={() => handleAction(sol, "approve")}
                  disabled={pending?.id === sol.id}
                  style={{ padding: "12px 24px", borderRadius: 11, border: "none", background: "#C9A227", color: "#070920", fontWeight: 700, fontSize: 14, cursor: pending?.id === sol.id ? "not-allowed" : "pointer", opacity: pending?.id === sol.id ? 0.65 : 1, display: "flex", alignItems: "center", gap: 7, fontFamily: "inherit", transition: ".16s" }}
                >
                  {pending?.id === sol.id && pending.type === "approve" ? (
                    <div style={{ width: 14, height: 14, border: "2px solid rgba(7,9,32,.3)", borderTopColor: "#070920", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
                  ) : (
                    <CheckCircle size={16} />
                  )}
                  Aprobar y activar
                </button>
                <button
                  onClick={() => handleAction(sol, "reject")}
                  disabled={pending?.id === sol.id}
                  style={{ padding: "12px 24px", borderRadius: 11, border: "1px solid #DCDFEC", background: "#fff", color: "#FF6B6B", fontWeight: 600, fontSize: 14, cursor: pending?.id === sol.id ? "not-allowed" : "pointer", opacity: pending?.id === sol.id ? 0.65 : 1, display: "flex", alignItems: "center", gap: 7, fontFamily: "inherit", transition: ".16s" }}
                >
                  {pending?.id === sol.id && pending.type === "reject" ? (
                    <div style={{ width: 14, height: 14, border: "2px solid rgba(255,107,107,.3)", borderTopColor: "#FF6B6B", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
                  ) : (
                    <XCircle size={16} />
                  )}
                  Rechazar
                </button>
                <span style={{ fontSize: 13, color: "#9094AC", marginLeft: 4 }}>Tu decisión es irreversible.</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "#12153D", color: "#fff", padding: "12px 22px", borderRadius: 11, fontSize: 14, fontWeight: 500, zIndex: 200, display: "flex", alignItems: "center", gap: 9, boxShadow: "0 20px 60px rgba(0,0,0,.35)" }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: toast.ok ? "#34D17F" : "#FF6B6B", display: "inline-block" }} />
          {toast.text}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
