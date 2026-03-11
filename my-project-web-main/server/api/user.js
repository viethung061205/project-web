const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

exports.dangky = async (req, res) => {
  const { hoten, ngaysinh, gioitinh, diachi, sdt, email, matkhau } = req.body;

  if (!hoten || !ngaysinh || !gioitinh || !diachi || !sdt || !email || !matkhau) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (!/^\d{9,11}$/.test(sdt)) {
    return res.status(400).json({
      message: "Phone number must contain only digits (9–11 characters)",
    });
  }

  if (matkhau.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters",
    });
  }

  db.query(
    "SELECT id FROM users WHERE email = ?",
    [email],
    async (err, result) => {
      if (err) return res.status(500).json({ message: "Server error" });

      if (result.length > 0) {
        return res.status(409).json({ message: "Email already exists" });
      }

      const hash = await bcrypt.hash(matkhau, 10);

      db.query(
        `INSERT INTO users (hoten, ngaysinh, gioitinh, diachi, sdt, email, matkhau)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [hoten, ngaysinh, gioitinh, diachi, sdt, email, hash],
        (err) => {
          if (err)
            return res.status(500).json({ message: "Failed to create account" });

          res.status(201).json({ message: "Account created successfully" });
        }
      );
    }
  );
};

exports.dangnhap = (req, res) => {
  const { email, matkhau } = req.body;

  if (!email || !matkhau) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, result) => {
      if (err) return res.status(500).json({ message: "Server error" });
      if (result.length === 0)
        return res.status(404).json({ message: "Email does not exist" });

      const user = result[0];
      const isMatch = await bcrypt.compare(matkhau, user.matkhau);

      if (!isMatch)
        return res.status(401).json({ message: "Incorrect password" });

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          hoten: user.hoten,
          email: user.email,
          sdt: user.sdt,
          ngaysinh: user.ngaysinh,
          gioitinh: user.gioitinh,
          diachi: user.diachi,
          avatar: user.avatar
        },
      });
    }
  );
};

exports.dangxuat = (req, res) => {
  res.json({ message: "Logout successful" });
};

exports.guiOTP = (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  db.query("SELECT id FROM users WHERE email = ?", [email], (err, result) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (result.length === 0)
      return res.status(404).json({ message: "Email does not exist" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    db.query(
      "INSERT INTO password_otps (email, otp, expires_at) VALUES (?, ?, ?)",
      [email, otp, expiresAt],
      async (insertErr) => {
        if (insertErr)
          return res.status(500).json({ message: "Database error" });

        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        try {
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Mã OTP đặt lại mật khẩu",
            html: `<h2>Mã OTP của bạn là: ${otp}</h2>`,
          });
          res.json({ message: "OTP sent to email successfully" });
        } catch (mailError) {
          console.error("Mail Error:", mailError);
          res.status(500).json({ message: "Could not send email" });
        }
      }
    );
  });
};

exports.xacnhanOTP = async (req, res) => {
  const { email, otp, matkhauMoi } = req.body;

  if (!email || !otp || !matkhauMoi)
    return res.status(400).json({ message: "Missing fields" });

  if (matkhauMoi.length < 6)
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });

  db.query(
    `SELECT * FROM password_otps 
     WHERE email = ? AND otp = ? AND expires_at > NOW()
     ORDER BY id DESC LIMIT 1`,
    [email, otp],
    async (err, result) => {
      if (err) return res.status(500).json({ message: "Server error" });
      if (result.length === 0)
        return res.status(400).json({ message: "Invalid or expired OTP" });

      const hash = await bcrypt.hash(matkhauMoi, 10);

      db.query("UPDATE users SET matkhau = ? WHERE email = ?", [
        hash,
        email,
      ]);

      db.query("DELETE FROM password_otps WHERE email = ?", [email]);

      res.json({ message: "Password updated successfully" });
    }
  );
};

exports.thongtincanhan = (req, res) => {
  const { id, hoten, ngaysinh, gioitinh, diachi, sdt, avatar } = req.body;

  if (!id) return res.status(400).json({ message: "User ID is required" });

  const formattedDate = ngaysinh ? ngaysinh.split('T')[0] : null;

  const query = `
    UPDATE users 
    SET hoten = ?, ngaysinh = ?, gioitinh = ?, diachi = ?, sdt = ?, avatar = ?
    WHERE id = ?
  `;

  db.query(
    query,
    [hoten, formattedDate, gioitinh, diachi, sdt, avatar, id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Update failed" });
      }

      db.query("SELECT id, hoten, email, sdt, ngaysinh, gioitinh, diachi, avatar FROM users WHERE id = ?", [id], (err, rows) => {
        if (err) return res.status(500).json({ message: "Error fetching updated data" });
        
        res.json({
          message: "Profile updated successfully",
          user: rows[0]
        });
      });
    }
  );
};

exports.vecuatoi = (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const query = `
    SELECT 
      id,
      txn_ref,
      hoten,
      email,
      sdt,
      diachi,
      diadiem,
      loai_ve,
      soluong_ve,
      soluong_suatan,
      ngay_sudung,
      tong_tien,
      ma_ngan_hang,
      trang_thai,
      ma_gd_vnpay,
      ngay_tao
    FROM bookings
    WHERE email = ?
    ORDER BY ngay_tao DESC
  `;

  db.query(query, [email], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(rows);
  });
};