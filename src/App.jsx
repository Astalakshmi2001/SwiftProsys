import React, { useState } from 'react'
import Login from './pages/auth/login'
import Signup from './pages/auth/signup'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Production_report from './pages/Production/production_report';
import UserScreen from './screens/userScreen';
import Attendance from './pages/attendance/dailyattendance';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/Production" element={<Production_report />} />
        <Route path="/userscreen" element={<UserScreen />} /> 
          <Route path="/" element={<UserScreen />}>
          <Route index element={<Attendance />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
