import { useState, useEffect, useMemo } from "react";
import Layout from "../components/Layout";
import api from "../utils/api";
import { motion, AnimatePresence } from "framer-motion";

const STAGES = ["All", "New", "Contacted", "Qualified", "Proposal", "Won", "Lost"];
const SOURCES = ["All", "web", "referral", "cold", "event"];

const stageColors = {
  New: { bg: "rgba(59,130,246,0.15)", color: "#60a5fa", border: "rgba(59,130,246,0.3)" },
  Contacted: { bg: "rgba(245,158,11,0.15)", color: "#fbbf24", border: "rgba(245,158,11,0.3)" },
  Qualified: { bg: "rgba(139,92,246,0.15)", color: "#a78bfa", border: "rgba(139,92,246,0.3)" },
  Proposal: { bg: "rgba(249,115,22,0.15)", color: "#fb923c", border: "rgba(249,115,22,0.3)" },
  Won: { bg: "rgba(34,197,94,0.15)", color: "#4ade80", border: "rgba(34,197,94,0.3)" },
  Lost: { bg: "rgba(239,68,68,0.15)", color: "#f87171", border: "rgba(239,68,68,0.3)" },
};

const empty = { name: "", email: "", phone: "", company: "", source: "web", stage: "New", value: "", notes: "" };

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("table");
  const [editLead, setEditLead] = useState(null);

  const fetchLeads = async () => {
    const res = await api.get("/leads");
    setLeads(res.data);
  };

  useEffect(() => { fetchLeads(); }, []);

  const filtered = useMemo(() => {
    let result = [...leads];
    if (search) result = result.filter(l =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.company?.toLowerCase().includes(search.toLowerCase()) ||
      l.email?.toLowerCase().includes(search.toLowerCase())
    );
    if (stageFilter !== "All") result = result.filter(l => l.stage === stageFilter);
    if (sourceFilter !== "All") result = result.filter(l => l.source === sourceFilter);
    if (sortBy === "newest") result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sortBy === "oldest") result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    if (sortBy === "value-high") result.sort((a, b) => (b.value || 0) - (a.value || 0));
    if (sortBy === "value-low") result.sort((a, b) => (a.value || 0) - (b.value || 0));
    if (sortBy === "name") result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [leads, search, stageFilter, sourceFilter, sortBy]);

  const totalValue = filtered.reduce((sum, l) => sum + (l.value || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editLead) {
        await api.patch("/leads/" + editLead._id, form);
        setEditLead(null);
      } else {
        await api.post("/leads", form);
      }
      setForm(empty);
      setShowForm(false);
      fetchLeads();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving lead");
    } finally {
      setLoading(false);
    }
  };

  const updateStage = async (id, stage) => {
    await api.patch("/leads/" + id, { stage });
    fetchLeads();
  };

  const deleteLead = async (id) => {
    if (!confirm("Delete this lead?")) return;
    await api.delete("/leads/" + id);
    fetchLeads();
  };

  const startEdit = (lead) => {
    setForm({ name: lead.name, email: lead.email || "", phone: lead.phone || "",
      company: lead.company || "", source: lead.source, stage: lead.stage,
      value: lead.value || "", notes: lead.notes || "" });
    setEditLead(lead);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Layout>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 900, color: "white" }}>Leads</h1>
          <p style={{ color: "#6b7280", fontSize: "0.875rem", marginTop: "0.25rem" }}>
            {filtered.length} leads · Total value: <span style={{ color: "#f97316", fontWeight: 700 }}>Rs {totalValue.toLocaleString()}</span>
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button onClick={() => setViewMode(viewMode === "table" ? "cards" : "table")}
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              color: "#9ca3af", padding: "0.625rem 1rem", borderRadius: "0.75rem",
              cursor: "pointer", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <i className={"ti " + (viewMode === "table" ? "ti-layout-grid" : "ti-table")}></i>
            {viewMode === "table" ? "Card View" : "Table View"}
          </button>
          <button onClick={() => { setShowForm(!showForm); setEditLead(null); setForm(empty); }}
            style={{ background: "linear-gradient(135deg,#f97316,#ef4444)", color: "white",
              border: "none", padding: "0.625rem 1.25rem", borderRadius: "0.75rem",
              cursor: "pointer", fontSize: "0.875rem", fontWeight: 700,
              display: "flex", alignItems: "center", gap: "0.5rem",
              boxShadow: "0 0 20px rgba(249,115,22,0.3)" }}>
            <i className="ti ti-plus"></i>
            Add Lead
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }} transition={{ duration: 0.3 }}
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(249,115,22,0.2)",
              borderRadius: "1.25rem", padding: "1.5rem", marginBottom: "1.5rem",
              boxShadow: "0 0 40px rgba(249,115,22,0.08)" }}>
            <h2 style={{ color: "white", fontWeight: 700, marginBottom: "1.25rem", fontSize: "1.125rem" }}>
              {editLead ? "Edit Lead" : "New Lead"}
            </h2>
            <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem" }}>
              {[["name","Name",true],["email","Email",false],["phone","Phone",false],
                ["company","Company",false]].map(([field,label,req]) => (
                <div key={field}>
                  <label style={{ display: "block", fontSize: "0.75rem", color: "#6b7280",
                    marginBottom: "0.375rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {label}
                  </label>
                  <input type="text" value={form[field]} onChange={e => setForm({...form,[field]:e.target.value})}
                    required={req}
                    style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                      color: "white", borderRadius: "0.75rem", padding: "0.75rem 1rem", fontSize: "0.875rem",
                      outline: "none", boxSizing: "border-box" }}/>
                </div>
              ))}
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", color: "#6b7280",
                  marginBottom: "0.375rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Source
                </label>
                <select value={form.source} onChange={e => setForm({...form,source:e.target.value})}
                  style={{ width: "100%", background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)",
                    color: "white", borderRadius: "0.75rem", padding: "0.75rem 1rem", fontSize: "0.875rem", outline: "none" }}>
                  {["web","referral","cold","event"].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", color: "#6b7280",
                  marginBottom: "0.375rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Stage
                </label>
                <select value={form.stage} onChange={e => setForm({...form,stage:e.target.value})}
                  style={{ width: "100%", background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)",
                    color: "white", borderRadius: "0.75rem", padding: "0.75rem 1rem", fontSize: "0.875rem", outline: "none" }}>
                  {STAGES.filter(s => s !== "All").map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", color: "#6b7280",
                  marginBottom: "0.375rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Deal Value (Rs)
                </label>
                <input type="number" value={form.value} onChange={e => setForm({...form,value:e.target.value})}
                  style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                    color: "white", borderRadius: "0.75rem", padding: "0.75rem 1rem", fontSize: "0.875rem",
                    outline: "none", boxSizing: "border-box" }}/>
              </div>
              <div style={{ gridColumn: "span 3" }}>
                <label style={{ display: "block", fontSize: "0.75rem", color: "#6b7280",
                  marginBottom: "0.375rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Notes
                </label>
                <textarea value={form.notes} onChange={e => setForm({...form,notes:e.target.value})} rows={2}
                  style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                    color: "white", borderRadius: "0.75rem", padding: "0.75rem 1rem", fontSize: "0.875rem",
                    outline: "none", resize: "vertical", boxSizing: "border-box" }}/>
              </div>
              <div style={{ gridColumn: "span 3", display: "flex", gap: "0.75rem" }}>
                <button type="submit" disabled={loading}
                  style={{ background: "linear-gradient(135deg,#f97316,#ef4444)", color: "white",
                    border: "none", padding: "0.75rem 2rem", borderRadius: "0.75rem",
                    fontWeight: 700, cursor: "pointer", fontSize: "0.875rem" }}>
                  {loading ? "Saving..." : editLead ? "Update Lead" : "Save Lead"}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditLead(null); setForm(empty); }}
                  style={{ background: "rgba(255,255,255,0.05)", color: "#9ca3af",
                    border: "1px solid rgba(255,255,255,0.1)", padding: "0.75rem 1.5rem",
                    borderRadius: "0.75rem", cursor: "pointer", fontSize: "0.875rem" }}>
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search & Filters */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
        {/* Search */}
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <i className="ti ti-search" style={{ position: "absolute", left: "1rem", top: "50%",
            transform: "translateY(-50%)", color: "#6b7280", fontSize: "0.875rem" }}></i>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, company or email..."
            style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
              color: "white", borderRadius: "0.75rem", padding: "0.625rem 1rem 0.625rem 2.5rem",
              fontSize: "0.875rem", outline: "none", boxSizing: "border-box" }}/>
          {search && (
            <button onClick={() => setSearch("")}
              style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", color: "#6b7280", cursor: "pointer" }}>
              <i className="ti ti-x text-xs"></i>
            </button>
          )}
        </div>

        {/* Stage filter */}
        <select value={stageFilter} onChange={e => setStageFilter(e.target.value)}
          style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)",
            color: stageFilter === "All" ? "#6b7280" : "#f97316", borderRadius: "0.75rem",
            padding: "0.625rem 1rem", fontSize: "0.875rem", outline: "none", cursor: "pointer" }}>
          {STAGES.map(s => <option key={s} value={s}>{s === "All" ? "All Stages" : s}</option>)}
        </select>

        {/* Source filter */}
        <select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)}
          style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)",
            color: sourceFilter === "All" ? "#6b7280" : "#f97316", borderRadius: "0.75rem",
            padding: "0.625rem 1rem", fontSize: "0.875rem", outline: "none", cursor: "pointer", textTransform: "capitalize" }}>
          {SOURCES.map(s => <option key={s} value={s}>{s === "All" ? "All Sources" : s}</option>)}
        </select>

        {/* Sort */}
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)",
            color: "#9ca3af", borderRadius: "0.75rem",
            padding: "0.625rem 1rem", fontSize: "0.875rem", outline: "none", cursor: "pointer" }}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="value-high">Highest Value</option>
          <option value="value-low">Lowest Value</option>
          <option value="name">Name A-Z</option>
        </select>

        {/* Clear filters */}
        {(search || stageFilter !== "All" || sourceFilter !== "All") && (
          <button onClick={() => { setSearch(""); setStageFilter("All"); setSourceFilter("All"); }}
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
              color: "#f87171", borderRadius: "0.75rem", padding: "0.625rem 1rem",
              fontSize: "0.875rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.375rem" }}>
            <i className="ti ti-x text-xs"></i> Clear
          </button>
        )}
      </div>

      {/* Stage quick filter pills */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        {STAGES.map(s => {
          const c = s === "All" ? { bg: "rgba(255,255,255,0.05)", color: "#9ca3af", border: "rgba(255,255,255,0.1)" } : stageColors[s];
          const active = stageFilter === s;
          return (
            <button key={s} onClick={() => setStageFilter(s)}
              style={{ padding: "0.375rem 0.875rem", borderRadius: "9999px", fontSize: "0.75rem",
                fontWeight: 600, cursor: "pointer", border: "1px solid",
                borderColor: active ? c.border : "rgba(255,255,255,0.06)",
                background: active ? c.bg : "transparent",
                color: active ? c.color : "#6b7280",
                transition: "all 0.2s" }}>
              {s}
              <span style={{ marginLeft: "0.375rem", opacity: 0.7 }}>
                {s === "All" ? leads.length : leads.filter(l => l.stage === s).length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table View */}
      {viewMode === "table" && (
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "1.25rem", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["Lead","Company","Source","Stage","Value","Added","Actions"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "1rem 1.25rem",
                    fontSize: "0.7rem", fontWeight: 700, color: "#4b5563",
                    textTransform: "uppercase", letterSpacing: "0.1em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: "3rem", color: "#4b5563" }}>
                  No leads found. Try adjusting your filters.
                </td></tr>
              ) : filtered.map((lead, i) => (
                <motion.tr key={lead._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", transition: "background 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(249,115,22,0.03)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div style={{ width: "2.25rem", height: "2.25rem", borderRadius: "0.625rem", flexShrink: 0,
                        background: "linear-gradient(135deg,#f97316,#ef4444)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: 900, color: "white", fontSize: "0.875rem",
                        boxShadow: "0 0 15px rgba(249,115,22,0.2)" }}>
                        {lead.name.charAt(0)}
                      </div>
                      <div>
                        <p style={{ color: "white", fontWeight: 600, fontSize: "0.875rem" }}>{lead.name}</p>
                        <p style={{ color: "#4b5563", fontSize: "0.75rem" }}>{lead.email || "No email"}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "1rem 1.25rem", color: "#9ca3af", fontSize: "0.875rem" }}>
                    {lead.company || "-"}
                  </td>
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <span style={{ fontSize: "0.75rem", padding: "0.25rem 0.625rem", borderRadius: "9999px",
                      background: "rgba(255,255,255,0.05)", color: "#6b7280",
                      textTransform: "capitalize" }}>{lead.source}</span>
                  </td>
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <select value={lead.stage} onChange={e => updateStage(lead._id, e.target.value)}
                      style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem", borderRadius: "9999px",
                        border: "1px solid " + (stageColors[lead.stage]?.border || "#333"),
                        background: stageColors[lead.stage]?.bg || "transparent",
                        color: stageColors[lead.stage]?.color || "white",
                        cursor: "pointer", outline: "none" }}>
                      {STAGES.filter(s => s !== "All").map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: "1rem 1.25rem", color: "#f97316", fontWeight: 700, fontSize: "0.875rem" }}>
                    {lead.value ? "Rs " + Number(lead.value).toLocaleString() : "-"}
                  </td>
                  <td style={{ padding: "1rem 1.25rem", color: "#4b5563", fontSize: "0.75rem" }}>
                    {new Date(lead.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </td>
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button onClick={() => startEdit(lead)}
                        style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)",
                          color: "#60a5fa", borderRadius: "0.5rem", padding: "0.375rem 0.625rem",
                          cursor: "pointer", fontSize: "0.75rem" }}>
                        <i className="ti ti-edit"></i>
                      </button>
                      <button onClick={() => deleteLead(lead._id)}
                        style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
                          color: "#f87171", borderRadius: "0.5rem", padding: "0.375rem 0.625rem",
                          cursor: "pointer", fontSize: "0.75rem" }}>
                        <i className="ti ti-trash"></i>
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Card View */}
      {viewMode === "cards" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "1rem" }}>
          {filtered.length === 0 ? (
            <div style={{ gridColumn: "span 3", textAlign: "center", padding: "3rem", color: "#4b5563" }}>
              No leads found.
            </div>
          ) : filtered.map((lead, i) => (
            <motion.div key={lead._id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "1.25rem", padding: "1.25rem", transition: "all 0.3s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(249,115,22,0.2)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "0.75rem",
                    background: "linear-gradient(135deg,#f97316,#ef4444)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 900, color: "white", boxShadow: "0 0 15px rgba(249,115,22,0.25)" }}>
                    {lead.name.charAt(0)}
                  </div>
                  <div>
                    <p style={{ color: "white", fontWeight: 700, fontSize: "0.875rem" }}>{lead.name}</p>
                    <p style={{ color: "#6b7280", fontSize: "0.75rem" }}>{lead.company || "No company"}</p>
                  </div>
                </div>
                <span style={{ fontSize: "0.7rem", padding: "0.25rem 0.625rem", borderRadius: "9999px",
                  border: "1px solid " + (stageColors[lead.stage]?.border || "#333"),
                  background: stageColors[lead.stage]?.bg || "transparent",
                  color: stageColors[lead.stage]?.color || "white" }}>
                  {lead.stage}
                </span>
              </div>
              {lead.email && <p style={{ color: "#6b7280", fontSize: "0.75rem", marginBottom: "0.5rem" }}>
                <i className="ti ti-mail" style={{ marginRight: "0.375rem", color: "#f97316" }}></i>{lead.email}
              </p>}
              {lead.phone && <p style={{ color: "#6b7280", fontSize: "0.75rem", marginBottom: "0.75rem" }}>
                <i className="ti ti-phone" style={{ marginRight: "0.375rem", color: "#f97316" }}></i>{lead.phone}
              </p>}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                paddingTop: "0.75rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <span style={{ color: "#f97316", fontWeight: 700, fontSize: "0.875rem" }}>
                  {lead.value ? "Rs " + Number(lead.value).toLocaleString() : "No value"}
                </span>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button onClick={() => startEdit(lead)}
                    style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)",
                      color: "#60a5fa", borderRadius: "0.5rem", padding: "0.375rem 0.625rem",
                      cursor: "pointer" }}>
                    <i className="ti ti-edit text-xs"></i>
                  </button>
                  <button onClick={() => deleteLead(lead._id)}
                    style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
                      color: "#f87171", borderRadius: "0.5rem", padding: "0.375rem 0.625rem",
                      cursor: "pointer" }}>
                    <i className="ti ti-trash text-xs"></i>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </Layout>
  );
}
