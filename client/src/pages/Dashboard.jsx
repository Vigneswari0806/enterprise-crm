import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import Layout from '../components/Layout';
import api from '../utils/api';

const COLORS = ['#3b82f6', '#f59e0b', '#8b5cf6', '#f97316', '#22c55e', '#ef4444'];

const StatCard = ({ label, value, sub, color }) => (
  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
    <p className="text-sm text-gray-400">{label}</p>
    <p className={'text-3xl font-bold mt-1 ' + color}>{value}</p>
    {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <Layout>
      <div className="flex items-center justify-center h-64 text-gray-400">Loading dashboard...</div>
    </Layout>
  );

  const stageData = stats?.byStage?.map(s => ({ name: s._id, count: s.count, value: s.value })) || [];
  const sourceData = stats?.bySource?.map(s => ({ name: s._id, value: s.count })) || [];
  const winRate = stats?.totalLeads ? Math.round((stats.wonLeads / stats.totalLeads) * 100) : 0;

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Sales performance overview</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Leads" value={stats?.totalLeads || 0} sub="All time" color="text-white"/>
        <StatCard label="Won Deals" value={stats?.wonLeads || 0} sub={"Win rate: " + winRate + "%"} color="text-green-400"/>
        <StatCard label="Lost Deals" value={stats?.lostLeads || 0} color="text-red-400"/>
        <StatCard label="Total Revenue" value={"Rs " + (stats?.totalRevenue || 0).toLocaleString()} sub="From won deals" color="text-blue-400"/>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Leads by Stage</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={stageData}>
              <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 8 }} />
              <Bar dataKey="count" fill="#3b82f6" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Leads by Source</h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={sourceData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => name + " " + (percent*100).toFixed(0) + "%"}>
                {sourceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Recent Leads</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              {['Name', 'Company', 'Stage', 'Value'].map(h => (
                <th key={h} className="text-left pb-3 text-xs font-medium text-gray-400 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {stats?.recentLeads?.map(lead => (
              <tr key={lead._id} className="hover:bg-gray-800/50 transition">
                <td className="py-3 text-white text-sm">{lead.name}</td>
                <td className="py-3 text-gray-400 text-sm">{lead.company || '-'}</td>
                <td className="py-3 text-sm">
                  <span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full text-xs">{lead.stage}</span>
                </td>
                <td className="py-3 text-gray-400 text-sm">{lead.value ? 'Rs ' + Number(lead.value).toLocaleString() : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
