import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

function Sparkles() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    setItems(Array.from({ length: 20 }, (_, i) => ({
      id: i, left: Math.random() * 100, top: Math.random() * 100,
      size: Math.random() * 4 + 1.5,
      delay: Math.random() * 4, duration: Math.random() * 2 + 1.5,
      color: ["#f97316","#fb923c","#fbbf24","#f43f5e"][Math.floor(Math.random()*4)],
    })));
  }, []);
  return (
    <div className="fixed inset-0 overflow-hidden" style={{pointerEvents:"none",zIndex:1}}>
      <style>{"@keyframes twinkle{0%,100%{transform:scale(0);opacity:0}50%{transform:scale(1);opacity:0.8}}"}</style>
      {items.map(s => (
        <div key={s.id} style={{position:"absolute",left:s.left+"%",top:s.top+"%",
          width:s.size+"px",height:s.size+"px",background:s.color,borderRadius:"50%",
          boxShadow:"0 0 "+s.size*2+"px "+s.color,
          animation:"twinkle "+s.duration+"s "+s.delay+"s ease-in-out infinite"}}/>
      ))}
    </div>
  );
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const inp = (f) => ({
    background: focused===f ? "#fff" : "rgba(249,115,22,0.03)",
    border: focused===f ? "1.5px solid rgba(249,115,22,0.6)" : "1.5px solid rgba(0,0,0,0.08)",
    boxShadow: focused===f ? "0 0 20px rgba(249,115,22,0.12)" : "none",
  });

  return (
    <div style={{minHeight:"100vh",display:"flex",overflow:"hidden",position:"relative",
      background:"linear-gradient(135deg,#fff7ed 0%,#ffffff 50%,#fdf4ff 100%)"}}>
      <Sparkles/>

      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0}}>
        <div style={{position:"absolute",top:0,left:0,width:"24rem",height:"24rem",
          background:"rgba(249,115,22,0.07)",borderRadius:"50%",filter:"blur(80px)"}}></div>
        <div style={{position:"absolute",bottom:0,right:0,width:"24rem",height:"24rem",
          background:"rgba(168,85,247,0.05)",borderRadius:"50%",filter:"blur(80px)"}}></div>
      </div>

      <motion.div initial={{opacity:0,x:-50}} animate={{opacity:1,x:0}}
        transition={{duration:0.7,ease:[0.16,1,0.3,1]}}
        style={{display:"none",flexDirection:"column",justifyContent:"space-between",
          width:"50%",padding:"3rem",position:"relative",zIndex:10,
          background:"linear-gradient(135deg,#080808 0%,#111 100%)"}}
        className="hidden lg:flex">

        <div style={{position:"absolute",top:0,left:0,right:0,height:"1px",
          background:"linear-gradient(90deg,transparent,rgba(249,115,22,0.6),transparent)"}}></div>

        <div style={{display:"flex",alignItems:"center",gap:"0.75rem"}}>
          <div style={{position:"relative"}}>
            <div style={{width:"2.5rem",height:"2.5rem",background:"linear-gradient(135deg,#fb923c,#dc2626)",
              borderRadius:"0.75rem",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <i className="ti ti-chart-arrows" style={{color:"white"}}></i>
            </div>
          </div>
          <div>
            <p style={{fontWeight:900,fontSize:"1.125rem",background:"linear-gradient(135deg,#f97316,#fb923c)",
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>SalesFlow</p>
            <p style={{color:"#4b5563",fontSize:"0.75rem"}}>Enterprise CRM</p>
          </div>
        </div>

        <div style={{maxWidth:"28rem"}}>
          <h1 style={{fontSize:"3rem",fontWeight:900,lineHeight:1.1,marginBottom:"1rem",color:"white"}}>
            Your Sales<br/>
            <span style={{background:"linear-gradient(135deg,#f97316,#fb923c)",
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Command</span><br/>
            Center
          </h1>
          <p style={{color:"#6b7280",lineHeight:1.6,marginBottom:"2rem"}}>
            Track leads, manage pipelines and close deals faster.
          </p>
          <div style={{display:"flex",flexDirection:"column",gap:"0.75rem"}}>
            {[
              {icon:"ti-users",title:"Lead Tracking",desc:"Never miss a hot lead",color:"#f97316"},
              {icon:"ti-layout-kanban",title:"Kanban Pipeline",desc:"Visual deal management",color:"#8b5cf6"},
              {icon:"ti-chart-bar",title:"Live Analytics",desc:"Real-time dashboards",color:"#3b82f6"},
              {icon:"ti-lock",title:"Role-Based Access",desc:"Admin, Manager, Sales",color:"#22c55e"},
            ].map((f,i) => (
              <motion.div key={i} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}}
                transition={{delay:0.4+i*0.08}}
                style={{display:"flex",alignItems:"center",gap:"0.75rem",
                  background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",
                  borderRadius:"1rem",padding:"0.75rem 1rem"}}>
                <div style={{width:"2rem",height:"2rem",borderRadius:"0.75rem",
                  display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
                  background:f.color+"20",border:"1px solid "+f.color+"30"}}>
                  <i className={"ti "+f.icon} style={{color:f.color,fontSize:"0.875rem"}}></i>
                </div>
                <div>
                  <p style={{color:"white",fontSize:"0.75rem",fontWeight:600}}>{f.title}</p>
                  <p style={{color:"#6b7280",fontSize:"0.75rem"}}>{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div style={{display:"flex",gap:"2rem"}}>
          {[{v:"Many",l:"Leads"},{v:"6",l:"Stages"},{v:"3",l:"Roles"},{v:"Free",l:"Forever"}].map((s,i) => (
            <div key={i} style={{textAlign:"center"}}>
              <div style={{fontSize:"1.25rem",fontWeight:900,background:"linear-gradient(135deg,#f97316,#fb923c)",
                WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{s.v}</div>
              <div style={{color:"#6b7280",fontSize:"0.75rem"}}>{s.l}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{opacity:0,x:50}} animate={{opacity:1,x:0}}
        transition={{duration:0.7,delay:0.1,ease:[0.16,1,0.3,1]}}
        style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",
          padding:"2rem",position:"relative",zIndex:10,background:"white"}}>
        <div style={{width:"100%",maxWidth:"28rem"}}>
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
            transition={{delay:0.3}} style={{marginBottom:"2rem"}}>
            <h2 style={{fontSize:"2.5rem",fontWeight:900,color:"#111827",marginBottom:"0.5rem"}}>
              Welcome <span style={{background:"linear-gradient(135deg,#f97316,#fb923c)",
                WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Back!</span>
            </h2>
            <p style={{color:"#9ca3af",fontSize:"0.875rem"}}>Sign in and start closing deals today</p>
          </motion.div>

          <motion.div initial={{opacity:0,y:30,scale:0.97}} animate={{opacity:1,y:0,scale:1}}
            transition={{delay:0.4}}
            style={{position:"relative",borderRadius:"1.5rem",padding:"2rem",
              background:"white",boxShadow:"0 25px 60px rgba(249,115,22,0.12)",
              border:"1px solid rgba(249,115,22,0.12)"}}>

            <div style={{position:"absolute",top:0,left:0,right:0,height:"1px",borderRadius:"1.5rem 1.5rem 0 0",
              background:"linear-gradient(90deg,transparent,rgba(249,115,22,0.5),transparent)"}}></div>

            {error && (
              <div style={{marginBottom:"1.25rem",padding:"0.75rem 1rem",borderRadius:"1rem",
                display:"flex",alignItems:"center",gap:"0.5rem",fontSize:"0.875rem",color:"#ef4444",
                background:"rgba(239,68,68,0.06)",border:"1px solid rgba(239,68,68,0.2)"}}>
                <i className="ti ti-alert-triangle"></i> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{display:"flex",flexDirection:"column",gap:"1.25rem"}}>
              <div>
                <label style={{fontSize:"0.75rem",fontWeight:700,color:"#6b7280",
                  textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:"0.5rem",
                  display:"flex",alignItems:"center",gap:"0.5rem"}}>
                  <i className="ti ti-mail" style={{color:"#f97316",fontSize:"0.75rem"}}></i>
                  Email Address
                </label>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
                  onFocus={()=>setFocused("email")} onBlur={()=>setFocused("")}
                  placeholder="you@company.com" required
                  style={{width:"100%",color:"#1f2937",fontSize:"0.875rem",borderRadius:"1rem",
                    padding:"1rem 1.25rem",outline:"none",transition:"all 0.3s",
                    boxSizing:"border-box",...inp("email")}}/>
              </div>

              <div>
                <label style={{fontSize:"0.75rem",fontWeight:700,color:"#6b7280",
                  textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:"0.5rem",
                  display:"flex",alignItems:"center",gap:"0.5rem"}}>
                  <i className="ti ti-lock" style={{color:"#f97316",fontSize:"0.75rem"}}></i>
                  Password
                </label>
                <div style={{position:"relative"}}>
                  <input type={showPass?"text":"password"} value={password}
                    onChange={e=>setPassword(e.target.value)}
                    onFocus={()=>setFocused("password")} onBlur={()=>setFocused("")}
                    placeholder="Enter your password" required
                    style={{width:"100%",color:"#1f2937",fontSize:"0.875rem",borderRadius:"1rem",
                      padding:"1rem 3rem 1rem 1.25rem",outline:"none",transition:"all 0.3s",
                      boxSizing:"border-box",...inp("password")}}/>
                  <button type="button" onClick={()=>setShowPass(!showPass)}
                    style={{position:"absolute",right:"1rem",top:"50%",transform:"translateY(-50%)",
                      background:"none",border:"none",cursor:"pointer",color:"#9ca3af"}}>
                    <i className={"ti "+(showPass?"ti-eye-off":"ti-eye")}></i>
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                style={{width:"100%",padding:"1rem",borderRadius:"1rem",fontWeight:900,
                  color:"white",fontSize:"1rem",border:"none",cursor:loading?"not-allowed":"pointer",
                  background:"linear-gradient(135deg,#f97316,#ef4444)",
                  boxShadow:"0 8px 30px rgba(249,115,22,0.35)",
                  display:"flex",alignItems:"center",justifyContent:"center",gap:"0.75rem",
                  transition:"all 0.3s",opacity:loading?0.6:1,
                  transform:"scale(1)"}}>
                {loading ? (
                  <><i className="ti ti-loader animate-rotate" style={{fontSize:"1.25rem"}}></i> Signing in...</>
                ) : (
                  <><i className="ti ti-rocket" style={{fontSize:"1.25rem"}}></i>
                  Launch Dashboard
                  <i className="ti ti-arrow-right"></i></>
                )}
              </button>
            </form>

            <div style={{marginTop:"1.5rem",paddingTop:"1.25rem",borderTop:"1px solid #f3f4f6",textAlign:"center"}}>
              <p style={{color:"#9ca3af",fontSize:"0.875rem"}}>
                New to SalesFlow?{" "}
                <button onClick={()=>navigate("/register")}
                  style={{color:"#f97316",fontWeight:700,background:"none",border:"none",
                    cursor:"pointer",transition:"color 0.2s"}}>
                  Create free account
                </button>
              </p>
            </div>
          </motion.div>

          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"1.5rem",marginTop:"1.5rem"}}>
            {[{i:"ti-shield-check",l:"Secure"},{i:"ti-lock",l:"Encrypted"},{i:"ti-eye-off",l:"Private"}].map((s,i) => (
              <div key={i} style={{display:"flex",alignItems:"center",gap:"0.375rem",color:"#9ca3af",fontSize:"0.75rem"}}>
                <i className={"ti "+s.i} style={{color:"#f97316"}}></i>{s.l}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
