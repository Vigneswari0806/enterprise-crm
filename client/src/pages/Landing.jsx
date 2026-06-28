import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

const features = [
  { icon: "ti-users", title: "Smart Lead Tracking", desc: "Capture every lead automatically. Assign, track and follow up. Never let a hot lead go cold again.", color: "#f97316", bg: "from-orange-500 to-red-500", stat: "Unlimited Leads" },
  { icon: "ti-layout-kanban", title: "Kanban Pipeline", desc: "Drag and drop deals across New, Contacted, Qualified, Proposal, Won and Lost stages in real time.", color: "#8b5cf6", bg: "from-purple-500 to-pink-500", stat: "6 Deal Stages" },
  { icon: "ti-chart-bar", title: "Live Sales Dashboard", desc: "Bar charts, pie charts, win rates and revenue metrics. Updated instantly as your team closes deals.", color: "#3b82f6", bg: "from-blue-500 to-cyan-500", stat: "Real-time Data" },
  { icon: "ti-calendar", title: "Activity & Email Logs", desc: "Log every call, email, meeting and note against a lead. Full timeline history for every customer.", color: "#22c55e", bg: "from-green-500 to-teal-500", stat: "4 Activity Types" },
  { icon: "ti-lock", title: "Role-Based Access", desc: "Admin controls everything. Managers see team data. Sales reps see only their own leads.", color: "#f59e0b", bg: "from-yellow-500 to-orange-500", stat: "3 User Roles" },
  { icon: "ti-bolt", title: "Lightning Fast", desc: "Built on React 18, Vite, Node.js and MongoDB. Sub-second page loads with smooth animations.", color: "#ec4899", bg: "from-pink-500 to-rose-500", stat: "Sub-second Load" },
];

const steps = [
  { num: "01", title: "Create Account", desc: "Sign up free in 30 seconds. No credit card needed.", icon: "ti-user-plus", color: "#f97316" },
  { num: "02", title: "Add Your Leads", desc: "Import or manually add leads with company details.", icon: "ti-users", color: "#8b5cf6" },
  { num: "03", title: "Track Pipeline", desc: "Move deals through stages with drag and drop.", icon: "ti-layout-kanban", color: "#3b82f6" },
  { num: "04", title: "Close More Deals", desc: "Use analytics to focus on the highest value leads.", icon: "ti-trophy", color: "#22c55e" },
];

const testimonials = [
  { name: "Arjun Mehta", role: "Sales Head", company: "TechVision India", text: "The Kanban pipeline changed how our team works. We can see every deal at a glance and drag them through stages instantly.", avatar: "A", color: "from-orange-500 to-red-500" },
  { name: "Priya Nair", role: "Startup Founder", company: "GrowthStack", text: "Clean UI, fast performance, and the dashboard charts give me exactly the insights I need every morning to plan my day.", avatar: "P", color: "from-purple-500 to-pink-500" },
  { name: "Rahul Sharma", role: "VP of Sales", company: "NexusCorp", text: "Role-based access means my sales reps only see their own leads. No data leaks, no confusion, pure productivity.", avatar: "R", color: "from-blue-500 to-cyan-500" },
];

function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function AnimSection({ children, delay = 0, direction = "up" }) {
  const [ref, inView] = useInView();
  const variants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? 50 : direction === "down" ? -50 : 0,
      x: direction === "left" ? 50 : direction === "right" ? -50 : 0,
      scale: 0.95,
    },
    visible: { opacity: 1, y: 0, x: 0, scale: 1 },
  };
  return (
    <motion.div ref={ref} variants={variants} initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

function Bubbles() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    setItems(Array.from({ length: 12 }, (_, i) => ({
      id: i, left: Math.random() * 100,
      size: Math.random() * 80 + 20,
      delay: Math.random() * 10, duration: Math.random() * 8 + 10,
      color: ["rgba(249,115,22", "rgba(239,68,68", "rgba(251,146,60"][Math.floor(Math.random() * 3)],
    })));
  }, []);
  return (
    <div className="fixed inset-0 overflow-hidden" style={{ pointerEvents: "none", zIndex: 0 }}>
      <style>{"@keyframes floatUp{0%{transform:translateY(0) scale(0.8);opacity:0}10%{opacity:.4}90%{opacity:.1}100%{transform:translateY(-110vh) scale(1.3);opacity:0}}"}</style>
      {items.map(b => (
        <div key={b.id} className="absolute bottom-0 rounded-full"
          style={{ left: b.left + "%", width: b.size + "px", height: b.size + "px",
            background: "radial-gradient(circle at 30% 30%," + b.color + ",0.12)," + b.color + ",0.03))",
            border: "1px solid " + b.color + ",0.2)",
            animation: "floatUp " + b.duration + "s " + b.delay + "s infinite ease-in" }} />
      ))}
    </div>
  );
}

function Sparkles() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    setItems(Array.from({ length: 25 }, (_, i) => ({
      id: i, left: Math.random() * 100, top: Math.random() * 100,
      size: Math.random() * 3 + 1, delay: Math.random() * 5, duration: Math.random() * 2 + 1.5,
      color: ["#f97316", "#fb923c", "#fbbf24", "#f43f5e"][Math.floor(Math.random() * 4)],
    })));
  }, []);
  return (
    <div className="fixed inset-0 overflow-hidden" style={{ pointerEvents: "none", zIndex: 0 }}>
      <style>{"@keyframes twinkle{0%,100%{transform:scale(0);opacity:0}50%{transform:scale(1);opacity:0.9}}"}</style>
      {items.map(s => (
        <div key={s.id} style={{ position: "absolute", left: s.left + "%", top: s.top + "%",
          width: s.size + "px", height: s.size + "px", background: s.color, borderRadius: "50%",
          boxShadow: "0 0 " + s.size * 3 + "px " + s.color,
          animation: "twinkle " + s.duration + "s " + s.delay + "s ease-in-out infinite" }} />
      ))}
    </div>
  );
}

function CountUp({ end, prefix = "", suffix = "" }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView(0.5);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end]);
  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

export default function Landing() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#050505", color: "white", overflowX: "hidden" }}>
      <Bubbles />
      <Sparkles />

      {/* Ambient orbs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: 0, left: "25%", width: "600px", height: "600px",
          background: "rgba(249,115,22,0.06)", borderRadius: "50%", filter: "blur(120px)" }} className="animate-float"></div>
        <div style={{ position: "absolute", bottom: 0, right: "25%", width: "500px", height: "500px",
          background: "rgba(239,68,68,0.05)", borderRadius: "50%", filter: "blur(100px)" }} className="animate-float-2"></div>
      </div>

      {/* Navbar */}
      <motion.nav initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: "fixed", top: 0, width: "100%", zIndex: 50,
          background: scrolled ? "rgba(5,5,5,0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(249,115,22,0.1)" : "none",
          transition: "all 0.4s" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "1rem 1.5rem",
          display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ position: "relative" }}>
              <div style={{ width: "2.5rem", height: "2.5rem", background: "linear-gradient(135deg,#f97316,#dc2626)",
                borderRadius: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center" }}
                className="animate-glow">
                <i className="ti ti-chart-arrows" style={{ color: "white" }}></i>
              </div>
              <div style={{ position: "absolute", inset: 0, background: "rgba(249,115,22,0.4)",
                borderRadius: "0.75rem", filter: "blur(8px)" }} className="animate-pulse"></div>
            </div>
            <div>
              <p style={{ fontWeight: 900, fontSize: "1.125rem", background: "linear-gradient(135deg,#f97316,#fb923c)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>SalesFlow</p>
              <p style={{ color: "#4b5563", fontSize: "0.65rem", marginTop: "-2px" }}>CRM Platform</p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "2rem" }} className="hidden md:flex">
            {["Features", "How It Works", "Testimonials"].map(l => (
              <a key={l} href={"#" + l.toLowerCase().replace(" ", "-")}
                style={{ color: "#6b7280", fontSize: "0.875rem", textDecoration: "none",
                  transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = "#f97316"}
                onMouseLeave={e => e.target.style.color = "#6b7280"}>
                {l}
              </a>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button onClick={() => navigate("/login")}
              style={{ color: "#9ca3af", background: "none", border: "none", cursor: "pointer",
                fontSize: "0.875rem", padding: "0.5rem 1rem", borderRadius: "0.75rem",
                transition: "all 0.2s" }}
              onMouseEnter={e => { e.target.style.color = "white"; e.target.style.background = "rgba(255,255,255,0.05)"; }}
              onMouseLeave={e => { e.target.style.color = "#9ca3af"; e.target.style.background = "none"; }}>
              Sign In
            </button>
            <button onClick={() => navigate("/register")}
              style={{ background: "linear-gradient(135deg,#f97316,#ef4444)", color: "white",
                border: "none", cursor: "pointer", fontSize: "0.875rem", fontWeight: 700,
                padding: "0.625rem 1.25rem", borderRadius: "0.75rem",
                boxShadow: "0 0 20px rgba(249,115,22,0.3)", transition: "all 0.3s" }}
              onMouseEnter={e => { e.target.style.transform = "scale(1.05)"; e.target.style.boxShadow = "0 0 30px rgba(249,115,22,0.5)"; }}
              onMouseLeave={e => { e.target.style.transform = "scale(1)"; e.target.style.boxShadow = "0 0 20px rgba(249,115,22,0.3)"; }}>
              Get Started Free
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section ref={heroRef} style={{ minHeight: "100vh", display: "flex", alignItems: "center",
        justifyContent: "center", padding: "6rem 1.5rem 3rem", position: "relative", zIndex: 1 }}>
        <motion.div style={{ y: heroY, opacity: heroOpacity, textAlign: "center", maxWidth: "900px" }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem",
              background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)",
              color: "#fb923c", fontSize: "0.75rem", padding: "0.5rem 1rem",
              borderRadius: "9999px", marginBottom: "2rem" }}>
            <span style={{ width: "0.5rem", height: "0.5rem", background: "#4ade80",
              borderRadius: "50%" }} className="animate-pulse"></span>
            Full Stack CRM — React + Node.js + MongoDB — Open Source
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ fontSize: "clamp(3rem,8vw,6rem)", fontWeight: 900, lineHeight: 1.05,
              marginBottom: "1.5rem", letterSpacing: "-0.02em" }}>
            Manage Every Deal
            <br />
            <span style={{ background: "linear-gradient(135deg,#f97316,#fb923c,#fbbf24)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
              className="animate-neon">
              Like a Pro
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{ color: "#6b7280", fontSize: "1.125rem", lineHeight: 1.7,
              maxWidth: "600px", margin: "0 auto 2.5rem" }}>
            A complete enterprise CRM with lead tracking, kanban pipeline,
            live dashboards, activity logs and role-based access.
            Built for serious sales teams.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            style={{ display: "flex", alignItems: "center", justifyContent: "center",
              gap: "1rem", flexWrap: "wrap", marginBottom: "4rem" }}>
            <button onClick={() => navigate("/register")}
              style={{ background: "linear-gradient(135deg,#f97316,#ef4444)", color: "white",
                border: "none", cursor: "pointer", fontSize: "1rem", fontWeight: 900,
                padding: "1rem 2.5rem", borderRadius: "1rem",
                boxShadow: "0 0 40px rgba(249,115,22,0.4), 0 0 80px rgba(249,115,22,0.2)",
                display: "flex", alignItems: "center", gap: "0.75rem", transition: "all 0.3s" }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
              <i className="ti ti-rocket" style={{ fontSize: "1.25rem" }}></i>
              Start Free — No Credit Card
              <i className="ti ti-arrow-right"></i>
            </button>
            <button onClick={() => navigate("/login")}
              style={{ background: "rgba(255,255,255,0.04)", color: "#9ca3af",
                border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer",
                fontSize: "1rem", fontWeight: 600, padding: "1rem 2.5rem",
                borderRadius: "1rem", display: "flex", alignItems: "center", gap: "0.75rem",
                transition: "all 0.3s", backdropFilter: "blur(10px)" }}
              onMouseEnter={e => { e.currentTarget.style.color = "white"; e.currentTarget.style.borderColor = "rgba(249,115,22,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#9ca3af"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}>
              <i className="ti ti-login"></i>
              Already have account? Sign In
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem",
              maxWidth: "700px", margin: "0 auto" }}>
            {[
              { v: 6, l: "Deal Stages", i: "ti-layers", c: "#f97316", suffix: "" },
              { v: 3, l: "User Roles", i: "ti-users", c: "#8b5cf6", suffix: "" },
              { v: 100, l: "Free Forever", i: "ti-heart", c: "#22c55e", suffix: "%" },
              { v: 4, l: "Activity Types", i: "ti-calendar", c: "#3b82f6", suffix: "" },
            ].map((s, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "1rem", padding: "1rem", cursor: "default", transition: "all 0.3s" }}
                className="animate-card-float"
                onMouseEnter={e => { e.currentTarget.style.borderColor = s.c + "40"; e.currentTarget.style.background = s.c + "08"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}>
                <i className={"ti " + s.i} style={{ color: s.c, fontSize: "1.5rem",
                  filter: "drop-shadow(0 0 6px " + s.c + ")", display: "block", marginBottom: "0.5rem" }}></i>
                <div style={{ fontSize: "1.5rem", fontWeight: 900, background: "linear-gradient(135deg,#f97316,#fb923c)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  <CountUp end={s.v} suffix={s.suffix} />
                </div>
                <div style={{ color: "#4b5563", fontSize: "0.7rem", marginTop: "0.25rem" }}>{s.l}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: "6rem 1.5rem", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <AnimSection>
            <div style={{ textAlign: "center", marginBottom: "4rem" }}>
              <span style={{ color: "#f97316", fontSize: "0.75rem", fontWeight: 700,
                letterSpacing: "0.3em", textTransform: "uppercase" }}>What We Built</span>
              <h2 style={{ fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 900, marginTop: "0.75rem",
                marginBottom: "1rem" }}>
                Everything your team needs
                <br />
                <span style={{ background: "linear-gradient(135deg,#f97316,#fb923c)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  to close more deals
                </span>
              </h2>
              <p style={{ color: "#6b7280", maxWidth: "500px", margin: "0 auto", lineHeight: 1.6 }}>
                Built from scratch with React, Node.js, Express and MongoDB.
                No third-party SaaS. Fully open source.
              </p>
            </div>
          </AnimSection>

          {/* Interactive feature showcase */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem",
            alignItems: "center" }} className="hidden lg:grid">
            <AnimSection direction="right">
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {features.map((f, i) => (
                  <motion.div key={i}
                    onClick={() => setActiveFeature(i)}
                    whileHover={{ x: 8 }}
                    style={{ display: "flex", alignItems: "center", gap: "1rem",
                      padding: "1rem 1.25rem", borderRadius: "1rem", cursor: "pointer",
                      transition: "all 0.3s",
                      background: activeFeature === i ? "rgba(249,115,22,0.08)" : "rgba(255,255,255,0.02)",
                      border: activeFeature === i ? "1px solid rgba(249,115,22,0.25)" : "1px solid rgba(255,255,255,0.05)",
                      boxShadow: activeFeature === i ? "0 0 30px rgba(249,115,22,0.1)" : "none" }}>
                    <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "0.75rem", flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: activeFeature === i ? "linear-gradient(135deg," + f.color + "," + f.color + "99)" : "rgba(255,255,255,0.05)",
                      boxShadow: activeFeature === i ? "0 0 15px " + f.color + "40" : "none",
                      transition: "all 0.3s" }}>
                      <i className={"ti " + f.icon} style={{ color: activeFeature === i ? "white" : "#6b7280", fontSize: "1rem" }}></i>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: activeFeature === i ? "white" : "#9ca3af", fontWeight: 600,
                        fontSize: "0.875rem", transition: "color 0.3s" }}>{f.title}</p>
                      {activeFeature === i && (
                        <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                          style={{ color: "#6b7280", fontSize: "0.75rem", marginTop: "0.25rem", lineHeight: 1.5 }}>
                          {f.desc}
                        </motion.p>
                      )}
                    </div>
                    {activeFeature === i && (
                      <div style={{ width: "0.5rem", height: "0.5rem", borderRadius: "50%",
                        background: f.color, boxShadow: "0 0 8px " + f.color }} className="animate-pulse"></div>
                    )}
                  </motion.div>
                ))}
              </div>
            </AnimSection>

            <AnimSection direction="left">
              <AnimatePresence mode="wait">
                <motion.div key={activeFeature}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ duration: 0.4 }}
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "1.5rem", padding: "2.5rem", textAlign: "center",
                    boxShadow: "0 0 60px " + features[activeFeature].color + "20" }}>
                  <div style={{ width: "5rem", height: "5rem", borderRadius: "1.5rem", margin: "0 auto 1.5rem",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "linear-gradient(135deg," + features[activeFeature].color + "," + features[activeFeature].color + "99)",
                    boxShadow: "0 0 40px " + features[activeFeature].color + "40" }}>
                    <i className={"ti " + features[activeFeature].icon} style={{ color: "white", fontSize: "2rem" }}></i>
                  </div>
                  <h3 style={{ fontSize: "1.5rem", fontWeight: 900, color: "white", marginBottom: "1rem" }}>
                    {features[activeFeature].title}
                  </h3>
                  <p style={{ color: "#6b7280", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                    {features[activeFeature].desc}
                  </p>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem",
                    background: features[activeFeature].color + "15",
                    border: "1px solid " + features[activeFeature].color + "30",
                    color: features[activeFeature].color, fontSize: "0.875rem", fontWeight: 700,
                    padding: "0.5rem 1.25rem", borderRadius: "9999px" }}>
                    <i className="ti ti-check"></i>
                    {features[activeFeature].stat}
                  </div>
                </motion.div>
              </AnimatePresence>
            </AnimSection>
          </div>

          {/* Mobile feature grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1rem" }}
            className="lg:hidden">
            {features.map((f, i) => (
              <AnimSection key={i} delay={i * 0.1}>
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "1.25rem", padding: "1.5rem", transition: "all 0.3s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = f.color + "40"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                  <div style={{ width: "3rem", height: "3rem", borderRadius: "0.875rem", marginBottom: "1rem",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "linear-gradient(135deg," + f.color + "," + f.color + "99)" }}>
                    <i className={"ti " + f.icon} style={{ color: "white", fontSize: "1.25rem" }}></i>
                  </div>
                  <h3 style={{ color: "white", fontWeight: 700, marginBottom: "0.5rem" }}>{f.title}</h3>
                  <p style={{ color: "#6b7280", fontSize: "0.875rem", lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" style={{ padding: "6rem 1.5rem", position: "relative", zIndex: 1,
        background: "rgba(255,255,255,0.01)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <AnimSection>
            <div style={{ textAlign: "center", marginBottom: "4rem" }}>
              <span style={{ color: "#f97316", fontSize: "0.75rem", fontWeight: 700,
                letterSpacing: "0.3em", textTransform: "uppercase" }}>How It Works</span>
              <h2 style={{ fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 900, marginTop: "0.75rem" }}>
                Up and running in{" "}
                <span style={{ background: "linear-gradient(135deg,#f97316,#fb923c)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  4 simple steps
                </span>
              </h2>
            </div>
          </AnimSection>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "2rem" }}>
            {steps.map((s, i) => (
              <AnimSection key={i} delay={i * 0.15}>
                <div style={{ position: "relative", textAlign: "center", padding: "2rem 1.5rem",
                  background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "1.5rem", transition: "all 0.3s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = s.color + "40"; e.currentTarget.style.transform = "translateY(-8px)"; e.currentTarget.style.boxShadow = "0 20px 60px " + s.color + "15"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                  <div style={{ fontSize: "3rem", fontWeight: 900, color: s.color + "20",
                    position: "absolute", top: "1rem", right: "1.25rem", lineHeight: 1 }}>{s.num}</div>
                  <div style={{ width: "4rem", height: "4rem", borderRadius: "1.25rem", margin: "0 auto 1.25rem",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: s.color + "15", border: "1px solid " + s.color + "30" }}>
                    <i className={"ti " + s.icon} style={{ color: s.color, fontSize: "1.5rem" }}></i>
                  </div>
                  <h3 style={{ color: "white", fontWeight: 700, marginBottom: "0.75rem" }}>{s.title}</h3>
                  <p style={{ color: "#6b7280", fontSize: "0.875rem", lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" style={{ padding: "6rem 1.5rem", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <AnimSection>
            <div style={{ textAlign: "center", marginBottom: "4rem" }}>
              <span style={{ color: "#f97316", fontSize: "0.75rem", fontWeight: 700,
                letterSpacing: "0.3em", textTransform: "uppercase" }}>Testimonials</span>
              <h2 style={{ fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 900, marginTop: "0.75rem" }}>
                Loved by{" "}
                <span style={{ background: "linear-gradient(135deg,#f97316,#fb923c)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  sales teams
                </span>
              </h2>
            </div>
          </AnimSection>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "1.5rem" }}>
            {testimonials.map((t, i) => (
              <AnimSection key={i} delay={i * 0.15}>
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "1.5rem", padding: "1.75rem", height: "100%", transition: "all 0.3s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(249,115,22,0.2)"; e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 20px 60px rgba(249,115,22,0.08)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                  <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1rem" }}>
                    {[...Array(5)].map((_, j) => (
                      <i key={j} className="ti ti-star-filled" style={{ color: "#f97316", fontSize: "0.875rem" }}></i>
                    ))}
                  </div>
                  <p style={{ color: "#d1d5db", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                    "{t.text}"
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "0.75rem", flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 900, color: "white", fontSize: "0.875rem",
                      background: "linear-gradient(135deg," + (t.color.includes("orange") ? "#f97316,#ef4444" : t.color.includes("purple") ? "#8b5cf6,#ec4899" : "#3b82f6,#06b6d4") + ")" }}>
                      {t.avatar}
                    </div>
                    <div>
                      <p style={{ color: "white", fontWeight: 600, fontSize: "0.875rem" }}>{t.name}</p>
                      <p style={{ color: "#6b7280", fontSize: "0.75rem" }}>{t.role} · {t.company}</p>
                    </div>
                  </div>
                </div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "6rem 1.5rem", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <AnimSection>
            <div style={{ position: "relative", background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(249,115,22,0.2)", borderRadius: "2rem", padding: "4rem",
              textAlign: "center", overflow: "hidden",
              boxShadow: "0 0 80px rgba(249,115,22,0.1), inset 0 1px 0 rgba(249,115,22,0.1)" }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(249,115,22,0.05),rgba(239,68,68,0.03))", pointerEvents: "none" }}></div>
              <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
                width: "1px", height: "4rem", background: "linear-gradient(180deg,rgba(249,115,22,0.6),transparent)" }}></div>

              <div style={{ position: "relative" }}>
                <div style={{ width: "5rem", height: "5rem", margin: "0 auto 2rem",
                  background: "linear-gradient(135deg,#f97316,#dc2626)", borderRadius: "1.5rem",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 0 60px rgba(249,115,22,0.5)" }} className="animate-float animate-glow">
                  <i className="ti ti-chart-arrows" style={{ color: "white", fontSize: "2rem" }}></i>
                </div>
                <h2 style={{ fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 900, marginBottom: "1rem" }}>
                  Ready to{" "}
                  <span style={{ background: "linear-gradient(135deg,#f97316,#fb923c)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    close more deals?
                  </span>
                </h2>
                <p style={{ color: "#6b7280", fontSize: "1.125rem", marginBottom: "2.5rem",
                  maxWidth: "500px", margin: "0 auto 2.5rem", lineHeight: 1.6 }}>
                  Start using SalesFlow CRM today. Free forever.
                  No credit card required. Built with React + Node.js + MongoDB.
                </p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
                  <button onClick={() => navigate("/register")}
                    style={{ background: "linear-gradient(135deg,#f97316,#ef4444)", color: "white",
                      border: "none", cursor: "pointer", fontSize: "1rem", fontWeight: 900,
                      padding: "1rem 2.5rem", borderRadius: "1rem",
                      boxShadow: "0 0 50px rgba(249,115,22,0.5)", transition: "all 0.3s",
                      display: "flex", alignItems: "center", gap: "0.75rem" }}
                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                    <i className="ti ti-rocket" style={{ fontSize: "1.25rem" }}></i>
                    Create Free Account
                    <i className="ti ti-arrow-right"></i>
                  </button>
                  <button onClick={() => navigate("/login")}
                    style={{ background: "rgba(255,255,255,0.04)", color: "#9ca3af",
                      border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer",
                      fontSize: "1rem", padding: "1rem 2rem", borderRadius: "1rem",
                      transition: "all 0.3s", display: "flex", alignItems: "center", gap: "0.5rem" }}
                    onMouseEnter={e => { e.currentTarget.style.color = "white"; e.currentTarget.style.borderColor = "rgba(249,115,22,0.3)"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "#9ca3af"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}>
                    <i className="ti ti-login"></i>
                    Sign In
                  </button>
                </div>
              </div>
            </div>
          </AnimSection>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "2.5rem 1.5rem", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex",
          flexDirection: "column", alignItems: "center", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: "2rem", height: "2rem", background: "linear-gradient(135deg,#f97316,#dc2626)",
              borderRadius: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <i className="ti ti-chart-arrows" style={{ color: "white", fontSize: "0.875rem" }}></i>
            </div>
            <span style={{ fontWeight: 900, background: "linear-gradient(135deg,#f97316,#fb923c)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>SalesFlow CRM</span>
          </div>
          <p style={{ color: "#374151", fontSize: "0.875rem" }}>
            © 2026 SalesFlow CRM · Built with React + Node.js + MongoDB · Open Source · MIT License
          </p>
        </div>
      </footer>
    </div>
  );
}
