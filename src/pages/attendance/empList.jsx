import React from 'react';

const EmployeeList = ({ employees, onAddClick }) => {
    
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Employee List</h2>

      <button onClick={onAddClick} className="mb-6 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">
        + Add New Employee
      </button>

      {employees.length === 0 ? (
        <p className="text-gray-500">No employees added yet.</p>
      ) : (
        <ul className="space-y-4">
          {employees.map(emp => (
            <li key={emp.id} className="p-4 border rounded shadow-sm flex items-center space-x-4">
              {emp.previewImage ? (
                <img src={emp.previewImage} alt="" className="w-12 h-12 rounded-full" />
              ) : (
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-white">👤</div>
              )}
              <div>
                <p className="font-semibold">{emp.firstName} {emp.lastName}</p>
                <p className="text-sm text-gray-500">{emp.position} - {emp.department}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmployeeList;
