import React, { useState } from 'react'
import Login from './pages/auth/login'
import Signup from './pages/auth/signup'
import { BrowserRouter as Router, Routes, Route, Navigate  } from 'react-router-dom';
import ProtectedRoute from './components/protectedRoute';
import Production_report from './pages/Production/production_report';
import UserScreen from './screens/userScreen';
import Attendance from './pages/attendance/dailyattendance';
import AddEmployee from './pages/attendance/addEmployee';
import EmployeeList from './pages/attendance/empList';
import AdminScreen from './screens/adminScreen';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Production" element={<Production_report />} />

        {/* User routes protected */}
        <Route element={<ProtectedRoute roleAllowed="user" />}>
          <Route path="/" element={<UserScreen />}>
            <Route index element={<Attendance />} />
          </Route>
        </Route>

        {/* Admin routes protected */}
        <Route element={<ProtectedRoute roleAllowed="admin" />}>
          <Route path="/" element={<AdminScreen />}>
            <Route path="emplist" element={<EmployeeList />} />
            <Route path="addemployee" element={<AddEmployee />} />
          </Route>
        </Route>

        {/* Catch-all: redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App
