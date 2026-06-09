"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";
import { Search, Bell, HelpCircle, ChevronDown } from "lucide-react";

const navItems = [
  { icon: "■", label: "Resumen", active: true },
  { icon: "🏢", label: "Organizaciones" },
  { icon: "🤖", label: "Bots" },
  { icon: "📄", label: "Solicitudes" },
  { icon: "⚙", label: "FORGE" },
  { icon: "★", label: "Skills" },
  { icon: "🛡", label: "Aprobaciones" },
  { icon: "↻", label: "Loops" },
  { icon: "🔌", label: "Fuentes" },
  { icon: "⚙", label: "Workers y Colas" },
  { icon: "📊", label: "Resultados" },
  { icon: "📝", label: "Auditoría" },
  { icon: "⚙", label: "Configuración" },
];

const KPI_DATA = [
  { icon: "📄", label: "Solicitudes hoy", value: "184", delta: "▲ 21% vs ayer", type: "up" },
  { icon: "🛡", label: "Aprobaciones pendientes", value: "37", delta: "▼ 12% vs ayer", type: "down" },
  { icon: "↻", label: "Loops activos", value: "28", delta: "— 0% vs ayer", type: "flat" },
  { icon: "⚠", label: "Jobs fallidos", value: "7", delta: "▼ 22% vs ayer", type: "down" },
  { icon: "★", label: "Skills aprobados", value: "128", delta: "▲ 18% vs ayer", type: "up" },
  { icon: "💰", label: "Costo LLM estimado", value: "$142.68", delta: "▲ 9% vs ayer", type: "up" },
];

export default function AdminPage() {
  const router = useRouter();
  const [env, setEnv] = useState<"Producción" | "Staging">("Producción");
  const [envMenuOpen, setEnvMenuOpen] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    if (!getToken()) router.push("/auth");
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, [router]);

  const s = (v: string) => ({ style: v });

  return (
    <div style={{ display: "grid", gridTemplateColumns: "230px 1fr", minHeight: "100vh", fontFamily: "var(--font-inter), system-ui, sans-serif", fontSize: 14, WebkitFontSmoothing: "antialiased", background: "#0A0C24", color: "#EEF0FA" }}>
      {/* SIDEBAR */}
      <aside style={{ background: "#080A1F", borderRight: "1px solid #222746", padding: "18px 12px", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh", overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px 24px" }}>
          <Image src="/logo.png" alt="Nodematik" width={32} height={32} style={{ objectFit: "contain", flexShrink: 0 }} />
          <span style={{ fontWeight: 800, fontSize: 19, letterSpacing: "-0.03em", color: "#fff" }}>Nodematik</span>
        </div>
        {navItems.map((item, i) => (
          <button
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 13,
              padding: "10px 13px",
              borderRadius: 10,
              color: item.active ? "#fff" : "#A7ACCB",
              fontSize: 14,
              fontWeight: item.active ? 600 : 500,
              transition: ".15s",
              border: "none",
              background: item.active ? "#1B1F5A" : "none",
              width: "100%",
              textAlign: "left",
              marginBottom: 1,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <span style={{ width: 18, textAlign: "center", fontSize: 15, opacity: 0.85, color: item.active ? "#D4AF37" : "inherit" }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
        <div style={{ marginTop: "auto", borderTop: "1px solid #222746", paddingTop: 8 }}>
          <button style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 13px", color: "#6E739A", fontSize: 13, fontWeight: 500, background: "none", border: "none", width: "100%", cursor: "pointer", fontFamily: "inherit" }}>
            ◀ Colapsar
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div style={{ minWidth: 0, display: "flex", flexDirection: "column" }}>
        {/* TOPBAR */}
        <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "16px 26px", borderBottom: "1px solid #222746", background: "#0E1130", position: "sticky", top: 0, zIndex: 40 }}>
          <h1 style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em", whiteSpace: "nowrap", color: "#EEF0FA" }}>Admin Console</h1>
          {/* Environment switcher */}
          <div
            style={{ display: "flex", alignItems: "center", gap: 8, background: "#11142F", border: "1px solid #2E3458", borderRadius: 9, padding: "7px 13px", fontSize: 13, fontWeight: 600, cursor: "pointer", position: "relative" }}
            onClick={() => setEnvMenuOpen(!envMenuOpen)}
          >
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: env === "Producción" ? "#34D17F" : "#E3B43C", boxShadow: `0 0 8px ${env === "Producción" ? "#34D17F" : "#E3B43C"}`, display: "inline-block" }} />
            <span style={{ color: "#EEF0FA" }}>{env}</span>
            <ChevronDown size={14} color="#A7ACCB" />
            {envMenuOpen && (
              <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, background: "#1B1F42", border: "1px solid #2E3458", borderRadius: 10, boxShadow: "0 8px 28px rgba(0,0,0,.4)", padding: 5, minWidth: 160, zIndex: 50 }}>
                {["Producción", "Staging"].map(opt => (
                  <button
                    key={opt}
                    onClick={e => { e.stopPropagation(); setEnv(opt as "Producción" | "Staging"); setEnvMenuOpen(false); }}
                    style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 12px", borderRadius: 7, fontSize: 13, fontWeight: 500, width: "100%", textAlign: "left", background: "none", border: "none", color: "#EEF0FA", cursor: "pointer", fontFamily: "inherit" }}
                  >
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: opt === "Producción" ? "#34D17F" : "#E3B43C", display: "inline-block" }} />
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Search */}
          <div style={{ flex: 1, maxWidth: 430, position: "relative" }}>
            <Search size={14} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#6E739A" }} />
            <input
              placeholder="Buscar en toda la consola..."
              style={{ width: "100%", background: "#11142F", border: "1px solid #2E3458", borderRadius: 10, padding: "10px 14px 10px 38px", fontFamily: "inherit", fontSize: 14, color: "#EEF0FA", outline: "none" }}
            />
            <span style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", fontFamily: "monospace", fontSize: 11, color: "#6E739A", background: "#1B1F42", border: "1px solid #222746", borderRadius: 5, padding: "2px 6px" }}>⌘K</span>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ position: "relative", width: 38, height: 38, borderRadius: 10, background: "#11142F", border: "1px solid #2E3458", display: "grid", placeItems: "center" }}>
              <Bell size={16} color="#A7ACCB" />
              <span style={{ position: "absolute", top: -5, right: -5, background: "#C9A227", color: "#070920", fontSize: 10, fontWeight: 700, minWidth: 18, height: 18, borderRadius: 9, display: "grid", placeItems: "center", padding: "0 4px", border: "2px solid #0E1130" }}>12</span>
            </div>
            <div style={{ position: "relative", width: 38, height: 38, borderRadius: 10, background: "#11142F", border: "1px solid #2E3458", display: "grid", placeItems: "center", cursor: "pointer" }}>
              <HelpCircle size={16} color="#A7ACCB" />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, paddingLeft: 6 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(145deg,#2D3480,#1B1F5A)", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 13, color: "#E3C65B", fontFamily: "monospace" }}>AD</div>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 700, lineHeight: 1.2, color: "#EEF0FA" }}>Admin</div>
                <div style={{ fontSize: 11.5, color: "#6E739A" }}>Superadministrador</div>
              </div>
              <ChevronDown size={14} color="#6E739A" />
            </div>
          </div>
        </div>

        <div style={{ padding: "22px 26px 40px", overflow: "auto", flex: 1 }}>
          {/* KPI CARDS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 14, marginBottom: 22 }}>
            {KPI_DATA.map((kpi) => (
              <div key={kpi.label} style={{ background: "#11142F", border: "1px solid #222746", borderRadius: 13, padding: 17 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 11, marginBottom: 13 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: "#1B1F42", border: "1px solid #2E3458", display: "grid", placeItems: "center", fontSize: 17, flexShrink: 0 }}>{kpi.icon}</div>
                  <div style={{ fontSize: 12, color: "#A7ACCB", fontWeight: 500, lineHeight: 1.3 }}>{kpi.label}</div>
                </div>
                <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1, color: "#EEF0FA" }}>{kpi.value}</div>
                <div style={{ fontSize: 11.5, fontFamily: "monospace", marginTop: 9, display: "flex", alignItems: "center", gap: 5, color: kpi.type === "up" ? "#34D17F" : kpi.type === "down" ? "#FF6B6B" : "#6E739A" }}>
                  {kpi.delta}
                </div>
              </div>
            ))}
          </div>

          {/* ROW A: Pipeline + Detalle + Skills */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px 380px", gap: 16, marginBottom: 16 }}>
            {/* FORGE Pipeline */}
            <div style={{ background: "#11142F", border: "1px solid #222746", borderRadius: 16, padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <h2 style={{ fontSize: 15.5, fontWeight: 700, letterSpacing: "-0.01em", display: "flex", alignItems: "center", gap: 10, color: "#EEF0FA" }}>
                  Pipeline FORGE
                  <span style={{ fontSize: 11, fontFamily: "monospace", background: "rgba(91,168,227,.13)", color: "#5BA8E3", padding: "3px 9px", borderRadius: 6, fontWeight: 500 }}>Solicitud seleccionada</span>
                </h2>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                <div style={{ fontSize: 21, fontWeight: 800, letterSpacing: "-0.02em", color: "#EEF0FA" }}>SOL-1842</div>
                <div style={{ display: "flex", gap: 18 }}>
                  <span style={{ fontSize: 12, color: "#6E739A" }}>Modo: <b style={{ color: "#A7ACCB" }}>Única</b></span>
                  <span style={{ fontSize: 12, color: "#6E739A" }}>Riesgo: <span style={{ fontSize: 11, fontWeight: 600, background: "rgba(227,180,60,.13)", color: "#E3B43C", padding: "3px 9px", borderRadius: 6 }}>Medio</span></span>
                </div>
              </div>
              <p style={{ fontSize: 13, color: "#A7ACCB", lineHeight: 1.5, marginBottom: 22, maxWidth: 680 }}>Problema: los reportes de inventario presentan diferencias entre el sistema ERP y los archivos subidos por almacenes. Identificar causas y proponer correcciones.</p>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", position: "relative", margin: "6px 0 22px" }}>
                <div style={{ position: "absolute", top: 24, left: "6%", right: "6%", height: 2, background: "#2E3458", zIndex: 1 }} />
                {[
                  { label: "Intake", time: "10:12:01", ok: true },
                  { label: "Sources", time: "10:12:05", ok: true },
                  { label: "Extract", time: "10:12:18", ok: true },
                  { label: "Analyze", time: "10:12:34", ok: true },
                  { label: "Factory", time: "10:12:59", ok: true },
                  { label: "Gate", time: "", ok: false, gate: true },
                  { label: "Loop", time: "", ok: false, todo: true },
                ].map((step, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", flex: 1, position: "relative", zIndex: 2 }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: "50%", display: "grid", placeItems: "center", fontSize: 19, marginBottom: 10,
                      background: step.todo ? "#11142F" : step.gate ? "rgba(227,180,60,.13)" : "#11142F",
                      border: step.todo ? "2px dashed #2E3458" : step.gate ? "2px solid #E3B43C" : "2px solid #34D17F",
                      color: step.todo ? "#6E739A" : step.gate ? "#E3B43C" : "#34D17F",
                    }}>
                      {step.todo ? "↻" : step.gate ? "⏸" : "✓"}
                    </div>
                    <b style={{ fontSize: 13, fontWeight: 600, marginBottom: 3, color: "#EEF0FA" }}>{step.label}</b>
                    {step.time && <span style={{ fontSize: 11, color: "#6E739A", fontFamily: "monospace" }}>{step.time}</span>}
                    <span style={{ fontSize: 11, fontFamily: "monospace", fontWeight: 600, marginTop: 2, color: step.todo ? "#6E739A" : step.gate ? "#E3B43C" : "#34D17F" }}>
                      {step.todo ? "Pendiente" : step.gate ? "Esperando aprobación" : "OK"}
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 26, borderTop: "1px solid #222746", paddingTop: 15, fontSize: 12, color: "#6E739A", flexWrap: "wrap" }}>
                <span>Solicitado por: <b style={{ color: "#A7ACCB" }}>ops@acme.com</b></span>
                <span>Organización: <b style={{ color: "#A7ACCB" }}>ACME Retail</b></span>
                <span>Bot: <b style={{ color: "#A7ACCB" }}>Analista Inventarios</b></span>
                <span>Creado: <b style={{ color: "#A7ACCB" }}>22/05 10:12</b></span>
              </div>
            </div>

            {/* Detalle de solicitud */}
            <div style={{ background: "#11142F", border: "1px solid #222746", borderRadius: 16, padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <h2 style={{ fontSize: 15.5, fontWeight: 700, color: "#EEF0FA" }}>Detalle de solicitud</h2>
              </div>
              {[
                { k: "Estado", v: "◀ En Gate", vStyle: { color: "#E3B43C" } },
                { k: "Organización", v: "ACME Retail" },
                { k: "Bot", v: "Analista Inventarios" },
                { k: "Modo", v: "Única" },
                { k: "Skill generado", v: "reconciliacion_inventario", mono: true },
                { k: "Versión", v: "1.0.0" },
                { k: "Loop asociado", v: "—" },
                { k: "Riesgo", v: "● Medio", vStyle: { color: "#E3B43C" } },
                { k: "Actualizada", v: "22/05 10:14", mono: true },
              ].map(({ k, v, mono, vStyle }) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid #222746", fontSize: 13 }}>
                  <span style={{ color: "#6E739A" }}>{k}</span>
                  <span style={{ fontWeight: 600, color: "#EEF0FA", fontFamily: mono ? "monospace" : "inherit", fontSize: mono ? 12 : 13, ...(vStyle || {}) }}>{v}</span>
                </div>
              ))}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 16 }}>
                <button style={{ padding: 12, borderRadius: 10, fontWeight: 600, fontSize: 13.5, border: "none", background: "#C9A227", color: "#070920", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>✓ Aprobar</button>
                <button style={{ padding: 12, borderRadius: 10, fontWeight: 600, fontSize: 13.5, border: "1px solid #2E3458", background: "#1B1F42", color: "#FF6B6B", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>✕ Rechazar</button>
              </div>
            </div>

            {/* Skills recientes */}
            <div style={{ background: "#11142F", border: "1px solid #222746", borderRadius: 16, padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <h2 style={{ fontSize: 15.5, fontWeight: 700, color: "#EEF0FA" }}>Skills recientes</h2>
                <a href="#" style={{ fontSize: 12.5, color: "#6B72C9", fontWeight: 600, textDecoration: "none" }}>Ver todos</a>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr>
                    {["Skill", "Ver.", "Estado", "Origen"].map(h => (
                      <th key={h} style={{ textAlign: "left", fontSize: 11, fontWeight: 600, color: "#6E739A", textTransform: "uppercase", letterSpacing: ".04em", padding: "0 10px 11px", fontFamily: "monospace" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { skill: "reconciliacion_inventario", ver: "1.0.0", estado: "warn", origen: "✨ Nuevo" },
                    { skill: "normalizacion_productos", ver: "2.1.0", estado: "ok", origen: "↻ Reutilizado" },
                    { skill: "clasificacion_proveedores", ver: "1.3.0", estado: "ok", origen: "↻ Reutilizado" },
                    { skill: "deteccion_anomalias_stock", ver: "1.0.1", estado: "ok", origen: "✨ Nuevo" },
                    { skill: "validacion_precios", ver: "2.0.0", estado: "warn", origen: "↻ Reutilizado" },
                  ].map((row) => (
                    <tr key={row.skill}>
                      <td style={{ padding: "11px 10px", borderTop: "1px solid #222746", fontFamily: "monospace", fontSize: 12.5 }}>{row.skill}</td>
                      <td style={{ padding: "11px 10px", borderTop: "1px solid #222746", fontFamily: "monospace", fontSize: 12.5 }}>{row.ver}</td>
                      <td style={{ padding: "11px 10px", borderTop: "1px solid #222746" }}>
                        <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 6, display: "inline-block", background: row.estado === "ok" ? "rgba(52,209,127,.13)" : "rgba(227,180,60,.13)", color: row.estado === "ok" ? "#34D17F" : "#E3B43C" }}>
                          {row.estado === "ok" ? "Aprobado" : "Pendiente"}
                        </span>
                      </td>
                      <td style={{ padding: "11px 10px", borderTop: "1px solid #222746", fontSize: 12, color: "#6B72C9", fontWeight: 500 }}>{row.origen}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ROW B: Loops + Workers + Fuentes/Auditoría */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 360px", gap: 16, marginBottom: 16 }}>
            {/* Loops */}
            <div style={{ background: "#11142F", border: "1px solid #222746", borderRadius: 16, padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <h2 style={{ fontSize: 15.5, fontWeight: 700, color: "#EEF0FA" }}>Loops y operación</h2>
                <a href="#" style={{ fontSize: 12.5, color: "#6B72C9", fontWeight: 600, textDecoration: "none" }}>Ver todos</a>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr>
                    {["Loop", "Estado", "Próxima ejec.", "Fallos", "Adapt."].map(h => (
                      <th key={h} style={{ textAlign: "left", fontSize: 11, fontWeight: 600, color: "#6E739A", textTransform: "uppercase", letterSpacing: ".04em", padding: "0 10px 11px", fontFamily: "monospace" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { loop: "loop_inventarios", estado: "ok", prox: "10:30", fallos: 0, adapt: "warn" },
                    { loop: "loop_precios", estado: "ok", prox: "10:12", fallos: 1, adapt: "line" },
                    { loop: "loop_compras", estado: "paused", prox: "11:00", fallos: 0, adapt: "line" },
                    { loop: "loop_proveedores", estado: "ok", prox: "10:45", fallos: 0, adapt: "warn" },
                    { loop: "loop_ventas", estado: "ok", prox: "10:05", fallos: 2, adapt: "warn" },
                  ].map(row => (
                    <tr key={row.loop}>
                      <td style={{ padding: "11px 10px", borderTop: "1px solid #222746", fontFamily: "monospace", fontSize: 12.5 }}>{row.loop}</td>
                      <td style={{ padding: "11px 10px", borderTop: "1px solid #222746" }}>
                        <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 6, display: "inline-block", background: row.estado === "ok" ? "rgba(52,209,127,.13)" : "rgba(138,144,180,.13)", color: row.estado === "ok" ? "#34D17F" : "#8A90B4" }}>
                          {row.estado === "ok" ? "Activo" : "Pausado"}
                        </span>
                      </td>
                      <td style={{ padding: "11px 10px", borderTop: "1px solid #222746", fontFamily: "monospace", fontSize: 12.5 }}>{row.prox}</td>
                      <td style={{ padding: "11px 10px", borderTop: "1px solid #222746", color: row.fallos > 0 ? "#FF6B6B" : "#EEF0FA", fontWeight: row.fallos > 0 ? 700 : 400 }}>{row.fallos}</td>
                      <td style={{ padding: "11px 10px", borderTop: "1px solid #222746" }}>
                        <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 6, display: "inline-block", background: row.adapt === "warn" ? "rgba(227,180,60,.13)" : "transparent", color: row.adapt === "warn" ? "#E3B43C" : "#A7ACCB", border: row.adapt === "line" ? "1px solid #2E3458" : "none" }}>
                          {row.adapt === "warn" ? "Sí" : "No"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Workers */}
            <div style={{ background: "#11142F", border: "1px solid #222746", borderRadius: 16, padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <h2 style={{ fontSize: 15.5, fontWeight: 700, color: "#EEF0FA" }}>Workers y colas</h2>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr>
                    {["Servicio", "Salud", "Espera", "Activos", "Fallidos", "Compl."].map(h => (
                      <th key={h} style={{ textAlign: "left", fontSize: 11, fontWeight: 600, color: "#6E739A", textTransform: "uppercase", letterSpacing: ".04em", padding: "0 10px 11px", fontFamily: "monospace" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { srv: "API", espera: 12, activos: 18, fallidos: 0, compl: "12,431" },
                    { srv: "forge-worker", espera: 45, activos: 22, fallidos: 1, compl: "8,912" },
                    { srv: "scheduler", espera: 3, activos: 1, fallidos: 0, compl: "4,221" },
                    { srv: "Redis", espera: "—", activos: "—", fallidos: 0, compl: "—" },
                    { srv: "Postgres", espera: "—", activos: 12, fallidos: 0, compl: "—" },
                  ].map(row => (
                    <tr key={row.srv}>
                      <td style={{ padding: "11px 10px", borderTop: "1px solid #222746", fontFamily: "monospace", fontSize: 12.5 }}>{row.srv}</td>
                      <td style={{ padding: "11px 10px", borderTop: "1px solid #222746" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontWeight: 600, color: "#34D17F" }}>
                          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#34D17F", boxShadow: "0 0 6px #34D17F", display: "inline-block" }} />
                          Healthy
                        </span>
                      </td>
                      <td style={{ padding: "11px 10px", borderTop: "1px solid #222746" }}>{row.espera}</td>
                      <td style={{ padding: "11px 10px", borderTop: "1px solid #222746" }}>{row.activos}</td>
                      <td style={{ padding: "11px 10px", borderTop: "1px solid #222746", color: Number(row.fallidos) > 0 ? "#FF6B6B" : "#EEF0FA", fontWeight: Number(row.fallidos) > 0 ? 700 : 400 }}>{row.fallidos}</td>
                      <td style={{ padding: "11px 10px", borderTop: "1px solid #222746", fontFamily: "monospace", fontSize: 12.5 }}>{row.compl}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, paddingTop: 13, borderTop: "1px solid #222746", fontSize: 12, color: "#6E739A" }}>
                <span>Última verificación: 22/05 10:14:50</span>
                <a href="#" style={{ color: "#6B72C9", textDecoration: "none", fontWeight: 600 }}>Ver métricas ↗</a>
              </div>
            </div>

            {/* Fuentes + Auditoría */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: "#11142F", border: "1px solid #222746", borderRadius: 16, padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <h2 style={{ fontSize: 15.5, fontWeight: 700, color: "#EEF0FA" }}>Fuentes y extractores</h2>
                  <a href="#" style={{ fontSize: 12.5, color: "#6B72C9", fontWeight: 600, textDecoration: "none" }}>Gestionar ↗</a>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
                  {["feed", "api", "web", "archivo_cliente", "dataset_abierto"].map(src => (
                    <span key={src} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#1B1F42", border: "1px solid #2E3458", borderRadius: 8, padding: "8px 13px", fontSize: 12.5, fontFamily: "monospace" }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#34D17F", display: "inline-block" }} />
                      {src}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ background: "#11142F", border: "1px solid #222746", borderRadius: 16, padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <h2 style={{ fontSize: 15.5, fontWeight: 700, color: "#EEF0FA" }}>Auditoría reciente</h2>
                  <a href="#" style={{ fontSize: 12.5, color: "#6B72C9", fontWeight: 600, textDecoration: "none" }}>Ver todo</a>
                </div>
                {[
                  { icon: "✓", title: "Aprobación de skill", sub: "admin@nodematik.com", time: "10:13:22", ref: "SOL-1839" },
                  { icon: "↻", title: "Activación de loop", sub: "scheduler", time: "10:12:05", ref: "loop_inventarios" },
                  { icon: "★", title: "Nueva versión de skill", sub: "forge-worker", time: "10:11:34", ref: "normalizacion v2.1" },
                  { icon: "✕", title: "Rechazo de skill", sub: "admin@nodematik.com", time: "10:10:18", ref: "SOL-1836", err: true },
                ].map((aud, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 0", borderTop: i === 0 ? "none" : "1px solid #222746" }}>
                    <div style={{ width: 32, height: 32, borderRadius: 9, display: "grid", placeItems: "center", fontSize: 14, flexShrink: 0, background: "#1B1F42", border: "1px solid #2E3458", color: aud.err ? "#FF6B6B" : "#EEF0FA" }}>
                      {aud.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#EEF0FA" }}>{aud.title}</div>
                      <div style={{ fontSize: 11.5, color: "#6E739A", fontFamily: "monospace", marginTop: 1 }}>{aud.sub}</div>
                    </div>
                    <div style={{ fontSize: 11, color: "#6E739A", fontFamily: "monospace", textAlign: "right", whiteSpace: "nowrap" }}>
                      {aud.time}<br />{aud.ref}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: "auto", borderTop: "1px solid #222746", padding: "14px 26px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "#6E739A", background: "#0E1130" }}>
          <span>© 2026 Nodematik. Todos los derechos reservados.</span>
          <span>
            Tiempo de servidor: {now.toLocaleString("es-MX", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" })} UTC-5 &nbsp;&nbsp;
            <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#34D17F", boxShadow: "0 0 6px #34D17F", display: "inline-block" }} />
              Sistema operacional
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
