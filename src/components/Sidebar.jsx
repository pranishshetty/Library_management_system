import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiBook, FiPlus, FiSend } from 'react-icons/fi';

function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: FiHome },
    { path: '/books', label: 'Books', icon: FiBook },
    { path: '/add-book', label: 'Add Book', icon: FiPlus },
    { path: '/issue', label: 'Issue Book', icon: FiSend },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white shadow-lg z-10">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-400">Library</h1>
      </div>
      <nav className="mt-6">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg mx-3 transition-all duration-200 hover:bg-gray-800 hover:text-white ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-4" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;