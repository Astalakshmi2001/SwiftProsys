import React from 'react';

const AdminDashboard = () => {
  // Sample data
  const stats = [
    { title: "Total Employees", value: 142, icon: "bx-group", trend: "+5% from last month", color: "bg-blue-100 text-blue-600" },
    { title: "Present Today", value: 128, icon: "bx-check-circle", trend: "94% attendance", color: "bg-green-100 text-green-600" },
    { title: "On Leave", value: 8, icon: "bx-calendar-x", trend: "2 planned, 6 unplanned", color: "bg-yellow-100 text-yellow-600" },
    { title: "Late Arrivals", value: 6, icon: "bx-time-five", trend: "3% decrease", color: "bg-red-100 text-red-600" }
  ];

  const recentActivity = [
    { employee: "John Doe", action: "Checked in late", time: "10 min ago", avatar: "https://i.pravatar.cc/150?img=5" },
    { employee: "Jane Smith", action: "Submitted leave request", time: "25 min ago", avatar: "https://i.pravatar.cc/150?img=11" },
    { employee: "Robert Johnson", action: "Updated profile", time: "1 hour ago", avatar: "https://i.pravatar.cc/150?img=8" }
  ];

  const departmentAttendance = [
    { name: "Engineering", present: 45, total: 48, percentage: 94, color: "bg-green-500" },
    { name: "Marketing", present: 22, total: 25, percentage: 88, color: "bg-blue-500" },
    { name: "Sales", present: 38, total: 40, percentage: 95, color: "bg-purple-500" }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      {/* <div className="bg-indigo-800 text-white w-64 flex-shrink-0">
        <div className="p-4 flex items-center justify-between border-b border-indigo-700">
          <h1 className="text-xl font-bold">HRMS Admin</h1>
          <button className="text-white focus:outline-none">
            <i className='bx bx-x text-2xl'></i>
          </button>
        </div>
        <nav className="p-4">
          <ul>
            <li className="mb-2">
              <a href="#" className="flex items-center p-2 rounded-lg bg-indigo-700">
                <i className='bx bx-home text-xl mr-3'></i>
                <span>Dashboard</span>
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="flex items-center p-2 rounded-lg hover:bg-indigo-700">
                <i className='bx bx-user text-xl mr-3'></i>
                <span>Employees</span>
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="flex items-center p-2 rounded-lg hover:bg-indigo-700">
                <i className='bx bx-calendar-check text-xl mr-3'></i>
                <span>Attendance</span>
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="flex items-center p-2 rounded-lg hover:bg-indigo-700">
                <i className='bx bx-line-chart text-xl mr-3'></i>
                <span>Reports</span>
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="flex items-center p-2 rounded-lg hover:bg-indigo-700">
                <i className='bx bx-cog text-xl mr-3'></i>
                <span>Settings</span>
              </a>
            </li>
          </ul>
        </nav>
      </div> */}

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Navigation */}
        {/* <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <div className="flex items-center">
            <button className="mr-4 text-gray-600 focus:outline-none">
              <i className='bx bx-menu text-2xl'></i>
            </button>
            <h2 className="text-xl font-semibold">Dashboard Overview</h2>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative text-gray-600 focus:outline-none">
              <i className='bx bx-bell text-2xl'></i>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center">
              <img src="https://i.pravatar.cc/150?img=3" alt="Admin" className="w-8 h-8 rounded-full mr-2" />
              <span className="font-medium">Admin</span>
            </div>
          </div>
        </header> */}

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between">
                  <div>
                    <p className="text-gray-500">{stat.title}</p>
                    <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                    <p className={`text-sm ${stat.color.replace('bg-', 'text-')} mt-1`}>
                      {stat.trend}
                    </p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-full`}>
                    <i className={`bx ${stat.icon} text-2xl`}></i>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts and Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Attendance Overview */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Attendance Overview</h3>
                <select className="border rounded px-3 py-1 text-sm">
                  <option>Last 7 Days</option>
                  <option>Last Month</option>
                  <option>Last Quarter</option>
                </select>
              </div>
              <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
                <p className="text-gray-400">Attendance chart will appear here</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start">
                    <img src={activity.avatar} alt="User" className="w-10 h-10 rounded-full mr-3" />
                    <div>
                      <p className="font-medium">{activity.employee}</p>
                      <p className="text-sm text-gray-600">{activity.action}</p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Department Attendance */}
          <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Department Attendance</h3>
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Department</th>
                    <th className="text-left py-3 px-4">Present</th>
                    <th className="text-left py-3 px-4">Total</th>
                    <th className="text-left py-3 px-4">Percentage</th>
                    <th className="text-left py-3 px-4">Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {departmentAttendance.map((dept, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{dept.name}</td>
                      <td className="py-3 px-4">{dept.present}</td>
                      <td className="py-3 px-4">{dept.total}</td>
                      <td className="py-3 px-4">{dept.percentage}%</td>
                      <td className="py-3 px-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`${dept.color} h-2 rounded-full`} 
                            style={{ width: `${dept.percentage}%` }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;