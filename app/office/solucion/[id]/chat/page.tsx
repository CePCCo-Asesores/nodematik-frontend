"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";
import { chatWithBot } from "@/lib/api";
import { getBotId } from "@/lib/auth";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ChatBPage() {
  const params = useParams();
  const solucionId = params.id as string;
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hola, soy tu solución activa. Puedo responder preguntas, analizar información y ejecutar tareas relacionadas con mi objetivo. ¿En qué te puedo ayudar?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput("");
    setLoading(true);

    const userMsg: Message = { role: "user", content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);

    try {
      const botId = getBotId();
      if (!botId) throw new Error("No bot configured");
      const data = await chatWithBot(botId, text, conversationId);
      if (data.conversationId) setConversationId(data.conversationId);
      const assistantMsg: Message = { role: "assistant", content: data.respuesta, timestamp: new Date() };
      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      // Demo response
      const demoResponses = [
        "Basado en el análisis más reciente, he detectado 3 menciones relevantes en las últimas 6 horas. Dos son neutrales y una requiere atención: hay una queja en X con 145 interacciones.",
        "Los datos muestran que tu marca tiene un sentiment positivo del 78% esta semana. Los temas principales son producto, servicio al cliente y precio.",
        "He generado un resumen ejecutivo con los hallazgos más importantes. ¿Te gustaría que profundice en algún aspecto específico?",
        "Puedo programar un reporte automático para eso. ¿Prefieres recibirlo diariamente o con otra frecuencia?",
      ];
      const idx = messages.filter(m => m.role === "assistant").length - 1;
      const resp = demoResponses[idx % demoResponses.length];
      const assistantMsg: Message = { role: "assistant", content: resp, timestamp: new Date() };
      setMessages(prev => [...prev, assistantMsg]);
    } finally {
      setLoading(false);
    }
  }

  function formatTime(d: Date) {
    return d.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "calc(100vh - 80px)", padding: "20px 30px 24px", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
        <Link href={`/office/solucion/${solucionId}`} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13.5, color: "#54586F", textDecoration: "none", padding: "8px 12px", borderRadius: 9, border: "1px solid #DCDFEC", background: "#fff" }}>
          <ArrowLeft size={14} /> Volver
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "#1B1F5A", display: "grid", placeItems: "center", fontSize: 16 }}>🤖</div>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: "#1B1F5A" }}>Chat con la Solución</h1>
            <div style={{ fontSize: 12, color: "#34D17F", display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34D17F", display: "inline-block" }} />
              Operando · ID: {solucionId}
            </div>
          </div>
        </div>
      </div>

      {/* Chat */}
      <div style={{ flex: 1, background: "#fff", border: "1px solid #EAECF4", borderRadius: 22, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 2px 10px rgba(20,22,46,.05)" }}>
        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", gap: 10 }}>
              {msg.role === "assistant" && (
                <div style={{ width: 32, height: 32, borderRadius: 9, background: "#1B1F5A", display: "grid", placeItems: "center", fontSize: 14, flexShrink: 0, alignSelf: "flex-end" }}>🤖</div>
              )}
              <div style={{ maxWidth: "72%" }}>
                <div style={{
                  padding: "13px 17px",
                  borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  background: msg.role === "user" ? "#1B1F5A" : "#F7F8FC",
                  color: msg.role === "user" ? "#fff" : "#14162E",
                  fontSize: 14.5,
                  lineHeight: 1.6,
                  border: msg.role === "assistant" ? "1px solid #EAECF4" : "none",
                }}>
                  {msg.content}
                </div>
                <div style={{ fontSize: 11, color: "#9094AC", marginTop: 4, fontFamily: "monospace", textAlign: msg.role === "user" ? "right" : "left" }}>
                  {formatTime(msg.timestamp)}
                </div>
              </div>
              {msg.role === "user" && (
                <div style={{ width: 32, height: 32, borderRadius: 9, background: "#EEF0FB", display: "grid", placeItems: "center", color: "#1B1F5A", fontWeight: 700, fontSize: 12, flexShrink: 0, alignSelf: "flex-end" }}>Tú</div>
              )}
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: "#1B1F5A", display: "grid", placeItems: "center", fontSize: 14, flexShrink: 0 }}>🤖</div>
              <div style={{ padding: "13px 17px", borderRadius: "18px 18px 18px 4px", background: "#F7F8FC", border: "1px solid #EAECF4" }}>
                <div style={{ display: "flex", gap: 4 }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#9094AC", display: "inline-block" }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid #EAECF4", display: "flex", gap: 12 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Escribe tu pregunta o instrucción..."
            disabled={loading}
            style={{ flex: 1, background: "#F7F8FC", border: "1px solid #DCDFEC", borderRadius: 13, padding: "13px 16px", fontSize: 15, color: "#14162E", outline: "none", fontFamily: "inherit" }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{ width: 48, height: 48, borderRadius: 12, background: "#1B1F5A", border: "none", display: "grid", placeItems: "center", cursor: loading || !input.trim() ? "not-allowed" : "pointer", opacity: loading || !input.trim() ? 0.6 : 1, flexShrink: 0 }}
          >
            <Send size={18} color="white" />
          </button>
        </div>
      </div>
    </div>
  );
}
