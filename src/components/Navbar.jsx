import { useLocation } from 'react-router-dom';
import { FiSearch, FiBell } from 'react-icons/fi';

function Navbar() {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'COLLECTIONS OVERVIEW';
      case '/books':
        return 'INVENTORY CATALOG';
      case '/add-book':
        return 'ADD NEW TITLE';
      case '/issue':
        return 'DISTRIBUTION LOG';
      default:
        return 'LIBRARY MANAGEMENT';
    }
  };

  const titleSplit = getPageTitle().split(' ');
  const firstWord = titleSplit[0];
  const restWords = titleSplit.slice(1).join(' ');

  return (
    <div className="h-[72px] border-b border-blue-100/60 z-10 relative bg-white/70 backdrop-blur-xl flex items-center shadow-sm">
      <div className="flex items-center justify-between w-full px-10">
        
        {/* Left side title */}
        <div className="flex items-center text-[11px] tracking-[0.12em] font-medium">
          <div className="relative">
            <span className="text-slate-800 font-semibold relative">
              {firstWord}
              <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></span>
            </span>
            <span className="ml-2 text-slate-400 font-normal">{restWords}</span>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center space-x-6">
          {/* Search */}
          <div className="flex items-center space-x-2 cursor-pointer group bg-blue-50/60 hover:bg-blue-100/80 px-4 py-2 rounded-xl transition-all duration-300">
            <FiSearch className="w-3.5 h-3.5 text-blue-500 group-hover:text-blue-600 transition-colors" />
            <span className="text-[9px] tracking-[0.12em] font-medium text-blue-500 group-hover:text-blue-600 transition-colors">SEARCH</span>
          </div>

          {/* Notifications */}
          <div className="relative cursor-pointer group p-2 hover:bg-blue-50 rounded-xl transition-all duration-300">
            <FiBell className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
            <span className="absolute top-1 right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500 border border-white"></span>
            </span>
          </div>

          {/* Profile */}
          <div className="flex items-center space-x-3 cursor-pointer group pl-4 border-l border-blue-100/60">
            <div className="flex flex-col text-right">
              <span className="text-[9px] tracking-[0.12em] font-semibold text-slate-700 uppercase">LIBRARIAN</span>
              <span className="text-[7.5px] tracking-[0.1em] text-slate-400 uppercase">MAIN BRANCH</span>
            </div>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-md shadow-blue-500/20 overflow-hidden">
               <img src="https://ui-avatars.com/api/?name=Librarian&background=3b82f6&color=ffffff&font-size=0.4&bold=true" alt="avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default Navbar;