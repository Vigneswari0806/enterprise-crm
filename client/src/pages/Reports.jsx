import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import api from "../utils/api";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Reports() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState("");

  useEffect(() => {
    api.get("/leads").then(res => { setLeads(res.data); setLoading(false); });
  }, []);

  const totalRevenue = leads.filter(l => l.stage === "Won").reduce((sum, l) => sum + (l.value || 0), 0);
  const winRate = leads.length ? Math.round((leads.filter(l => l.stage === "Won").length / leads.length) * 100) : 0;

  const byStage = ["New","Contacted","Qualified","Proposal","Won","Lost"].map(stage => ({
    stage, count: leads.filter(l => l.stage === stage).length,
    value: leads.filter(l => l.stage === stage).reduce((sum, l) => sum + (l.value || 0), 0),
  }));

  const bySource = ["web","referral","cold","event"].map(source => ({
    source, count: leads.filter(l => l.source === source).length,
    value: leads.filter(l => l.source === source).reduce((sum, l) => sum + (l.value || 0), 0),
  }));

  const exportPDF = () => {
    setExporting("pdf");
    const doc = new jsPDF();

    // Header
    doc.setFillColor(249, 115, 22);
    doc.rect(0, 0, 220, 30, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("SalesFlow CRM - Sales Report", 14, 18);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Generated on " + new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }), 14, 26);

    // Summary
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Summary", 14, 45);

    autoTable(doc, {
      startY: 50,
      head: [["Metric", "Value"]],
      body: [
        ["Total Leads", leads.length],
        ["Won Deals", leads.filter(l => l.stage === "Won").length],
        ["Lost Deals", leads.filter(l => l.stage === "Lost").length],
        ["Win Rate", winRate + "%"],
        ["Total Revenue", "Rs " + totalRevenue.toLocaleString()],
        ["Avg Deal Size", leads.filter(l=>l.stage==="Won").length ? "Rs " + Math.round(totalRevenue / leads.filter(l=>l.stage==="Won").length).toLocaleString() : "Rs 0"],
      ],
      headStyles: { fillColor: [249, 115, 22], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [255, 248, 240] },
      styles: { fontSize: 11 },
    });

    // By Stage
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Leads by Stage", 14, doc.lastAutoTable.finalY + 20);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 25,
      head: [["Stage", "Count", "Total Value"]],
      body: byStage.map(s => [s.stage, s.count, "Rs " + s.value.toLocaleString()]),
      headStyles: { fillColor: [249, 115, 22], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [255, 248, 240] },
    });

    // All Leads
    doc.addPage();
    doc.setFillColor(249, 115, 22);
    doc.rect(0, 0, 220, 20, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("All Leads", 14, 13);

    autoTable(doc, {
      startY: 25,
      head: [["Name", "Company", "Email", "Source", "Stage", "Value"]],
      body: leads.map(l => [
        l.name, l.company || "-", l.email || "-",
        l.source, l.stage, l.value ? "Rs " + Number(l.value).toLocaleString() : "-"
      ]),
      headStyles: { fillColor: [249, 115, 22], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [255, 248, 240] },
      styles: { fontSize: 9 },
    });

    doc.save("SalesFlow-Report-" + new Date().toISOString().slice(0,10) + ".pdf");
    setExporting("");
  };

  const exportExcel = () => {
    setExporting("excel");
    const wb = XLSX.utils.book_new();

    // Summary sheet
    const summaryData = [
      ["SalesFlow CRM - Sales Report"],
      ["Generated on", new Date().toLocaleDateString("en-IN")],
      [],
      ["SUMMARY"],
      ["Metric", "Value"],
      ["Total Leads", leads.length],
      ["Won Deals", leads.filter(l => l.stage === "Won").length],
      ["Lost Deals", leads.filter(l => l.stage === "Lost").length],
      ["Win Rate", winRate + "%"],
      ["Total Revenue", "Rs " + totalRevenue.toLocaleString()],
      [],
      ["BY STAGE"],
      ["Stage", "Count", "Total Value"],
      ...byStage.map(s => [s.stage, s.count, "Rs " + s.value.toLocaleString()]),
      [],
      ["BY SOURCE"],
      ["Source", "Count", "Total Value"],
      ...bySource.map(s => [s.source, s.count, "Rs " + s.value.toLocaleString()]),
    ];
    const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, ws1, "Summary");

    // All leads sheet
    const leadsData = [
      ["Name", "Company", "Email", "Phone", "Source", "Stage", "Value", "Notes", "Created"],
      ...leads.map(l => [
        l.name, l.company || "", l.email || "", l.phone || "",
        l.source, l.stage, l.value || 0, l.notes || "",
        new Date(l.createdAt).toLocaleDateString("en-IN")
      ])
    ];
    const ws2 = XLSX.utils.aoa_to_sheet(leadsData);
    XLSX.utils.book_append_sheet(wb, ws2, "All Leads");

    // Won deals sheet
    const wonData = [
      ["Name", "Company", "Email", "Value", "Source", "Notes"],
      ...leads.filter(l => l.stage === "Won").map(l => [
        l.name, l.company || "", l.email || "", l.value || 0, l.source, l.notes || ""
      ])
    ];
    const ws3 = XLSX.utils.aoa_to_sheet(wonData);
    XLSX.utils.book_append_sheet(wb, ws3, "Won Deals");

    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }),
      "SalesFlow-Report-" + new Date().toISOString().slice(0,10) + ".xlsx");
    setExporting("");
  };

  const stageColors = {
    New: "#3b82f6", Contacted: "#f59e0b", Qualified: "#8b5cf6",
    Proposal: "#f97316", Won: "#22c55e", Lost: "#ef4444"
  };

  return (
    <Layout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 900, color: "white" }}>Reports</h1>
          <p style={{ color: "#6b7280", fontSize: "0.875rem", marginTop: "0.25rem" }}>
            Sales analytics and data export
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button onClick={exportExcel} disabled={loading || exporting === "excel"}
            style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)",
              color: "#4ade80", padding: "0.625rem 1.25rem", borderRadius: "0.75rem",
              cursor: "pointer", fontSize: "0.875rem", fontWeight: 700,
              display: "flex", alignItems: "center", gap: "0.5rem", transition: "all 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(34,197,94,0.2)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(34,197,94,0.1)"}>
            <i className="ti ti-file-spreadsheet"></i>
            {exporting === "excel" ? "Exporting..." : "Export Excel"}
          </button>
          <button onClick={exportPDF} disabled={loading || exporting === "pdf"}
            style={{ background: "linear-gradient(135deg,#f97316,#ef4444)", color: "white",
              border: "none", padding: "0.625rem 1.25rem", borderRadius: "0.75rem",
              cursor: "pointer", fontSize: "0.875rem", fontWeight: 700,
              display: "flex", alignItems: "center", gap: "0.5rem",
              boxShadow: "0 0 20px rgba(249,115,22,0.3)", transition: "all 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
            <i className="ti ti-file-type-pdf"></i>
            {exporting === "pdf" ? "Exporting..." : "Export PDF"}
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", marginBottom: "2rem" }}>
        {[
          { label: "Total Leads", value: leads.length, icon: "ti-users", color: "#f97316" },
          { label: "Won Deals", value: leads.filter(l=>l.stage==="Won").length, icon: "ti-trophy", color: "#22c55e" },
          { label: "Win Rate", value: winRate + "%", icon: "ti-target", color: "#8b5cf6" },
          { label: "Total Revenue", value: "Rs " + totalRevenue.toLocaleString(), icon: "ti-currency-rupee", color: "#3b82f6" },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "1.25rem", padding: "1.25rem" }}>
            <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "0.75rem", marginBottom: "0.75rem",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: s.color + "15", border: "1px solid " + s.color + "30" }}>
              <i className={"ti " + s.icon} style={{ color: s.color, fontSize: "1.125rem" }}></i>
            </div>
            <p style={{ color: "#6b7280", fontSize: "0.75rem", marginBottom: "0.25rem" }}>{s.label}</p>
            <p style={{ color: "white", fontWeight: 900, fontSize: "1.5rem" }}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
        {/* By Stage */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "1.25rem", padding: "1.5rem" }}>
          <h2 style={{ color: "white", fontWeight: 700, marginBottom: "1.25rem", fontSize: "1rem" }}>
            Pipeline by Stage
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            {byStage.map((s, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.375rem" }}>
                  <span style={{ color: "#9ca3af", fontSize: "0.8rem" }}>{s.stage}</span>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <span style={{ color: stageColors[s.stage], fontSize: "0.8rem", fontWeight: 700 }}>{s.count} leads</span>
                    <span style={{ color: "#6b7280", fontSize: "0.8rem" }}>Rs {s.value.toLocaleString()}</span>
                  </div>
                </div>
                <div style={{ height: "6px", background: "rgba(255,255,255,0.05)", borderRadius: "9999px", overflow: "hidden" }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: leads.length ? (s.count / leads.length * 100) + "%" : "0%" }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    style={{ height: "100%", borderRadius: "9999px",
                      background: stageColors[s.stage],
                      boxShadow: "0 0 8px " + stageColors[s.stage] + "60" }}/>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* By Source */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "1.25rem", padding: "1.5rem" }}>
          <h2 style={{ color: "white", fontWeight: 700, marginBottom: "1.25rem", fontSize: "1rem" }}>
            Leads by Source
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            {bySource.map((s, i) => {
              const colors = ["#f97316","#8b5cf6","#3b82f6","#22c55e"];
              return (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.375rem" }}>
                    <span style={{ color: "#9ca3af", fontSize: "0.8rem", textTransform: "capitalize" }}>{s.source}</span>
                    <div style={{ display: "flex", gap: "1rem" }}>
                      <span style={{ color: colors[i], fontSize: "0.8rem", fontWeight: 700 }}>{s.count} leads</span>
                      <span style={{ color: "#6b7280", fontSize: "0.8rem" }}>Rs {s.value.toLocaleString()}</span>
                    </div>
                  </div>
                  <div style={{ height: "6px", background: "rgba(255,255,255,0.05)", borderRadius: "9999px", overflow: "hidden" }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: leads.length ? (s.count / leads.length * 100) + "%" : "0%" }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      style={{ height: "100%", borderRadius: "9999px",
                        background: colors[i], boxShadow: "0 0 8px " + colors[i] + "60" }}/>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* All leads table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "1.25rem", overflow: "hidden" }}>
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)",
          display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ color: "white", fontWeight: 700, fontSize: "1rem" }}>All Leads Data</h2>
          <span style={{ color: "#6b7280", fontSize: "0.75rem" }}>{leads.length} records</span>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              {["Name","Company","Source","Stage","Value","Date"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "0.875rem 1.25rem",
                  fontSize: "0.7rem", fontWeight: 700, color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.map((l, i) => (
              <tr key={l._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", transition: "background 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(249,115,22,0.03)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "0.875rem 1.25rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                    <div style={{ width: "1.75rem", height: "1.75rem", borderRadius: "0.5rem", flexShrink: 0,
                      background: "linear-gradient(135deg,#f97316,#ef4444)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 900, color: "white", fontSize: "0.7rem" }}>
                      {l.name.charAt(0)}
                    </div>
                    <span style={{ color: "white", fontSize: "0.875rem", fontWeight: 500 }}>{l.name}</span>
                  </div>
                </td>
                <td style={{ padding: "0.875rem 1.25rem", color: "#9ca3af", fontSize: "0.875rem" }}>{l.company || "-"}</td>
                <td style={{ padding: "0.875rem 1.25rem" }}>
                  <span style={{ fontSize: "0.75rem", padding: "0.2rem 0.5rem", borderRadius: "9999px",
                    background: "rgba(255,255,255,0.05)", color: "#6b7280", textTransform: "capitalize" }}>
                    {l.source}
                  </span>
                </td>
                <td style={{ padding: "0.875rem 1.25rem" }}>
                  <span style={{ fontSize: "0.75rem", padding: "0.2rem 0.5rem", borderRadius: "9999px",
                    background: stageColors[l.stage] + "20", color: stageColors[l.stage],
                    border: "1px solid " + stageColors[l.stage] + "40" }}>
                    {l.stage}
                  </span>
                </td>
                <td style={{ padding: "0.875rem 1.25rem", color: "#f97316", fontWeight: 700, fontSize: "0.875rem" }}>
                  {l.value ? "Rs " + Number(l.value).toLocaleString() : "-"}
                </td>
                <td style={{ padding: "0.875rem 1.25rem", color: "#4b5563", fontSize: "0.75rem" }}>
                  {new Date(l.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </Layout>
  );
}
