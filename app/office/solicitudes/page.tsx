"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSolicitudes } from "@/lib/api";
import type { Solicitud } from "@/lib/types";
import { Search, RefreshCw, ChevronRight } from "lucide-react";

type Tab = "todas" | "proceso" | "aprobacion" | "completadas";

const TAB_LABELS: Record<Tab, string> = {
  todas: "Todas",
  proceso: "En proceso",
  aprobacion: "Esperando aprobación",
  completadas: "Completadas",
};

const ESTADO_DISPLAY: Record<string, { label: string; color: string; bg: string }> = {
  pendiente:             { label: "Pendiente",            color: "#3B6FC4", bg: "#E9F0FB" },
  procesando:            { label: "Procesando",           color: "#3B6FC4", bg: "#E9F0FB" },
  construyendo:          { label: "Construyendo",         color: "#3B6FC4", bg: "#E9F0FB" },
  esperando_aprobacion:  { label: "Esperando aprobación", color: "#C8911A", bg: "#FBF3DC" },
  pending:               { label: "Esperando aprobación", color: "#C8911A", bg: "#FBF3DC" },
  operando:              { label: "Operando",             color: "#1F9D57", bg: "#EAF7F0" },
  ok:                    { label: "Operando",             color: "#1F9D57", bg: "#EAF7F0" },
  lista:                 { label: "Lista",                color: "#2D3480", bg: "#EEF0FB" },
  done:                  { label: "Lista",                color: "#2D3480", bg: "#EEF0FB" },
  completado:            { label: "Completada",           color: "#2D3480", bg: "#EEF0FB" },
  error:                 { label: "Error",                color: "#D94F4F", bg: "#FDE9E9" },
};

function estadoStyle(estado: string) {
  return ESTADO_DISPLAY[estado] ?? { label: estado, color: "#9094AC", bg: "#F1F2F6" };
}

function matchTab(s: Solicitud, tab: Tab) {
  if (tab === "todas") return true;
  if (tab === "proceso") return ["pendiente", "procesando", "construyendo"].includes(s.estado);
  if (tab === "aprobacion") return ["esperando_aprobacion", "pending"].includes(s.estado);
  if (tab === "completadas") return ["lista", "done", "completado", "operando", "ok"].includes(s.estado);
  return true;
}

export default function SolicitudesPage() {
  const router = useRouter();
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState<Tab>("todas");
  const [query, setQuery] = useState("");

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const data = await getSolicitudes();
      setSolicitudes(data ?? []);
    } catch {
      // keep existing
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

  const filtered = solicitudes.filter((s) => {
    if (!matchTab(s, tab)) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      s.id.toLowerCase().includes(q) ||
      s.pregunta?.toLowerCase().includes(q) ||
      s.nombre?.toLowerCase().includes(q) ||
      s.estado.toLowerCase().includes(q)
    );
  });

  const countTab = (t: Tab) => solicitudes.filter((s) => matchTab(s, t)).length;

  return (
    <div style={{ flex: 1, padding: "28px 30px 50px", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1B1F5A", letterSpacing: "-0.03em" }}>Solicitudes</h1>
          <p style={{ fontSize: 14, color: "#54586F", marginTop: 4 }}>
            Todas las solicitudes de soluciones de tu organización
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            style={{ padding: "9px 14px", borderRadius: 9, border: "1px solid #DCDFEC", background: "#fff", color: "#54586F", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
          >
            <RefreshCw size={14} style={{ animation: refreshing ? "spin .8s linear infinite" : "none" }} />
            Actualizar
          </button>
          <Link
            href="/office/nueva-solucion"
            style={{ padding: "9px 16px", borderRadius: 9, background: "#1B1F5A", color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 6, boxShadow: "0 4px 12px rgba(27,31,90,.22)" }}
          >
            + Nueva solicitud
          </Link>
        </div>
      </div>

      {/* Tabs + Search */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 4, background: "#F7F8FC", border: "1px solid #EAECF4", borderRadius: 12, padding: 4 }}>
          {(["todas", "proceso", "aprobacion", "completadas"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "8px 14px",
                borderRadius: 9,
                border: "none",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                transition: ".15s",
                background: tab === t ? "#fff" : "transparent",
                color: tab === t ? "#1B1F5A" : "#9094AC",
                boxShadow: tab === t ? "0 1px 4px rgba(20,22,46,.08)" : "none",
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "inherit",
              }}
            >
              {TAB_LABELS[t]}
              {t !== "todas" && (
                <span style={{ fontSize: 11, fontWeight: 700, background: tab === t ? "#EEF0FB" : "#EAECF4", color: tab === t ? "#1B1F5A" : "#9094AC", borderRadius: 6, padding: "1px 6px" }}>
                  {countTab(t)}
                </span>
              )}
            </button>
          ))}
        </div>
        <div style={{ position: "relative", flex: 1, maxWidth: 340 }}>
          <Search size={14} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#9094AC" }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre o ID..."
            style={{ width: "100%", paddingLeft: 36, paddingRight: 14, paddingTop: 10, paddingBottom: 10, borderRadius: 10, border: "1px solid #DCDFEC", background: "#fff", fontSize: 14, color: "#14162E", outline: "none", fontFamily: "inherit" }}
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
          <div style={{ width: 32, height: 32, border: "3px solid #EAECF4", borderTopColor: "#1B1F5A", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", background: "#fff", borderRadius: 20, border: "1px solid #EAECF4" }}>
          <div style={{ fontSize: 36, marginBottom: 14 }}>📭</div>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1B1F5A", marginBottom: 8 }}>
            {query ? "Sin resultados para esa búsqueda" : "No hay solicitudes aún"}
          </h3>
          <p style={{ fontSize: 14, color: "#9094AC", marginBottom: 20 }}>
            {query ? "Intenta con otros términos." : "Crea tu primera solicitud describiendo el problema que quieres resolver."}
          </p>
          {!query && (
            <Link href="/office/nueva-solucion" style={{ padding: "11px 22px", borderRadius: 11, background: "#1B1F5A", color: "#fff", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
              Nueva solicitud
            </Link>
          )}
        </div>
      ) : (
        <div style={{ background: "#fff", border: "1px solid #EAECF4", borderRadius: 20, overflow: "hidden", boxShadow: "0 2px 10px rgba(20,22,46,.05)" }}>
          {/* Table header */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 160px 160px 140px 48px", gap: 0, padding: "12px 20px", borderBottom: "1px solid #EAECF4", background: "#FAFBFE" }}>
            {["Solicitud", "Estado", "Creada", "Actualizada", ""].map((h) => (
              <span key={h} style={{ fontSize: 11.5, fontWeight: 600, color: "#9094AC", textTransform: "uppercase", letterSpacing: ".04em", fontFamily: "monospace" }}>{h}</span>
            ))}
          </div>
          {filtered.map((s) => {
            const st = estadoStyle(s.estado);
            return (
              <div
                key={s.id}
                onClick={() => router.push(`/office/solucion/${s.id}`)}
                style={{ display: "grid", gridTemplateColumns: "1fr 160px 160px 140px 48px", gap: 0, padding: "16px 20px", borderTop: "1px solid #EAECF4", cursor: "pointer", transition: ".15s", alignItems: "center" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFBFE")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "")}
              >
                {/* Name */}
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14.5, color: "#1B1F5A", marginBottom: 3 }}>
                    {s.nombre || s.pregunta?.slice(0, 60) || "Solicitud"}
                    {(s.pregunta?.length ?? 0) > 60 && "…"}
                  </div>
                  <div style={{ fontSize: 11.5, color: "#9094AC", fontFamily: "monospace" }}>ID: {s.id.slice(0, 16)}…</div>
                </div>
                {/* Estado */}
                <span style={{ fontSize: 12, fontWeight: 600, padding: "4px 11px", borderRadius: 7, display: "inline-block", color: st.color, background: st.bg, width: "fit-content" }}>
                  {st.label}
                </span>
                {/* Creada */}
                <span style={{ fontSize: 12.5, color: "#9094AC", fontFamily: "monospace" }}>
                  {s.createdAt ? new Date(s.createdAt).toLocaleString("es-MX", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : "—"}
                </span>
                {/* Actualizada */}
                <span style={{ fontSize: 12.5, color: "#9094AC", fontFamily: "monospace" }}>
                  {s.updatedAt ? new Date(s.updatedAt).toLocaleString("es-MX", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : "—"}
                </span>
                {/* Arrow */}
                <ChevronRight size={16} color="#DCDFEC" />
              </div>
            );
          })}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
