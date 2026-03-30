import { useState, useEffect } from 'react';
import { FiBookOpen, FiTrendingUp, FiCheckCircle, FiUsers } from 'react-icons/fi';

function Dashboard() {
  const [stats, setStats] = useState({
    total_books: 1250,
    available_books: 842,
    issued_books: 408,
    this_month: 156
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/dashboard')
      .then(res => res.json())
      .then(data => {
        setStats({
          total_books: data.stats.total_books || 1250,
          issued_books: data.stats.issued_books || 408,
          available_books: data.stats.available_books || 842,
          this_month: data.stats.this_month || 156
        });
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching dashboard:", err);
        setLoading(false);
      });
  }, []);

  const statCards = [
    {
      label: 'TOTAL VOLUMES',
      value: stats.total_books.toLocaleString(),
      subtitle: 'CURATED TITLES',
      icon: FiBookOpen,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      label: 'IN CIRCULATION',
      value: stats.issued_books.toLocaleString(),
      subtitle: 'ACTIVE LOANS',
      icon: FiTrendingUp,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
    },
    {
      label: 'AVAILABLE',
      value: stats.available_books.toLocaleString(),
      subtitle: 'READY TO BORROW',
      icon: FiCheckCircle,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
    {
      label: 'MEMBERSHIP',
      value: stats.this_month,
      subtitle: 'ACTIVE READERS',
      icon: FiUsers,
      color: 'from-violet-500 to-violet-600',
      bgColor: 'bg-violet-50',
      textColor: 'text-violet-600',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto flex flex-col min-h-[calc(100vh-140px)] justify-between pb-8">
      
      {/* Header Section */}
      <div className="pt-4 animate-fade-in">
        <div className="mb-4">
          <span className="text-[10px] tracking-[0.25em] font-semibold text-blue-500 uppercase px-3 py-1 bg-blue-50 rounded-full">OVERVIEW</span>
        </div>
        
        <div className="flex justify-between items-start mt-10">
          <div className="max-w-xl">
            <h1 className="text-6xl xl:text-7xl font-serif text-slate-800 leading-[1.1] italic mb-8 -ml-1">
              Portfolio<br />
              <span className="gradient-text">Performance</span>
            </h1>
            <p className="text-[10px] tracking-[0.15em] text-slate-400 leading-relaxed uppercase">
              MONITORING THE FLOW OF INTELLECTUAL ASSETS AND<br />
              COMMUNITY ENGAGEMENT THROUGH THE CENTRAL<br />
              TREASURY
            </p>
          </div>
          
          <div className="text-right mt-8 pr-8">
            <div className="bg-white rounded-3xl px-10 py-8 border border-blue-100/60 shadow-lg shadow-blue-500/5">
              <h2 className="text-5xl xl:text-6xl font-serif gradient-text mb-3">92%</h2>
              <p className="text-[8px] tracking-[0.25em] font-bold text-slate-400 uppercase">UTILIZATION RATE</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mt-16">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 border border-blue-100/60 hover:shadow-xl hover:shadow-blue-500/8 hover:-translate-y-1 transition-all duration-300 card-glow group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[9px] tracking-[0.18em] text-slate-400 font-semibold uppercase">{card.label}</h3>
                <div className={`w-9 h-9 ${card.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-4 h-4 ${card.textColor}`} />
                </div>
              </div>
              <p className="text-3xl font-serif text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">{card.value}</p>
              <p className="text-[8px] tracking-[0.18em] text-slate-400 uppercase font-medium">{card.subtitle}</p>
            </div>
          );
        })}
      </div>

    </div>
  );
}

export default Dashboard;