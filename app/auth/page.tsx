"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { login, register } from "@/lib/api";
import { saveSession } from "@/lib/auth";
import { Spinner } from "@/components/ui/Spinner";
import { Suspense } from "react";

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<"login" | "registro">("login");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: "err" | "ok" } | null>(null);

  // Form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [regOrg, setRegOrg] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPass, setRegPass] = useState("");

  useEffect(() => {
    if (searchParams.get("tab") === "registro") setTab("registro");
  }, [searchParams]);

  async function doLogin(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      const data = await login(loginEmail, loginPass);
      saveSession({
        token: data.token,
        orgId: data.orgId,
        userId: data.userId,
        role: data.role,
        botId: data.botId,
        llmConfigured: data.llmConfigured,
      });
      setMsg({ text: "Bienvenido. Entrando a tu oficina...", type: "ok" });
      setTimeout(() => {
        if (data.llmConfigured) router.push("/office");
        else router.push("/config");
      }, 700);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "No pudimos iniciar sesión. Revisa tus datos.";
      setMsg({ text: errMsg, type: "err" });
      setLoading(false);
    }
  }

  async function doRegister(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      const data = await register(regOrg, regEmail, regPass);
      saveSession({
        token: data.token,
        orgId: data.orgId,
        userId: data.userId,
        botId: data.botId,
      });
      setMsg({ text: "Cuenta creada. Preparando tu oficina...", type: "ok" });
      setTimeout(() => router.push("/config"), 800);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "No pudimos crear la cuenta.";
      setMsg({ text: errMsg.includes("409") ? "Ese correo ya está registrado. Inicia sesión." : errMsg, type: "err" });
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
    transition: "border-color .15s, box-shadow .15s",
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
      position: "relative",
      WebkitFontSmoothing: "antialiased",
    }}>
      {/* Background */}
      <div style={{ position: "fixed", inset: 0, zIndex: -2, background: "radial-gradient(900px 500px at 80% 0%,rgba(45,52,128,.45),transparent 60%), radial-gradient(700px 500px at 10% 100%,rgba(201,162,39,.07),transparent 55%), #0A0C24" }} />
      <div style={{ position: "fixed", inset: 0, zIndex: -1, opacity: 0.35, backgroundImage: "radial-gradient(circle,rgba(107,114,201,.1) 1px,transparent 1px)", backgroundSize: "34px 34px" }} />

      {/* Back link */}
      <Link href="/" style={{ position: "fixed", top: 24, left: 24, color: "#B0B5D6", fontSize: 13.5, textDecoration: "none", display: "flex", alignItems: "center", gap: 7, padding: "9px 15px", borderRadius: 9, border: "1px solid #313861", background: "rgba(17,20,47,.6)" }}>
        ← Volver
      </Link>

      {/* Card */}
      <div style={{ width: "100%", maxWidth: 430, background: "#11142F", border: "1px solid #313861", borderRadius: 22, boxShadow: "0 40px 100px rgba(0,0,0,.55)", overflow: "hidden" }}>
        {/* Card top */}
        <div style={{ padding: "30px 34px 0", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 11, marginBottom: 26 }}>
            <Image src="/logo.png" alt="Nodematik" width={38} height={38} style={{ objectFit: "contain" }} />
            <span style={{ fontWeight: 800, fontSize: 22, letterSpacing: "-0.03em", color: "#fff" }}>Nodematik</span>
          </div>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, background: "#151935", border: "1px solid #222746", borderRadius: 12, padding: 4, marginBottom: 6 }}>
            {(["login", "registro"] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setMsg(null); }}
                style={{
                  flex: 1,
                  padding: 11,
                  borderRadius: 9,
                  border: "none",
                  background: tab === t ? "#161A4A" : "none",
                  color: tab === t ? "#fff" : "#B0B5D6",
                  fontFamily: "inherit",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                  transition: ".15s",
                }}
              >
                {t === "login" ? "Iniciar sesión" : "Crear cuenta"}
              </button>
            ))}
          </div>
        </div>

        {/* Card body */}
        <div style={{ padding: "24px 34px 32px" }}>
          {/* Message */}
          {msg && (
            <div style={{
              fontSize: 13.5,
              padding: "11px 14px",
              borderRadius: 10,
              marginBottom: 16,
              lineHeight: 1.45,
              background: msg.type === "err" ? "rgba(255,107,107,.12)" : "rgba(52,209,127,.12)",
              color: msg.type === "err" ? "#FF6B6B" : "#34D17F",
              border: `1px solid ${msg.type === "err" ? "rgba(255,107,107,.3)" : "rgba(52,209,127,.3)"}`,
            }}>
              {msg.text}
            </div>
          )}

          {/* LOGIN FORM */}
          {tab === "login" && (
            <form onSubmit={doLogin}>
              <h1 style={{ fontFamily: "Fraunces, Georgia, serif", fontWeight: 600, fontSize: 24, color: "#fff", letterSpacing: "-0.02em", marginBottom: 6, textAlign: "center" }}>Bienvenido de vuelta</h1>
              <p style={{ fontSize: 14, color: "#B0B5D6", textAlign: "center", marginBottom: 24 }}>Entra a tu oficina de soluciones</p>
              <div style={{ marginBottom: 15 }}>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#B0B5D6", marginBottom: 7 }}>Correo</label>
                <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="tu@empresa.com" required style={inputStyle} autoComplete="email" />
              </div>
              <div style={{ marginBottom: 15 }}>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#B0B5D6", marginBottom: 7 }}>Contraseña</label>
                <input type="password" value={loginPass} onChange={e => setLoginPass(e.target.value)} placeholder="Tu contraseña" required style={inputStyle} autoComplete="current-password" />
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{ width: "100%", padding: 14, borderRadius: 11, border: "none", background: "#C9A227", color: "#070920", fontFamily: "inherit", fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1, marginTop: 6, display: "flex", alignItems: "center", justifyContent: "center", gap: 9, transition: ".16s" }}
              >
                {loading && <Spinner size="sm" />}
                <span>Entrar</span>
              </button>
              <p style={{ textAlign: "center", fontSize: 12.5, color: "#777CA4", marginTop: 18 }}>
                ¿No tienes cuenta? <button type="button" onClick={() => setTab("registro")} style={{ color: "#9AA0DD", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 12.5 }}>Crear una</button>
              </p>
            </form>
          )}

          {/* REGISTRO FORM */}
          {tab === "registro" && (
            <form onSubmit={doRegister}>
              <h1 style={{ fontFamily: "Fraunces, Georgia, serif", fontWeight: 600, fontSize: 24, color: "#fff", letterSpacing: "-0.02em", marginBottom: 6, textAlign: "center" }}>Crea tu oficina</h1>
              <p style={{ fontSize: 14, color: "#B0B5D6", textAlign: "center", marginBottom: 24 }}>Empieza a resolver problemas con Nodematik</p>
              <div style={{ marginBottom: 15 }}>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#B0B5D6", marginBottom: 7 }}>Nombre de tu empresa u organización</label>
                <input type="text" value={regOrg} onChange={e => setRegOrg(e.target.value)} placeholder="Acme S.A." required style={inputStyle} />
                <p style={{ fontSize: 11.5, color: "#777CA4", marginTop: 6 }}>Será el nombre de tu oficina en Nodematik.</p>
              </div>
              <div style={{ marginBottom: 15 }}>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#B0B5D6", marginBottom: 7 }}>Correo</label>
                <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} placeholder="tu@empresa.com" required style={inputStyle} autoComplete="email" />
              </div>
              <div style={{ marginBottom: 15 }}>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#B0B5D6", marginBottom: 7 }}>Contraseña</label>
                <input type="password" value={regPass} onChange={e => setRegPass(e.target.value)} placeholder="Mínimo 8 caracteres" required minLength={8} style={inputStyle} autoComplete="new-password" />
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{ width: "100%", padding: 14, borderRadius: 11, border: "none", background: "#C9A227", color: "#070920", fontFamily: "inherit", fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1, marginTop: 6, display: "flex", alignItems: "center", justifyContent: "center", gap: 9 }}
              >
                {loading && <Spinner size="sm" />}
                <span>Crear cuenta y entrar</span>
              </button>
              <p style={{ textAlign: "center", fontSize: 12.5, color: "#777CA4", marginTop: 18 }}>
                ¿Ya tienes cuenta? <button type="button" onClick={() => setTab("login")} style={{ color: "#9AA0DD", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 12.5 }}>Iniciar sesión</button>
              </p>
            </form>
          )}

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, fontSize: 11.5, color: "#777CA4", marginTop: 20, fontFamily: "monospace" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34D17F", boxShadow: "0 0 6px #34D17F", display: "inline-block" }} />
            Conexión segura · tus datos viajan cifrados
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense>
      <AuthForm />
    </Suspense>
  );
}
