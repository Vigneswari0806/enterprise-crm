import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const ROLES = ['admin', 'manager', 'sales'];

const roleColors = {
  admin: 'bg-red-500/20 text-red-400',
  manager: 'bg-blue-500/20 text-blue-400',
  sales: 'bg-green-500/20 text-green-400',
};

export default function Settings() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const updateRole = async (id, role) => {
    try {
      await api.patch('/users/' + id + '/role', { role });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update role');
    }
  };

  const deleteUser = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      await api.delete('/users/' + id);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Manage users and roles</p>
      </div>

      {/* Current user info */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Your Account</h2>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-xl font-bold text-white">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-white font-medium text-lg">{user?.name}</p>
            <p className="text-gray-400 text-sm">{user?.email}</p>
            <span className={"text-xs font-medium px-2 py-1 rounded-full mt-1 inline-block capitalize " + roleColors[user?.role]}>
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Users table - admin only */}
      {user?.role === 'admin' ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-lg font-semibold text-white">Team Members</h2>
            <p className="text-gray-400 text-sm mt-1">{users.length} users total</p>
          </div>
          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading users...</div>
          ) : error ? (
            <div className="p-12 text-center text-red-400">{error}</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  {['User', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-gray-800/50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <p className="text-white text-sm font-medium">{u.name}</p>
                        {u._id === user?.id && <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">You</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{u.email}</td>
                    <td className="px-6 py-4">
                      {u._id === user?.id ? (
                        <span className={"text-xs font-medium px-2 py-1 rounded-full capitalize " + roleColors[u.role]}>{u.role}</span>
                      ) : (
                        <select value={u.role} onChange={e => updateRole(u._id, e.target.value)}
                          className={"text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer capitalize " + roleColors[u.role]}>
                          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      {u._id !== user?.id && (
                        <button onClick={() => deleteUser(u._id)}
                          className="text-gray-500 hover:text-red-400 transition">
                          <i className="ti ti-trash"></i>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
          <i className="ti ti-lock text-4xl text-gray-600 mb-4 block"></i>
          <p className="text-gray-400">Only admins can manage users and roles.</p>
        </div>
      )}
    </Layout>
  );
}
