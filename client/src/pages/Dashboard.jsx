import { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area } from 'recharts';
import Layout from '../components/Layout';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const COLORS = ['#f97316', '#8b5cf6', '#3b82f6', '#22c55e', '#ef4444', '#ec4899'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-xl px-3 py-2 text-xs" style={{border:'1px solid rgba(249,115,22,0.2)'}}>
        <p className="text-orange-400 font-semibold">{label}</p>
        <p className="text-white">{payload[0].value} leads</p>
      </div>
    );
  }
  return null;
};

function AnimatedCounter({ value, prefix = '', suffix = '' }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseInt(value) || 0;
    if (end === 0) { setCount(0); return; }
    const duration = 1500;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    api.get('/dashboard/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center animate-pulse shadow-lg shadow-orange-500/40">
          <i className="ti ti-chart-arrows text-white text-xl"></i>
        </div>
        <p className="text-gray-500 text-sm animate-pulse">Loading your dashboard...</p>
      </div>
    </Layout>
  );

  const stageData = stats?.byStage?.map(s => ({ name: s._id, count: s.count, value: s.value })) || [];
  const sourceData = stats?.bySource?.map(s => ({ name: s._id, value: s.count })) || [];
  const winRate = stats?.totalLeads ? Math.round((stats.wonLeads / stats.totalLeads) * 100) : 0;

  const statCards = [
    { label: 'Total Leads', value: stats?.totalLeads || 0, icon: 'ti-users', color: 'from-orange-500 to-red-500', glow: 'rgba(249,115,22,0.3)', prefix: '', suffix: '' },
    { label: 'Won Deals', value: stats?.wonLeads || 0, icon: 'ti-trophy', color: 'from-green-500 to-teal-500', glow: 'rgba(34,197,94,0.3)', prefix: '', suffix: '' },
    { label: 'Lost Deals', value: stats?.lostLeads || 0, icon: 'ti-x', color: 'from-red-500 to-pink-500', glow: 'rgba(239,68,68,0.3)', prefix: '', suffix: '' },
    { label: 'Win Rate', value: winRate, icon: 'ti-target', color: 'from-purple-500 to-blue-500', glow: 'rgba(139,92,246,0.3)', prefix: '', suffix: '%' },
    { label: 'Revenue', value: stats?.totalRevenue || 0, icon: 'ti-currency-rupee', color: 'from-yellow-500 to-orange-500', glow: 'rgba(234,179,8,0.3)', prefix: 'Rs ', suffix: '' },
  ];

  return (
    <Layout>
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-gray-500 text-xs">Live Dashboard</span>
          </div>
          <h1 className="text-3xl font-black text-white">
            Good morning, <span className="text-gradient">{user?.name?.split(' ')[0]}! ??</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Here is what is happening with your sales today.</p>
        </div>
        <div className="glass rounded-2xl px-4 py-2 flex items-center gap-2" style={{border:'1px solid rgba(249,115,22,0.15)'}}>
          <i className="ti ti-calendar text-orange-400 text-sm"></i>
          <span className="text-gray-400 text-xs">{new Date().toLocaleDateString('en-IN', {weekday:'long', day:'numeric', month:'long'})}</span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {statCards.map((card, i) => (
          <div key={i} className="relative glass rounded-2xl p-4 overflow-hidden group hover:-translate-y-1 transition-all duration-300 cursor-default"
            style={{border:'1px solid rgba(255,255,255,0.05)', boxShadow:'0 0 0 rgba(0,0,0,0)'}}>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
              style={{boxShadow:'inset 0 0 30px ' + card.glow + '20'}}></div>
            <div className={"w-10 h-10 rounded-xl bg-gradient-to-br " + card.color + " flex items-center justify-center mb-3 shadow-lg transition-all duration-300 group-hover:scale-110"}
              style={{boxShadow:'0 4px 15px ' + card.glow}}>
              <i className={"ti " + card.icon + " text-white text-base"}></i>
            </div>
            <p className="text-gray-500 text-xs mb-1">{card.label}</p>
            <p className="text-2xl font-black text-white">
              <AnimatedCounter value={card.value} prefix={card.prefix} suffix={card.suffix}/>
            </p>
            <div className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
              style={{background:'linear-gradient(90deg, transparent, ' + card.glow + ', transparent)'}}></div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Bar chart */}
        <div className="glass rounded-2xl p-6" style={{border:'1px solid rgba(249,115,22,0.1)'}}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-white font-bold">Leads by Stage</h2>
              <p className="text-gray-500 text-xs mt-0.5">Pipeline distribution</p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <i className="ti ti-chart-bar text-white text-sm"></i>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stageData} barSize={28}>
              <XAxis dataKey="name" tick={{ fill: '#4b5563', fontSize: 11 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill: '#4b5563', fontSize: 11 }} axisLine={false} tickLine={false}/>
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(249,115,22,0.05)' }}/>
              <Bar dataKey="count" radius={[6,6,0,0]}>
                {stageData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]}
                    style={{filter:'drop-shadow(0 0 6px ' + COLORS[i % COLORS.length] + '60)'}}/>
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="glass rounded-2xl p-6" style={{border:'1px solid rgba(249,115,22,0.1)'}}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-white font-bold">Leads by Source</h2>
              <p className="text-gray-500 text-xs mt-0.5">Where leads come from</p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <i className="ti ti-chart-pie text-white text-sm"></i>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="60%" height={180}>
              <PieChart>
                <Pie data={sourceData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" paddingAngle={3}>
                  {sourceData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]}
                      style={{filter:'drop-shadow(0 0 8px ' + COLORS[i % COLORS.length] + '60)', cursor:'default'}}/>
                  ))}
                </Pie>
                <Tooltip contentStyle={{background:'#111', border:'1px solid rgba(249,115,22,0.2)', borderRadius:12, fontSize:12}}/>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {sourceData.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{background:COLORS[i % COLORS.length], boxShadow:'0 0 6px ' + COLORS[i % COLORS.length]}}></div>
                  <span className="text-gray-400 text-xs capitalize">{s.name}</span>
                  <span className="text-white text-xs font-bold ml-auto">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent leads */}
      <div className="glass rounded-2xl overflow-hidden" style={{border:'1px solid rgba(249,115,22,0.1)'}}>
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold">Recent Leads</h2>
            <p className="text-gray-500 text-xs mt-0.5">Latest activity in your pipeline</p>
          </div>
          <button onClick={() => window.location.href='/leads'}
            className="text-orange-400 hover:text-orange-300 text-xs flex items-center gap-1 transition-colors">
            View all <i className="ti ti-arrow-right text-xs"></i>
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              {['Lead', 'Company', 'Stage', 'Value', 'Added'].map(h => (
                <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stats?.recentLeads?.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-12 text-gray-600">No leads yet</td></tr>
            ) : stats?.recentLeads?.map((lead, i) => (
              <tr key={lead._id} className="border-b border-white/3 hover:bg-orange-500/3 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-xs font-black text-white shadow-lg shadow-orange-500/20">
                      {lead.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium group-hover:text-orange-300 transition-colors">{lead.name}</p>
                      <p className="text-gray-600 text-xs">{lead.email || 'No email'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-400 text-sm">{lead.company || '-'}</td>
                <td className="px-6 py-4">
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full"
                    style={{background:'rgba(249,115,22,0.1)', color:'#fb923c', border:'1px solid rgba(249,115,22,0.2)'}}>
                    {lead.stage}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-orange-400">
                  {lead.value ? 'Rs ' + Number(lead.value).toLocaleString() : '-'}
                </td>
                <td className="px-6 py-4 text-gray-600 text-xs">
                  {new Date(lead.createdAt).toLocaleDateString('en-IN', {day:'numeric', month:'short'})}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
