import React, { useState } from 'react'
import Login from './pages/auth/login'
import Signup from './pages/auth/signup'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Production_report from './pages/Production/production_report';
import UserScreen from './screens/userScreen';
import Attendance from './pages/attendance/dailyattendance';
import AddEmployee from './pages/attendance/addEmployee';
import EmployeeList from './pages/attendance/empList';
import AdminScreen from './screens/adminScreen';

function App() {
  const role = "user";
  const sampleEmployees = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      position: 'Software Engineer',
      department: 'Development',
      previewImage: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      position: 'Product Manager',
      department: 'Product',
      previewImage: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      id: 3,
      firstName: 'Ali',
      lastName: 'Khan',
      position: 'UI/UX Designer',
      department: 'Design',
      previewImage: '' // Will fallback to 👤 icon
    }
  ];

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/Production" element={<Production_report />} />
        {role === "user" ? (
          <>
            <Route path="/userscreen" element={<UserScreen />} />
            <Route path="/" element={<UserScreen />}>
              <Route index element={<Attendance />} />
            </Route>
          </>
        ) : (
          <>
            <Route path="/adminscreen" element={<AdminScreen />} />
            <Route path="/" element={<AdminScreen />}>
              <Route index element={<EmployeeList employees={sampleEmployees} onAddClick={() => window.location.href = '/addemployee'} />} />
              <Route path="/addemployee" element={<AddEmployee onAddEmployee={undefined} onBack={() => window.location.href = '/emplist'} />} />
            </Route>
          </>
        )}
      </Routes>
    </Router>
  )
}

export default App
