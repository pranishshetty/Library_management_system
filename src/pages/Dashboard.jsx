import { FiBook, FiCheckCircle, FiXCircle, FiTrendingUp, FiArrowRight, FiArrowLeft } from 'react-icons/fi';

function Dashboard() {
  const stats = [
    {
      title: 'Total Books',
      value: '150',
      icon: FiBook,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Available Books',
      value: '105',
      icon: FiCheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Issued Books',
      value: '45',
      icon: FiXCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: 'This Month',
      value: '+12',
      icon: FiTrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'issued',
      book: 'The Great Gatsby',
      user: 'John Smith',
      time: '2 hours ago',
    },
    {
      id: 2,
      type: 'returned',
      book: '1984',
      user: 'Sarah Johnson',
      time: '4 hours ago',
    },
    {
      id: 3,
      type: 'issued',
      book: 'Pride and Prejudice',
      user: 'Mike Davis',
      time: '6 hours ago',
    },
    {
      id: 4,
      type: 'returned',
      book: 'The Hobbit',
      user: 'Emma Wilson',
      time: '8 hours ago',
    },
    {
      id: 5,
      type: 'issued',
      book: 'Dune',
      user: 'Alex Brown',
      time: '1 day ago',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 text-lg">Monitor your library's performance and key metrics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  activity.type === 'issued' ? 'bg-red-100' : 'bg-green-100'
                }`}>
                  {activity.type === 'issued' ? (
                    <FiArrowRight className={`w-4 h-4 ${
                      activity.type === 'issued' ? 'text-red-600' : 'text-green-600'
                    }`} />
                  ) : (
                    <FiArrowLeft className={`w-4 h-4 ${
                      activity.type === 'issued' ? 'text-red-600' : 'text-green-600'
                    }`} />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    <span className="font-semibold">{activity.user}</span> {activity.type} <span className="font-semibold">"{activity.book}"</span>
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;