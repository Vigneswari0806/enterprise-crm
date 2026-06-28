import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import api from "../utils/api";
import { motion, AnimatePresence } from "framer-motion";

const STAGES = ["All", "New", "Contacted", "Qualified", "Proposal", "Won", "Lost"];

export default function Emails() {
  const [leads, setLeads] = useState([]);
  const [tab, setTab] = useState("single");
  const [form, setForm] = useState({ to: "", subject: "", body: "", leadId: "" });
  const [bulk, setBulk] = useState({ subject: "", body: "", stage: "All" });
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    api.get("/leads").then(res => setLeads(res.data));
  }, []);

  const sendSingle = async (e) => {
    e.preventDefault();
    setSending(true);
    setResult(null);
    try {
      const res = await api.post("/emails/send", form);
      setResult({ type: "success", message: res.data.message });
      setForm({ to: "", subject: "", body: "", leadId: "" });
    } catch (err) {
      setResult({ type: "error", message: err.response?.data?.message || "Failed to send" });
    } finally {
      setSending(false);
    }
  };

  const sendBulk = async (e) => {
    e.preventDefault();
    setSending(true);
    setResult(null);
    try {
      const res = await api.post("/emails/send-bulk", bulk);
      setResult({ type: "success", message: res.data.message });
      setBulk({ subject: "", body: "", stage: "All" });
    } catch (err) {
      setResult({ type: "error", message: err.response?.data?.message || "Failed to send" });
    } finally {
      setSending(false);
    }
  };

  const selectLead = (leadId) => {
    const lead = leads.find(l => l._id === leadId);
    setForm(prev => ({ ...prev, leadId, to: lead?.email || "" }));
  };

  const bulkCount = bulk.stage === "All"
    ? leads.filter(l => l.email).length
    : leads.filter(l => l.stage === bulk.stage && l.email).length;

  const inputStyle = {
    width: "100%", background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)", color: "white",
    borderRadius: "0.75rem", padding: "0.75rem 1rem",
    fontSize: "0.875rem", outline: "none", boxSizing: "border-box",
    transition: "all 0.2s",
  };

  return (
    <Layout>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 900, color: "white" }}>Email Center</h1>
        <p style={{ color: "#6b7280", fontSize: "0.875rem", marginTop: "0.25rem" }}>
          Send emails to leads directly from your CRM
        </p>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ marginBottom: "1.5rem", padding: "1rem 1.25rem", borderRadius: "0.875rem",
              display: "flex", alignItems: "center", gap: "0.75rem",
              background: result.type === "success" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
              border: "1px solid " + (result.type === "success" ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"),
              color: result.type === "success" ? "#4ade80" : "#f87171" }}>
            <i className={"ti " + (result.type === "success" ? "ti-circle-check" : "ti-alert-triangle")}
              style={{ fontSize: "1.25rem" }}></i>
            <p style={{ fontWeight: 600, margin: 0 }}>{result.message}</p>
            <button onClick={() => setResult(null)} style={{ marginLeft: "auto", background: "none",
              border: "none", cursor: "pointer", color: "inherit", fontSize: "1rem" }}>
              <i className="ti ti-x"></i>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem",
        background: "rgba(255,255,255,0.03)", padding: "0.375rem",
        borderRadius: "0.875rem", border: "1px solid rgba(255,255,255,0.06)", width: "fit-content" }}>
        {[
          { id: "single", label: "Single Email", icon: "ti-mail" },
          { id: "bulk", label: "Bulk Email", icon: "ti-send" },
        ].map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); setResult(null); }}
            style={{ padding: "0.625rem 1.25rem", borderRadius: "0.625rem", border: "none",
              cursor: "pointer", fontSize: "0.875rem", fontWeight: 600,
              display: "flex", alignItems: "center", gap: "0.5rem", transition: "all 0.2s",
              background: tab === t.id ? "linear-gradient(135deg,#f97316,#ef4444)" : "transparent",
              color: tab === t.id ? "white" : "#6b7280",
              boxShadow: tab === t.id ? "0 0 15px rgba(249,115,22,0.3)" : "none" }}>
            <i className={"ti " + t.icon}></i>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "1.5rem" }}>
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "1.25rem", padding: "1.75rem" }}>
          {tab === "single" ? (
            <form onSubmit={sendSingle} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <h2 style={{ color: "white", fontWeight: 700, margin: 0, fontSize: "1.125rem" }}>Send to a Lead</h2>
              <div>
                <label style={{ display: "block", color: "#6b7280", fontSize: "0.75rem",
                  fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>
                  Select Lead (optional)
                </label>
                <select value={form.leadId} onChange={e => selectLead(e.target.value)}
                  style={{ ...inputStyle, background: "#111" }}>
                  <option value="">-- Pick a lead to autofill email --</option>
                  {leads.filter(l => l.email).map(l => (
                    <option key={l._id} value={l._id}>{l.name} — {l.email}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: "block", color: "#6b7280", fontSize: "0.75rem",
                  fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>
                  To (Email)
                </label>
                <input type="email" value={form.to} onChange={e => setForm({...form, to: e.target.value})}
                  placeholder="recipient@example.com" required style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "rgba(249,115,22,0.5)"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}/>
              </div>
              <div>
                <label style={{ display: "block", color: "#6b7280", fontSize: "0.75rem",
                  fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>
                  Subject
                </label>
                <input type="text" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}
                  placeholder="Follow-up on your inquiry" required style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "rgba(249,115,22,0.5)"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}/>
              </div>
              <div>
                <label style={{ display: "block", color: "#6b7280", fontSize: "0.75rem",
                  fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>
                  Message
                </label>
                <textarea value={form.body} onChange={e => setForm({...form, body: e.target.value})}
                  placeholder="Write your email message here..." required rows={8}
                  style={{ ...inputStyle, resize: "vertical" }}
                  onFocus={e => e.target.style.borderColor = "rgba(249,115,22,0.5)"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}/>
              </div>
              <button type="submit" disabled={sending}
                style={{ background: "linear-gradient(135deg,#f97316,#ef4444)", color: "white",
                  border: "none", padding: "0.875rem", borderRadius: "0.875rem",
                  fontWeight: 700, fontSize: "0.875rem", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                  boxShadow: "0 0 20px rgba(249,115,22,0.3)", opacity: sending ? 0.6 : 1 }}>
                {sending ? <><i className="ti ti-loader animate-rotate"></i> Sending...</> : <><i className="ti ti-send"></i> Send Email</>}
              </button>
            </form>
          ) : (
            <form onSubmit={sendBulk} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <h2 style={{ color: "white", fontWeight: 700, margin: "0 0 0.25rem", fontSize: "1.125rem" }}>Bulk Email</h2>
                <p style={{ color: "#6b7280", fontSize: "0.8rem", margin: 0 }}>Send to multiple leads at once</p>
              </div>
              <div>
                <label style={{ display: "block", color: "#6b7280", fontSize: "0.75rem",
                  fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>
                  Filter by Stage
                </label>
                <select value={bulk.stage} onChange={e => setBulk({...bulk, stage: e.target.value})}
                  style={{ ...inputStyle, background: "#111" }}>
                  {STAGES.map(s => <option key={s} value={s}>{s === "All" ? "All Leads" : s}</option>)}
                </select>
                <p style={{ color: "#f97316", fontSize: "0.75rem", marginTop: "0.5rem", fontWeight: 600 }}>
                  {bulkCount} leads with email will receive this
                </p>
              </div>
              <div>
                <label style={{ display: "block", color: "#6b7280", fontSize: "0.75rem",
                  fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>
                  Subject
                </label>
                <input type="text" value={bulk.subject} onChange={e => setBulk({...bulk, subject: e.target.value})}
                  placeholder="Special offer for you!" required style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "rgba(249,115,22,0.5)"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}/>
              </div>
              <div>
                <label style={{ display: "block", color: "#6b7280", fontSize: "0.75rem",
                  fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>
                  Message
                </label>
                <textarea value={bulk.body} onChange={e => setBulk({...bulk, body: e.target.value})}
                  placeholder="Write your bulk email message..." required rows={8}
                  style={{ ...inputStyle, resize: "vertical" }}
                  onFocus={e => e.target.style.borderColor = "rgba(249,115,22,0.5)"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}/>
              </div>
              <button type="submit" disabled={sending || bulkCount === 0}
                style={{ background: "linear-gradient(135deg,#f97316,#ef4444)", color: "white",
                  border: "none", padding: "0.875rem", borderRadius: "0.875rem",
                  fontWeight: 700, fontSize: "0.875rem", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                  boxShadow: "0 0 20px rgba(249,115,22,0.3)", opacity: sending || bulkCount === 0 ? 0.6 : 1 }}>
                {sending ? <><i className="ti ti-loader animate-rotate"></i> Sending...</> : <><i className="ti ti-send"></i> Send to {bulkCount} Leads</>}
              </button>
            </form>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.15)",
            borderRadius: "1.25rem", padding: "1.5rem" }}>
            <h3 style={{ color: "#fb923c", fontWeight: 700, marginBottom: "1rem", fontSize: "0.875rem",
              display: "flex", alignItems: "center", gap: "0.5rem", margin: "0 0 1rem" }}>
              <i className="ti ti-bulb"></i> Email Tips
            </h3>
            {[
              { icon: "ti-target", tip: "Keep subject lines under 50 characters" },
              { icon: "ti-clock", tip: "Best time: Tuesday-Thursday, 9am-11am" },
              { icon: "ti-user", tip: "Personalize with the lead name" },
              { icon: "ti-link", tip: "Include one clear call-to-action" },
            ].map((t, i) => (
              <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", marginBottom: "0.875rem" }}>
                <div style={{ width: "1.75rem", height: "1.75rem", borderRadius: "0.5rem", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(249,115,22,0.15)" }}>
                  <i className={"ti " + t.icon} style={{ color: "#f97316", fontSize: "0.8rem" }}></i>
                </div>
                <p style={{ color: "#9ca3af", fontSize: "0.8rem", lineHeight: 1.5, margin: 0 }}>{t.tip}</p>
              </div>
            ))}
          </div>

          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "1.25rem", padding: "1.5rem" }}>
            <h3 style={{ color: "white", fontWeight: 700, marginBottom: "1rem", fontSize: "0.875rem", margin: "0 0 1rem" }}>
              Leads with Email ({leads.filter(l => l.email).length})
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "260px", overflowY: "auto" }}>
              {leads.filter(l => l.email).map(l => (
                <div key={l._id} style={{ display: "flex", alignItems: "center", gap: "0.625rem",
                  padding: "0.5rem 0.75rem", borderRadius: "0.625rem",
                  background: "rgba(255,255,255,0.02)", cursor: "pointer", transition: "all 0.2s" }}
                  onClick={() => { setTab("single"); selectLead(l._id); }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(249,115,22,0.06)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}>
                  <div style={{ width: "1.75rem", height: "1.75rem", borderRadius: "0.5rem", flexShrink: 0,
                    background: "linear-gradient(135deg,#f97316,#ef4444)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 900, color: "white", fontSize: "0.7rem" }}>
                    {l.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: "white", fontSize: "0.75rem", fontWeight: 600, margin: 0,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.name}</p>
                    <p style={{ color: "#6b7280", fontSize: "0.7rem", margin: 0,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.email}</p>
                  </div>
                  <i className="ti ti-mail" style={{ color: "#f97316", fontSize: "0.75rem" }}></i>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
