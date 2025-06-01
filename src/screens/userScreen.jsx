import React from 'react';
import Header from '../pages/header/header';
import Sidebar from '../pages/sidebar/sidebar';
import { Outlet } from 'react-router-dom';

function UserScreen() {
  return (
    <div className="userscreen">
      <Header />
      <div className="d-flex">
        <div
          style={{
            position: 'fixed',
            top: '60px',
            left: 0,
            overflowY: 'auto',
          }}
        >
          <Sidebar />
        </div>
        <div
          className="flex-grow-1"
          style={{
            marginLeft: '240px',
            marginTop: '60px', // match Header height
            height: 'calc(100vh - 60px)',
            overflowY: 'auto',
            padding: '1rem',
          }}
        >
          <Outlet /> {/* Page content renders here */}
        </div>
      </div>
    </div>
  )
}

export default UserScreen
