"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MessageSquare, CheckCircle, XCircle } from "lucide-react";
import { getSolicitud, responderSolicitud } from "@/lib/api";
import type { Solicitud } from "@/lib/types";

export default function SolucionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [solicitud, setSolicitud] = useState<Solicitud | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);
  const [acting, setActing] = useState<"approve" | "reject" | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getSolicitud(id);
        setSolicitud(data);
      } catch {
        // Demo fallback
        setSolicitud({
          id,
          estado: "esperando_aprobacion",
          pregunta: "Monitoreo de menciones de marca en redes sociales",
          respuesta: "He diseñado una solución de monitoreo continuo que vigila X, LinkedIn, Instagram y TikTok cada 15 minutos, generando alertas y resúmenes diarios automatizados.",
          nombre: "Vigilancia de marca",
        });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  function showToast(text: string, ok: boolean) {
    setToast({ text, ok });
    setTimeout(() => setToast(null), 2800);
  }

  async function handleAction(type: "approve" | "reject") {
    if (!solicitud) return;
    setActing(type);
    try {
      const respuesta = type === "approve"
        ? "Apruebo esta solución. Por favor actívala."
        : "Rechaza esta propuesta. No procede.";
      await responderSolicitud(solicitud.id, respuesta);
      showToast(type === "approve" ? "Solución aprobada y activada" : "Solicitud rechazada", type === "approve");
      setSolicitud((prev) => prev ? { ...prev, estado: type === "approve" ? "operando" : "paused" } : prev);
    } catch {
      showToast("No se pudo procesar. Intenta de nuevo.", false);
    } finally {
      setActing(null);
    }
  }

  if (loading) {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
        <div style={{ width: 32, height: 32, border: "3px solid #EAECF4", borderTopColor: "#1B1F5A", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!solicitud) return null;

  const isAprobacion = ["esperando_aprobacion", "pending"].includes(solicitud.estado);

  return (
    <div style={{ flex: 1, padding: "24px 30px 40px", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
        <Link href="/office" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13.5, color: "#54586F", textDecoration: "none", padding: "8px 12px", borderRadius: 9, border: "1px solid #DCDFEC", background: "#fff" }}>
          <ArrowLeft size={14} /> Mi Oficina
        </Link>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1B1F5A", letterSpacing: "-0.03em" }}>{solicitud.nombre || solicitud.pregunta}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
            <span style={{ fontFamily: "monospace", fontSize: 12, color: "#9094AC" }}>ID: {solicitud.id}</span>
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#DCDFEC", display: "inline-block" }} />
            <span style={{ fontSize: 12, color: isAprobacion ? "#C8911A" : "#1F9D57", fontWeight: 600 }}>
              {isAprobacion ? "● Esperando aprobación" : "● " + solicitud.estado}
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24 }}>
        {/* Main content */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Propuesta */}
          <div style={{ background: "#fff", border: "1px solid #EAECF4", borderRadius: 22, padding: 28, boxShadow: "0 2px 10px rgba(20,22,46,.05)" }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1B1F5A", marginBottom: 16 }}>Propuesta de solución</h2>
            <div style={{ background: "#F7F8FC", border: "1px solid #EAECF4", borderRadius: 14, padding: 20 }}>
              <div style={{ fontSize: 11, fontFamily: "monospace", color: "#9094AC", textTransform: "uppercase" as const, letterSpacing: ".06em", marginBottom: 8 }}>Descripción del problema</div>
              <p style={{ fontSize: 15, color: "#14162E", fontWeight: 500, lineHeight: 1.6 }}>{solicitud.pregunta}</p>
            </div>
            {solicitud.respuesta && (
              <div style={{ marginTop: 16, background: "#EEF0FB", border: "1px solid #C6CAEE", borderRadius: 14, padding: 20 }}>
                <div style={{ fontSize: 11, fontFamily: "monospace", color: "#2D3480", textTransform: "uppercase" as const, letterSpacing: ".06em", marginBottom: 8 }}>Solución propuesta</div>
                <p style={{ fontSize: 14.5, color: "#14162E", lineHeight: 1.6 }}>{solicitud.respuesta}</p>
              </div>
            )}
          </div>

          {/* Chat con solución */}
          <div style={{ background: "#fff", border: "1px solid #EAECF4", borderRadius: 22, padding: 24, boxShadow: "0 2px 10px rgba(20,22,46,.05)" }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1B1F5A", marginBottom: 6 }}>Chatea con esta solución</h2>
            <p style={{ fontSize: 13.5, color: "#54586F", marginBottom: 16 }}>Haz preguntas sobre el problema o pide que la solución ejecute tareas específicas.</p>
            <Link
              href={`/office/solucion/${id}/chat`}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 20px", borderRadius: 12, background: "#1B1F5A", color: "#fff", fontWeight: 600, fontSize: 14, textDecoration: "none", boxShadow: "0 6px 16px rgba(27,31,90,.22)" }}
            >
              <MessageSquare size={16} />
              Abrir chat
            </Link>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Aprobación */}
          {isAprobacion && (
            <div style={{ background: "#FBF3D6", border: "1px solid #E3C65B", borderRadius: 22, padding: 24 }}>
              <div style={{ fontSize: 11, fontFamily: "monospace", color: "#A8861C", textTransform: "uppercase" as const, letterSpacing: ".06em", marginBottom: 12 }}>Aprobación requerida</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1B1F5A", marginBottom: 10 }}>Esta solución necesita tu aprobación</h3>
              <p style={{ fontSize: 13.5, color: "#54586F", lineHeight: 1.5, marginBottom: 18 }}>Revisa la propuesta y decide si activarla. Ninguna solución opera sin tu aprobación.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <button
                  onClick={() => handleAction("approve")}
                  disabled={acting !== null}
                  style={{ padding: 12, borderRadius: 10, fontWeight: 600, fontSize: 13.5, border: "none", background: "#C9A227", color: "#070920", cursor: acting ? "not-allowed" : "pointer", opacity: acting ? 0.65 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: "inherit" }}
                >
                  {acting === "approve" ? <div style={{ width: 14, height: 14, border: "2px solid rgba(7,9,32,.3)", borderTopColor: "#070920", borderRadius: "50%", animation: "spin .7s linear infinite" }} /> : <CheckCircle size={15} />}
                  Aprobar
                </button>
                <button
                  onClick={() => handleAction("reject")}
                  disabled={acting !== null}
                  style={{ padding: 12, borderRadius: 10, fontWeight: 600, fontSize: 13.5, border: "1px solid #DCDFEC", background: "#fff", color: "#FF6B6B", cursor: acting ? "not-allowed" : "pointer", opacity: acting ? 0.65 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: "inherit" }}
                >
                  {acting === "reject" ? <div style={{ width: 14, height: 14, border: "2px solid rgba(255,107,107,.3)", borderTopColor: "#FF6B6B", borderRadius: "50%", animation: "spin .7s linear infinite" }} /> : <XCircle size={15} />}
                  Rechazar
                </button>
              </div>
            </div>
          )}

          {/* Info */}
          <div style={{ background: "#fff", border: "1px solid #EAECF4", borderRadius: 22, padding: 20, boxShadow: "0 2px 10px rgba(20,22,46,.05)" }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1B1F5A", marginBottom: 14 }}>Información</h3>
            {[
              { label: "Estado", value: solicitud.estado },
              { label: "ID solución", value: solicitud.id },
              { label: "Creada", value: solicitud.createdAt ? new Date(solicitud.createdAt).toLocaleString("es-MX") : "—" },
              { label: "Actualizada", value: solicitud.updatedAt ? new Date(solicitud.updatedAt).toLocaleString("es-MX") : "—" },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid #EAECF4", fontSize: 13 }}>
                <span style={{ color: "#9094AC" }}>{label}</span>
                <span style={{ fontWeight: 600, color: "#14162E", fontFamily: label === "ID solución" ? "monospace" : "inherit", fontSize: label === "ID solución" ? 11.5 : 13 }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {toast && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "#12153D", color: "#fff", padding: "12px 20px", borderRadius: 11, fontSize: 14, fontWeight: 500, zIndex: 200, display: "flex", alignItems: "center", gap: 9 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: toast.ok ? "#34D17F" : "#FF6B6B", display: "inline-block" }} />
          {toast.text}
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
