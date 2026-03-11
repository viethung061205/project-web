import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();

  const savedUser = JSON.parse(localStorage.getItem("user"));
  const [userData, setUserData] = useState(savedUser);
  const [avatar, setAvatar] = useState(savedUser?.avatar || null);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...userData });

  const [activeTab, setActiveTab] = useState("account");
  const [ticketTab, setTicketTab] = useState("available");
  const [shopTab, setShopTab] = useState("cart");

  const [orderStatusTab, setOrderStatusTab] = useState("To Confirm");

  const [tickets, setTickets] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);

  const fetchUserTickets = async () => {
    if (!userData?.email) return;
    try {
      const response = await fetch(
        `http://localhost:3000/api/user/vecuatoi/${userData.email}`
      );
      const data = await response.json();
      if (response.ok) {
        setTickets(data);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  const fetchCartItems = async () => {
    if (!userData?.email) return;
    try {
      const response = await fetch(
        `http://localhost:3000/api/shop/laygiohang/${userData.email}`
      );
      const data = await response.json();
      if (response.ok) {
        setCartItems(data);
        const mappedForLocal = data.map((item) => ({
          id: item.productId,
          name: item.ten_sanpham,
          price: item.gia,
          image: item.anh,
          quantity: item.soluong,
        }));
        localStorage.setItem("cartItems", JSON.stringify(mappedForLocal));
      }
    } catch (error) {
      console.error("Fetch cart error:", error);
    }
  };

  const fetchUserOrders = async () => {
    if (!userData?.email) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/shop/laydonhang/${userData.email}`
      );

      const data = await response.json();

      if (response.ok) {
        setOrders(data);
      } else {
        console.error("Failed to retrieve orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleDeleteCartItem = async (cartId) => {
    if (!window.confirm("Are you sure you want to remove this item?")) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/shop/xoagiohang/${cartId}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        setCartItems(cartItems.filter((item) => item.cart_id !== cartId));
        alert("Item removed successfully!");
      } else {
        alert("Unable to remove the item. Please try again.");
      }
    } catch (error) {
      console.error("Delete cart error:", error);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/shop/huydonhang/${orderId}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        setOrders(
          orders.map((order) =>
            order.id === orderId
              ? { ...order, trangthai: "Cancelled" }
              : order
          )
        );
        alert("Order canceled successfully!");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Unable to cancel the order.");
      }
    } catch (error) {
      console.error("Cancel order error:", error);
      alert("An error occurred while connecting to the server.");
    }
  };

  useEffect(() => {
    if (activeTab === "ticket") {
      fetchUserTickets();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "shop" && shopTab === "cart") {
      fetchCartItems();
    }
  }, [activeTab, shopTab]);

  useEffect(() => {
    if (activeTab === "shop" && shopTab === "orders") {
      fetchUserOrders();
    }
  }, [activeTab, shopTab]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const updateProfileAPI = async (updatedUser) => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/user/thongtincanhan",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedUser),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setUserData(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("avatar", data.user.avatar || "");
        setIsEditing(false);
        alert("Profile updated successfully!");
      } else {
        alert(data.message || "Profile update failed");
      }
    } catch (error) {
      alert("An error occurred while updating profile");
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result;
      setAvatar(base64Image);
      updateProfileAPI({ ...userData, avatar: base64Image });
    };
    reader.readAsDataURL(file);
  };

  const handleSaveInfo = () => {
    updateProfileAPI({ ...editData, avatar });
  };

  if (!userData) return <div className="loading">Please login to continue</div>;

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-tabs">
          <button
            className={activeTab === "account" ? "tab active" : "tab"}
            onClick={() => setActiveTab("account")}
          >
            My Account
          </button>
          <button
            className={activeTab === "ticket" ? "tab active" : "tab"}
            onClick={() => setActiveTab("ticket")}
          >
            My Tickets
          </button>
          <button
            className={activeTab === "shop" ? "tab active" : "tab"}
            onClick={() => setActiveTab("shop")}
          >
            My Shop
          </button>
        </div>

        {activeTab === "account" && (
          <>
            <div className="profile-avatar">
              <img
                src={
                  avatar ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="Avatar"
              />
              <label className="upload-btn">
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  hidden
                />
              </label>
            </div>

            <div className="profile-info">
              {isEditing ? (
                <>
                  <div className="input-group">
                    <label>Full Name:</label>
                    <input
                      name="hoten"
                      value={editData.hoten}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="input-group">
                    <label>Gender:</label>
                    <select
                      name="gioitinh"
                      value={editData.gioitinh}
                      onChange={handleChange}
                    >
                      <option value="Nam">Male</option>
                      <option value="Nữ">Female</option>
                      <option value="Khác">Other</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label>Phone:</label>
                    <input
                      name="sdt"
                      value={editData.sdt}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="input-group">
                    <label>Address:</label>
                    <input
                      name="diachi"
                      value={editData.diachi}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="input-group">
                    <label>Birthday:</label>
                    <input
                      type="date"
                      name="ngaysinh"
                      value={editData.ngaysinh?.split("T")[0]}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="profile-actions">
                    <button className="save-btn" onClick={handleSaveInfo}>
                      Save Changes
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p>
                    <span>Full Name:</span> {userData.hoten}
                  </p>
                  <p>
                    <span>Email:</span> {userData.email}
                  </p>
                  <p>
                    <span>Phone:</span> {userData.sdt}
                  </p>
                  <p>
                    <span>Address:</span> {userData.diachi}
                  </p>
                  <p>
                    <span>Gender:</span> {userData.gioitinh}
                  </p>
                  <p>
                    <span>Birthday:</span>{" "}
                    {new Date(userData.ngaysinh).toLocaleDateString()}
                  </p>

                  <div className="profile-actions">
                    <button
                      className="edit-btn"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </button>
                    <button
                      className="logout-btn-profile"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {activeTab === "ticket" && (
          <>
            <div className="profile-tabs sub-tabs">
              <button
                className={ticketTab === "available" ? "tab active" : "tab"}
                onClick={() => setTicketTab("available")}
              >
                Available Tickets
              </button>
              <button
                className={ticketTab === "unavailable" ? "tab active" : "tab"}
                onClick={() => setTicketTab("unavailable")}
              >
                History
              </button>
            </div>

            <div className="ticket-container">
              <div className="ticket-grid">
                {(() => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);

                  const filteredTickets = tickets.filter((t) => {
                    const usageDate = new Date(t.ngay_sudung);
                    usageDate.setHours(0, 0, 0, 0);

                    const expiredDays =
                      (today - usageDate) / (1000 * 60 * 60 * 24);

                    if (expiredDays > 30) return false;

                    const isAvailable =
                      t.trang_thai === "Success" && usageDate >= today;

                    return ticketTab === "available"
                      ? isAvailable
                      : !isAvailable;
                  });

                  if (filteredTickets.length === 0) {
                    return (
                      <p className="no-data-msg">
                        No tickets found in this category.
                      </p>
                    );
                  }

                  return filteredTickets.map((ticket, index) => {
                    const usageDate = new Date(ticket.ngay_sudung);
                    usageDate.setHours(0, 0, 0, 0);

                    const isExpired =
                      usageDate < today && ticket.trang_thai === "Success";

                    return (
                      <div
                        key={index}
                        className={`ticket-item-card ${ticket.trang_thai.toLowerCase()} ${
                          isExpired ? "expired-style" : ""
                        }`}
                      >
                        <div className="ticket-header">
                          <h3>{ticket.loai_ve}</h3>
                          <span className="status-label">
                            {isExpired ? "Expired" : ticket.trang_thai}
                          </span>
                        </div>

                        <div className="ticket-body">
                          <p>
                            <b>Full Name:</b> {ticket.hoten}
                          </p>
                          <p>
                            <b>Email:</b> {ticket.email}
                          </p>
                          <p>
                            <b>Phone:</b> {ticket.sdt}
                          </p>
                          <p>
                            <b>Address:</b> {ticket.diachi}
                          </p>

                          <hr />

                          <p>
                            <b>Transaction Ref:</b> {ticket.txn_ref}
                          </p>
                          <p>
                            <b>VNPAY Transaction ID:</b> {ticket.ma_gd_vnpay}
                          </p>
                          <p>
                            <b>Bank Code:</b> {ticket.ma_ngan_hang}
                          </p>
                          <p>
                            <b>Location:</b> {ticket.diadiem}
                          </p>
                          <p>
                            <b>Usage Date:</b>{" "}
                            {usageDate.toLocaleDateString()}
                          </p>
                          <p>
                            <b>Quantity:</b> {ticket.soluong_ve} tickets |{" "}
                            {ticket.soluong_suatan} meals
                          </p>

                          <hr />

                          <p className="total-price">
                            <b>Total Amount:</b>{" "}
                            {Number(ticket.tong_tien).toLocaleString()} VND
                          </p>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </>
        )}

        {activeTab === "shop" && (
          <>
            <div className="profile-tabs sub-tabs">
              <button
                className={shopTab === "cart" ? "tab active" : "tab"}
                onClick={() => setShopTab("cart")}
              >
                Shopping Cart
              </button>
              <button
                className={shopTab === "orders" ? "tab active" : "tab"}
                onClick={() => setShopTab("orders")}
              >
                Your Orders
              </button>
            </div>

            {shopTab === "orders" && (
              <div className="profile-tabs sub-tabs">
                <button
                  className={orderStatusTab === "To Confirm" ? "tab active" : "tab"}
                  onClick={() => setOrderStatusTab("To Confirm")}
                >
                  To Confirm
                </button>
                <button
                  className={orderStatusTab === "To Ship" ? "tab active" : "tab"}
                  onClick={() => setOrderStatusTab("To Ship")}
                >
                  To Ship
                </button>
                <button
                  className={orderStatusTab === "Shipping" ? "tab active" : "tab"}
                  onClick={() => setOrderStatusTab("Shipping")}
                >
                  Shipping
                </button>
                <button
                  className={orderStatusTab === "Delivered" ? "tab active" : "tab"}
                  onClick={() => setOrderStatusTab("Delivered")}
                >
                  Delivered
                </button>
                <button
                  className={orderStatusTab === "Returned" ? "tab active" : "tab"}
                  onClick={() => setOrderStatusTab("Returned")}
                >
                  Returned
                </button>
                <button
                  className={orderStatusTab === "Cancelled" ? "tab active" : "tab"}
                  onClick={() => setOrderStatusTab("Cancelled")}
                >
                  Cancelled
                </button>
              </div>
            )}

            <div className="ticket-container">
              <div className="ticket-grid">
                {shopTab === "cart" && (
                  <div className="cart-container-profile">
                    {cartItems.length === 0 ? (
                      <p className="no-data-msg">
                        Your shopping cart is empty.
                      </p>
                    ) : (
                      <>
                        <div className="cart-items-list">
                          {cartItems.map((item) => {
                            const subtotal = item.gia * item.soluong;

                            return (
                              <div
                                key={item.cart_id}
                                className="cart-item-card"
                              >
                                <img
                                  src={item.anh}
                                  alt={item.ten_sanpham}
                                  className="cart-product-img"
                                />

                                <div className="cart-product-info">
                                  <h3 className="product-name">
                                    {item.ten_sanpham}
                                  </h3>

                                  <p className="product-category">
                                    Category: {item.loai}
                                  </p>

                                  <p className="product-quantity">
                                    Quantity: <b>{item.soluong}</b>
                                  </p>

                                  <div className="product-price">
                                    {item.gia.toLocaleString("vi-VN")} VND
                                  </div>
                                </div>

                                <div className="cart-product-total">
                                  <span>Subtotal</span>
                                  <b>
                                    {subtotal.toLocaleString("vi-VN")} VND
                                  </b>
                                </div>

                                <button
                                  className="remove-cart-item"
                                  onClick={() =>
                                    handleDeleteCartItem(item.cart_id)
                                  }
                                >
                                  Remove
                                </button>
                              </div>
                            );
                          })}
                        </div>

                        <div className="cart-footer">
                          <div className="grand-total">
                            <span>Total Payment</span>
                            <span className="total-amount">
                              {cartItems
                                .reduce(
                                  (total, item) =>
                                    total + item.gia * item.soluong,
                                  0
                                )
                                .toLocaleString("vi-VN")}{" "}
                              VND
                            </span>
                          </div>

                          <button
                            className="pd-btn checkout-btn"
                            onClick={() =>
                              navigate("/checkout", {
                                state: { cartFromProfile: cartItems },
                              })
                            }
                          >
                            BUY NOW
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {shopTab === "orders" && (
                  <div className="orders-container">
                    {orders.filter(o => o.trangthai === orderStatusTab).length === 0 ? (
                      <p className="no-data-msg">
                        No orders in this status.
                      </p>
                    ) : (
                      <div className="orders-list">
                        {orders
                          .filter(o => o.trangthai === orderStatusTab)
                          .map((order) => (
                            <div key={order.id} className="order-card">
                              <div className="order-header">
                                <h3>Order #{order.id}</h3>
                                <span className="order-status">
                                  {order.trangthai}
                                </span>
                              </div>

                              <div className="order-body">

                                <img
                                  src={order.anh}
                                  alt={order.ten_sanpham}
                                  className="cart-product-img"
                                />

                                <p>
                                  <b>Product:</b> {order.ten_sanpham}
                                </p>

                                <p>
                                  <b>Category:</b> {order.loai}
                                </p>

                                <p>
                                  <b>Price:</b>{" "}
                                  {Number(order.gia).toLocaleString("vi-VN")} VND
                                </p>

                                <p>
                                  <b>Quantity:</b> {order.soluong}
                                </p>

                                <p>
                                  <b>Total:</b>{" "}
                                  {Number(order.tongtien).toLocaleString(
                                    "vi-VN"
                                  )}{" "}
                                  VND
                                </p>

                                <hr />

                                <p>
                                  <b>Customer:</b> {order.hoten}
                                </p>

                                <p>
                                  <b>Phone:</b> {order.sdt}
                                </p>

                                <p>
                                  <b>Address:</b> {order.diachi}
                                </p>

                                <p>
                                  <b>Delivery Time:</b>{" "}
                                  {order.thoigiangiaohang
                                    ? new Date(
                                        order.thoigiangiaohang
                                      ).toLocaleString()
                                    : "Updating"}
                                </p>

                                <p>
                                  <b>Order Date:</b>{" "}
                                  {new Date(order.ngaytao).toLocaleString()}
                                </p>

                                {order.trangthai === "To Confirm" && (
                                  <button
                                    className="cancel-order-btn"
                                    onClick={() =>
                                      handleCancelOrder(order.id)
                                    }
                                  >
                                    Cancel Order
                                  </button>
                                )}

                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}