import React, { useState } from "react";
import "../index.css";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    hoten: "",
    ngaysinh: "",
    gioitinh: "",
    diachi: "",
    sdt: "",
    email: "",
    matkhau: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "sdt" && !/^\d*$/.test(value)) return;

    setForm({ ...form, [name]: value });
  };

  const validateForm = () => {
    const { hoten, ngaysinh, gioitinh, diachi, sdt, email, matkhau } = form;

    if (!hoten || !ngaysinh || !gioitinh || !diachi || !sdt || !email || !matkhau) {
      setError("Please fill in all required fields");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format");
      return false;
    }

    if (matkhau.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    setError("");
    return true;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const res = await fetch("http://localhost:3000/api/user/dangky", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Sign up failed");
        return;
      }

      setShowSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Cannot connect to server");
    }
  };

  return (
    <div className="login-container">
      <div className="login-logo">
        <Link to="/"><img src="/disney-logo.png" alt="Disney" /></Link>
      </div>

      <h2>Lots of shopping privileges and benefits await you</h2>
      <p className="sub-title">
        Exclusive benefits for you when joining Disney account
      </p>

      <div className="benefits">
        <div className="benefit-item">
          <img src="https://i.pinimg.com/736x/86/ab/8e/86ab8ec4bd0c09f0a832ae8d04fd6472.jpg" alt="voucher" />
          <span>DISCOUNT VOUCHER</span>
        </div>
        <div className="benefit-item">
          <img src="https://i.pinimg.com/736x/d2/01/a4/d201a4e368e776e425c30261201bc74c.jpg" alt="gift" />
          <span>EXCLUSIVE GIFT</span>
        </div>
        <div className="benefit-item">
          <img src="https://i.pinimg.com/736x/4b/f5/f0/4bf5f0f7b288df34bea35287317a7656.jpg" alt="cashback" />
          <span>CASHBACK OFFER</span>
        </div>
      </div>

      <form className="login-form" onSubmit={handleSignUp}>
        <label>Full name <span>*</span></label>
        <input type="text" name="hoten" value={form.hoten} onChange={handleChange} />

        <label>Date of birth <span>*</span></label>
        <input type="date" name="ngaysinh" value={form.ngaysinh} onChange={handleChange} />

        <label>Gender <span>*</span></label>
        <select name="gioitinh" value={form.gioitinh} onChange={handleChange}>
          <option value="">-- Select gender --</option>
          <option value="Nam">Male</option>
          <option value="Nữ">Female</option>
          <option value="Khác">Other</option>
        </select>

        <label>Address <span>*</span></label>
        <input type="text" name="diachi" value={form.diachi} onChange={handleChange} />

        <label>Phone number <span>*</span></label>
        <input type="text" name="sdt" value={form.sdt} onChange={handleChange} />

        <label>Email address <span>*</span></label>
        <input type="email" name="email" value={form.email} onChange={handleChange} />

        <label>Password <span>*</span></label>
        <div className="password-input">
          <input
            type={showPassword ? "text" : "password"}
            name="matkhau"
            value={form.matkhau}
            onChange={handleChange}
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

        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

        <button type="submit" className="login-btn">
          <b>SIGN UP</b>
        </button>
      </form>

      {showSuccess && (
        <div className="success-popup">
          <p>
            Now you also have a new account. Let's login again and enjoy the web.
            <br />
            Thank you for your loving!
          </p>
          <button
            className="popup-btn"
            onClick={() => {
              setShowSuccess(false);
              navigate("/login");
            }}
          >
            OK
          </button>
        </div>
      )}
    </div>
  );
};

export default SignUp;
