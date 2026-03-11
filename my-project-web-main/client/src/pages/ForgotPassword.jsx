import React, { useState } from "react";
import "../index.css";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [matkhauMoi, setMatkhauMoi] = useState("");
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "http://localhost:3000/api/user/guiOTP",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("OTP has been sent to your email");
        setStep(2);
      } else {
        alert(data.message);
      }
    } catch {
      alert("Cannot connect to server");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "http://localhost:3000/api/user/xacnhanOTP",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            otp,
            matkhauMoi,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Password updated successfully");
        navigate("/login");
      } else {
        alert(data.message);
      }
    } catch {
      alert("Cannot connect to server");
    }
  };

  return (
    <div className="login-container">
      <div className="login-logo">
        <Link to="/">
          <img src="/disney-logo.png" alt="Disney" />
        </Link>
      </div>

      <h2>Reset your password</h2>

      {step === 1 && (
        <form className="login-form" onSubmit={handleSendOTP}>
          <label>Email address <span>*</span></label>
          <input
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" className="login-btn">
            <b>SEND OTP</b>
          </button>
        </form>
      )}

      {step === 2 && (
        <form className="login-form" onSubmit={handleResetPassword}>
          <label>OTP code <span>*</span></label>
          <input
            type="text"
            placeholder="6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          <label>New password <span>*</span></label>
          <input
            type="password"
            placeholder="At least 6 characters"
            value={matkhauMoi}
            onChange={(e) => setMatkhauMoi(e.target.value)}
            required
          />

          <button type="submit" className="login-btn">
            <b>RESET PASSWORD</b>
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
