import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import api from "../utils/api";
import { motion, AnimatePresence } from "framer-motion";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/leads").then(res => {
      setCustomers(res.data.filter(l => l.stage === "Won"));
      setLoading(false);
    });
  }, []);

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.company?.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = customers.reduce((sum, c) => sum + (c.value || 0), 0);

  return (
    <Layout>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 900, color: "white" }}>Customers</h1>
        <p style={{ color: "#6b7280", fontSize: "0.875rem", marginTop: "0.25rem" }}>
          Leads that have been converted to customers (Won stage)
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem", marginBottom: "2rem" }}>
        {[
          { label: "Total Customers", value: customers.length, icon: "ti-users", color: "#f97316" },
          { label: "Total Revenue", value: "Rs " + totalRevenue.toLocaleString(), icon: "ti-currency-rupee", color: "#22c55e" },
          { label: "Avg Deal Size", value: customers.length ? "Rs " + Math.round(totalRevenue / customers.length).toLocaleString() : "Rs 0", icon: "ti-chart-bar", color: "#8b5cf6" },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "1.25rem", padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: "3rem", height: "3rem", borderRadius: "0.875rem", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: s.color + "15", border: "1px solid " + s.color + "30" }}>
              <i className={"ti " + s.icon} style={{ color: s.color, fontSize: "1.25rem" }}></i>
            </div>
            <div>
              <p style={{ color: "#6b7280", fontSize: "0.75rem" }}>{s.label}</p>
              <p style={{ color: "white", fontWeight: 900, fontSize: "1.25rem" }}>{s.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: "1.5rem" }}>
        <i className="ti ti-search" style={{ position: "absolute", left: "1rem", top: "50%",
          transform: "translateY(-50%)", color: "#6b7280" }}></i>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search customers..."
          style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            color: "white", borderRadius: "0.75rem", padding: "0.75rem 1rem 0.75rem 2.5rem",
            fontSize: "0.875rem", outline: "none", boxSizing: "border-box" }}/>
      </div>

      {/* Customer cards */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>Loading customers...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem",
          background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "1.25rem", color: "#4b5563" }}>
          <i className="ti ti-users" style={{ fontSize: "3rem", marginBottom: "1rem", display: "block", color: "#1f2937" }}></i>
          <p>No customers yet. Win some deals to see them here!</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "1rem" }}>
          {filtered.map((c, i) => (
            <motion.div key={c._id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 }}
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(34,197,94,0.15)",
                borderRadius: "1.25rem", padding: "1.5rem", transition: "all 0.3s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(34,197,94,0.35)"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 20px 60px rgba(34,197,94,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(34,197,94,0.15)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
                <div style={{ width: "3rem", height: "3rem", borderRadius: "0.875rem", flexShrink: 0,
                  background: "linear-gradient(135deg,#22c55e,#16a34a)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 900, color: "white", fontSize: "1.125rem",
                  boxShadow: "0 0 20px rgba(34,197,94,0.25)" }}>
                  {c.name.charAt(0)}
                </div>
                <div>
                  <p style={{ color: "white", fontWeight: 700 }}>{c.name}</p>
                  <p style={{ color: "#6b7280", fontSize: "0.75rem" }}>{c.company || "Independent"}</p>
                </div>
                <div style={{ marginLeft: "auto", background: "rgba(34,197,94,0.1)",
                  border: "1px solid rgba(34,197,94,0.25)", color: "#4ade80",
                  fontSize: "0.7rem", fontWeight: 700, padding: "0.25rem 0.625rem", borderRadius: "9999px" }}>
                  Customer
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem",
                paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                {[
                  { icon: "ti-mail", label: "Email", value: c.email || "Not provided" },
                  { icon: "ti-phone", label: "Phone", value: c.phone || "Not provided" },
                  { icon: "ti-world", label: "Source", value: c.source || "-", capitalize: true },
                  { icon: "ti-currency-rupee", label: "Deal Value", value: c.value ? "Rs " + Number(c.value).toLocaleString() : "-", highlight: true },
                ].map((item, j) => (
                  <div key={j}>
                    <p style={{ color: "#4b5563", fontSize: "0.65rem", textTransform: "uppercase",
                      letterSpacing: "0.08em", marginBottom: "0.25rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      <i className={"ti " + item.icon} style={{ color: "#f97316", fontSize: "0.75rem" }}></i>
                      {item.label}
                    </p>
                    <p style={{ color: item.highlight ? "#f97316" : "#9ca3af", fontSize: "0.8rem",
                      fontWeight: item.highlight ? 700 : 400,
                      textTransform: item.capitalize ? "capitalize" : "none",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {c.notes && (
                <div style={{ marginTop: "1rem", padding: "0.75rem", borderRadius: "0.75rem",
                  background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <p style={{ color: "#6b7280", fontSize: "0.75rem", lineHeight: 1.5 }}>
                    <i className="ti ti-note" style={{ color: "#f97316", marginRight: "0.375rem" }}></i>
                    {c.notes}
                  </p>
                </div>
              )}

              <div style={{ marginTop: "1rem", fontSize: "0.7rem", color: "#374151", display: "flex", alignItems: "center", gap: "0.375rem" }}>
                <i className="ti ti-calendar" style={{ color: "#f97316" }}></i>
                Won on {new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </Layout>
  );
}
