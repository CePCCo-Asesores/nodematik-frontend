"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getSolicitudes } from "@/lib/api";
import type { Solicitud } from "@/lib/types";
import { RefreshCw, Plus } from "lucide-react";

type Filter = "todas" | "activas" | "aprobacion" | "completadas";

const FILTER_LABELS: Record<Filter, string> = {
  todas: "Todas",
  activas: "Activas",
  aprobacion: "En revisión",
  completadas: "Completadas",
};

function mapEstado(estado: string): "ok" | "pending" | "building" | "done" | "paused" | "error" {
  if (["operando", "ok"].includes(estado)) return "ok";
  if (["esperando_aprobacion", "pending"].includes(estado)) return "pending";
  if (["construyendo", "building", "procesando", "pendiente"].includes(estado)) return "building";
  if (["lista", "done", "completado"].includes(estado)) return "done";
  if (["error"].includes(estado)) return "error";
  return "paused";
}

const STATUS_CONFIG = {
  ok:       { label: "Operando",            color: "#1F9D57", bg: "#EAF7F0", dot: "#1F9D57" },
  pending:  { label: "Esperando aprobación", color: "#C8911A", bg: "#FBF3DC", dot: "#C8911A" },
  building: { label: "Procesando",          color: "#3B6FC4", bg: "#E9F0FB", dot: "#3B6FC4" },
  done:     { label: "Completada",          color: "#2D3480", bg: "#EEF0FB", dot: "#2D3480" },
  paused:   { label: "En pausa",            color: "#9094AC", bg: "#F1F2F6", dot: "#9094AC" },
  error:    { label: "Error",              color: "#D94F4F", bg: "#FDE9E9", dot: "#D94F4F" },
};

const ICONS = ["⚡", "🛡", "📊", "👥", "📄", "🔍", "🤖", "📈", "🔒", "💡"];

function pickIcon(id: string) {
  const hash = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return ICONS[hash % ICONS.length];
}

function matchFilter(s: Solicitud, f: Filter) {
  const e = mapEstado(s.estado);
  if (f === "todas") return true;
  if (f === "activas") return e === "ok" || e === "building";
  if (f === "aprobacion") return e === "pending";
  if (f === "completadas") return e === "done";
  return true;
}

export default function SolucionesPage() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("todas");
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async (silent = false) => {
    if (silent) setRefreshing(true);
    try {
      const data = await getSolicitudes();
      setSolicitudes(data ?? []);
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

  const filtered = solicitudes.filter((s) => matchFilter(s, filter));

  return (
    <div style={{ flex: 1, padding: "28px 30px 50px", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1B1F5A", letterSpacing: "-0.03em" }}>Soluciones</h1>
          <p style={{ fontSize: 14, color: "#54586F", marginTop: 4 }}>
            {solicitudes.length} solución{solicitudes.length !== 1 ? "es" : ""} en total
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            style={{ padding: "9px 14px", borderRadius: 9, border: "1px solid #DCDFEC", background: "#fff", color: "#54586F", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit" }}
          >
            <RefreshCw size={14} style={{ animation: refreshing ? "spin .8s linear infinite" : "none" }} />
            Actualizar
          </button>
          <Link
            href="/office/nueva-solucion"
            style={{ padding: "9px 16px", borderRadius: 9, background: "#1B1F5A", color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 6, boxShadow: "0 4px 12px rgba(27,31,90,.22)" }}
          >
            <Plus size={14} /> Nueva solución
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 4, background: "#F7F8FC", border: "1px solid #EAECF4", borderRadius: 12, padding: 4, marginBottom: 24, width: "fit-content" }}>
        {(["todas", "activas", "aprobacion", "completadas"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "8px 16px",
              borderRadius: 9,
              border: "none",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: ".15s",
              background: filter === f ? "#fff" : "transparent",
              color: filter === f ? "#1B1F5A" : "#9094AC",
              boxShadow: filter === f ? "0 1px 4px rgba(20,22,46,.08)" : "none",
              fontFamily: "inherit",
            }}
          >
            {FILTER_LABELS[f]}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
          <div style={{ width: 32, height: 32, border: "3px solid #EAECF4", borderTopColor: "#1B1F5A", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "70px 20px", background: "#fff", borderRadius: 20, border: "1px solid #EAECF4" }}>
          <div style={{ fontSize: 44, marginBottom: 16 }}>🔍</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1B1F5A", marginBottom: 8 }}>
            {filter === "todas" ? "Aún no tienes soluciones" : `No hay soluciones en "${FILTER_LABELS[filter]}"`}
          </h3>
          <p style={{ fontSize: 14, color: "#9094AC", marginBottom: 20 }}>
            {filter === "todas" ? "Crea tu primera solución para empezar." : "Prueba con otro filtro."}
          </p>
          {filter === "todas" && (
            <Link href="/office/nueva-solucion" style={{ padding: "11px 22px", borderRadius: 11, background: "#1B1F5A", color: "#fff", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
              Crear solución
            </Link>
          )}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 18 }}>
          {filtered.map((s) => {
            const estado = mapEstado(s.estado);
            const sc = STATUS_CONFIG[estado];
            return (
              <Link
                key={s.id}
                href={`/office/solucion/${s.id}`}
                style={{ background: "#fff", border: "1px solid #EAECF4", borderRadius: 20, padding: 20, textDecoration: "none", color: "inherit", boxShadow: "0 2px 10px rgba(20,22,46,.05)", transition: ".2s", display: "flex", flexDirection: "column", gap: 0 }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(20,22,46,.12)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 10px rgba(20,22,46,.05)"; (e.currentTarget as HTMLElement).style.transform = ""; }}
              >
                {/* Icon */}
                <div style={{ width: 44, height: 44, borderRadius: 13, background: "#EEF0FB", display: "grid", placeItems: "center", fontSize: 20, marginBottom: 14 }}>
                  {pickIcon(s.id)}
                </div>
                {/* Name */}
                <div style={{ fontWeight: 700, fontSize: 15, color: "#1B1F5A", lineHeight: 1.3, marginBottom: 10, minHeight: 42 }}>
                  {s.nombre || s.pregunta?.slice(0, 55) || "Solución"}
                  {(s.pregunta?.length ?? 0) > 55 && "…"}
                </div>
                {/* Status */}
                <div style={{ display: "inline-flex", alignItems: "center", gap: 7, marginBottom: 14 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: sc.dot, display: "inline-block" }} />
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: sc.color }}>{sc.label}</span>
                </div>
                <hr style={{ border: "none", borderTop: "1px solid #EAECF4", margin: "0 0 12px" }} />
                {/* Meta */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11.5, color: "#9094AC", fontFamily: "monospace" }}>
                    {s.updatedAt ? new Date(s.updatedAt).toLocaleDateString("es-MX") : "—"}
                  </span>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: "#2D3480" }}>Ver →</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
