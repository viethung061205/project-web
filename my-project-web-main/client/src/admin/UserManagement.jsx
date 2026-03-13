import React, { useEffect, useState } from "react";
import "./Admin.css";

const UserManagement = () => {

  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [editData, setEditData] = useState({
    hoten: "",
    ngaysinh: "",
    gioitinh: "",
    diachi: "",
    avatar: "",
    sdt: "",
    email: "",
    matkhau: ""
  });

  // Hàm này để format ngày truyền vào ô input type="date" (YYYY-MM-DD)
  // Dùng phương pháp thủ công để tránh bị lệch múi giờ (lùi 1 ngày)
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Hàm hiển thị ngày tháng năm ra bảng (DD/MM/YYYY)
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const loadUsers = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/admin/layUser");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {

    try {
      const url = editingId
        ? `http://localhost:3000/api/admin/capnhatUser/${editingId}`
        : "http://localhost:3000/api/admin/themUser";

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(editData)
      });

      const data = await res.json();
      alert(data.message);

      setEditData({
        hoten: "",
        ngaysinh: "",
        gioitinh: "",
        diachi: "",
        avatar: "",
        sdt: "",
        email: "",
        matkhau: ""
      });

      setEditingId(null);
      loadUsers();

    } catch (err) {
      console.log(err);
    }

  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setEditData({
      hoten: user.hoten,
      ngaysinh: formatDateForInput(user.ngaysinh), // Sửa lỗi lùi ngày ở đây
      gioitinh: user.gioitinh,
      diachi: user.diachi,
      avatar: user.avatar,
      sdt: user.sdt,
      email: user.email,
      matkhau: "" // Để trống mật khẩu khi sửa để bảo mật
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/admin/xoaUser/${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      alert(data.message);
      loadUsers();
    } catch (err) {
      console.log(err);
    }
  };

  const handleCancel = () => {
  setEditingId(null);
  setEditData({
    hoten: "",
    ngaysinh: "",
    gioitinh: "",
    diachi: "",
    avatar: "",
    sdt: "",
    email: "",
    matkhau: ""
  });
};

  return (
    <div className="user-management">
      <h2>User Management</h2>

      <div className="user-form">
        <div className="input-group">
          <label>Full Name:</label>
          <input name="hoten" value={editData.hoten} onChange={handleChange} />
        </div>

        <div className="input-group">
          <label>Date of Birth:</label>
          <input type="date" name="ngaysinh" value={editData.ngaysinh} onChange={handleChange} />
        </div>

        <div className="input-group">
          <label>Gender:</label>
          <select name="gioitinh" value={editData.gioitinh} onChange={handleChange}>
            <option value="">Select gender</option>
            <option value="Nam">Male</option>
            <option value="Nữ">Female</option>
            <option value="Khác">Other</option>
          </select>
        </div>

        <div className="input-group">
          <label>Address:</label>
          <input name="diachi" value={editData.diachi} onChange={handleChange} />
        </div>

        <div className="input-group">
          <label>Avatar:</label>
          <input name="avatar" value={editData.avatar} onChange={handleChange} />
        </div>

        <div className="input-group">
          <label>Phone:</label>
          <input name="sdt" value={editData.sdt} onChange={handleChange} />
        </div>

        <div className="input-group">
          <label>Email:</label>
          <input name="email" value={editData.email} onChange={handleChange} />
        </div>

        <div className="input-group">
          <label>Password:</label>
          <input 
            type="password" 
            name="matkhau" 
            placeholder={editingId ? "Leave blank to keep current" : "Enter password"}
            value={editData.matkhau} 
            onChange={handleChange} 
          />
        </div>

        <div className="form-btns">
  <button className="btn-save" onClick={handleSubmit}>
    {editingId ? "Update User" : "Add User"}
  </button>

  {editingId && (
    <button className="btn-cancel" onClick={handleCancel}>
      Cancel
    </button>
  )}
</div>
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Avatar</th>
            <th>Name</th>
            <th>Date of Birth</th>
            <th>Gender</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Address</th>
            <th>Password</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>
                <img
                  src={user.avatar || "https://via.placeholder.com/40"}
                  alt=""
                  style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                />
              </td>
              <td>{user.hoten}</td>
              <td>{formatDateForDisplay(user.ngaysinh)}</td> {/* Hiển thị Ngày/Tháng/Năm */}
              <td>{user.gioitinh}</td>
              <td>{user.sdt}</td>
              <td>{user.email}</td>
              <td>{user.diachi}</td>
              <td title={user.matkhau}>********</td> {/* Ẩn mật khẩu thật để tránh lộ thông tin */}
              <td>
                <button className="edit-btn" onClick={() => handleEdit(user)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;