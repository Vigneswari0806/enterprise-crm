import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';

function Sparkles() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    setItems(Array.from({ length: 20 }, (_, i) => ({
      id: i, left: Math.random() * 100, top: Math.random() * 100,
      size: Math.random() * 4 + 1.5,
      delay: Math.random() * 4, duration: Math.random() * 2 + 1.5,
      color: ['#f97316','#fb923c','#fbbf24','#f43f5e'][Math.floor(Math.random()*4)],
    })));
  }, []);
  return (
    <div className="fixed inset-0 overflow-hidden" style={{pointerEvents:'none',zIndex:1}}>
      <style>{'@keyframes twinkle{0%,100%{transform:scale(0);opacity:0}50%{transform:scale(1);opacity:0.8}}'}</style>
      {items.map(s => (
        <div key={s.id} style={{position:'absolute',left:s.left+'%',top:s.top+'%',
          width:s.size+'px',height:s.size+'px',background:s.color,borderRadius:'50%',
          boxShadow:'0 0 '+s.size*2+'px '+s.color,
          animation:'twinkle '+s.duration+'s '+s.delay+'s ease-in-out infinite'}}/>
      ))}
    </div>
  );
}

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'sales' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field) => ({
    background: focused===field ? '#fff' : 'rgba(249,115,22,0.03)',
    border: focused===field ? '1.5px solid rgba(249,115,22,0.6)' : '1.5px solid rgba(0,0,0,0.08)',
    boxShadow: focused===field ? '0 0 20px rgba(249,115,22,0.12)' : 'none',
  });

  return (
    <div className="min-h-screen flex overflow-hidden relative"
      style={{background:'linear-gradient(135deg,#fff7ed 0%,#ffffff 50%,#fdf4ff 100%)'}}>
      <Sparkles/>

      {/* Ambient orbs */}
      <div className="fixed inset-0" style={{pointerEvents:'none',zIndex:0}}>
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl animate-float"
          style={{background:'rgba(249,115,22,0.08)'}}></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl animate-float-2"
          style={{background:'rgba(168,85,247,0.06)'}}></div>
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full animate-rotate-slow"
          style={{border:'1px dashed rgba(249,115,22,0.2)'}}></div>
        <div className="absolute bottom-10 right-10 w-20 h-20 rounded-full animate-rotate-slow"
          style={{border:'1px dashed rgba(168,85,247,0.2)',animationDirection:'reverse'}}></div>
      </div>

      {/* Left dark panel */}
      <motion.div
        initial={{opacity:0, x:-40}}
        animate={{opacity:1, x:0}}
        transition={{duration:0.6, ease:[0.16,1,0.3,1]}}
        className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative"
        style={{background:'linear-gradient(135deg,#0a0a0a 0%,#111111 100%)',zIndex:10}}>

        {/* Dark panel top line */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{background:'linear-gradient(90deg,transparent,rgba(249,115,22,0.6),transparent)'}}></div>

        {/* Dark panel orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full blur-3xl"
            style={{background:'rgba(249,115,22,0.08)'}}></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full blur-3xl"
            style={{background:'rgba(168,85,247,0.08)'}}></div>
        </div>

        <div className="relative flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-600 rounded-xl flex items-center justify-center animate-glow">
              <i className="ti ti-chart-arrows text-white"></i>
            </div>
            <div className="absolute inset-0 bg-orange-500 rounded-xl blur-lg opacity-40 animate-pulse"></div>
          </div>
          <div>
            <p className="font-black text-gradient text-lg">SalesFlow</p>
            <p className="text-gray-600 text-xs">Enterprise CRM</p>
          </div>
        </div>

        <div className="relative max-w-md">
          <div className="inline-flex items-center gap-2 text-orange-400 text-xs px-3 py-1.5 rounded-full mb-6"
            style={{background:'rgba(249,115,22,0.1)',border:'1px solid rgba(249,115,22,0.2)'}}>
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
            Join 1000s of sales teams
          </div>
          <h1 className="text-5xl font-black leading-tight mb-4 text-white">
            Start Closing<br/>
            <span className="text-gradient">More Deals</span><br/>
            Today
          </h1>
          <p className="text-gray-500 leading-relaxed mb-8">
            Create your free account and get access to lead tracking,
            kanban pipeline, live analytics and role-based access control.
          </p>

          {/* Feature list */}
          <div className="space-y-3">
            {[
              {icon:'ti-check',text:'Unlimited lead tracking',color:'#22c55e'},
              {icon:'ti-check',text:'Drag & drop Kanban pipeline',color:'#3b82f6'},
              {icon:'ti-check',text:'Real-time sales dashboard',color:'#f97316'},
              {icon:'ti-check',text:'Activity & email logs',color:'#8b5cf6'},
              {icon:'ti-check',text:'Role-based access control',color:'#ec4899'},
              {icon:'ti-check',text:'100% free forever',color:'#fbbf24'},
            ].map((f,i) => (
              <motion.div key={i}
                initial={{opacity:0, x:-20}}
                animate={{opacity:1, x:0}}
                transition={{delay:0.3+i*0.08, duration:0.4}}
                className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{background:f.color+'20',border:'1px solid '+f.color+'40'}}>
                  <i className="ti ti-check" style={{color:f.color,fontSize:'9px'}}></i>
                </div>
                <span className="text-gray-400 text-sm">{f.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center gap-2">
          <div className="flex -space-x-2">
            {['A','R','P','V'].map((l,i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center text-xs font-black text-white"
                style={{background:['#f97316','#8b5cf6','#3b82f6','#22c55e'][i]}}>
                {l}
              </div>
            ))}
          </div>
          <p className="text-gray-500 text-xs ml-2">
            Join <span className="text-orange-400 font-bold">1,000+</span> sales professionals
          </p>
        </div>
      </motion.div>

      {/* Right white panel - Register form */}
      <motion.div
        initial={{opacity:0, x:40}}
        animate={{opacity:1, x:0}}
        transition={{duration:0.6, delay:0.1, ease:[0.16,1,0.3,1]}}
        className="flex-1 flex items-center justify-center p-8 relative"
        style={{zIndex:10}}>
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-4xl font-black text-gray-900 mb-2">
              Create <span className="text-gradient">Account</span>
            </h2>
            <p className="text-gray-400 text-sm">Fill in your details to get started</p>
          </div>

          <div className="relative rounded-3xl p-8 shadow-2xl shadow-orange-100"
            style={{background:'rgba(255,255,255,0.95)',backdropFilter:'blur(40px)',
              border:'1px solid rgba(249,115,22,0.12)'}}>
            <div className="absolute top-0 left-0 right-0 h-px rounded-t-3xl"
              style={{background:'linear-gradient(90deg,transparent,rgba(249,115,22,0.5),transparent)'}}></div>

            {error && (
              <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}}
                className="mb-5 px-4 py-3 rounded-2xl flex items-center gap-2 text-sm text-red-500"
                style={{background:'rgba(239,68,68,0.06)',border:'1px solid rgba(239,68,68,0.2)'}}>
                <i className="ti ti-alert-triangle"></i> {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <i className="ti ti-user text-orange-400 text-xs"></i> Full Name
                </label>
                <input type="text" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}
                  onFocus={()=>setFocused('name')} onBlur={()=>setFocused('')}
                  placeholder="Vigneswari" required
                  className="w-full text-gray-800 text-sm rounded-2xl px-5 py-3.5 outline-none transition-all duration-300 placeholder-gray-300"
                  style={inputStyle('name')}/>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <i className="ti ti-mail text-orange-400 text-xs"></i> Email Address
                </label>
                <input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}
                  onFocus={()=>setFocused('email')} onBlur={()=>setFocused('')}
                  placeholder="you@company.com" required
                  className="w-full text-gray-800 text-sm rounded-2xl px-5 py-3.5 outline-none transition-all duration-300 placeholder-gray-300"
                  style={inputStyle('email')}/>
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <i className="ti ti-lock text-orange-400 text-xs"></i> Password
                </label>
                <div className="relative">
                  <input type={showPass?'text':'password'} value={form.password}
                    onChange={e=>setForm({...form,password:e.target.value})}
                    onFocus={()=>setFocused('password')} onBlur={()=>setFocused('')}
                    placeholder="Min 6 characters" required
                    className="w-full text-gray-800 text-sm rounded-2xl px-5 py-3.5 pr-12 outline-none transition-all duration-300 placeholder-gray-300"
                    style={inputStyle('password')}/>
                  <button type="button" onClick={()=>setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-400 transition-colors">
                    <i className={"ti "+(showPass?'ti-eye-off':'ti-eye')}></i>
                  </button>
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <i className="ti ti-shield text-orange-400 text-xs"></i> Your Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    {v:'admin',l:'Admin',i:'ti-crown',c:'#f97316'},
                    {v:'manager',l:'Manager',i:'ti-users',c:'#8b5cf6'},
                    {v:'sales',l:'Sales',i:'ti-target',c:'#22c55e'},
                  ].map(r => (
                    <button key={r.v} type="button" onClick={()=>setForm({...form,role:r.v})}
                      className="flex flex-col items-center gap-1 py-3 rounded-2xl text-xs font-semibold transition-all duration-300"
                      style={{
                        background:form.role===r.v?r.c+'15':'rgba(0,0,0,0.03)',
                        border:form.role===r.v?'1.5px solid '+r.c+'50':'1.5px solid rgba(0,0,0,0.06)',
                        color:form.role===r.v?r.c:'#9ca3af',
                        boxShadow:form.role===r.v?'0 0 15px '+r.c+'20':'none',
                      }}>
                      <i className={"ti "+r.i+" text-base"}></i>
                      {r.l}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="group relative w-full py-4 rounded-2xl font-black text-white text-base overflow-hidden transition-all duration-300 hover:scale-105 disabled:opacity-60 flex items-center justify-center gap-3 shadow-lg shadow-orange-200 mt-2"
                style={{background:'linear-gradient(135deg,#f97316,#ef4444)'}}>
                <div className="absolute inset-0 shimmer opacity-30"></div>
                {loading ? (
                  <><i className="ti ti-loader animate-rotate text-xl"></i> Creating account...</>
                ) : (
                  <><i className="ti ti-rocket text-xl group-hover:rotate-12 transition-transform"></i>
                  Create My Account
                  <i className="ti ti-arrow-right group-hover:translate-x-2 transition-transform"></i></>
                )}
              </button>
            </form>

            <div className="mt-5 pt-5 border-t border-gray-100 text-center">
              <p className="text-gray-400 text-sm">
                Already have an account?
                <button onClick={()=>navigate('/login')}
                  className="text-orange-500 hover:text-orange-400 font-bold ml-1 transition-colors">
                  Sign in here
                </button>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
