import React, { useState } from "react";
import "../index.css";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/api/user/dangnhap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          matkhau: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      // ✅ Save token
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // ✅ Save user info
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      setShowPopup(true);
    } catch (error) {
      console.error(error);
      alert("Cannot connect to server");
    }
  };

  const handleOK = () => {
    setShowPopup(false);
    navigate("/");
  };

  return (
    <div className="login-container">
      {/* LOGO */}
      <div className="login-logo">
        <Link to="/">
          <img src="/disney-logo.png" alt="Disney" />
        </Link>
      </div>

      <h2>Lots of shopping privileges and benefits await you</h2>
      <p className="sub-title">
        Exclusive benefits for you when joining Disney account
      </p>

      {/* BENEFITS */}
      <div className="benefits">
        <div className="benefit-item">
          <img
            src="https://i.pinimg.com/736x/86/ab/8e/86ab8ec4bd0c09f0a832ae8d04fd6472.jpg"
            alt="voucher1"
          />
          <span>DISCOUNT VOUCHER</span>
        </div>

        <div className="benefit-item">
          <img
            src="https://i.pinimg.com/736x/d2/01/a4/d201a4e368e776e425c30261201bc74c.jpg"
            alt="voucher2"
          />
          <span>EXCLUSIVE GIFT</span>
        </div>

        <div className="benefit-item">
          <img
            src="https://i.pinimg.com/736x/4b/f5/f0/4bf5f0f7b288df34bea35287317a7656.jpg"
            alt="voucher3"
          />
          <span>CASHBACK OFFER</span>
        </div>
      </div>

      {/* LOGIN FORM */}
      <form className="login-form" onSubmit={handleLogin}>
        <label>
          Email address or phone number <span>*</span>
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>
          Password <span>*</span>
        </label>
        <div className="password-input">
          <input
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <img
            src={
              showPassword
                ? "https://i.pinimg.com/736x/e4/a4/d8/e4a4d883b8b7bebbd595a059811a6c8f.jpg"
                : "https://i.pinimg.com/736x/89/99/bc/8999bc9c7b654ab16cb91a3334813ac7.jpg"
            }
            alt="toggle password"
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          />
        </div>

        {/* USER LOGIN BUTTON */}
        <button className="login-btn">
          <b>LOGIN</b>
        </button>

        {/* ADMIN LOGIN BUTTON */}
        <button
          type="button"
          className="admin-login-btn"
          onClick={() => navigate("/admin/login")}
        >
          <b>LOGIN AS ADMIN</b>
        </button>

        {/* LINKS */}
        <div className="login-links">
          <Link to="/signup">SIGN UP NEW ACCOUNT</Link>
          <Link to="/forgotpassword">FORGOT PASSWORD</Link>
        </div>
      </form>

      {/* SUCCESS POPUP */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Login Successful!</h3>
            <button className="ok-btn" onClick={handleOK}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;