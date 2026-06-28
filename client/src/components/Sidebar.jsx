import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: "ti-home", color: "#f97316" },
  { to: "/leads", label: "Leads", icon: "ti-users", color: "#3b82f6" },
  { to: "/pipeline", label: "Pipeline", icon: "ti-layout-kanban", color: "#8b5cf6" },
  { to: "/customers", label: "Customers", icon: "ti-building", color: "#22c55e" },
  { to: "/activities", label: "Activities", icon: "ti-calendar", color: "#ec4899" },
  { to: "/emails", label: "Emails", icon: "ti-mail", color: "#f59e0b" },
  { to: "/reports", label: "Reports", icon: "ti-chart-bar", color: "#06b6d4" },
  { to: "/settings", label: "Settings", icon: "ti-settings", color: "#6b7280" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredLink, setHoveredLink] = useState(null);
  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <aside style={{ width: "230px", minHeight: "100vh", display: "flex", flexDirection: "column",
      background: "rgba(8,8,8,0.98)", borderRight: "1px solid rgba(249,115,22,0.08)",
      boxShadow: "4px 0 30px rgba(0,0,0,0.5)", position: "relative", flexShrink: 0 }}>

      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: "linear-gradient(90deg,transparent,rgba(249,115,22,0.5),transparent)" }}></div>

      <div style={{ padding: "1.25rem 1rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
          <div style={{ position: "relative" }}>
            <div style={{ width: "2.25rem", height: "2.25rem", background: "linear-gradient(135deg,#f97316,#dc2626)",
              borderRadius: "0.625rem", display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 15px rgba(249,115,22,0.3)" }}>
              <i className="ti ti-chart-arrows" style={{ color: "white", fontSize: "1rem" }}></i>
            </div>
            <div style={{ position: "absolute", inset: 0, background: "rgba(249,115,22,0.3)",
              borderRadius: "0.625rem", filter: "blur(6px)" }} className="animate-pulse"></div>
          </div>
          <div>
            <p style={{ fontWeight: 900, fontSize: "1rem", background: "linear-gradient(135deg,#f97316,#fb923c)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1, margin: 0 }}>SalesFlow</p>
            <p style={{ color: "#374151", fontSize: "0.6rem", marginTop: "1px", margin: 0 }}>CRM Platform</p>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: "0.75rem 0.5rem", overflowY: "auto" }}>
        <p style={{ color: "#1f2937", fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase",
          letterSpacing: "0.15em", padding: "0 0.75rem", marginBottom: "0.5rem" }}>Main Menu</p>
        {links.map(link => {
          const isActive = location.pathname === link.to;
          return (
            <NavLink key={link.to} to={link.to}
              onMouseEnter={() => setHoveredLink(link.to)}
              onMouseLeave={() => setHoveredLink(null)}
              style={{ display: "flex", alignItems: "center", gap: "0.625rem",
                padding: "0.5rem 0.75rem", borderRadius: "0.75rem", marginBottom: "0.2rem",
                textDecoration: "none", transition: "all 0.2s", position: "relative",
                background: isActive ? "rgba(249,115,22,0.1)" : hoveredLink === link.to ? "rgba(255,255,255,0.03)" : "transparent",
                border: isActive ? "1px solid rgba(249,115,22,0.2)" : "1px solid transparent" }}>
              {isActive && (
                <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
                  width: "3px", height: "60%", background: "linear-gradient(180deg,#f97316,#ef4444)",
                  borderRadius: "0 9999px 9999px 0" }}></div>
              )}
              <div style={{ width: "1.75rem", height: "1.75rem", borderRadius: "0.5rem", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: isActive ? link.color + "20" : "rgba(255,255,255,0.04)",
                border: isActive ? "1px solid " + link.color + "30" : "1px solid transparent" }}>
                <i className={"ti " + link.icon} style={{ fontSize: "0.875rem",
                  color: isActive ? link.color : "#4b5563" }}></i>
              </div>
              <span style={{ fontSize: "0.8rem", fontWeight: isActive ? 600 : 400,
                color: isActive ? "white" : "#6b7280" }}>{link.label}</span>
              {isActive && (
                <div style={{ marginLeft: "auto", width: "0.375rem", height: "0.375rem",
                  borderRadius: "50%", background: link.color,
                  boxShadow: "0 0 6px " + link.color }} className="animate-pulse"></div>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div style={{ padding: "0.75rem 0.5rem", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(249,115,22,0.08)",
          borderRadius: "0.875rem", padding: "0.75rem", marginBottom: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <div style={{ position: "relative" }}>
              <div style={{ width: "2rem", height: "2rem", borderRadius: "0.625rem",
                background: "linear-gradient(135deg,#f97316,#ef4444)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 900, color: "white", fontSize: "0.75rem" }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div style={{ position: "absolute", bottom: "-2px", right: "-2px", width: "8px", height: "8px",
                background: "#4ade80", borderRadius: "50%", border: "2px solid #080808" }}></div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: "white", fontSize: "0.75rem", fontWeight: 600, margin: 0,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.name}</p>
              <p style={{ color: "#f97316", fontSize: "0.65rem", textTransform: "capitalize", opacity: 0.7, margin: 0 }}>{user?.role}</p>
            </div>
          </div>
        </div>
        <button onClick={handleLogout}
          style={{ width: "100%", display: "flex", alignItems: "center", gap: "0.625rem",
            padding: "0.5rem 0.75rem", borderRadius: "0.75rem", background: "none",
            border: "1px solid transparent", cursor: "pointer", color: "#4b5563",
            fontSize: "0.8rem", transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.color = "#f87171"; e.currentTarget.style.background = "rgba(239,68,68,0.05)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "#4b5563"; e.currentTarget.style.background = "none"; }}>
          <i className="ti ti-logout"></i> Sign Out
        </button>
      </div>
    </aside>
  );
}
