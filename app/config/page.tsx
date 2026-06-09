"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updateBot } from "@/lib/api";
import { getToken, getBotId } from "@/lib/auth";
import { Spinner } from "@/components/ui/Spinner";

const MODELS: Record<string, string> = {
  google: "gemini-2.0-flash",
  anthropic: "claude-3-5-haiku-20241022",
  openai: "gpt-4o-mini",
};

export default function ConfigPage() {
  const router = useRouter();
  const [provider, setProvider] = useState("google");
  const [model, setModel] = useState(MODELS.google);
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: "err" | "ok" } | null>(null);

  useEffect(() => {
    if (!getToken()) router.push("/auth");
  }, [router]);

  function handleProviderChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const v = e.target.value;
    setProvider(v);
    setModel(MODELS[v] || "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const botId = getBotId();
    if (!botId) {
      setMsg({ text: "No encontramos tu asistente. Inicia sesión de nuevo.", type: "err" });
      return;
    }
    setLoading(true);
    try {
      await updateBot(botId, { llmProvider: provider, llmModel: model, llmApiKey: apiKey, status: "active" });
      if (typeof window !== "undefined") localStorage.setItem("nm_llm_configured", "1");
      setMsg({ text: "Asistente configurado. Entrando a tu oficina...", type: "ok" });
      setTimeout(() => router.push("/office"), 800);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "No pudimos guardar la configuración.";
      setMsg({ text: errMsg, type: "err" });
      setLoading(false);
    }
  }

  const inputStyle = {
    width: "100%",
    background: "#151935",
    border: "1px solid #313861",
    borderRadius: 11,
    padding: "13px 15px",
    fontSize: 15,
    color: "#F4F5FD",
    outline: "none",
    fontFamily: "inherit",
    transition: "border-color .15s",
  };

  const selectStyle = {
    ...inputStyle,
    appearance: "none" as const,
    WebkitAppearance: "none" as const,
    cursor: "pointer",
  };

  return (
    <div style={{
      fontFamily: "var(--font-inter), system-ui, sans-serif",
      background: "#0A0C24",
      color: "#F4F5FD",
      minHeight: "100vh",
      display: "grid",
      placeItems: "center",
      padding: 24,
      WebkitFontSmoothing: "antialiased",
      position: "relative",
    }}>
      <div style={{ position: "fixed", inset: 0, zIndex: -2, background: "radial-gradient(900px 500px at 80% 0%,rgba(45,52,128,.45),transparent 60%), radial-gradient(700px 500px at 10% 100%,rgba(201,162,39,.07),transparent 55%), #0A0C24" }} />

      <div style={{ width: "100%", maxWidth: 520, background: "#11142F", border: "1px solid #313861", borderRadius: 22, boxShadow: "0 40px 100px rgba(0,0,0,.55)", overflow: "hidden" }}>
        {/* Top */}
        <div style={{ padding: "30px 36px 0", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 11, marginBottom: 22 }}>
            <Image src="/logo.png" alt="Nodematik" width={46} height={46} style={{ objectFit: "contain" }} />
            <span style={{ fontWeight: 800, fontSize: 21, letterSpacing: "-0.03em", color: "#fff" }}>Nodematik</span>
          </div>
          <div style={{ fontSize: 12, fontFamily: "monospace", color: "#E3C65B", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10 }}>Último paso</div>
          <h1 style={{ fontFamily: "Fraunces, Georgia, serif", fontWeight: 600, fontSize: 25, color: "#fff", letterSpacing: "-0.02em", marginBottom: 8 }}>Configura tu asistente</h1>
          <p style={{ fontSize: 14.5, color: "#B0B5D6", lineHeight: 1.55, maxWidth: 400, margin: "0 auto" }}>
            Nodematik usa tu propia cuenta de IA para trabajar. Conecta tu clave para que tus soluciones puedan operar. Tu clave se guarda cifrada y solo la usa tu asistente.
          </p>
        </div>

        {/* Body */}
        <div style={{ padding: "26px 36px 34px" }}>
          {msg && (
            <div style={{
              fontSize: 13.5,
              padding: "11px 14px",
              borderRadius: 10,
              marginBottom: 18,
              lineHeight: 1.45,
              background: msg.type === "err" ? "rgba(255,107,107,.12)" : "rgba(52,209,127,.12)",
              color: msg.type === "err" ? "#FF6B6B" : "#34D17F",
              border: `1px solid ${msg.type === "err" ? "rgba(255,107,107,.3)" : "rgba(52,209,127,.3)"}`,
            }}>
              {msg.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13 }}>
              <div style={{ marginBottom: 17 }}>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#B0B5D6", marginBottom: 8 }}>Proveedor de IA</label>
                <select value={provider} onChange={handleProviderChange} style={selectStyle}>
                  <option value="google">Google Gemini (tier gratuito)</option>
                  <option value="anthropic">Anthropic (Claude)</option>
                  <option value="openai">OpenAI (GPT)</option>
                </select>
              </div>
              <div style={{ marginBottom: 17 }}>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#B0B5D6", marginBottom: 8 }}>Modelo</label>
                <input
                  type="text"
                  value={model}
                  onChange={e => setModel(e.target.value)}
                  placeholder="gemini-2.0-flash"
                  style={inputStyle}
                />
              </div>
            </div>
            <div style={{ marginBottom: 17 }}>
              <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#B0B5D6", marginBottom: 8 }}>Tu clave de API</label>
              <input
                type="password"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="sk-..."
                required
                autoComplete="off"
                style={inputStyle}
              />
              <p style={{ fontSize: 11.5, color: "#777CA4", marginTop: 7, lineHeight: 1.5 }}>
                Se guarda cifrada (AES-256). Nunca la compartimos ni la mostramos.<br />
                Con Gemini obtienes una clave <b>gratis</b> en{" "}
                <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" style={{ color: "#9AA0DD", textDecoration: "none" }}>aistudio.google.com</a> (sin tarjeta).
              </p>
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{ width: "100%", padding: 14, borderRadius: 11, border: "none", background: "#C9A227", color: "#070920", fontFamily: "inherit", fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1, marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 9, transition: ".16s" }}
            >
              {loading && <Spinner size="sm" />}
              <span>Guardar y entrar a mi oficina</span>
            </button>
          </form>

          {/* Security note */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 9, fontSize: 12, color: "#777CA4", marginTop: 18, lineHeight: 1.5, background: "#151935", border: "1px solid #222746", borderRadius: 11, padding: "13px 15px" }}>
            <span style={{ color: "#34D17F", flexShrink: 0 }}>🔒</span>
            <span>Modelo BYO (Bring Your Own): usas tu propia cuenta de IA, controlas tu gasto y tus datos. Nodematik solo orquesta; nunca ve tu clave en claro.</span>
          </div>

          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Link href="/office" style={{ fontSize: 13, color: "#777CA4", textDecoration: "none" }}>Configurar después →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
