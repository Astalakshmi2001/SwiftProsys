import { useState, useMemo } from 'react';
import { format, subDays } from 'date-fns';
// import 'boxicons';

const AttendanceReport = () => {
  // Sample data - replace with your API data
  const [data, setData] = useState(() => generateMockData());
  const [dateRange, setDateRange] = useState({
    start: subDays(new Date(), 30),
    end: new Date(),
  });
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Generate columns for the table
  const columns = useMemo(() => [
    {
      header: 'Employee',
      accessorKey: 'employee',
      cell: info => (
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-200 mr-2 overflow-hidden flex-shrink-0">
            <img src={info.row.original.avatar} alt={info.getValue()} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <p className="font-medium truncate">{info.getValue()}</p>
            <p className="text-xs text-gray-500 truncate">{info.row.original.employeeId}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Department',
      accessorKey: 'department',
      cell: info => <span className="text-gray-700">{info.getValue()}</span>,
    },
    {
      header: 'Present',
      accessorKey: 'presentDays',
      cell: info => <span className="text-green-600 font-medium">{info.getValue()}</span>,
    },
    {
      header: 'Absent',
      accessorKey: 'absentDays',
      cell: info => <span className="text-red-600 font-medium">{info.getValue()}</span>,
    },
    {
      header: 'Late',
      accessorKey: 'lateDays',
      cell: info => <span className="text-yellow-600 font-medium">{info.getValue()}</span>,
    },
    {
      header: 'Early Leave',
      accessorKey: 'earlyLeaveDays',
      cell: info => <span className="text-purple-600 font-medium">{info.getValue()}</span>,
    },
    {
      header: 'Attendance %',
      accessorKey: 'attendancePercentage',
      cell: info => (
        <div className="flex items-center">
          <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${info.getValue()}%` }}
            ></div>
          </div>
          <span className="text-sm text-gray-700">{info.getValue()}%</span>
        </div>
      ),
    },
  ], []);

  // Filter and process data
  const filteredData = useMemo(() => {
    let result = [...data];
    
    if (departmentFilter !== 'all') {
      result = result.filter(item => item.department === departmentFilter);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.employee.toLowerCase().includes(term) ||
        item.employeeId.toLowerCase().includes(term)
      );
    }
    
    return result;
  }, [data, departmentFilter, searchTerm]);

  // Calculate statistics for cards
  const stats = useMemo(() => {
    const totalEmployees = data.length;
    const avgAttendance = Math.round(data.reduce((sum, emp) => sum + emp.attendancePercentage, 0) / data.length);
    const totalLate = data.reduce((sum, emp) => sum + emp.lateDays, 0);
    const totalAbsent = data.reduce((sum, emp) => sum + emp.absentDays, 0);
    
    return { totalEmployees, avgAttendance, totalLate, totalAbsent };
  }, [data]);

  // Department statistics
  const departmentStats = useMemo(() => {
    const departments = [...new Set(data.map(item => item.department))];
    return departments.map(dept => {
      const deptEmployees = data.filter(item => item.department === dept);
      const totalPresent = deptEmployees.reduce((sum, emp) => sum + emp.presentDays, 0);
      const totalDays = deptEmployees.length * 30;
      return {
        department: dept,
        presentPercentage: Math.round((totalPresent / totalDays) * 100),
        employeeCount: deptEmployees.length,
      };
    });
  }, [data]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Employee Attendance Report</h1>
          <p className="text-gray-600">Overview of employee attendance records</p>
        </div>
        
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className='bx bx-search text-gray-400'></i>
              </div>
              <input
                type="text"
                placeholder="Search employees..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={departmentFilter}
                onChange={e => setDepartmentFilter(e.target.value)}
              >
                <option value="all">All Departments</option>
                {[...new Set(data.map(item => item.department))].map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className='bx bx-calendar text-gray-400'></i>
                </div>
                <div className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  {format(dateRange.start, 'MMM d, yyyy')} - {format(dateRange.end, 'MMM d, yyyy')}
                </div>
              </div>
              
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <i className='bx bx-filter-alt mr-2'></i>
                Filter
              </button>
              
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <i className='bx bx-download mr-2'></i>
                Export
              </button>
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard 
            title="Total Employees" 
            value={stats.totalEmployees} 
            icon={<i className='bx bx-group text-2xl mr-4'></i>}
            trend="+5% from last month"
            trendColor="green"
          />
          <StatCard 
            title="Avg. Attendance" 
            value={`${stats.avgAttendance}%`} 
            icon={<i className='bx bx-check-circle text-2xl mr-4'></i>}
            trend="+2% from last month"
            trendColor="green"
          />
          <StatCard 
            title="Late Arrivals" 
            value={stats.totalLate} 
            icon={<i className='bx bx-time-five text-2xl mr-4'></i>}
            trend="3% decrease"
            trendColor="red"
          />
          <StatCard 
            title="Absences" 
            value={stats.totalAbsent} 
            icon={<i className='bx bx-x-circle text-2xl mr-4'></i>}
            trend="1% increase"
            trendColor="red"
          />
        </div>
        
        {/* Department Stats */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Attendance by Department</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employees
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendance Rate
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {departmentStats.map((dept, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {dept.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {dept.employeeCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {dept.presentPercentage}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${dept.presentPercentage}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Main Data Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column, idx) => (
                    <th
                      key={idx}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div className="flex items-center">
                        {column.header}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.slice(0, 10).map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-gray-50">
                    {columns.map((column, colIdx) => (
                      <td key={colIdx} className="px-6 py-4 whitespace-nowrap">
                        {column.cell({ row: { original: row }, getValue: () => row[column.accessorKey] })}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Previous
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
                  <span className="font-medium">{filteredData.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">First</span>
                    <i className='bx bx-chevrons-left h-5 w-5'></i>
                  </button>
                  <button
                    className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Previous</span>
                    <i className='bx bx-chevron-left h-5 w-5'></i>
                  </button>
                  <button
                    className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Next</span>
                    <i className='bx bx-chevron-right h-5 w-5'></i>
                  </button>
                  <button
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Last</span>
                    <i className='bx bx-chevrons-right h-5 w-5'></i>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, trend, trendColor = 'green' }) => {
  const trendColors = {
    green: 'text-green-600',
    red: 'text-red-600',
    yellow: 'text-yellow-600',
    blue: 'text-blue-600',
  };
  
  return (
    <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0 text-2xl mr-4">
            {icon}
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-900">{value}</dd>
            <p className={`mt-1 text-xs ${trendColors[trendColor]}`}>{trend}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mock data generator
function generateMockData() {
  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];
  const firstNames = ['John', 'Jane', 'Robert', 'Emily', 'Michael', 'Sarah', 'David', 'Lisa'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia'];
  
  return Array.from({ length: 50 }, (_, i) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const department = departments[Math.floor(Math.random() * departments.length)];
    const presentDays = Math.floor(Math.random() * 25) + 15;
    const absentDays = Math.floor(Math.random() * 5);
    const lateDays = Math.floor(Math.random() * 10);
    const earlyLeaveDays = Math.floor(Math.random() * 5);
    const totalDays = presentDays + absentDays;
    
    return {
      id: `EMP${1000 + i}`,
      employeeId: `EMP${1000 + i}`,
      employee: `${firstName} ${lastName}`,
      department,
      presentDays,
      absentDays,
      lateDays,
      earlyLeaveDays,
      attendancePercentage: Math.round((presentDays / totalDays) * 100),
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
    };
  });
}

export default AttendanceReport;