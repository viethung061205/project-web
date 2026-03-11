const db = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


exports.dangnhapQR = (req, res) => {
  const { mssv } = req.body;

  if (!mssv) {
    return res.status(400).json({ message: "QR code is required" });
  }

  db.query(
    "SELECT * FROM admins WHERE mssv = ?",
    [mssv.trim()],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Server error" });
      }

      if (result.length === 0) {
        return res
          .status(403)
          .json({ message: "This card does not have admin access" });
      }

      const admin = result[0];

      db.query(
        "UPDATE admins SET landangnhapcuoi = NOW() WHERE mssv = ?",
        [mssv],
        (updateErr) => {
          if (updateErr) {
            return res
              .status(500)
              .json({ message: "Failed to update last login time" });
          }

          const token = jwt.sign(
            {
              id: admin.id,
              mssv: admin.mssv,
              role: "admin",
            },
            process.env.JWT_SECRET || "your_secret_key",
            { expiresIn: "1d" }
          );

          res.json({
            message: "Admin login successful",
            token,
            admin: {
              id: admin.id,
              name: admin.ten_admin,
              mssv: admin.mssv,
            },
          });
        }
      );
    }
  );
};

exports.layve = (req, res) => {
  db.query("SELECT * FROM tickets ORDER BY id ASC", (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Server error while fetching tickets" });
    }
    res.json(result);
  });
};

exports.taove = (req, res) => {
  const { diadiem, loai, mota, gia, giabth } = req.body;

  const getMaxId = "SELECT MAX(id) AS maxId FROM tickets";

  db.query(getMaxId, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Failed to get max id" });
    }

    const newId = (result[0].maxId || 0) + 1;

    const sql = `
      INSERT INTO tickets (id, diadiem, loai, mota, gia, giabth, ngaytao)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;

    db.query(
      sql,
      [newId, diadiem, loai, mota, gia, giabth],
      (err2) => {
        if (err2) {
          return res.status(500).json({ message: "Failed to create ticket" });
        }

        res.json({
          message: "Ticket created successfully",
          id: newId
        });
      }
    );
  });
};

exports.capnhatve = (req, res) => {
  const { id } = req.params;
  const { diadiem, loai, mota, gia, giabth } = req.body;

  const sql =
    "UPDATE tickets SET diadiem=?, loai=?, mota=?, gia=?, giabth=? WHERE id=?";

  db.query(sql, [diadiem, loai, mota, gia, giabth, id], (err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to update ticket" });
    }

    res.json({ message: "Ticket updated successfully" });
  });
};

exports.xoave = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM tickets WHERE id=?", [id], (err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to delete ticket" });
    }

    res.json({ message: "Ticket deleted successfully" });
  });
};

exports.layveUser = (req, res) => {
  db.query("SELECT * FROM bookings ORDER BY id ASC", (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to fetch user tickets." });
    }
    res.json(result);
  });
};

exports.capnhatveUser = (req, res) => {

  const { id } = req.params;

  const {
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
    ma_gd_vnpay
  } = req.body;

  const sql = `
    UPDATE bookings 
    SET 
      txn_ref = ?,
      hoten = ?,
      email = ?,
      sdt = ?,
      diachi = ?,
      diadiem = ?,
      loai_ve = ?,
      soluong_ve = ?,
      soluong_suatan = ?,
      ngay_sudung = ?,
      tong_tien = ?,
      ma_ngan_hang = ?,
      trang_thai = ?,
      ma_gd_vnpay = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
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
      id
    ],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to update ticket." });
      }

      res.json({ message: "Ticket updated successfully." });
    }
  );
};

exports.xoaveUser = (req, res) => {

  const { id } = req.params;

  db.query("DELETE FROM bookings WHERE id=?", [id], (err) => {

    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to delete ticket." });
    }

    res.json({ message: "Ticket deleted successfully." });

  });

};

exports.layUser = (req, res) => {
  db.query("SELECT * FROM users ORDER BY id ASC", (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch users" });
    }

    res.json(result);
  });
};

exports.themUser = (req, res) => {

  const {
    hoten,
    ngaysinh,
    gioitinh,
    diachi,
    avatar,
    sdt,
    email,
    matkhau
  } = req.body;

  const sql = `
    INSERT INTO users
    (hoten, ngaysinh, gioitinh, diachi, avatar, sdt, email, matkhau, ngaytao)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `;

  db.query(
    sql,
    [hoten, ngaysinh, gioitinh, diachi, avatar, sdt, email, matkhau],
    (err) => {

      if (err) {
        return res.status(500).json({ message: "Failed to create user" });
      }

      res.json({ message: "User created successfully" });

    }
  );

};

exports.capnhatUser = async (req, res) => {
  const { id } = req.params;
  const {
    hoten,
    ngaysinh,
    gioitinh,
    diachi,
    avatar,
    sdt,
    email,
    matkhau
  } = req.body;

  try {
    const formattedDate = ngaysinh ? ngaysinh.split('T')[0] : null;
    let sql;
    let params;

    if (matkhau && matkhau.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(matkhau, salt);

      sql = `
        UPDATE users
        SET hoten = ?, ngaysinh = ?, gioitinh = ?, diachi = ?, 
            avatar = ?, sdt = ?, email = ?, matkhau = ?
        WHERE id = ?
      `;
      params = [hoten, formattedDate, gioitinh, diachi, avatar, sdt, email, hash, id];
    } else {
      sql = `
        UPDATE users
        SET hoten = ?, ngaysinh = ?, gioitinh = ?, diachi = ?, 
            avatar = ?, sdt = ?, email = ?
        WHERE id = ?
      `;
      params = [hoten, formattedDate, gioitinh, diachi, avatar, sdt, email, id];
    }

    db.query(sql, params, (err) => {
      if (err) {
        console.error("Update error:", err);
        return res.status(500).json({ message: "Failed to update user" });
      }
      res.json({ message: "User updated successfully" });
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during update" });
  }
};

exports.xoaUser = (req, res) => {

  const { id } = req.params;

  db.query("DELETE FROM users WHERE id=?", [id], (err) => {

    if (err) {
      return res.status(500).json({ message: "Failed to delete user" });
    }

    res.json({ message: "User deleted successfully" });

  });

};

exports.laysanpham = (req, res) => {
  const sql = "SELECT * FROM shop ORDER BY id DESC";
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.themsanpham = (req, res) => {
  const { ten_sanpham, loai, gia, so_luong, mauanh, mota, anh } = req.body;

  const getMaxId = "SELECT MAX(id) AS maxId FROM shop";

  db.query(getMaxId, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    const newId = (result[0].maxId || 0) + 1;

    const sql = `
      INSERT INTO shop (id, ten_sanpham, loai, gia, so_luong, mauanh, mota, anh) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      newId,
      ten_sanpham,
      loai,
      gia,
      so_luong,
      Array.isArray(mauanh) ? JSON.stringify(mauanh) : (mauanh || "[]"),
      mota,
      anh
    ];

    db.query(sql, values, (err, insertResult) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({
        message: "Product added successfully",
        id: newId
      });
    });
  });
};

exports.suasanpham = (req, res) => {
  const { id } = req.params;
  const { ten_sanpham, loai, gia, so_luong, mauanh, mota, anh } = req.body;
  const sql = `
    UPDATE shop 
    SET ten_sanpham = ?, loai = ?, gia = ?, so_luong = ?, mauanh = ?, mota = ?, anh = ? 
    WHERE id = ?
  `;
  const mauanhData = Array.isArray(mauanh) ? JSON.stringify(mauanh) : mauanh;

  const values = [ten_sanpham, loai, gia, so_luong, mauanhData, mota, anh, id];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Product updated successfully" });
  });
};

exports.xoasanpham = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM shop WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Product deleted successfully" });
  });
};

exports.laydonhang = (req, res) => {
  const sql = "SELECT * FROM orders ORDER BY ngaytao DESC";
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.suadonhang = (req, res) => {
  const { id } = req.params;
  const { 
    user_email, 
    hoten, 
    diachi, 
    sdt, 
    sanpham_id, 
    ten_sanpham, 
    loai, 
    gia, 
    soluong, 
    anh, 
    tongtien, 
    thoigiangiaohang, 
    trangthai 
  } = req.body;

  const sql = `
    UPDATE orders 
    SET 
      user_email = ?, 
      hoten = ?, 
      diachi = ?, 
      sdt = ?, 
      sanpham_id = ?, 
      ten_sanpham = ?, 
      loai = ?, 
      gia = ?, 
      soluong = ?, 
      anh = ?, 
      tongtien = ?, 
      thoigiangiaohang = ?, 
      trangthai = ?
    WHERE id = ?
  `;

  const values = [
    user_email, 
    hoten, 
    diachi, 
    sdt, 
    sanpham_id, 
    ten_sanpham, 
    loai, 
    gia, 
    soluong, 
    anh, 
    tongtien, 
    thoigiangiaohang, 
    trangthai, 
    id
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Order update error:", err);
      return res.status(500).json({ error: err.message });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order updated successfully" });
  });
};

exports.xoadonhang = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM orders WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Order deleted permanently" });
  });
};

exports.laygiohang = (req, res) => {
  const sql = `
    SELECT c.*, s.ten_sanpham, s.gia, s.anh, s.loai 
    FROM cart c 
    JOIN shop s ON c.sanpham_id = s.id 
    ORDER BY c.ngaytao DESC
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.suagiohang = (req, res) => {
  const { id } = req.params;
  const { soluong } = req.body;
  const sql = "UPDATE cart SET soluong = ? WHERE id = ?";
  db.query(sql, [soluong, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Cart updated successfully" });
  });
};

exports.xoagiohang = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM cart WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Item removed from cart" });
  });
};