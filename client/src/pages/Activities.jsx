import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';

const TYPES = ['call', 'email', 'meeting', 'note'];

const typeConfig = {
  call: { icon: 'ti-phone', color: 'bg-green-500/20 text-green-400', label: 'Call' },
  email: { icon: 'ti-mail', color: 'bg-blue-500/20 text-blue-400', label: 'Email' },
  meeting: { icon: 'ti-calendar', color: 'bg-purple-500/20 text-purple-400', label: 'Meeting' },
  note: { icon: 'ti-note', color: 'bg-yellow-500/20 text-yellow-400', label: 'Note' },
};

const empty = { type: 'call', subject: '', body: '', outcome: '', lead: '' };

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [leads, setLeads] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  const fetchData = async () => {
    try {
      const [actRes, leadRes] = await Promise.all([
        api.get('/activities'),
        api.get('/leads'),
      ]);
      setActivities(actRes.data);
      setLeads(leadRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/activities', form);
      setForm(empty);
      setShowForm(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error logging activity');
    } finally {
      setLoading(false);
    }
  };

  const deleteActivity = async (id) => {
    if (!confirm('Delete this activity?')) return;
    await api.delete('/activities/' + id);
    fetchData();
  };

  const filtered = filter === 'all' ? activities : activities.filter(a => a.type === filter);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Activity Log</h1>
          <p className="text-gray-400 text-sm mt-1">{activities.length} total activities</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2">
          <i className="ti ti-plus"></i>
          Log Activity
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {['all', ...TYPES].map(t => (
          <button key={t} onClick={() => setFilter(t)}
            className={"px-4 py-2 rounded-lg text-sm font-medium transition capitalize " +
              (filter === t ? "bg-blue-600 text-white" : "bg-gray-900 text-gray-400 hover:text-white border border-gray-800")}>
            {t === 'all' ? 'All' : typeConfig[t].label}
          </button>
        ))}
      </div>

      {/* Log form */}
      {showForm && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Log New Activity</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Type</label>
              <div className="flex gap-2">
                {TYPES.map(t => (
                  <button key={t} type="button" onClick={() => setForm({...form, type: t})}
                    className={"flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition capitalize " +
                      (form.type === t ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white")}>
                    <i className={"ti " + typeConfig[t].icon}></i>
                    {typeConfig[t].label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Related Lead</label>
              <select value={form.lead} onChange={e => setForm({...form, lead: e.target.value})}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                <option value="">-- Select lead --</option>
                {leads.map(l => <option key={l._id} value={l._id}>{l.name} {l.company ? "- " + l.company : ""}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-gray-400 mb-1">Subject</label>
              <input type="text" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}
                required placeholder="e.g. Follow-up call with Ravi"
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"/>
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-gray-400 mb-1">Notes</label>
              <textarea value={form.body} onChange={e => setForm({...form, body: e.target.value})} rows={2}
                placeholder="What happened during this activity?"
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"/>
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-gray-400 mb-1">Outcome</label>
              <input type="text" value={form.outcome} onChange={e => setForm({...form, outcome: e.target.value})}
                placeholder="e.g. Interested, will call back next week"
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"/>
            </div>
            <div className="col-span-2 flex gap-3">
              <button type="submit" disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg text-sm font-medium transition">
                {loading ? 'Saving...' : 'Save Activity'}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg text-sm transition">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Timeline */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center text-gray-500">
            No activities yet. Log your first activity!
          </div>
        ) : filtered.map(activity => (
          <div key={activity._id}
            className="group bg-gray-900 border border-gray-800 rounded-2xl p-4 hover:border-gray-600 transition-all duration-200 flex gap-4">
            <div className={"w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 " + typeConfig[activity.type]?.color}>
              <i className={"ti " + typeConfig[activity.type]?.icon + " text-lg"}></i>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white text-sm font-medium">{activity.subject}</p>
                  {activity.lead && (
                    <p className="text-blue-400 text-xs mt-0.5 flex items-center gap-1">
                      <i className="ti ti-user text-xs"></i>
                      {activity.lead.name}{activity.lead.company ? " · " + activity.lead.company : ""}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{formatDate(activity.createdAt)}</span>
                  <button onClick={() => deleteActivity(activity._id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all">
                    <i className="ti ti-trash text-sm"></i>
                  </button>
                </div>
              </div>
              {activity.body && <p className="text-gray-400 text-xs mt-2 leading-relaxed">{activity.body}</p>}
              {activity.outcome && (
                <div className="mt-2 inline-flex items-center gap-1 bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded-lg">
                  <i className="ti ti-flag text-xs text-yellow-400"></i>
                  {activity.outcome}
                </div>
              )}
              <div className="mt-2 flex items-center gap-1 text-xs text-gray-600">
                <i className="ti ti-user-circle text-xs"></i>
                {activity.user?.name || 'You'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
