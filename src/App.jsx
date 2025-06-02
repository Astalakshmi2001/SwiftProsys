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
  const role = "admin";

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/Production" element={<Production_report />} />
        {role === "user" ? (
          <>
            {/* <Route path="/userscreen" element={<UserScreen />} /> */}
            <Route path="/" element={<UserScreen />}>
              <Route index element={<Attendance />} />
            </Route>
          </>
        ) : role === "admin" ? (
          <>
            {/* <Route path="/adminscreen" element={<AdminScreen />} /> */}
            <Route path="/" element={<AdminScreen />}>
              <Route path="/emplist" element={<EmployeeList />} />
              <Route path="/addemployee" element={<AddEmployee />} />
            </Route>
          </>
        ) : (
          <Route path="/" element={<Login />} />
        )}
      </Routes>
    </Router>
  )
}

export default App
