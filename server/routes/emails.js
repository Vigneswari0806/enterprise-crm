const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const sendEmail = require("../utils/mailer");
const Activity = require("../models/Activity");
const Lead = require("../models/Lead");

router.post("/send", protect, async (req, res) => {
  const { to, subject, body, leadId } = req.body;
  if (!to || !subject || !body)
    return res.status(400).json({ message: "To, subject and body are required" });
  try {
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
        <div style="background:linear-gradient(135deg,#f97316,#ef4444);padding:20px;border-radius:12px 12px 0 0;">
          <h2 style="color:white;margin:0;">SalesFlow CRM</h2>
        </div>
        <div style="background:#fff;padding:30px;border:1px solid #e5e7eb;border-top:none;">
          <h3 style="color:#111827;">${subject}</h3>
          <div style="color:#374151;line-height:1.7;white-space:pre-line;">${body}</div>
        </div>
        <div style="background:#f9fafb;padding:15px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;border-top:none;text-align:center;">
          <p style="color:#9ca3af;font-size:0.75rem;margin:0;">Sent via SalesFlow CRM</p>
        </div>
      </div>
    `;
    await sendEmail({ to, subject, html });
    if (leadId) {
      await Activity.create({
        type: "email", subject, body,
        outcome: "Email sent to " + to,
        lead: leadId, user: req.user._id,
      });
    }
    res.json({ message: "Email sent successfully!" });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ message: "Failed to send email: " + err.message });
  }
});

router.post("/send-bulk", protect, async (req, res) => {
  const { subject, body, stage } = req.body;
  try {
    let query = {};
    if (stage && stage !== "All") query.stage = stage;
    const leads = await Lead.find(query).select("name email");
    const withEmail = leads.filter(l => l.email);
    const results = await Promise.allSettled(
      withEmail.map(lead => {
        const html = `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
            <div style="background:linear-gradient(135deg,#f97316,#ef4444);padding:20px;border-radius:12px 12px 0 0;">
              <h2 style="color:white;margin:0;">SalesFlow CRM</h2>
            </div>
            <div style="background:#fff;padding:30px;border:1px solid #e5e7eb;border-top:none;">
              <p style="color:#374151;">Hi ${lead.name},</p>
              <div style="color:#374151;line-height:1.7;white-space:pre-line;">${body}</div>
            </div>
          </div>
        `;
        return sendEmail({ to: lead.email, subject, html });
      })
    );
    const sent = results.filter(r => r.status === "fulfilled").length;
    const failed = results.filter(r => r.status === "rejected").length;
    res.json({ message: "Sent " + sent + " emails. " + failed + " failed.", sent, failed });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
