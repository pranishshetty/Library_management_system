import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-[260px] min-h-screen flex flex-col">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-6 animate-page">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;