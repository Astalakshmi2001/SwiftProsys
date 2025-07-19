import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/protectedRoute';

// 🔹 Lazy-loaded components
const Login = lazy(() => import('./pages/auth/login'));
const Signup = lazy(() => import('./pages/auth/signup'));
const Production_report = lazy(() => import('./pages/Production/production_report'));
const UserScreen = lazy(() => import('./screens/userScreen'));
const Attendance = lazy(() => import('./pages/attendance/dailyattendance'));
const AddEmployee = lazy(() => import('./pages/attendance/addEmployee'));
const EmployeeList = lazy(() => import('./pages/attendance/empList'));
const AdminScreen = lazy(() => import('./screens/adminScreen'));
const AttendanceReport = lazy(() => import('./pages/attendance/attendance_report'));
const AdminDashboard = lazy(() => import('./pages/attendance/Admin_dashboard'));

function App() {
  return (
    <Router>
      {/* Wrap all lazy-loaded components in Suspense */}
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Production" element={<Production_report />} />

          <Route path="/user" element={<ProtectedRoute roleAllowed="user" />}>
            <Route element={<UserScreen />}>
              <Route index element={<Attendance />} />
            </Route>
          </Route>

          <Route path="/admin" element={<ProtectedRoute roleAllowed="admin" />}>
            <Route element={<AdminScreen />}>
              <Route index element={<AdminDashboard />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="emplist" element={<EmployeeList />} />
              <Route path="addemployee" element={<AddEmployee />} />
              <Route path="attendancereport" element={<AttendanceReport />} />
            </Route>
          </Route>

          {/* Catch-all */}
          <Route path="/addemployee" element={<AddEmployee />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
