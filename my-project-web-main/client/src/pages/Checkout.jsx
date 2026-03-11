import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Checkout.css";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("user"));

  const [cartItems, setCartItems] = useState([]);
  const [isBuyNow, setIsBuyNow] = useState(false);

  useEffect(() => {
    if (location.state?.buyNowItem) {
      setCartItems([location.state.buyNowItem]);
      setIsBuyNow(true);
    } 
    else if (location.state?.cartFromProfile) {
      const items = location.state.cartFromProfile.map((item) => ({
        ...item,
        id: item.productId || item.id,
        quantity: item.soluong || item.quantity || 1
      }));
      setCartItems(items);
      setIsBuyNow(false);
    } 
    else {
      const saved = localStorage.getItem("cartItems");
      if (saved) {
        const items = JSON.parse(saved).map((item) => ({
          ...item,
          ten_sanpham: item.name || item.ten_sanpham,
          gia: item.price || item.gia,
          anh: item.image || item.anh,
          loai: item.loai || "General",
          quantity: item.quantity || item.soluong || 1
        }));
        setCartItems(items);
        setIsBuyNow(false);
      }
    }
  }, [location]);

  const total = cartItems.reduce((sum, item) => sum + item.gia * item.quantity, 0);

  const handleProcessOrder = async () => {
    if (!userData) return alert("Please login to order");

    try {
      for (const item of cartItems) {
        const quantity = item.quantity;
        const subtotal = item.gia * quantity;

        const response = await fetch("http://localhost:3000/api/shop/datHangNgay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userData.email,
            hoten: userData.hoten,
            diachi: userData.diachi,
            sdt: userData.sdt,
            productId: item.productId || item.product_id || item.id,
            ten_sanpham: item.ten_sanpham,
            loai: item.loai,
            gia: item.gia,
            quantity: item.soluong || item.quantity,
            anh: item.anh,
            tongtien: subtotal,
            thoigiangiaohang: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            ngaytao: new Date().toISOString()
          }),
        });

        if (!response.ok) throw new Error("Order failed");
      }

      alert("Order placed successfully!");
      localStorage.removeItem("cartItems");
      navigate("/profile");
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  if (cartItems.length === 0)
    return <div className="checkout-page">Your bag is empty.</div>;

  return (
    <div className="checkout-page">
      <h1>{isBuyNow ? "Quick Checkout" : "Review Your Order"}</h1>

      <div className="checkout-content">
        <div className="shipping-info">
          <h3>Shipping Information</h3>
          <p><b>Email:</b> {userData?.email}</p>
          <p><b>Name:</b> {userData?.hoten}</p>
          <p><b>Phone:</b> {userData?.sdt}</p>
          <p><b>Address:</b> {userData?.diachi}</p>
        </div>

        <div className="checkout-list">
          {cartItems.map((item, index) => {
            const subtotal = item.gia * item.quantity;
            const delivery = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

            return (
              <div key={index} className="checkout-item">
                <img src={item.anh} alt={item.ten_sanpham} />

                <div className="checkout-info">
                  <h4>{item.ten_sanpham}</h4>
                  <p><b>Category:</b> {item.loai}</p>
                  <p><b>Price:</b> {item.gia?.toLocaleString()} VND</p>
                  <p><b>Quantity:</b> {item.quantity}</p>
                  <p><b>Subtotal:</b> {subtotal.toLocaleString()} VND</p>
                  <p><b>Delivery Time:</b> {delivery.toLocaleString()}</p>
                  <p><b>Created At:</b> {new Date().toLocaleString()}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="checkout-summary">
          <h2>Total Payment: {total.toLocaleString()} VND</h2>
          <button className="checkout-pay" onClick={handleProcessOrder}>
            CONFIRM ORDER
          </button>
        </div>
      </div>
    </div>
  );
}