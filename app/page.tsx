"use client";

import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div style={{ background: "#0A0C24", color: "#F4F5FD", fontFamily: "var(--font-inter), system-ui, sans-serif", lineHeight: 1.55, WebkitFontSmoothing: "antialiased", overflowX: "hidden" }}>

      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 60, background: "rgba(10,12,36,.8)", backdropFilter: "blur(16px)", borderBottom: "1px solid #222746" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <Image src="/logo.png" alt="Nodematik" width={34} height={34} style={{ objectFit: "contain" }} />
            <span style={{ fontWeight: 800, fontSize: 20, letterSpacing: "-0.02em", color: "#fff" }}>Nodematik</span>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <Link href="#producto" style={{ color: "#B0B5D6", fontSize: 14, fontWeight: 500, padding: "9px 15px", borderRadius: 9, textDecoration: "none" }}>Producto</Link>
            <Link href="#como" style={{ color: "#B0B5D6", fontSize: 14, fontWeight: 500, padding: "9px 15px", borderRadius: 9, textDecoration: "none" }}>Como funciona</Link>
            <Link href="#vistas" style={{ color: "#B0B5D6", fontSize: 14, fontWeight: 500, padding: "9px 15px", borderRadius: 9, textDecoration: "none" }}>Plataforma</Link>
            <Link href="#casos" style={{ color: "#B0B5D6", fontSize: 14, fontWeight: 500, padding: "9px 15px", borderRadius: 9, textDecoration: "none" }}>Casos</Link>
            <Link href="/auth" style={{ color: "#B0B5D6", fontSize: 14, fontWeight: 500, padding: "9px 15px", borderRadius: 9, textDecoration: "none" }}>Iniciar sesión</Link>
            <Link href="/auth?tab=registro" style={{ background: "#C9A227", color: "#070920", fontWeight: 600, fontSize: 14, padding: "9px 15px", borderRadius: 9, textDecoration: "none" }}>Registrarse</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header style={{ position: "relative", padding: "80px 0 70px", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: -1, background: "radial-gradient(900px 500px at 80% 10%,rgba(45,52,128,.5),transparent 60%), radial-gradient(700px 500px at 5% 0%,rgba(201,162,39,.08),transparent 55%)" }} />
        <div style={{ position: "absolute", inset: 0, zIndex: -1, opacity: 0.4, backgroundImage: "radial-gradient(circle,rgba(107,114,201,.1) 1px,transparent 1px)", backgroundSize: "34px 34px" }} />
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 32px", display: "grid", gridTemplateColumns: "1fr 1.08fr", gap: 48, alignItems: "center" }}>
          <div>
            <h1 className="rise d1" style={{ fontFamily: "Fraunces, Georgia, serif", fontWeight: 600, fontSize: "clamp(44px,5.6vw,64px)", lineHeight: 1.02, letterSpacing: "-0.02em", color: "#fff" }}>
              Describe tu problema. <em style={{ fontStyle: "normal", color: "#D4AF37", display: "block" }}>Recibe la solución.</em>
            </h1>
            <p className="rise d2" style={{ fontSize: 18, color: "#B0B5D6", marginTop: 24, maxWidth: 500, lineHeight: 1.65 }}>
              Nodematik convierte necesidades en lenguaje natural en soluciones operables: comprende el problema, encuentra fuentes, fabrica capacidades, solicita tu aprobación y las deja trabajando.
            </p>
            <div className="rise d3" style={{ display: "flex", gap: 13, marginTop: 32, flexWrap: "wrap" }}>
              <Link href="/auth" style={{ fontWeight: 600, fontSize: 15, padding: "14px 26px", borderRadius: 12, background: "#C9A227", color: "#070920", boxShadow: "0 10px 30px rgba(201,162,39,.3)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 9 }}>
                Iniciar sesión ▶
              </Link>
              <Link href="/auth?tab=registro" style={{ fontWeight: 600, fontSize: 15, padding: "14px 26px", borderRadius: 12, background: "transparent", color: "#fff", border: "1px solid #313861", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 9 }}>
                Crear cuenta
              </Link>
            </div>
            <div className="rise d4" style={{ display: "flex", gap: 20, marginTop: 26, flexWrap: "wrap" }}>
              {[
                { icon: "🛡", label: "Aprobación humana" },
                { icon: "⛏", label: "Soluciones operables" },
                { icon: "⚙", label: "Producción real" },
              ].map((chip) => (
                <span key={chip.label} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, color: "#B0B5D6" }}>
                  <span style={{ width: 26, height: 26, borderRadius: 7, background: "#11142F", border: "1px solid #313861", display: "grid", placeItems: "center", fontSize: 13, color: "#D4AF37" }}>{chip.icon}</span>
                  {chip.label}
                </span>
              ))}
            </div>
          </div>
          {/* Mini Oficina mockup */}
          <div className="rise d3">
            <div style={{ background: "#11142F", border: "1px solid #313861", borderRadius: 24, boxShadow: "0 40px 100px rgba(0,0,0,.55)", overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "13px 16px", borderBottom: "1px solid #222746", background: "#151935" }}>
                <Image src="/logo.png" alt="" width={22} height={22} style={{ objectFit: "contain" }} />
                <span style={{ fontWeight: 700, fontSize: 13.5 }}>Mi Oficina</span>
                <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ width: 24, height: 24, borderRadius: 7, background: "#1B1F42", display: "grid", placeItems: "center", fontSize: 11, color: "#777CA4" }}>🔔</span>
                  <span style={{ width: 24, height: 24, borderRadius: 7, background: "#1B1F42", display: "grid", placeItems: "center", fontSize: 11, color: "#777CA4" }}>N</span>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "96px 1fr", minHeight: 300 }}>
                <div style={{ background: "#151935", borderRight: "1px solid #222746", padding: "14px 8px", display: "flex", flexDirection: "column", gap: 3 }}>
                  {[
                    { icon: "🏠", label: "Inicio", active: true },
                    { icon: "⛏", label: "Soluciones" },
                    { icon: "🛡", label: "Aprob." },
                    { icon: "📊", label: "Result." },
                    { icon: "📝", label: "Activid." },
                    { icon: "🔌", label: "Fuentes" },
                    { icon: "⚙", label: "Config." },
                  ].map((item) => (
                    <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 8px", borderRadius: 7, fontSize: 10.5, color: item.active ? "#fff" : "#777CA4", fontWeight: 500, background: item.active ? "#161A4A" : "transparent" }}>
                      <span style={{ fontSize: 11 }}>{item.icon}</span> {item.label}
                    </div>
                  ))}
                </div>
                <div style={{ padding: 15, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 11, alignContent: "start" }}>
                  <div style={{ background: "#151935", border: "1px solid #222746", borderRadius: 11, padding: 13 }}>
                    <h5 style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: "#fff" }}>Vigilancia de marca</h5>
                    <div style={{ fontSize: 10, fontWeight: 600, marginBottom: 7, color: "#34D17F" }}>● Operando</div>
                    <p style={{ fontSize: 10.5, color: "#B0B5D6", lineHeight: 1.5 }}>Monitorea menciones y riesgos.</p>
                    <div style={{ fontSize: 9.5, color: "#777CA4", fontFamily: "monospace", marginTop: 8 }}>hace 5 min</div>
                  </div>
                  <div style={{ background: "#151935", border: "1px solid #222746", borderRadius: 11, padding: 13 }}>
                    <h5 style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: "#fff" }}>Análisis documental</h5>
                    <div style={{ fontSize: 10, fontWeight: 600, marginBottom: 7, color: "#E3B43C" }}>● Esperando aprob.</div>
                    <p style={{ fontSize: 10.5, color: "#B0B5D6", lineHeight: 1.5 }}>Extrae información clave.</p>
                    <div style={{ fontSize: 9.5, color: "#777CA4", fontFamily: "monospace", marginTop: 8 }}>hace 18 min</div>
                  </div>
                  <div style={{ background: "#1B1F42", border: "1px solid #313861", borderRadius: 11, padding: 13, gridRow: "span 2" }}>
                    <div style={{ fontSize: 9, color: "#E3C65B", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 5 }}>Aprobación requerida</div>
                    <h5 style={{ fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Análisis documental</h5>
                    <p style={{ fontSize: 10.5, color: "#B0B5D6", lineHeight: 1.5, marginBottom: 8 }}>Se propone extraer cláusulas contractuales críticas.</p>
                    <div style={{ fontSize: 9.5, color: "#E3C65B", fontFamily: "monospace", marginBottom: 8 }}>⚡ 3.2 h/sem ahorradas</div>
                    <button style={{ display: "block", width: "100%", textAlign: "center", borderRadius: 7, padding: 8, fontSize: 10.5, fontWeight: 600, marginTop: 7, border: "none", background: "#C9A227", color: "#070920", cursor: "pointer" }}>✓ Aprobar</button>
                    <button style={{ display: "block", width: "100%", textAlign: "center", borderRadius: 7, padding: 8, fontSize: 10.5, fontWeight: 600, marginTop: 4, border: "1px solid #313861", background: "transparent", color: "#B0B5D6", cursor: "pointer" }}>Ver detalles</button>
                  </div>
                  <div style={{ background: "#151935", border: "1px solid #222746", borderRadius: 11, padding: 13 }}>
                    <h5 style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: "#fff" }}>Operación comercial</h5>
                    <div style={{ fontSize: 10, fontWeight: 600, color: "#34D17F" }}>● Operando</div>
                    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 28, marginTop: 8 }}>
                      {[40, 70, 50, 90, 60, 80].map((h, i) => (
                        <span key={i} style={{ flex: 1, background: "#3D45A0", borderRadius: 2, opacity: 0.6, display: "block", height: `${h}%` }} />
                      ))}
                    </div>
                  </div>
                  <div style={{ background: "#151935", border: "1px solid #222746", borderRadius: 11, padding: 13 }}>
                    <h5 style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: "#fff" }}>Inteligencia competitiva</h5>
                    <div style={{ fontSize: 10, fontWeight: 600, color: "#5BA8E3", marginBottom: 9 }}>● En fabricación</div>
                    <div style={{ height: 5, background: "#222746", borderRadius: 100, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: "62%", background: "linear-gradient(90deg,#6B72C9,#C9A227)", borderRadius: 100 }} />
                    </div>
                    <div style={{ fontSize: 9.5, color: "#777CA4", fontFamily: "monospace", marginTop: 4 }}>62%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* COMPRENDE / FABRICA / OPERA */}
      <section id="producto" style={{ padding: "80px 0", background: "#070920", borderTop: "1px solid #222746", borderBottom: "1px solid #222746" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 32px" }}>
          <h2 style={{ textAlign: "center", fontFamily: "Fraunces, Georgia, serif", fontWeight: 600, fontSize: "clamp(28px,3.6vw,40px)", letterSpacing: "-0.02em", color: "#fff", marginBottom: 14 }}>
            No te entregamos una herramienta. Te entregamos <em style={{ fontStyle: "normal", color: "#D4AF37" }}>resultados.</em>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginTop: 44, position: "relative" }}>
            {[
              { icon: "🧠", title: "Comprende", desc: "Entiende el problema y su contexto, en lenguaje natural." },
              { icon: "⚙", title: "Fabrica", desc: "Crea la solución adecuada para resolverlo." },
              { icon: "🚀", title: "Opera", desc: "La mantiene trabajando y adaptándose." },
            ].map((item, i) => (
              <div key={item.title} style={{ background: "#11142F", border: "1px solid #313861", borderRadius: 18, padding: 32, position: "relative" }}>
                <div style={{ width: 54, height: 54, borderRadius: 14, background: "#1B1F42", border: "1px solid #313861", display: "grid", placeItems: "center", fontSize: 25, marginBottom: 18 }}>{item.icon}</div>
                <h3 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 21, fontWeight: 600, color: "#fff", marginBottom: 9 }}>{item.title}</h3>
                <p style={{ fontSize: 14.5, color: "#B0B5D6", lineHeight: 1.6 }}>{item.desc}</p>
                {i < 2 && <span style={{ position: "absolute", top: "50%", right: -14, transform: "translateY(-50%)", color: "#C9A227", fontSize: 18, zIndex: 2 }}>➜</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como" style={{ padding: "80px 0" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 32px" }}>
          <h2 style={{ textAlign: "center", fontFamily: "Fraunces, Georgia, serif", fontWeight: 600, fontSize: "clamp(28px,3.6vw,40px)", letterSpacing: "-0.02em", color: "#fff", marginBottom: 14 }}>
            Como funciona
          </h2>
          <p style={{ textAlign: "center", color: "#B0B5D6", fontSize: 17, maxWidth: 560, margin: "0 auto 52px" }}>
            El pipeline FORGE convierte tu problema en una solución operable
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 14, position: "relative", marginTop: 44 }}>
            <div style={{ position: "absolute", top: 20, left: "8%", right: "8%", height: 1.5, background: "repeating-linear-gradient(90deg,#313861 0 6px,transparent 6px 12px)", zIndex: 1 }} />
            {[
              { n: 1, icon: "📥", title: "Intake", desc: "Captura el problema en lenguaje natural" },
              { n: 2, icon: "📖", title: "Sources", desc: "Busca y conecta las fuentes correctas" },
              { n: 3, icon: "📤", title: "Extract", desc: "Extrae los datos relevantes" },
              { n: 4, icon: "📊", title: "Analyze", desc: "Analiza y genera insights accionables" },
              { n: 5, icon: "🏭", title: "Factory", desc: "Construye la solución como capacidad" },
              { n: 6, icon: "↻", title: "Gate & Loop", desc: "Solicita aprobación y mejora en loop" },
            ].map((step) => (
              <div key={step.n} style={{ textAlign: "center", position: "relative", zIndex: 2 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", border: "1.5px solid #C9A227", color: "#D4AF37", display: "grid", placeItems: "center", fontWeight: 700, fontFamily: "monospace", fontSize: 14, margin: "0 auto 22px", background: "#0A0C24", position: "relative" as const, zIndex: 2 }}>{step.n}</div>
                <div style={{ fontSize: 24, marginBottom: 12, color: "#B0B5D6" }}>{step.icon}</div>
                <b style={{ display: "block", fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 6 }}>{step.title}</b>
                <span style={{ fontSize: 12, color: "#777CA4", lineHeight: 1.45, display: "block", padding: "0 4px" }}>{step.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DOS VISTAS */}
      <section id="vistas" style={{ padding: "80px 0", background: "#070920", borderTop: "1px solid #222746", borderBottom: "1px solid #222746" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 32px" }}>
          <h2 style={{ textAlign: "center", fontFamily: "Fraunces, Georgia, serif", fontWeight: 600, fontSize: "clamp(28px,3.6vw,40px)", letterSpacing: "-0.02em", color: "#fff", marginBottom: 14 }}>
            Dos vistas, una plataforma
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, marginTop: 44 }}>
            <div style={{ background: "#11142F", border: "1px solid #313861", borderRadius: 24, overflow: "hidden" }}>
              <div style={{ padding: "22px 24px 16px" }}>
                <h3 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 21, fontWeight: 600, color: "#fff", display: "flex", alignItems: "center", gap: 10 }}>🏠 Mi Oficina</h3>
                <p style={{ fontSize: 13, color: "#B0B5D6", marginTop: 6, lineHeight: 1.5 }}>Enfocada en soluciones, resultados y aprobaciones. La vista del cliente.</p>
              </div>
              <div style={{ margin: "0 18px 18px", background: "#151935", border: "1px solid #222746", borderRadius: 14, padding: 16 }}>
                <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
                  {["Todas", "Operando", "En espera", "En fabricación"].map((t, i) => (
                    <span key={t} style={{ fontSize: 10, padding: "3px 9px", borderRadius: 6, background: i === 0 ? "#1F2560" : "#1B1F42", color: i === 0 ? "#fff" : "#B0B5D6", fontFamily: "monospace" }}>{t}</span>
                  ))}
                </div>
                {[
                  { icon: "🛡", name: "Vigilancia de marca", status: "● Operando", statusColor: "#34D17F", imp: "Alto" },
                  { icon: "📄", name: "Análisis documental", status: "● Esperando aprob.", statusColor: "#E3B43C", imp: "Alto" },
                  { icon: "📊", name: "Operación comercial", status: "● Operando", statusColor: "#34D17F", imp: "Medio" },
                ].map((row) => (
                  <div key={row.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: "1px solid #222746", fontSize: 12.5 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: "#1B1F42", display: "grid", placeItems: "center", fontSize: 13, flexShrink: 0 }}>{row.icon}</div>
                    <div>
                      <div style={{ fontWeight: 600, color: "#fff" }}>{row.name}</div>
                      <div style={{ fontSize: 10.5, color: row.statusColor }}>{row.status}</div>
                    </div>
                    <span style={{ marginLeft: "auto", fontSize: 10.5, color: "#777CA4", fontFamily: "monospace" }}>{row.imp}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: "#11142F", border: "1px solid #313861", borderRadius: 24, overflow: "hidden" }}>
              <div style={{ padding: "22px 24px 16px" }}>
                <h3 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 21, fontWeight: 600, color: "#fff", display: "flex", alignItems: "center", gap: 10 }}>⚙ Admin Console</h3>
                <p style={{ fontSize: 13, color: "#B0B5D6", marginTop: 6, lineHeight: 1.5 }}>Para operar la fábrica: solicitudes, pipeline FORGE, skills, loops, workers y auditoría.</p>
              </div>
              <div style={{ margin: "0 18px 18px", background: "#151935", border: "1px solid #222746", borderRadius: 14, padding: 16 }}>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                  {[["Intake", 12], ["Sources", 8], ["Extract", 6], ["Analyze", 5], ["Factory", 4], ["Gate", 3]].map(([name, count]) => (
                    <div key={String(name)} style={{ flex: 1, minWidth: 0, background: "#1B1F42", border: "1px solid #222746", borderRadius: 7, padding: "8px 4px", textAlign: "center" }}>
                      <div style={{ fontSize: 9, color: "#777CA4", fontFamily: "monospace" }}>{name}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#D4AF37", fontFamily: "monospace" }}>{count}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 9 }}>
                  {[["Skills", 128], ["Loops", 24], ["Workers", 56], ["Audit", "3,421"]].map(([label, value]) => (
                    <div key={String(label)} style={{ background: "#1B1F42", border: "1px solid #222746", borderRadius: 9, padding: 11 }}>
                      <div style={{ fontSize: 9.5, color: "#777CA4", fontFamily: "monospace", textTransform: "uppercase" }}>{label}</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginTop: 2 }}>{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CASOS DE USO */}
      <section id="casos" style={{ padding: "80px 0" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 32px" }}>
          <h2 style={{ textAlign: "center", fontFamily: "Fraunces, Georgia, serif", fontWeight: 600, fontSize: "clamp(28px,3.6vw,40px)", letterSpacing: "-0.02em", color: "#fff", marginBottom: 14 }}>
            Casos de uso
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18, marginTop: 44 }}>
            {[
              { icon: "🛡", title: "Vigilancia reputacional", desc: "Monitorea tu marca y detecta riesgos en tiempo real.", metric: "▼ 62%", ml: "Incidentes críticos" },
              { icon: "📄", title: "Análisis documental", desc: "Extrae y analiza información clave de cualquier documento.", metric: "▲ 78%", ml: "Eficiencia de análisis" },
              { icon: "🎯", title: "Inteligencia competitiva", desc: "Detecta movimientos, tendencias y oportunidades del mercado.", metric: "▲ 31%", ml: "Oportunidades detectadas" },
              { icon: "📈", title: "Operación comercial", desc: "Potencia tu pipeline y mejora la conversión de oportunidades.", metric: "▲ 27%", ml: "Conversión de pipeline" },
            ].map((c) => (
              <div key={c.title} style={{ background: "#11142F", border: "1px solid #222746", borderRadius: 18, padding: 24 }}>
                <div style={{ width: 42, height: 42, borderRadius: 11, background: "#1B1F42", border: "1px solid #313861", display: "grid", placeItems: "center", fontSize: 19, marginBottom: 16, color: "#D4AF37" }}>{c.icon}</div>
                <h4 style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{c.title}</h4>
                <p style={{ fontSize: 13, color: "#B0B5D6", lineHeight: 1.55, marginBottom: 16, minHeight: 58 }}>{c.desc}</p>
                <div style={{ fontFamily: "monospace", fontSize: 22, fontWeight: 700, color: "#34D17F" }}>{c.metric}</div>
                <div style={{ fontSize: 12, color: "#777CA4", marginTop: 2 }}>{c.ml}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AUTONOMIA CON CONTROL HUMANO */}
      <section style={{ padding: "80px 0", background: "#070920", borderTop: "1px solid #222746", borderBottom: "1px solid #222746" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: ".85fr 1.15fr", gap: 40, alignItems: "center" }}>
            <div>
              <h2 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 32, fontWeight: 600, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: 16 }}>Autonomía con control humano</h2>
              <p style={{ fontSize: 15.5, color: "#B0B5D6", lineHeight: 1.65 }}>Nodematik propone, fabrica y opera. Tú apruebas antes de activar soluciones críticas. La IA hace el trabajo; tú tienes la última palabra.</p>
            </div>
            <div>
              <div style={{ background: "#11142F", border: "1px solid #313861", borderRadius: 24, padding: 28, display: "flex", alignItems: "center", gap: 8 }}>
                {[
                  { icon: "📝", title: "Propuesta generada", desc: "Nodematik diseña la solución" },
                  null,
                  { icon: "👀", title: "Revisión humana", desc: "Evalúas impacto y fuentes" },
                  null,
                  { icon: "✓", title: "Decisión", desc: "Apruebas o rechazas" },
                  null,
                  { icon: "⚡", title: "Activación", desc: "La solución entra en operación" },
                ].map((item, i) =>
                  item === null ? (
                    <span key={i} style={{ color: "#777CA4", fontSize: 15, flexShrink: 0 }}>➜</span>
                  ) : (
                    <div key={i} style={{ flex: 1, textAlign: "center" }}>
                      <div style={{ width: 46, height: 46, borderRadius: 12, background: "#1B1F42", border: "1px solid #313861", display: "grid", placeItems: "center", fontSize: 20, margin: "0 auto 11px", color: "#D4AF37" }}>{item.icon}</div>
                      <b style={{ fontSize: 12.5, color: "#fff", display: "block", marginBottom: 4 }}>{item.title}</b>
                      <span style={{ fontSize: 10.5, color: "#777CA4", lineHeight: 1.4, display: "block" }}>{item.desc}</span>
                    </div>
                  )
                )}
              </div>
              <div style={{ display: "flex", gap: 9, justifyContent: "center", marginTop: 18 }}>
                <button style={{ padding: "9px 18px", borderRadius: 9, fontSize: 12.5, fontWeight: 600, border: "none", background: "#C9A227", color: "#070920", cursor: "pointer" }}>✓ Aprobar</button>
                <button style={{ padding: "9px 18px", borderRadius: 9, fontSize: 12.5, fontWeight: 600, background: "transparent", color: "#B0B5D6", border: "1px solid #313861", cursor: "pointer" }}>✕ Rechazar</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ background: "linear-gradient(120deg,#A8861C,#D4AF37)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -100, bottom: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,255,255,.18),transparent 70%)" }} />
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "56px 32px", display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 36, alignItems: "center", position: "relative" }}>
          <Image src="/logo.png" alt="Nodematik" width={90} height={90} style={{ objectFit: "contain", opacity: 0.95 }} />
          <div>
            <h2 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "clamp(28px,3.4vw,40px)", fontWeight: 600, color: "#070920", letterSpacing: "-0.02em", lineHeight: 1.1 }}>Convierte problemas en soluciones operables.</h2>
            <p style={{ fontSize: 16, color: "rgba(12,14,42,.75)", marginTop: 10 }}>Descubre cómo Nodematik puede convertirse en tu oficina de soluciones.</p>
          </div>
          <Link href="/auth?tab=registro" style={{ background: "#0C0E2A", color: "#fff", padding: "16px 30px", borderRadius: 12, fontWeight: 600, fontSize: 15, whiteSpace: "nowrap", textDecoration: "none" }}>
            Crear mi oficina →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#070920", padding: "40px 0", borderTop: "1px solid #222746" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <Image src="/logo.png" alt="Nodematik" width={40} height={40} style={{ objectFit: "contain" }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, color: "#fff" }}>Nodematik</div>
              <div style={{ fontSize: 11.5, color: "#777CA4" }}>Operador autónomo de soluciones</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 24, fontSize: 13.5, color: "#B0B5D6" }}>
            <Link href="#producto" style={{ color: "#B0B5D6", textDecoration: "none" }}>Producto</Link>
            <Link href="#" style={{ color: "#B0B5D6", textDecoration: "none" }}>Privacidad</Link>
            <Link href="#" style={{ color: "#B0B5D6", textDecoration: "none" }}>Términos</Link>
            <Link href="#" style={{ color: "#B0B5D6", textDecoration: "none" }}>Contacto</Link>
          </div>
          <div style={{ fontSize: 12, color: "#777CA4" }}>© 2026 Nodematik. Todos los derechos reservados.</div>
        </div>
      </footer>
    </div>
  );
}
