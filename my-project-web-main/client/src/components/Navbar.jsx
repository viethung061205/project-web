import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [navAuth, setNavAuth] = useState({
    label: "Login",
    link: "/login",
    role: null
  });

  useEffect(() => {
    const userToken = localStorage.getItem("token");
    const adminToken = localStorage.getItem("adminToken");
    const userRole = localStorage.getItem("userRole");

    if (adminToken && userRole === "admin") {
      setNavAuth({
        label: "Admin Panel",
        link: "/admin/user",
        role: "admin"
      });
    } else if (userToken) {
      setNavAuth({
        label: "My Account",
        link: "/profile",
        role: "user"
      });
    } else {
      setNavAuth({
        label: "Login",
        link: "/login",
        role: null
      });
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminInfo");
    localStorage.removeItem("userRole");
    
    setNavAuth({ label: "Login", link: "/login", role: null });
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src="/disney-logo.png" alt="Disney" />
        </Link>
      </div>

      <ul className="navbar-links">
        {/* Ẩn hoàn toàn menu User nếu là Admin */}
        {navAuth.role !== "admin" && (
          <>
            <li><Link to="/about">About us</Link></li>
            <li><Link to="/booking">Booking</Link></li>
            <li><Link to="/shop">Shop</Link></li>
          </>
        )}
        
        <li className="separator" />

        <li className="auth-group">
          <Link to={navAuth.link}>{navAuth.label}</Link>
          
          {/* CHỈ HIỆN NÚT LOGOUT NẾU LÀ ADMIN */}
          {navAuth.role === "admin" && (
            <button 
              onClick={handleLogout} 
              className="logout-nav-btn"
              style={{ marginLeft: "15px", cursor: "pointer" }}
            >
              Logout
            </button>
          )}
        </li>
      </ul>
    </nav>
  );
}