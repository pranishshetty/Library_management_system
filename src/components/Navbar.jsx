import { useLocation, useNavigate } from 'react-router-dom';
import { FiBell, FiMenu, FiUser, FiLogOut, FiShield } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/books': 'Books',
  '/add-book': 'Add Book',
  '/issue': 'Issue Book',
  '/return': 'Return Book',
};

function Navbar({ onMenuClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const title = PAGE_TITLES[location.pathname] || 'Library Management System';

  const handleLogout = () => {
    logout();
    toast.success('Signed out successfully');
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <FiMenu className="w-5 h-5 text-slate-500" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-slate-800 leading-tight">{title}</h1>
          <p className="text-[11px] text-slate-400 font-medium hidden sm:block">Library Management System</p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Notification */}
        <button className="relative p-2.5 rounded-xl hover:bg-slate-100 transition-colors">
          <FiBell className="w-[18px] h-[18px] text-slate-400" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"></span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <div className="hidden sm:block text-right">
            <p className="text-[13px] font-semibold text-slate-700 leading-tight">{user?.name || 'User'}</p>
            <p className="text-[11px] text-slate-400 flex items-center justify-end gap-1">
              {isAdmin && <FiShield className="w-3 h-3" />}
              {user?.role === 'admin' ? 'Admin' : 'Student'}
            </p>
          </div>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-sm ${
            isAdmin
              ? 'bg-gradient-to-br from-indigo-600 to-blue-600'
              : 'bg-gradient-to-br from-blue-500 to-cyan-500'
          }`}>
            <FiUser className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="p-2.5 rounded-xl hover:bg-red-50 transition-colors group"
          title="Sign out"
        >
          <FiLogOut className="w-[18px] h-[18px] text-slate-400 group-hover:text-red-500 transition-colors" />
        </button>
      </div>
    </header>
  );
}

export default Navbar;