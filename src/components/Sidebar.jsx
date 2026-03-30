import { Link, useLocation } from 'react-router-dom';
import { FiGrid, FiBook, FiPlusCircle, FiSend } from 'react-icons/fi';

function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'COLLECTIONS', icon: FiGrid },
    { path: '/books', label: 'INVENTORY', icon: FiBook },
    { path: '/add-book', label: 'ADD TITLE', icon: FiPlusCircle },
    { path: '/issue', label: 'DISTRIBUTION', icon: FiSend },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 z-10 flex flex-col items-center bg-white/80 backdrop-blur-xl border-r border-blue-100/60 shadow-[4px_0_24px_rgba(37,99,235,0.04)]">
      {/* Logo area */}
      <div className="pt-8 pb-10 w-full text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <span className="text-white text-lg font-bold font-serif">L</span>
        </div>
        <h1 className="text-xl font-serif text-slate-800 tracking-[0.25em] font-semibold">L M S</h1>
        <p className="text-[8px] tracking-[0.2em] text-blue-400 mt-1 uppercase">Library Suite</p>
      </div>

      {/* Divider */}
      <div className="w-3/4 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent mb-6" />

      {/* Nav */}
      <nav className="flex-1 w-full px-5 flex flex-col">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] tracking-[0.18em] font-medium transition-all duration-300 group ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-slate-500 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-white' : ''}`} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom section */}
      <div className="w-full px-5 pb-6">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent mb-5" />
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100/60">
          <p className="text-[9px] tracking-[0.12em] text-slate-500 uppercase font-medium">System Status</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] text-emerald-600 font-medium">All systems online</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;