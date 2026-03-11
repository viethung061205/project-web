import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./BookingForm.css";

const BookingForm = () => {
  const { location: locationId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    hoten: "",
    ngaysinh: "",
    gioitinh: "Other",
    diachi: "",
    sdt: "",
    email: ""
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const loggedInUser = JSON.parse(storedUser);

    let formattedDate = "";
    if (loggedInUser.ngaysinh) {
      const dateObj = new Date(loggedInUser.ngaysinh);
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      formattedDate = `${year}-${month}-${day}`;
    }

    setUserData({
      hoten: loggedInUser.hoten || "",
      email: loggedInUser.email || "",
      sdt: loggedInUser.sdt || "",
      diachi: loggedInUser.diachi || "",
      gioitinh: loggedInUser.gioitinh || "Other",
      ngaysinh: formattedDate
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContinue = () => {
    if (!userData.hoten || !userData.email || !userData.sdt) {
      alert("Please fill in all required fields (*)");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      alert("Invalid email format!");
      return;
    }

    if (!/^\d{9,11}$/.test(userData.sdt)) {
      alert("Phone number must contain 9–11 digits!");
      return;
    }

    navigate(`/booking/${locationId}/confirm`, {
      state: {
        ...state,
        customerInfo: userData
      }
    });
  };

  return (
    <div className="home">
      <div className="form-wrapper">
        <div className="form-header">
          <h2>Booking Information Confirmation</h2>
          <p>Please review or update your member information</p>
        </div>

        <div className="form-body">
          <h3>Customer Information</h3>

          <div className="input-row">
            <label>Full Name <span>*</span></label>
            <input
              type="text"
              name="hoten"
              value={userData.hoten}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
          </div>

          <div className="two-cols">
            <div className="input-row">
              <label>Phone Number <span>*</span></label>
              <input
                type="text"
                name="sdt"
                value={userData.sdt}
                onChange={handleChange}
              />
            </div>

            <div className="input-row">
              <label>Gender</label>
              <select
                name="gioitinh"
                value={userData.gioitinh}
                onChange={handleChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="input-row">
            <label>Email <span>*</span></label>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
            />
          </div>

          <div className="input-row">
            <label>Date of Birth</label>
            <input
              type="date"
              name="ngaysinh"
              value={userData.ngaysinh}
              onChange={handleChange}
            />
          </div>

          <div className="input-row">
            <label>Address</label>
            <textarea
              name="diachi"
              value={userData.diachi}
              onChange={handleChange}
              placeholder="Enter your address"
            />
          </div>

          <div className="summary-box">
            <p>
              <strong>Note:</strong> This information will be used to issue your
              electronic ticket. Please make sure all details are accurate.
            </p>
          </div>

          <div className="btn-container">
            <button className="back-btn" onClick={() => navigate(-1)}>
              BACK
            </button>
            <button className="continue-btn" onClick={handleContinue}>
              CONTINUE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;