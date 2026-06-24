import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';

const STAGES = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'];
const SOURCES = ['web', 'referral', 'cold', 'event'];

const stageColors = {
  New: 'bg-blue-500/10 text-blue-400',
  Contacted: 'bg-yellow-500/10 text-yellow-400',
  Qualified: 'bg-purple-500/10 text-purple-400',
  Proposal: 'bg-orange-500/10 text-orange-400',
  Won: 'bg-green-500/10 text-green-400',
  Lost: 'bg-red-500/10 text-red-400',
};

const empty = { name: '', email: '', phone: '', company: '', source: 'web', stage: 'New', value: '', notes: '' };

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);

  const fetchLeads = async () => {
    const res = await api.get('/leads');
    setLeads(res.data);
  };

  useEffect(() => { fetchLeads(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/leads', form);
      setForm(empty);
      setShowForm(false);
      fetchLeads();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating lead');
    } finally {
      setLoading(false);
    }
  };

  const updateStage = async (id, stage) => {
    await api.patch('/leads/' + id, { stage });
    fetchLeads();
  };

  const deleteLead = async (id) => {
    if (!confirm('Delete this lead?')) return;
    await api.delete('/leads/' + id);
    fetchLeads();
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Leads</h1>
          <p className="text-gray-400 text-sm mt-1">{leads.length} total leads</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2">
          <i className="ti ti-plus"></i>
          Add Lead
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">New Lead</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            {[['name','Name',true],['email','Email',false],['phone','Phone',false],['company','Company',false]].map(([field, label, required]) => (
              <div key={field}>
                <label className="block text-sm text-gray-400 mb-1">{label}</label>
                <input type="text" value={form[field]}
                  onChange={e => setForm({...form, [field]: e.target.value})}
                  required={required}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"/>
              </div>
            ))}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Source</label>
              <select value={form.source} onChange={e => setForm({...form, source: e.target.value})}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Deal value (Rs)</label>
              <input type="number" value={form.value}
                onChange={e => setForm({...form, value: e.target.value})}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"/>
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-gray-400 mb-1">Notes</label>
              <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={2}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"/>
            </div>
            <div className="col-span-2 flex gap-3">
              <button type="submit" disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg text-sm font-medium transition">
                {loading ? 'Saving...' : 'Save Lead'}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg text-sm transition">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              {['Name','Company','Source','Stage','Value','Actions'].map(h => (
                <th key={h} className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {leads.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-gray-500">No leads yet. Add your first lead!</td></tr>
            ) : leads.map(lead => (
              <tr key={lead._id} className="hover:bg-gray-800/50 transition">
                <td className="px-6 py-4">
                  <p className="text-white font-medium">{lead.name}</p>
                  <p className="text-gray-500 text-xs">{lead.email}</p>
                </td>
                <td className="px-6 py-4 text-gray-300 text-sm">{lead.company || '-'}</td>
                <td className="px-6 py-4 text-gray-300 text-sm capitalize">{lead.source}</td>
                <td className="px-6 py-4">
                  <select value={lead.stage} onChange={e => updateStage(lead._id, e.target.value)}
                    className={'text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ' + stageColors[lead.stage]}>
                    {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-6 py-4 text-gray-300 text-sm">
                  {lead.value ? 'Rs ' + Number(lead.value).toLocaleString() : '-'}
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => deleteLead(lead._id)}
                    className="text-gray-500 hover:text-red-400 transition">
                    <i className="ti ti-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
