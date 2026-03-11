import { useEffect, useState } from "react";
import "./Admin.css";

const BookingManagement = () => {

  const [tickets, setTickets] = useState([]);
  const [userTickets, setUserTickets] = useState([]);

  const [activeTab, setActiveTab] = useState("ticket");

  const [editingId, setEditingId] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);

  const [formData, setFormData] = useState({
    diadiem: "",
    loai: "",
    mota: "",
    gia: "",
    giabth: "",
    ngaytao: ""
  });

  const [userFormData, setUserFormData] = useState({
    txn_ref: "",
    hoten: "",
    email: "",
    sdt: "",
    diachi: "",
    diadiem: "",
    loai_ve: "",
    soluong_ve: "",
    soluong_suatan: "",
    ngay_sudung: "",
    tong_tien: "",
    ma_ngan_hang: "",
    trang_thai: "",
    ma_gd_vnpay: ""
  });

  const loadTickets = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/admin/quanlyve");
      const data = await response.json();
      if (response.ok) setTickets(data);
    } catch (error) {
      console.error("Failed to load ticket data:", error);
    }
  };

  const loadUserTickets = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/admin/layveUser");
      const data = await response.json();
      if (response.ok) setUserTickets(data);
    } catch (error) {
      console.error("Failed to load user ticket data:", error);
    }
  };

  useEffect(() => {
    loadTickets();
    loadUserTickets();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUserChange = (e) => {
    setUserFormData({ ...userFormData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editingId
      ? `http://localhost:3000/api/admin/quanlyve/${editingId}`
      : "http://localhost:3000/api/admin/quanlyve";

    const method = editingId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(editingId ? "Ticket updated successfully." : "New ticket added successfully.");
        setFormData({ diadiem: "", loai: "", mota: "", gia: "", giabth: "", ngaytao: "" });
        setEditingId(null);
        loadTickets();
      } else {
        alert("Failed to save ticket data.");
      }
    } catch (error) {
      console.error("Error submitting ticket:", error);
      alert("Server connection error.");
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:3000/api/admin/capnhatveUser/${editingUserId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userFormData)
        }
      );

      if (response.ok) {
        alert("User ticket updated successfully.");
        setEditingUserId(null);
        loadUserTickets();
      } else {
        alert("Failed to update user ticket.");
      }

    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      try {
        const response = await fetch(`http://localhost:3000/api/admin/quanlyve/${id}`, { method: "DELETE" });
        if (response.ok) {
          alert("Ticket deleted successfully.");
          loadTickets();
        } else {
          alert("Failed to delete ticket.");
        }
      } catch (error) {
        console.error("Delete error:", error);
        alert("Server connection error.");
      }
    }
  };

  const handleDeleteUserTicket = async (id) => {

    if (window.confirm("Are you sure you want to delete this ticket?")) {

      try {

        const response = await fetch(
          `http://localhost:3000/api/admin/xoaveUser/${id}`,
          { method: "DELETE" }
        );

        if (response.ok) {
          alert("Ticket deleted successfully.");
          loadUserTickets();
        } else {
          alert("Failed to delete ticket.");
        }

      } catch (error) {
        console.error("Delete error:", error);
      }

    }

  };

  const startEdit = (ticket) => {
    setEditingId(ticket.id);
    setFormData({
      diadiem: ticket.diadiem,
      loai: ticket.loai,
      mota: ticket.mota,
      gia: ticket.gia,
      giabth: ticket.giabth,
      ngaytao: ticket.ngaytao ? ticket.ngaytao.split("T")[0] : ""
    });
  };

  const startEditUser = (u) => {
    setEditingUserId(u.id);
    setUserFormData({
      txn_ref: u.txn_ref || "",
      hoten: u.hoten || "",
      email: u.email || "",
      sdt: u.sdt || "",
      diachi: u.diachi || "",
      diadiem: u.diadiem || "",
      loai_ve: u.loai_ve || "",
      soluong_ve: u.soluong_ve || "",
      soluong_suatan: u.soluong_suatan || "",
      ngay_sudung: u.ngay_sudung ? u.ngay_sudung.split("T")[0] : "",
      tong_tien: u.tong_tien || "",
      ma_ngan_hang: u.ma_ngan_hang || "",
      trang_thai: u.trang_thai || "",
      ma_gd_vnpay: u.ma_gd_vnpay || ""
    });
  };

  const today = new Date();

  const activeTickets = userTickets.filter(t => {
    if (!t.ngay_sudung) return false;
    const useDate = new Date(t.ngay_sudung);
    return t.trang_thai === "Success" && useDate >= today;
  });

  const inactiveTickets = userTickets.filter(t => {
    if (!t.ngay_sudung) return true;
    const useDate = new Date(t.ngay_sudung);
    return !(t.trang_thai === "Success" && useDate >= today);
  });

  return (
    <div className="booking-manage">

      <div className="admin-tabs">

        <button
          className={activeTab === "ticket" ? "tab active" : "tab"}
          onClick={() => setActiveTab("ticket")}
        >
          Ticket Management
        </button>

        <button
          className={activeTab === "user" ? "tab active" : "tab"}
          onClick={() => setActiveTab("user")}
        >
          User Ticket Management
        </button>

      </div>


      {activeTab === "ticket" && (
        <section className="box">

          <h3>{editingId ? "EDIT TICKET INFORMATION" : "ADD NEW TICKET"}</h3>

          <form onSubmit={handleSubmit} className="ticket-form">

            <select name="diadiem" value={formData.diadiem} onChange={handleChange} required>
              <option value="">Select Location</option>
              <option value="paris">Paris</option>
              <option value="tokyo">Tokyo</option>
              <option value="california">California</option>
              <option value="shanghai">Shanghai</option>
              <option value="hongkong">Hongkong</option>
            </select>

            <select name="loai" value={formData.loai} onChange={handleChange} required>
              <option value="">Select Ticket Type</option>
              <option value="1-day admission ticket">1-day admission ticket</option>
              <option value="Couple admission tickets">Couple admission tickets</option>
              <option value="2-day admission ticket">2-day admission ticket</option>
              <option value="1 day full option">1 day full option</option>
            </select>

            <input name="gia" type="number" placeholder="Price" value={formData.gia} onChange={handleChange} required />
            <input name="giabth" type="number" placeholder="Original Price" value={formData.giabth} onChange={handleChange} required />
            <textarea name="mota" placeholder="Ticket Description" value={formData.mota} onChange={handleChange} required />
            <input name="ngaytao" type="date" value={formData.ngaytao} onChange={handleChange} required />

            <div className="form-btns">
              <button type="submit" className="btn-save">
                {editingId ? "Update Ticket" : "Save Ticket"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ diadiem: "", loai: "", mota: "", gia: "", giabth: "", ngaytao: "" });
                  }}
                >
                  Cancel
                </button>
              )}
            </div>

          </form>


          <h3>TICKET LIST</h3>

          <div className="table-responsive">

            <table className="admin-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Location</th>
                  <th>Ticket Type</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Create Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {tickets.map((t) => (
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td><strong>{t.diadiem}</strong></td>
                    <td>{t.loai}</td>
                    <td className="description">{t.mota}</td>
                    <td>{t.gia?.toLocaleString()} VND</td>
                    <td>{t.ngaytao ? new Date(t.ngaytao).toLocaleDateString() : ""}</td>
                    <td>
                      <button className="btn-edit" onClick={() => startEdit(t)}>Edit</button>
                      <button className="btn-delete" onClick={() => handleDelete(t.id)}>Delete</button>
                    </td>
                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </section>
      )}


      {activeTab === "user" && (

        <section className="box">

          {editingUserId && (

            <form onSubmit={handleUserSubmit} className="ticket-form">

              <input name="txn_ref" placeholder="Transaction Ref" value={userFormData.txn_ref} onChange={handleUserChange} />
              <input name="hoten" placeholder="Full Name" value={userFormData.hoten} onChange={handleUserChange} />
              <input name="email" placeholder="Email" value={userFormData.email} onChange={handleUserChange} />
              <input name="sdt" placeholder="Phone" value={userFormData.sdt} onChange={handleUserChange} />
              <input name="diachi" placeholder="Address" value={userFormData.diachi} onChange={handleUserChange} />
              <input name="diadiem" placeholder="Location" value={userFormData.diadiem} onChange={handleUserChange} />
              <input name="loai_ve" placeholder="Ticket Type" value={userFormData.loai_ve} onChange={handleUserChange} />
              <input name="soluong_ve" type="number" placeholder="Ticket Quantity" value={userFormData.soluong_ve} onChange={handleUserChange} />
              <input name="soluong_suatan" type="number" placeholder="Meal Quantity" value={userFormData.soluong_suatan} onChange={handleUserChange} />
              <input name="ngay_sudung" type="date" value={userFormData.ngay_sudung} onChange={handleUserChange} />
              <input name="tong_tien" type="number" placeholder="Total Price" value={userFormData.tong_tien} onChange={handleUserChange} />
              <input name="ma_ngan_hang" placeholder="Bank Code" value={userFormData.ma_ngan_hang} onChange={handleUserChange} />

              <select name="trang_thai" value={userFormData.trang_thai} onChange={handleUserChange}>
                <option value="Pending">Pending</option>
                <option value="Success">Success</option>
                <option value="Failed">Failed</option>
              </select>

              <input name="ma_gd_vnpay" placeholder="VNPAY Transaction Code" value={userFormData.ma_gd_vnpay} onChange={handleUserChange} />

              <div className="form-btns">
                <button type="submit" className="btn-save">Update User Ticket</button>
                <button type="button" className="btn-cancel" onClick={() => setEditingUserId(null)}>Cancel</button>
              </div>

            </form>

          )}

          <h3>ACTIVE USER TICKETS</h3>

          <div className="table-responsive">

            <table className="admin-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Transaction</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Location</th>
                  <th>Ticket Type</th>
                  <th>Ticket Qty</th>
                  <th>Meal Qty</th>
                  <th>Use Date</th>
                  <th>Total</th>
                  <th>Bank</th>
                  <th>Status</th>
                  <th>VNPAY Code</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {activeTickets.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.txn_ref}</td>
                    <td>{u.hoten}</td>
                    <td>{u.email}</td>
                    <td>{u.sdt}</td>
                    <td>{u.diachi}</td>
                    <td>{u.diadiem}</td>
                    <td>{u.loai_ve}</td>
                    <td>{u.soluong_ve}</td>
                    <td>{u.soluong_suatan}</td>
                    <td>{u.ngay_sudung ? new Date(u.ngay_sudung).toLocaleDateString() : ""}</td>
                    <td>{Number(u.tong_tien).toLocaleString()} VND</td>
                    <td>{u.ma_ngan_hang}</td>
                    <td>{u.trang_thai}</td>
                    <td>{u.ma_gd_vnpay}</td>
                    <td>
                      <button className="btn-edit" onClick={() => startEditUser(u)}>Edit</button>
                      <button className="btn-delete" onClick={() => handleDeleteUserTicket(u.id)}>Delete</button>
                    </td>
                  </tr>
                ))}

              </tbody>

            </table>

          </div>


          <h3>INACTIVE / EXPIRED TICKETS</h3>

          <div className="table-responsive">

            <table className="admin-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Transaction</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Location</th>
                  <th>Ticket Type</th>
                  <th>Ticket Qty</th>
                  <th>Meal Qty</th>
                  <th>Use Date</th>
                  <th>Total</th>
                  <th>Bank</th>
                  <th>Status</th>
                  <th>VNPAY Code</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {inactiveTickets.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.txn_ref}</td>
                    <td>{u.hoten}</td>
                    <td>{u.email}</td>
                    <td>{u.sdt}</td>
                    <td>{u.diachi}</td>
                    <td>{u.diadiem}</td>
                    <td>{u.loai_ve}</td>
                    <td>{u.soluong_ve}</td>
                    <td>{u.soluong_suatan}</td>
                    <td>{u.ngay_sudung ? new Date(u.ngay_sudung).toLocaleDateString() : ""}</td>
                    <td>{Number(u.tong_tien).toLocaleString()} VND</td>
                    <td>{u.ma_ngan_hang}</td>
                    <td>{u.trang_thai}</td>
                    <td>{u.ma_gd_vnpay}</td>
                    <td>
                      <button className="btn-edit" onClick={() => startEditUser(u)}>Edit</button>
                      <button className="btn-delete" onClick={() => handleDeleteUserTicket(u.id)}>Delete</button>
                    </td>
                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </section>

      )}

    </div>
  );
};

export default BookingManagement;