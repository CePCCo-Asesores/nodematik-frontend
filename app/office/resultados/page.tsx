"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getSolicitudes } from "@/lib/api";
import type { Solicitud } from "@/lib/types";
import { RefreshCw, ExternalLink } from "lucide-react";

const ICONS = ["⚡", "🛡", "📊", "👥", "📄", "🔍", "🤖", "📈", "🔒", "💡"];
function pickIcon(id: string) {
  const hash = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return ICONS[hash % ICONS.length];
}

function relTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "hace un momento";
  if (m < 60) return `hace ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `hace ${h} h`;
  return `hace ${Math.floor(h / 24)} días`;
}

export default function ResultadosPage() {
  const [resultados, setResultados] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async (silent = false) => {
    if (silent) setRefreshing(true);
    try {
      const all = await getSolicitudes();
      const done = (all ?? []).filter((s) =>
        ["lista", "done", "completado", "operando", "ok"].includes(s.estado)
      );
      // Most recent first
      done.sort((a, b) => {
        const ta = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const tb = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return tb - ta;
      });
      setResultados(done);
    } catch {
      // keep
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const iv = setInterval(() => fetchData(true), 30000);
    return () => clearInterval(iv);
  }, [fetchData]);

  return (
    <div style={{ flex: 1, padding: "28px 30px 50px", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1B1F5A", letterSpacing: "-0.03em" }}>Resultados</h1>
          <p style={{ fontSize: 14, color: "#54586F", marginTop: 4 }}>
            Soluciones completadas y sus entregables
          </p>
        </div>
        <button
          onClick={() => fetchData(true)}
          disabled={refreshing}
          style={{ padding: "9px 14px", borderRadius: 9, border: "1px solid #DCDFEC", background: "#fff", color: "#54586F", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit" }}
        >
          <RefreshCw size={14} style={{ animation: refreshing ? "spin .8s linear infinite" : "none" }} />
          Actualizar
        </button>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
          <div style={{ width: 32, height: 32, border: "3px solid #EAECF4", borderTopColor: "#1B1F5A", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
        </div>
      ) : resultados.length === 0 ? (
        <div style={{ textAlign: "center", padding: "70px 20px", background: "#fff", borderRadius: 20, border: "1px solid #EAECF4" }}>
          <div style={{ fontSize: 44, marginBottom: 16 }}>📊</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1B1F5A", marginBottom: 8 }}>Sin resultados todavía</h3>
          <p style={{ fontSize: 14, color: "#9094AC", marginBottom: 20 }}>
            Los resultados aparecen cuando una solución completa su ejecución.
          </p>
          <Link href="/office/nueva-solucion" style={{ padding: "11px 22px", borderRadius: 11, background: "#1B1F5A", color: "#fff", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
            Crear solución
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {resultados.map((s) => (
            <div key={s.id} style={{ background: "#fff", border: "1px solid #EAECF4", borderRadius: 20, padding: 24, boxShadow: "0 2px 10px rgba(20,22,46,.05)", display: "grid", gridTemplateColumns: "48px 1fr auto", gap: 18, alignItems: "flex-start" }}>
              {/* Icon */}
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "#EEF0FB", display: "grid", placeItems: "center", fontSize: 22, flexShrink: 0 }}>
                {pickIcon(s.id)}
              </div>

              {/* Content */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1B1F5A", letterSpacing: "-0.01em" }}>
                    {s.nombre || s.pregunta?.slice(0, 70) || "Solución"}
                    {(s.pregunta?.length ?? 0) > 70 && "…"}
                  </h3>
                  <span style={{ fontSize: 11, fontWeight: 700, background: "#EAF7F0", color: "#1F9D57", padding: "3px 9px", borderRadius: 6 }}>
                    Completada
                  </span>
                </div>
                {/* Problem */}
                <p style={{ fontSize: 13.5, color: "#54586F", marginBottom: s.respuesta ? 12 : 0, lineHeight: 1.5 }}>
                  <span style={{ fontWeight: 600, color: "#9094AC" }}>Problema: </span>
                  {s.pregunta}
                </p>
                {/* Result */}
                {s.respuesta && (
                  <div style={{ background: "#F7F8FC", border: "1px solid #EAECF4", borderRadius: 12, padding: "12px 16px" }}>
                    <div style={{ fontSize: 11, fontFamily: "monospace", color: "#9094AC", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 6 }}>Resultado</div>
                    <p style={{ fontSize: 14, color: "#14162E", lineHeight: 1.6 }}>{s.respuesta}</p>
                  </div>
                )}
                {/* Meta */}
                <div style={{ display: "flex", gap: 16, marginTop: 12, fontSize: 12, color: "#9094AC", fontFamily: "monospace" }}>
                  <span>ID: {s.id.slice(0, 14)}…</span>
                  {s.updatedAt && <span>{relTime(s.updatedAt)}</span>}
                </div>
              </div>

              {/* Action */}
              <Link
                href={`/office/solucion/${s.id}`}
                style={{ padding: "9px 16px", borderRadius: 10, border: "1px solid #DCDFEC", background: "#FAFBFE", color: "#1B1F5A", fontSize: 13, fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 6, flexShrink: 0, whiteSpace: "nowrap" }}
              >
                <ExternalLink size={13} /> Ver detalle
              </Link>
            </div>
          ))}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
