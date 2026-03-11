const db = require("../config/db");

exports.shop = (req, res) => {
  const sql = `
    SELECT 
      id,
      ten_sanpham,
      loai,
      CAST(gia AS UNSIGNED) AS gia,
      so_luong,
      mauanh,
      anh,
      mota
    FROM shop
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error("SQL query error:", err);
      return res.status(500).json({
        error: "Server error while fetching products",
      });
    }

    res.json(rows);
  });
};

exports.chitietsanpham = (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM shop WHERE id = ?";

  db.query(sql, [id], (err, rows) => {
    if (err) {
      console.error("SQL query error:", err);
      return res.status(500).json({
        error: "Server error while fetching product",
      });
    }

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(rows[0]);
  });
};

exports.themgiohang = (req, res) => {
  const { email, productId, quantity } = req.body;
  const qtyToAdd = parseInt(quantity) || 1;

  if (!email || !productId) {
    return res.status(400).json({ message: "Missing information" });
  }

  const checkStockSql = `
    SELECT 
      s.so_luong AS stock, 
      IFNULL(c.soluong, 0) AS in_cart 
    FROM shop s
    LEFT JOIN cart c ON s.id = c.sanpham_id AND c.user_email = ?
    WHERE s.id = ?
  `;

  db.query(checkStockSql, [email, productId], (err, rows) => {
    if (err) {
      console.error("Check stock error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const { stock, in_cart } = rows[0];

    if (in_cart + qtyToAdd > stock) {
      return res.status(400).json({ 
        message: `Only ${stock} items available. You already have ${in_cart} in cart.`,
        availableToAdd: stock - in_cart
      });
    }

    const sql = `
      INSERT INTO cart (user_email, sanpham_id, soluong)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE soluong = soluong + VALUES(soluong)
    `;

    db.query(sql, [email, productId, qtyToAdd], (err, result) => {
      if (err) {
        console.error("Cart error:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ message: "Added to cart successfully" });
    });
  });
};

exports.laygiohang = (req, res) => {
  const { email } = req.params;

  const sql = `
    SELECT 
      c.id AS cart_id,
      s.id AS product_id,
      s.ten_sanpham,
      s.loai,
      CAST(s.gia AS UNSIGNED) AS gia,
      s.anh,
      c.soluong
    FROM cart c
    JOIN shop s ON c.sanpham_id = s.id
    WHERE c.user_email = ?
  `;

  db.query(sql, [email], (err, rows) => {
    if (err) {
      console.error("SQL Error (fetchCart):", err);
      return res.status(500).json({ error: "Server error while retrieving cart items" });
    }

    res.json(rows);
  });
};

exports.xoagiohang = (req, res) => {
  const { cartId } = req.params;

  const sql = "DELETE FROM cart WHERE id = ?";

  db.query(sql, [cartId], (err, result) => {
    if (err) {
      console.error("SQL Error (deleteCartItem):", err);
      return res.status(500).json({ error: "Server error while deleting cart item" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.json({ message: "Item removed from cart successfully" });
  });
};

exports.datHangNgay = (req, res) => {
  const { email, productId, quantity, hoten, diachi, sdt } = req.body;

  if (!email || !productId || !quantity) {
    return res.status(400).json({ message: "Incomplete order information" });
  }

  const productSql = "SELECT * FROM shop WHERE id = ?";

  db.query(productSql, [productId], (err, products) => {
    if (err) {
      console.error("Product Query Error:", err);
      return res.status(500).json({ error: "Server error while retrieving product" });
    }

    if (products.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = products[0];

    if (product.so_luong < quantity) {
      return res.status(400).json({ message: "Insufficient stock available" });
    }

    const tongtien = product.gia * quantity;
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);

    const orderSql = `
      INSERT INTO orders 
      (user_email, hoten, diachi, sdt, sanpham_id, ten_sanpham, loai, gia, soluong, anh, tongtien, thoigiangiaohang, trangthai)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'To Confirm')
    `;

    const orderData = [
      email, hoten, diachi, sdt, 
      product.id, product.ten_sanpham, product.loai, product.gia, 
      quantity, product.anh, tongtien, deliveryDate
    ];

    db.query(orderSql, orderData, (err, result) => {
      if (err) {
        console.error("Order Error:", err);
        return res.status(500).json({ error: "System error while placing order" });
      }

      db.query(
        "UPDATE shop SET so_luong = so_luong - ? WHERE id = ?",
        [quantity, product.id],
        (updErr) => {
          if (updErr) console.error("Update Stock Error:", updErr);

          const deleteCartSql = "DELETE FROM cart WHERE user_email = ? AND sanpham_id = ?";
          db.query(deleteCartSql, [email, product.id], (delErr) => {
            if (delErr) {
              console.error("Cart delete error:", delErr);
              return res.json({ 
                message: "Order placed, but failed to remove item from cart",
                orderId: result.insertId 
              });
            }

            res.json({
              message: "Order placed successfully and item removed from cart",
              orderId: result.insertId
            });
          });
        }
      );
    });
  });
};

exports.laydonhang = (req, res) => {
  const { email } = req.params;

  const sql = `
    SELECT 
      id,
      user_email,
      hoten,
      diachi,
      sdt,
      sanpham_id,
      ten_sanpham,
      loai,
      CAST(gia AS UNSIGNED) AS gia,
      soluong,
      anh,
      CAST(tongtien AS UNSIGNED) AS tongtien,
      thoigiangiaohang,
      trangthai,
      ngaytao
    FROM orders
    WHERE user_email = ?
    ORDER BY ngaytao DESC
  `;

  db.query(sql, [email], (err, rows) => {
    if (err) {
      console.error("SQL Error (getOrders):", err);
      return res.status(500).json({ error: "Server error while retrieving orders" });
    }

    res.json(rows);
  });
};

exports.huydonhang = (req, res) => {
  const { orderId } = req.params;
  const sql = "UPDATE orders SET trangthai = 'Cancelled' WHERE id = ?";

  db.query(sql, [orderId], (err, result) => {
    if (err) {
      console.error("SQL Error (cancelOrder):", err);
      return res.status(500).json({ error: "Server error while canceling the order" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found to cancel" });
    }

    res.json({ message: "Order status updated to Cancelled successfully" });
  });
};