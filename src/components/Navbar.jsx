import { useLocation } from 'react-router-dom';
import { FiSearch, FiUser } from 'react-icons/fi';

function Navbar() {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/books':
        return 'All Books';
      case '/add-book':
        return 'Add New Book';
      case '/issue':
        return 'Issue Book';
      default:
        return 'Library Management';
    }
  };

  return (
    <div className="fixed top-0 left-64 right-0 h-16 bg-white shadow-sm border-b border-gray-200 z-10">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-800">{getPageTitle()}</h1>
        </div>

        <div className="flex items-center space-x-6">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-12 pr-4 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80 bg-gray-50 hover:bg-white transition-all duration-200"
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer">
                <span className="text-white text-sm font-semibold">A</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-900 font-medium text-sm">Admin User</span>
              <span className="text-gray-500 text-xs -mt-1">Administrator</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;