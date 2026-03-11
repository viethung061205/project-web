import { useEffect, useState } from "react";
import "./Admin.css";

const ShoppingManagement = () => {
  const [activeTab, setActiveTab] = useState("products");

  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [tenSanPham, setTenSanPham] = useState("");
  const [loai, setLoai] = useState("Toys");
  const [gia, setGia] = useState("");
  const [soLuong, setSoLuong] = useState("");
  const [mota, setMota] = useState("");
  const [anh, setAnh] = useState("");
  const [mauanh, setMauanh] = useState([]);

  const [orders, setOrders] = useState([]);
  const [editingOrderId, setEditingOrderId] = useState(null);

  const [userEmail, setUserEmail] = useState("");
  const [hoTen, setHoTen] = useState("");
  const [diaChi, setDiaChi] = useState("");
  const [sdt, setSdt] = useState("");
  const [sanPhamId, setSanPhamId] = useState("");
  const [tenSanPhamOrder, setTenSanPhamOrder] = useState("");
  const [loaiOrder, setLoaiOrder] = useState("");
  const [giaOrder, setGiaOrder] = useState("");
  const [soLuongOrder, setSoLuongOrder] = useState("");
  const [anhOrder, setAnhOrder] = useState("");
  const [tongTien, setTongTien] = useState("");
  const [thoiGianGiaoHang, setThoiGianGiaoHang] = useState("");
  const [trangThai, setTrangThai] = useState("");

  const [cartItems, setCartItems] = useState([]);
  const [editingCartId, setEditingCartId] = useState(null);
  const [cartSoLuong, setCartSoLuong] = useState("");

  const fetchProducts = async () => {
    const res = await fetch("http://localhost:3000/api/admin/laysanpham");
    const data = await res.json();
    setProducts(data);
  };

  const fetchOrders = async () => {
    const res = await fetch("http://localhost:3000/api/admin/laydonhang");
    const data = await res.json();
    setOrders(data);
  };

  const fetchCart = async () => {
    const res = await fetch("http://localhost:3000/api/admin/laygiohang");
    const data = await res.json();
    setCartItems(data);
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchCart();
  }, []);

  const formatVND = (value) => {
    if (!value) return "0";
    return Number(value).toLocaleString("vi-VN");
  };

  const formatDateTime = (value) => {
    if (!value) return "";
    const d = new Date(value);
    return d.toLocaleString("vi-VN");
  };

  const handleAddProduct = async () => {
    const response = await fetch("http://localhost:3000/api/admin/themsanpham", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ten_sanpham: tenSanPham,
        loai: loai,
        gia: Number(gia),
        so_luong: Number(soLuong),
        mauanh: mauanh,
        mota: mota,
        anh: anh,
      }),
    });

    if (response.ok) {
      fetchProducts();
      resetForm();
    }
  };

  const handleUpdateProduct = async () => {
    const response = await fetch(
      `http://localhost:3000/api/admin/suasanpham/${editingId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ten_sanpham: tenSanPham,
          loai: loai,
          gia: Number(gia),
          so_luong: Number(soLuong),
          mauanh: mauanh,
          mota: mota,
          anh: anh,
        }),
      }
    );

    if (response.ok) {
      fetchProducts();
      resetForm();
      setEditingId(null);
    }
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:3000/api/admin/xoasanpham/${id}`, {
      method: "DELETE",
    });
    fetchProducts();
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setTenSanPham(p.ten_sanpham);
    setLoai(p.loai);
    setGia(p.gia);
    setSoLuong(p.so_luong);
    setMota(p.mota);
    setAnh(p.anh);

    let extraImages = [];
    try {
      extraImages =
        typeof p.mauanh === "string"
          ? JSON.parse(p.mauanh)
          : p.mauanh || [];
    } catch (e) {
      extraImages = [];
    }

    setMauanh(Array.isArray(extraImages) ? extraImages : []);
  };

  const resetForm = () => {
    setTenSanPham("");
    setLoai("Toys");
    setGia("");
    setSoLuong("");
    setMota("");
    setAnh("");
    setMauanh([]);
  };

  const handleEditOrder = (o) => {
    setEditingOrderId(o.id);
    setUserEmail(o.user_email);
    setHoTen(o.hoten);
    setDiaChi(o.diachi);
    setSdt(o.sdt);
    setSanPhamId(o.sanpham_id);
    setTenSanPhamOrder(o.ten_sanpham);
    setLoaiOrder(o.loai);
    setGiaOrder(o.gia);
    setSoLuongOrder(o.soluong);
    setAnhOrder(o.anh);
    setTongTien(o.tongtien);
    setThoiGianGiaoHang(o.thoigiangiaohang ? o.thoigiangiaohang.slice(0,16) : "");
    setTrangThai(o.trangthai);
  };

  const handleUpdateOrder = async () => {
    const response = await fetch(
      `http://localhost:3000/api/admin/suadonhang/${editingOrderId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_email: userEmail,
          hoten: hoTen,
          diachi: diaChi,
          sdt: sdt,
          sanpham_id: sanPhamId,
          ten_sanpham: tenSanPhamOrder,
          loai: loaiOrder,
          gia: giaOrder,
          soluong: soLuongOrder,
          anh: anhOrder,
          tongtien: tongTien,
          thoigiangiaohang: thoiGianGiaoHang,
          trangthai: trangThai,
        }),
      }
    );

    if (response.ok) {
      fetchOrders();
      setEditingOrderId(null);
    }
  };

  const handleDeleteOrder = async (id) => {
    await fetch(`http://localhost:3000/api/admin/xoadonhang/${id}`, {
      method: "DELETE",
    });
    fetchOrders();
  };

  const handleDeleteCart = async (id) => {
    if(window.confirm("Are you sure you want to remove this item?")) {
      await fetch(`http://localhost:3000/api/admin/xoagiohang/${id}`, { method: "DELETE" });
      fetchCart();
    }
  };

  const handleUpdateCart = async (id) => {
    const response = await fetch(`http://localhost:3000/api/admin/suagiohang/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ soluong: Number(cartSoLuong) }),
    });
    if (response.ok) {
      setEditingCartId(null);
      fetchCart();
    }
  };

  return (
    <div className="admin-container">

      <div style={{ marginBottom: "20px" }}>
        <button
          className="btn-add"
          onClick={() => setActiveTab("products")}
          style={{ marginRight: "10px" }}
        >
          Product Management
        </button>

        <button
          className="btn-save"
          onClick={() => setActiveTab("orders")}
          style={{ marginRight: "10px" }}
        >
          Order Management
        </button>

        <button
          className="btn-edit"
          onClick={() => setActiveTab("cart")}
        >
          Cart Management
        </button>
      </div>

      {activeTab === "products" && (
        <>
          <h2 className="admin-title">Product Management</h2>

          <div className="admin-form">
            <input type="text" placeholder="Product name" value={tenSanPham} onChange={(e) => setTenSanPham(e.target.value)} />

            <select value={loai} onChange={(e) => setLoai(e.target.value)}>
              <option value="Toys">Toys</option>
              <option value="Household & School supplies">Household & School supplies</option>
              <option value="Accessories">Accessories</option>
            </select>

            <input type="number" placeholder="Price (VND)" value={gia} onChange={(e) => setGia(e.target.value)} />

            <input type="number" placeholder="Quantity" value={soLuong} onChange={(e) => setSoLuong(e.target.value)} />

            <textarea placeholder="Description" value={mota} onChange={(e) => setMota(e.target.value)} />

            <input type="text" placeholder="Main image URL" value={anh} onChange={(e) => setAnh(e.target.value)} />

            <input
              type="text"
              placeholder="Paste extra image link and press Enter"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const newUrl = e.target.value.trim();
                  if (newUrl !== "") {
                    setMauanh((prev) => [...prev, newUrl]);
                    e.target.value = "";
                  }
                }
              }}
            />

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
              {mauanh.map((url, index) => (
                <div key={index} style={{ position: "relative" }}>
                  <img src={url} alt="preview" style={{ width: "50px", height: "50px", borderRadius: "5px" }} />
                  <button
                    onClick={() => setMauanh(mauanh.filter((_, i) => i !== index))}
                    style={{
                      position: "absolute",
                      top: "-5px",
                      right: "-5px",
                      background: "red",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      cursor: "pointer",
                      width: "18px",
                      height: "18px"
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {editingId ? (
              <button className="btn-save" onClick={handleUpdateProduct}>Update Product</button>
            ) : (
              <button className="btn-add" onClick={handleAddProduct}>Add Product</button>
            )}
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Price (VND)</th>
                  <th>Quantity</th>
                  <th>Description</th>
                  <th>Main Image</th>
                  <th>Extra Images</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.ten_sanpham}</td>
                    <td>{p.loai}</td>
                    <td>{formatVND(p.gia)}</td>
                    <td>{p.so_luong}</td>
                    <td>{p.mota}</td>

                    <td>
                      <img src={p.anh} alt="" style={{ width: "60px", height: "60px", objectFit: "cover" }} />
                    </td>

                    <td>
                      {(() => {
                        try {
                          const images =
                            typeof p.mauanh === "string"
                              ? JSON.parse(p.mauanh)
                              : p.mauanh || [];
                          return images.map((img, index) => (
                            <img key={index} src={img} alt="" style={{ width: "40px", height: "40px", objectFit: "cover", marginRight: "5px" }} />
                          ));
                        } catch {
                          return null;
                        }
                      })()}
                    </td>

                    <td>
                      <button className="btn-edit" onClick={() => handleEdit(p)}>Edit</button>
                      <button className="btn-delete" onClick={() => handleDelete(p.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === "orders" && (
        <>
          <h2 className="admin-title">Order Management</h2>

          {editingOrderId && (
            <div className="admin-form">
              <input type="text" placeholder="User Email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
              <input type="text" placeholder="Full Name" value={hoTen} onChange={(e) => setHoTen(e.target.value)} />
              <input type="text" placeholder="Address" value={diaChi} onChange={(e) => setDiaChi(e.target.value)} />
              <input type="text" placeholder="Phone" value={sdt} onChange={(e) => setSdt(e.target.value)} />
              <input type="number" placeholder="Product ID" value={sanPhamId} onChange={(e) => setSanPhamId(e.target.value)} />
              <input type="text" placeholder="Product Name" value={tenSanPhamOrder} onChange={(e) => setTenSanPhamOrder(e.target.value)} />
              <input type="text" placeholder="Type" value={loaiOrder} onChange={(e) => setLoaiOrder(e.target.value)} />
              <input type="number" placeholder="Price" value={giaOrder} onChange={(e) => setGiaOrder(e.target.value)} />
              <input type="number" placeholder="Quantity" value={soLuongOrder} onChange={(e) => setSoLuongOrder(e.target.value)} />

              <input type="text" placeholder="Image URL" value={anhOrder} onChange={(e) => setAnhOrder(e.target.value)} />

              <input type="number" placeholder="Total Price" value={tongTien} onChange={(e) => setTongTien(e.target.value)} />
              <input type="datetime-local" value={thoiGianGiaoHang} onChange={(e) => setThoiGianGiaoHang(e.target.value)} />

              <select value={trangThai} onChange={(e) => setTrangThai(e.target.value)}>
                <option value="To Confirm">To Confirm</option>
                <option value="To Ship">To Ship</option>
                <option value="Shipping">Shipping</option>
                <option value="Delivered">Delivered</option>
                <option value="Returned">Returned</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <button className="btn-save" onClick={handleUpdateOrder}>Update Order</button>
            </div>
          )}

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User Email</th>
                  <th>Full Name</th>
                  <th>Address</th>
                  <th>Phone</th>
                  <th>Product ID</th>
                  <th>Product Name</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Image</th>
                  <th>Total</th>
                  <th>Delivery Time</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>{o.user_email}</td>
                    <td>{o.hoten}</td>
                    <td>{o.diachi}</td>
                    <td>{o.sdt}</td>
                    <td>{o.sanpham_id}</td>
                    <td>{o.ten_sanpham}</td>
                    <td>{o.loai}</td>
                    <td>{formatVND(o.gia)}</td>
                    <td>{o.soluong}</td>
                    <td><img src={o.anh} alt="" style={{ width: "60px", height: "60px", objectFit: "cover" }} /></td>
                    <td>{formatVND(o.tongtien)}</td>
                    <td>{formatDateTime(o.thoigiangiaohang)}</td>
                    <td>{o.trangthai}</td>
                    <td>{formatDateTime(o.ngaytao)}</td>
                    <td>
                      <button className="btn-edit" onClick={() => handleEditOrder(o)}>Edit</button>
                      <button className="btn-delete" onClick={() => handleDeleteOrder(o.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === "cart" && (
        <>
          <h2 className="admin-title">Cart Management</h2>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User Email</th>
                  <th>Product</th>
                  <th>Image</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.user_email}</td>
                    <td>
                      <strong>{item.ten_sanpham}</strong> <br/>
                      <small>ID: {item.sanpham_id}</small>
                    </td>
                    <td><img src={item.anh} alt="" style={{ width: "50px" }} /></td>
                    <td>{formatVND(item.gia)}</td>
                    <td>
                      {editingCartId === item.id ? (
                        <input 
                          type="number" 
                          style={{width: '60px'}} 
                          value={cartSoLuong} 
                          onChange={(e) => setCartSoLuong(e.target.value)}
                        />
                      ) : (
                        item.soluong
                      )}
                    </td>
                    <td>{formatVND(item.gia * item.soluong)}</td>
                    <td>{formatDateTime(item.ngaytao)}</td>
                    <td>
                      {editingCartId === item.id ? (
                        <button className="btn-save" onClick={() => handleUpdateCart(item.id)}>Save</button>
                      ) : (
                        <button className="btn-edit" onClick={() => {
                          setEditingCartId(item.id);
                          setCartSoLuong(item.soluong);
                        }}>Edit</button>
                      )}
                      <button className="btn-delete" onClick={() => handleDeleteCart(item.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ShoppingManagement;