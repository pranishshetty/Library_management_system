import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiBook, FiCheckCircle, FiSend, FiTrendingUp, FiArrowRight, FiClock } from 'react-icons/fi';
import { getDashboard } from '../services/api';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const stats = data?.stats || { total_books: 0, available_books: 0, issued_books: 0, this_month: 0 };
  const activities = data?.recent_activities || [];

  const statCards = [
    { label: 'Total Books', value: stats.total_books, icon: FiBook, bg: 'bg-blue-50', text: 'text-blue-600', ring: 'ring-blue-100' },
    { label: 'Available', value: stats.available_books, icon: FiCheckCircle, bg: 'bg-emerald-50', text: 'text-emerald-600', ring: 'ring-emerald-100' },
    { label: 'Issued', value: stats.issued_books, icon: FiSend, bg: 'bg-amber-50', text: 'text-amber-600', ring: 'ring-amber-100' },
    { label: 'Requests', value: stats.pending_requests || 0, icon: FiClock, bg: 'bg-violet-50', text: 'text-violet-600', ring: 'ring-violet-100' },
  ];

  // Quick actions differ by role
  const quickActions = isAdmin
    ? [
        { label: 'Add New Book', desc: 'Add a book to inventory', path: '/add-book', icon: FiBook, color: 'blue' },
        { label: 'Book Requests', desc: 'Approve or reject', path: '/requests', icon: FiClock, color: 'violet' },
        { label: 'Issue Book', desc: 'Issue to a student', path: '/issue', icon: FiSend, color: 'amber' },
      ]
    : [
        { label: 'Browse Books', desc: 'View available books', path: '/books', icon: FiBook, color: 'blue' },
        { label: 'My Requests', desc: 'Track request status', path: '/requests', icon: FiClock, color: 'violet' },
      ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-400 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Welcome back, {user?.name}! 👋</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            {isAdmin
              ? "Here's what's happening in your library today."
              : "Browse and explore the library collection."}
          </p>
        </div>
        {isAdmin && (
          <Link
            to="/add-book"
            className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20 w-fit"
          >
            Add New Book
            <FiArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 border border-slate-100 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-0.5 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center ring-4 ${card.ring}`}>
                  <Icon className={`w-5 h-5 ${card.text}`} />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-800">{card.value.toLocaleString()}</p>
              <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Activity + Quick Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Recent Activity */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiClock className="w-4 h-4 text-slate-400" />
              <h3 className="font-semibold text-slate-700 text-[15px]">Recent Activity</h3>
            </div>
            <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Latest</span>
          </div>
          <div className="divide-y divide-slate-50">
            {activities.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <p className="text-sm text-slate-400">No recent activity yet</p>
              </div>
            ) : (
              activities.map((a, i) => (
                <div key={i} className="px-6 py-3.5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${a.type === 'issued' ? 'bg-amber-400' : 'bg-emerald-400'}`}></div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">{a.book}</p>
                      <p className="text-[12px] text-slate-400 truncate">{a.user}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize
                      ${a.type === 'issued'
                        ? 'bg-amber-50 text-amber-600'
                        : 'bg-emerald-50 text-emerald-600'
                      }`}>
                      {a.type}
                    </span>
                    <span className="text-[11px] text-slate-400 hidden sm:block">
                      {new Date(a.time).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h3 className="font-semibold text-slate-700 text-[15px] mb-5">Quick Actions</h3>
          <div className="space-y-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.path}
                  to={action.path}
                  className="flex items-center gap-3.5 p-3.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200 group"
                >
                  <div className={`w-9 h-9 rounded-lg bg-${action.color}-50 flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 text-${action.color}-500`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">{action.label}</p>
                    <p className="text-[11px] text-slate-400">{action.desc}</p>
                  </div>
                  <FiArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-all group-hover:translate-x-0.5" />
                </Link>
              );
            })}
          </div>

          {/* Student info box */}
          {!isAdmin && (
            <div className="mt-5 bg-amber-50 border border-amber-100 rounded-xl p-4">
              <p className="text-xs font-semibold text-amber-700 mb-1">Student Account</p>
              <p className="text-[11px] text-amber-600 leading-relaxed">
                You can browse and view books. Contact a librarian to issue or return books.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;