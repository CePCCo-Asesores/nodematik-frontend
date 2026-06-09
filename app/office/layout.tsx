"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { getToken } from "@/lib/auth";
import {
  Home,
  FileText,
  Shield,
  Layers,
  RefreshCw,
  BarChart2,
  Settings,
  Bell,
  ChevronDown,
  Plus,
  Search,
} from "lucide-react";

const navItems = [
  { icon: Home, label: "Mi Oficina", href: "/office" },
  { icon: FileText, label: "Solicitudes", href: "/office/solicitudes" },
  { icon: Shield, label: "Aprobaciones", href: "/office/aprobaciones", badge: 2 },
  { icon: Layers, label: "Soluciones", href: "/office/soluciones" },
  { icon: RefreshCw, label: "Loops", href: "/office/loops" },
  { icon: BarChart2, label: "Resultados", href: "/office/resultados" },
  { icon: Settings, label: "Configuración", href: "/config" },
];

export default function OfficeLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [userInitials, setUserInitials] = useState("AC");

  useEffect(() => {
    if (!getToken()) { router.push("/auth"); return; }
  }, [router]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "236px 1fr", minHeight: "100vh", background: "#F7F8FC", fontFamily: "var(--font-inter), system-ui, sans-serif", color: "#14162E", WebkitFontSmoothing: "antialiased" }}>
      {/* SIDEBAR */}
      <aside style={{ background: "#FFFFFF", borderRight: "1px solid #EAECF4", padding: "22px 14px", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh", overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 10px 26px" }}>
          <Image src="/logo.png" alt="Nodematik" width={30} height={30} style={{ objectFit: "contain", flexShrink: 0 }} />
          <span style={{ fontWeight: 800, fontSize: 20, letterSpacing: "-0.03em", color: "#1B1F5A" }}>Nodematik</span>
        </div>

        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/office" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 13,
                padding: "11px 12px",
                borderRadius: 11,
                color: isActive ? "#fff" : "#54586F",
                fontSize: 14.5,
                fontWeight: isActive ? 600 : 500,
                transition: ".15s",
                background: isActive ? "#1B1F5A" : "transparent",
                boxShadow: isActive ? "0 4px 12px rgba(27,31,90,.22)" : "none",
                marginBottom: 2,
                textDecoration: "none",
                position: "relative",
              }}
            >
              <Icon size={18} style={{ opacity: 0.9, flexShrink: 0 }} />
              {item.label}
              {item.badge && (
                <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, background: "#C9A227", color: "#070920", width: 20, height: 20, borderRadius: 7, display: "grid", placeItems: "center" }}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* FAB Nueva Solución */}
        <div style={{ marginTop: 16 }}>
          <Link
            href="/office/nueva-solucion"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 14px",
              borderRadius: 11,
              background: "#C9A227",
              color: "#070920",
              fontWeight: 700,
              fontSize: 14,
              textDecoration: "none",
              justifyContent: "center",
            }}
          >
            <Plus size={16} />
            Nueva Solución
          </Link>
        </div>

        {/* Help */}
        <div style={{ marginTop: "auto" }}>
          <div style={{ background: "#F7F8FC", border: "1px solid #EAECF4", borderRadius: 13, padding: 14, display: "flex", gap: 11, alignItems: "flex-start" }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: "#EEF0FB", color: "#252A78", display: "grid", placeItems: "center", flexShrink: 0 }}>
              <Shield size={15} />
            </div>
            <div>
              <b style={{ fontSize: 13, fontWeight: 700, color: "#1B1F5A", display: "block", lineHeight: 1.3 }}>Humano en el control</b>
              <p style={{ fontSize: 12, color: "#54586F", margin: "3px 0 6px", lineHeight: 1.4 }}>La IA propone, tú decides.</p>
              <a href="#" style={{ fontSize: 12.5, color: "#A8861C", fontWeight: 600, textDecoration: "none" }}>Saber más →</a>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div style={{ minWidth: 0, display: "flex", flexDirection: "column" }}>
        {/* TOPBAR */}
        <div style={{ padding: "18px 30px", display: "flex", alignItems: "center", gap: 20, position: "sticky", top: 0, zIndex: 40, background: "rgba(247,248,252,.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid #EAECF4" }}>
          <div style={{ flex: 1, maxWidth: 680, position: "relative" }}>
            <Search size={16} style={{ position: "absolute", left: 17, top: "50%", transform: "translateY(-50%)", color: "#9094AC" }} />
            <input
              placeholder="¿Qué necesitas resolver hoy?"
              style={{ width: "100%", background: "#FFFFFF", border: "1px solid #DCDFEC", borderRadius: 13, padding: "14px 18px 14px 46px", fontFamily: "inherit", fontSize: 15, color: "#14162E", outline: "none", boxShadow: "0 1px 2px rgba(20,22,46,.04)" }}
              autoComplete="off"
            />
            <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", fontFamily: "monospace", fontSize: 12, color: "#9094AC", background: "#F7F8FC", border: "1px solid #EAECF4", borderRadius: 6, padding: "2px 7px" }}>⌘ K</span>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 14 }}>
            <Link
              href="/office/nueva-solucion"
              style={{ padding: "9px 15px", fontSize: 13, borderRadius: 9, background: "#1B1F5A", color: "#fff", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 6, boxShadow: "0 6px 16px rgba(27,31,90,.22)" }}
            >
              <Plus size={14} />
              Nueva solución
            </Link>
            <div style={{ position: "relative", width: 42, height: 42, borderRadius: 12, background: "#FFFFFF", border: "1px solid #DCDFEC", display: "grid", placeItems: "center", fontSize: 17, cursor: "pointer" }}>
              <Bell size={17} color="#54586F" />
              <span style={{ position: "absolute", top: -5, right: -5, background: "#C9A227", color: "#070920", fontSize: 10.5, fontWeight: 700, width: 18, height: 18, borderRadius: "50%", display: "grid", placeItems: "center", border: "2px solid #F7F8FC" }}>3</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#FFFFFF", border: "1px solid #DCDFEC", borderRadius: 12, padding: "5px 12px 5px 6px", cursor: "pointer" }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: "#1B1F5A", color: "#E3C65B", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 12.5, fontFamily: "monospace" }}>
                {userInitials}
              </div>
              <ChevronDown size={14} color="#54586F" />
            </div>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
