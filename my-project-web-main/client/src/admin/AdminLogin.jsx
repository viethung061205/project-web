import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode";
import "./Admin.css";

const AdminLogin = () => {
  const [error, setError] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const navigate = useNavigate();

  const handleLoginByStudentId = async (studentId) => {
    try {
      const response = await fetch("http://localhost:3000/api/admin/dangnhapQR", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mssv: studentId.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminInfo", JSON.stringify(data.admin));
        localStorage.setItem("userRole", "admin");
        navigate("/admin/user");
      } else {
        setError(data.message || "Admin login failed");
      }
    } catch (err) {
      setError("Unable to connect to server");
    }
  };

  useEffect(() => {
    let scanner = null;

    if (showScanner) {
      scanner = new Html5QrcodeScanner("reader", {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      });

      scanner.render(
        async (decodedText) => {
          await scanner.clear();
          await handleLoginByStudentId(decodedText);
        },
        () => {}
      );
    }

    return () => {
      if (scanner) {
        scanner.clear();
      }
    };
  }, [showScanner]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsScanning(true);
    setError("");

    const html5QrCode = new Html5Qrcode("image-reader");

    try {
      const decodedText = await html5QrCode.scanFile(file, true);
      await handleLoginByStudentId(decodedText);
    } catch (err) {
      setError("The image does not contain a valid QR code");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-box">
        <h2>ADMIN LOGIN</h2>
        <p className="admin-subtitle">
          Scan your admin QR code to access the system
        </p>

        <div id="image-reader" style={{ display: "none" }}></div>

        {!showScanner && (
          <>
            <button
              className="admin-login-btn"
              onClick={() => setShowScanner(true)}
            >
              Open Camera to Scan QR
            </button>

            <label
              className="admin-login-btn"
              style={{ textAlign: "center" }}
            >
              Upload QR Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageUpload}
              />
            </label>
          </>
        )}

        {showScanner && (
          <>
            <div
              id="reader"
              style={{ width: "100%", marginTop: "15px" }}
            ></div>
            <button
              className="back-user-btn"
              onClick={() => setShowScanner(false)}
              style={{ marginTop: "10px" }}
            >
              Cancel Scan
            </button>
          </>
        )}

        {isScanning && (
          <p style={{ marginTop: "10px" }}>
            Scanning QR code...
          </p>
        )}

        {error && (
          <p
            className="admin-error"
            style={{ color: "red", marginTop: "10px" }}
          >
            {error}
          </p>
        )}

        <button
          className="back-user-btn"
          onClick={() => navigate("/login")}
          style={{ marginTop: "20px" }}
        >
          ← Back to User Login
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;