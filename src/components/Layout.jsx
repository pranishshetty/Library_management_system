import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { FiMenu } from 'react-icons/fi';

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen text-slate-800">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-slate-900/20 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="lg:ml-64 relative min-h-screen">
        {/* Top navbar */}
        <div className="sticky top-0 z-10">
          <Navbar />
          {/* Mobile menu button */}
          <div className="lg:hidden px-4 py-3 border-b border-blue-100/60 flex items-center bg-white/70 backdrop-blur-xl">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl hover:bg-blue-50 transition-colors"
            >
              <FiMenu className="w-5 h-5 text-slate-600" />
            </button>
            <span className="ml-4 font-serif font-bold tracking-widest text-lg text-slate-800">LMS</span>
          </div>
        </div>

        {/* Page content */}
        <main className="px-10 py-10 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;