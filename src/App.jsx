import React, { useState } from 'react'
// import './App.css'
import Login from './pages/auth/login'
import Signup from './pages/auth/signup'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Production_report from './pages/Production/production_report';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path=".pages/Production/production_report" element={<Production_report />} />
      </Routes>
    </Router>
  )
}

export default App
