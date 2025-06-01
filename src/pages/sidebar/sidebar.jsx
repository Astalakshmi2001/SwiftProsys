import React, { useState } from "react";
import "../../App.css";
import mainlogo from "../../assets/mainlogo.png";
import logo from "../../assets/logo.png";

function Sidebar({ collapsed }) {
  const menuItems = [
    { name: "Dashboard", icon: "bx bxs-dashboard" },
    { name: "Employees", icon: "bx bx-user" },
    { name: "Attendance", icon: "bx bx-calendar-event" },
    { name: "Departments", icon: "bx bx-buildings" },
    { name: "Reports", icon: "bx bx-bar-chart-alt-2" },
    { name: "Logout", icon: "bx bx-log-out-circle" },
  ];

  return (
    <div
      className={`flex flex-col bg-white border-r transition-all duration-300 ${collapsed ? "p-2 w-[70px]" : "p-2 w-[250px]"
        } h-[100vh]`}
    >
      {!collapsed ? (
        <div className="w-[200px] h-[50px]">
          <img src={mainlogo} alt="SwiftProsys" className="w-full h-full" />
        </div>
      ) : (
        <div className="w-[50px] h-[45px]">
          <img src={logo} alt="SwiftProsys" className="w-full h-full" />
        </div>
      )}
      <ul className="flex flex-col grow px-2 my-3">
        {menuItems.map((item, index) => (
          <li className="mb-2" key={index}>
            <a
              href="#"
              className="flex items-center p-2 no-underline text-gray-800 rounded-md hover:bg-primary hover:text-white transition-colors"
            >
              <i className={`${item.icon} text-xl me-2`}></i>
              {!collapsed && <span>{item.name}</span>}
            </a>
          </li>
        ))}
      </ul>
      {!collapsed && (
        <div className="text-xs text-gray-500 text-center px-2 py-3">
          <hr className="my-2" />
          Swift Prosys © 2025 HRM
        </div>
      )}
    </div>
  );
}

export default Sidebar
