import { Link, useLocation } from 'react-router-dom';
import {
  FiGrid, FiBook, FiPlusCircle, FiSend, FiRotateCcw, FiX, FiLock, FiClock
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const allMenuItems = [
  { path: '/', label: 'Dashboard', icon: FiGrid, roles: ['admin', 'student'] },
  { path: '/books', label: 'Books', icon: FiBook, roles: ['admin', 'student'] },
  { path: '/requests', label: 'Book Requests', icon: FiClock, roles: ['admin'] },
  { path: '/requests', label: 'My Requests', icon: FiClock, roles: ['student'] },
  { path: '/add-book', label: 'Add Book', icon: FiPlusCircle, roles: ['admin'] },
  { path: '/issue', label: 'Issue Book', icon: FiSend, roles: ['admin'] },
  { path: '/return', label: 'Return Book', icon: FiRotateCcw, roles: ['admin'] },
];

function Sidebar({ open, onClose }) {
  const location = useLocation();
  const { user } = useAuth();
  const role = user?.role || 'student';

  // Filter menu items by role
  const menuItems = allMenuItems.filter(item => item.roles.includes(role));

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-[260px] bg-white border-r border-slate-200 z-50 flex flex-col transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-600/20">
              <FiBook className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-[15px] text-slate-800 tracking-tight">LibraryMS</span>
          </div>
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <FiX className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Role badge */}
        <div className="px-6 pt-4 pb-2">
          <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg uppercase tracking-wider ${
            role === 'admin'
              ? 'bg-indigo-50 text-indigo-600'
              : 'bg-blue-50 text-blue-600'
          }`}>
            {role === 'admin' ? <FiLock className="w-3 h-3" /> : <FiBook className="w-3 h-3" />}
            {role} Account
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          {menuItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13.5px] font-medium transition-all duration-200 group
                  ${isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
              >
                <Icon className={`w-[18px] h-[18px] transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-3.5">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Status</p>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[12px] text-emerald-600 font-medium">System Online</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;