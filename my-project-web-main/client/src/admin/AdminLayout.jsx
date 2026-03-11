import React, { useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import "./Admin.css";

const AdminLayout = () => {
  const [openMenu, setOpenMenu] = useState(true);
  const location = useLocation();

  return (
    <div className="admin-container">
      {/* SIDEBAR */}
      <div className={`admin-sidebar ${openMenu ? "open" : "close"}`}>
        <div className="sidebar-header">
          <span className="menu-btn" onClick={() => setOpenMenu(!openMenu)}>☰</span>
          {openMenu && <span className="logo-text">Disney Admin</span>}
        </div>

        <ul className="sidebar-menu">
          <li className={location.pathname === "/admin/user" ? "active" : ""}>
            <Link to="/admin/user">
              <img className="menu-icon" src="https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png" alt="user" />
              {openMenu && <span>User management</span>}
            </Link>
          </li>

          <li className={location.pathname === "/admin/booking" ? "active" : ""}>
            <Link to="/admin/booking">
              <img className="menu-icon" src="https://cdn-icons-png.flaticon.com/512/6376/6376880.png" alt="booking" />
              {openMenu && <span>Booking management</span>}
            </Link>
          </li>

          <li className={location.pathname === "/admin/shopping" ? "active" : ""}>
            <Link to="/admin/shopping">
              <img className="menu-icon" src="/shopping.png" alt="shopping" />
              {openMenu && <span>Shopping management</span>}
            </Link>
          </li>

          <li className={location.pathname === "/admin/chatbot" ? "active" : ""}>
            <Link to="/admin/chatbot">
              <img className="menu-icon" src="https://iot-analytics.com/wp-content/uploads/2025/02/AI-White-Icon.png" alt="chatbot" />
              {openMenu && <span>AI Chatbot Center</span>}
            </Link>
          </li>
        </ul>
      </div>

      {/* MAIN */}
      <div className="admin-main">
        {/* HEADER */}
        <div className="admin-header">
          <div className="admin-user">
            <img src="/bell.png" alt="Notification" className="admin-icon-1" />
            <img src="https://images.trvl-media.com/place/6035062/bc5cbfac-925a-419b-8a45-bedd1120656b.jpg" alt="User" className="admin-icon-2" />
          </div>
        </div>

        {/* PAGE CONTENT */}
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
