import React, { useState } from "react";
import "../../App.css";

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => setCollapsed(!collapsed);

  const menuItems = [
    { name: "Dashboard", icon: "bi-speedometer2" },
    { name: "Employees", icon: "bi-people-fill" },
    { name: "Attendance", icon: "bi-calendar-check" },
    { name: "Departments", icon: "bi-diagram-3" },
    { name: "Reports", icon: "bi-bar-chart" },
    { name: "Logout", icon: "bi-box-arrow-right" },
  ];

  return (
    <div
      className={`d-flex flex-column bg-white border-end shadow-sm ${
        collapsed ? "p-2" : "p-3"
      }`}
      style={{ width: collapsed ? "70px" : "250px", height: "100vh", transition: "0.3s" }}
    >
      {/* Toggle Button */}
      {/* <button
        onClick={toggleSidebar}
        className="btn btn-outline-primary mb-4"
        style={{ alignSelf: collapsed ? "center" : "flex-end" }}
      >
        <i className={`bi ${collapsed ? "bi-arrow-right-square" : "bi-arrow-left-square"}`}></i>
      </button> */}

      {/* Menu */}
      <ul className="nav nav-pills flex-column mb-auto mt-5">
        {menuItems.map((item, index) => (
          <li className="nav-item mb-2" key={index}>
            <a href="#" className="nav-link text-dark d-flex align-items-center">
              <i className={`bi ${item.icon} fs-5 me-2`}></i>
              {!collapsed && <span>{item.name}</span>}
            </a>
          </li>
        ))}
      </ul>

      {/* Footer */}
      {!collapsed && (
        <div className="mt-auto small text-muted">
          <hr />
          Swift Prosys © 2025 HRM
        </div>
      )}
    </div>
  );
}

export default Sidebar
