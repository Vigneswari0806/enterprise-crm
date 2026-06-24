import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: 'ti-home' },
  { to: '/leads', label: 'Leads', icon: 'ti-users' },
  { to: '/pipeline', label: 'Pipeline', icon: 'ti-layout-kanban' },
  { to: '/customers', label: 'Customers', icon: 'ti-building' },
  { to: '/activities', label: 'Activities', icon: 'ti-calendar' },
  { to: '/settings', label: 'Settings', icon: 'ti-settings' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 min-h-screen bg-gray-900 border-r border-gray-800 flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold text-white">Enterprise CRM</h1>
        <p className="text-xs text-gray-500 mt-1">Sales Management</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map(link => (
          <NavLink key={link.to} to={link.to}
            className={({ isActive }) =>
              "flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition " +
              (isActive ? "bg-blue-600 text-white font-medium" : "text-gray-400 hover:bg-gray-800 hover:text-white")
            }>
            <i className={"ti " + link.icon} aria-hidden="true"></i>
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition">
          <i className="ti ti-logout" aria-hidden="true"></i>
          Logout
        </button>
      </div>
    </aside>
  );
}
