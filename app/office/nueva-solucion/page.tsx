"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send, ChevronRight } from "lucide-react";
import { crearSolicitud, responderSolicitud } from "@/lib/api";
import type { Solicitud } from "@/lib/types";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

type PipelineStep = {
  label: string;
  desc: string;
  status: "pending" | "active" | "done";
};

const PIPELINE_STEPS: PipelineStep[] = [
  { label: "Comprende tu problema", desc: "Traduce tu petición en un objetivo claro", status: "pending" },
  { label: "Encuentra las fuentes", desc: "Decide de dónde obtener los datos, con permiso", status: "pending" },
  { label: "Reúne y analiza", desc: "Extrae lo necesario y lo evalúa", status: "pending" },
  { label: "Diseña la solución", desc: "Arma lo que resuelve tu problema", status: "pending" },
];

export default function NuevaSolucionPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "¡Hola! Soy tu asistente de Nodematik. Describe el problema que quieres resolver y crearé una solución a medida para ti. ¿Qué necesitas?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [solicitudId, setSolicitudId] = useState<string | null>(null);
  const [pipelineSteps, setPipelineSteps] = useState<PipelineStep[]>([]);
  const [showPipeline, setShowPipeline] = useState(false);
  const [showAprobacionCTA, setShowAprobacionCTA] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput("");
    setLoading(true);

    const userMsg: Message = { role: "user", content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);

    try {
      let data: Solicitud;
      if (!solicitudId) {
        data = await crearSolicitud(text);
        setSolicitudId(data.id);
        // Show pipeline
        setShowPipeline(true);
        animatePipeline();
      } else {
        data = await responderSolicitud(solicitudId, text);
      }

      const respuesta = data.respuesta || "Entendido. Estoy procesando tu solicitud...";
      const assistantMsg: Message = { role: "assistant", content: respuesta, timestamp: new Date() };
      setMessages((prev) => [...prev, assistantMsg]);

      if (data.siguiente === "aprobacion" || data.estado === "esperando_aprobacion") {
        setShowAprobacionCTA(true);
      }
    } catch {
      // Simulate response for demo
      const demoResponses = [
        "Entendido. Estoy analizando tu problema para diseñar la mejor solución...",
        "He encontrado las fuentes de datos adecuadas. Ahora estoy extrayendo la información relevante.",
        "El análisis está completo. Diseñando tu solución personalizada...",
        "Tu solución está lista. Por favor revisa la propuesta y apruébala para activarla.",
      ];
      const idx = messages.filter(m => m.role === "assistant").length - 1;
      const resp = demoResponses[Math.min(idx, demoResponses.length - 1)];
      const assistantMsg: Message = { role: "assistant", content: resp, timestamp: new Date() };
      setMessages((prev) => [...prev, assistantMsg]);
      if (!showPipeline) {
        setShowPipeline(true);
        animatePipeline();
      }
    } finally {
      setLoading(false);
    }
  }

  function animatePipeline() {
    const steps = PIPELINE_STEPS.map(s => ({ ...s }));
    setPipelineSteps(steps.map(s => ({ ...s, status: "pending" as const })));
    let i = 0;
    const advance = () => {
      if (i > 0) {
        setPipelineSteps(prev => {
          const next = [...prev];
          next[i - 1] = { ...next[i - 1], status: "done" };
          return next;
        });
      }
      if (i < steps.length) {
        setPipelineSteps(prev => {
          const next = [...prev];
          next[i] = { ...next[i], status: "active" };
          return next;
        });
        i++;
        setTimeout(advance, 1200);
      } else {
        setTimeout(() => setShowAprobacionCTA(true), 600);
      }
    };
    setTimeout(advance, 400);
  }

  function formatTime(d: Date) {
    return d.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "calc(100vh - 80px)", padding: "20px 30px 24px", gap: 0, fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
        <Link href="/office" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13.5, color: "#54586F", textDecoration: "none", padding: "8px 12px", borderRadius: 9, border: "1px solid #DCDFEC", background: "#fff" }}>
          <ArrowLeft size={14} /> Volver
        </Link>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: "#1B1F5A", letterSpacing: "-0.03em" }}>Nueva Solución</h1>
          <p style={{ fontSize: 13, color: "#54586F", marginTop: 1 }}>Describe tu problema y te ayudaré a resolverlo</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, flex: 1, minHeight: 0 }}>
        {/* CHAT WINDOW */}
        <div style={{ display: "flex", flexDirection: "column", background: "#fff", border: "1px solid #EAECF4", borderRadius: 22, overflow: "hidden", boxShadow: "0 2px 10px rgba(20,22,46,.05)" }}>
          {/* Chat header */}
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #EAECF4", background: "#FAFBFE", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#1B1F5A", display: "grid", placeItems: "center", fontSize: 16 }}>🤖</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14.5, color: "#1B1F5A" }}>Asistente Nodematik</div>
              <div style={{ fontSize: 12, color: "#34D17F", display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34D17F", display: "inline-block" }} />
                En línea
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: 16 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", gap: 10 }}>
                {msg.role === "assistant" && (
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: "#1B1F5A", display: "grid", placeItems: "center", fontSize: 14, flexShrink: 0, alignSelf: "flex-end" }}>🤖</div>
                )}
                <div style={{ maxWidth: "70%" }}>
                  <div style={{
                    padding: "12px 16px",
                    borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    background: msg.role === "user" ? "#1B1F5A" : "#F7F8FC",
                    color: msg.role === "user" ? "#fff" : "#14162E",
                    fontSize: 14.5,
                    lineHeight: 1.55,
                    border: msg.role === "assistant" ? "1px solid #EAECF4" : "none",
                  }}>
                    {msg.content}
                  </div>
                  <div style={{ fontSize: 11, color: "#9094AC", marginTop: 4, fontFamily: "monospace", textAlign: msg.role === "user" ? "right" : "left" }}>
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
                {msg.role === "user" && (
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: "#EEF0FB", display: "grid", placeItems: "center", flexShrink: 0, alignSelf: "flex-end", color: "#1B1F5A", fontWeight: 700, fontSize: 12 }}>Tú</div>
                )}
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: "#1B1F5A", display: "grid", placeItems: "center", fontSize: 14, flexShrink: 0 }}>🤖</div>
                <div style={{ padding: "12px 16px", borderRadius: "18px 18px 18px 4px", background: "#F7F8FC", border: "1px solid #EAECF4" }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[0, 1, 2].map(i => (
                      <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#9094AC", display: "inline-block", animation: `bounce ${0.7 + i * 0.15}s infinite alternate`, animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Aprobación CTA */}
          {showAprobacionCTA && (
            <div style={{ margin: "0 16px 16px", padding: "14px 16px", background: "#FBF3D6", border: "1px solid #E3C65B", borderRadius: 14, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 20 }}>✅</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: "#A8861C" }}>Tu solución está lista para revisión</div>
                <div style={{ fontSize: 12, color: "#A8861C", marginTop: 2 }}>Revisa los detalles y aprueba para activarla</div>
              </div>
              <button
                onClick={() => router.push("/office")}
                style={{ padding: "9px 16px", borderRadius: 9, background: "#C9A227", color: "#070920", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" }}
              >
                Ir a revisar →
              </button>
            </div>
          )}

          {/* Input */}
          <div style={{ padding: "16px 20px", borderTop: "1px solid #EAECF4", display: "flex", gap: 12 }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Describe tu problema..."
              disabled={loading}
              style={{ flex: 1, background: "#F7F8FC", border: "1px solid #DCDFEC", borderRadius: 13, padding: "13px 16px", fontSize: 15, color: "#14162E", outline: "none", fontFamily: "inherit", transition: "border-color .15s" }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{ width: 48, height: 48, borderRadius: 12, background: "#1B1F5A", border: "none", display: "grid", placeItems: "center", cursor: loading || !input.trim() ? "not-allowed" : "pointer", opacity: loading || !input.trim() ? 0.6 : 1, transition: ".15s", flexShrink: 0 }}
            >
              <Send size={18} color="white" />
            </button>
          </div>
        </div>

        {/* PIPELINE PANEL */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {showPipeline && (
            <div style={{ background: "#fff", border: "1px solid #EAECF4", borderRadius: 22, padding: "20px", boxShadow: "0 2px 10px rgba(20,22,46,.05)" }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1B1F5A", marginBottom: 20 }}>Construyendo tu solución</h3>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {pipelineSteps.map((step, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "11px 0", position: "relative", opacity: step.status === "pending" ? 0.45 : 1, transition: ".4s" }}>
                    {i < pipelineSteps.length - 1 && (
                      <div style={{ position: "absolute", left: 16.5, top: 33, width: 2, height: 22, background: step.status === "done" ? "#34D17F" : "#DCDFEC", zIndex: 1, transition: ".4s" }} />
                    )}
                    <div style={{
                      width: 34, height: 34, borderRadius: 9, display: "grid", placeItems: "center",
                      fontFamily: "monospace", fontSize: 12, fontWeight: 600, flexShrink: 0, zIndex: 2,
                      background: step.status === "done" ? "#34D17F" : step.status === "active" ? "#1B1F5A" : "#F7F8FC",
                      color: step.status === "done" ? "#fff" : step.status === "active" ? "#E3C65B" : "#9094AC",
                      border: step.status === "done" ? "none" : step.status === "active" ? "none" : "1px solid #DCDFEC",
                      transition: ".4s",
                    }}>
                      {step.status === "done" ? "✓" : i + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <b style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#14162E" }}>{step.label}</b>
                      <span style={{ fontSize: 12, color: "#9094AC" }}>{step.desc}</span>
                    </div>
                    {step.status === "active" && (
                      <div style={{ width: 16, height: 16, border: "2px solid #DCDFEC", borderTopColor: "#2D3480", borderRadius: "50%", animation: "spin 0.7s linear infinite", flexShrink: 0 }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ background: "#EEF0FB", border: "1px solid #C6CAEE", borderRadius: 16, padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1B1F5A", marginBottom: 8 }}>¿Cómo funciona?</div>
            <p style={{ fontSize: 12.5, color: "#54586F", lineHeight: 1.55 }}>
              Describe tu problema con tus propias palabras. El asistente puede hacer preguntas para precisar el objetivo. Cuando la solución esté lista, podrás revisarla y aprobarla antes de activarla.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          from { transform: translateY(0); }
          to { transform: translateY(-4px); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
