import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./BookingConfirm.css";

const BookingConfirm = () => {
  const { location: locationId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state || !state.customerInfo) {
    alert("Invalid booking data. Please start your booking again.");
    navigate("/");
    return null;
  }

  const {
    customerInfo,
    locationData,
    ticketQty,
    mealQty,
    selectedDate,
    total,
    ticketType,
    discountedPrice
  } = state;

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  };

  const handleConfirm = async () => {
    try {
      const txn_ref = new Date().getTime().toString();

      const saveRes = await fetch(
        "http://localhost:3000/api/vnpay/luudonve",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            txn_ref,
            hoten: customerInfo.hoten,
            email: customerInfo.email,
            sdt: customerInfo.sdt,
            diachi: customerInfo.diachi,
            diadiem: locationId,
            loai_ve: ticketType,
            soluong_ve: ticketQty,
            soluong_suatan: mealQty,
            ngay_sudung: selectedDate,
            tong_tien: total
          })
        }
      );

      if (!saveRes.ok) {
        throw new Error("Failed to save booking information.");
      }

      const res = await fetch(
        "http://localhost:3000/api/vnpay/taodonve",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: total,
            orderInfo: `Ticket payment for ${customerInfo.hoten}`,
            txnRef: txn_ref
          })
        }
      );

      if (!res.ok) {
        throw new Error("Failed to generate VNPay payment link.");
      }

      const data = await res.json();
      window.location.href = data.paymentUrl;
    } catch (err) {
      alert(err.message || "An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="confirm-container">
      <div className="confirm-card">
        <div className="confirm-header">
          <h2>Booking Confirmation</h2>
          <p>Please verify your information before proceeding</p>
        </div>

        <div className="confirm-body">
          <section className="info-section">
            <h3>Customer Information</h3>

            <div className="info-grid">
              <div className="info-item">
                <span>Full Name:</span>
                <strong>{customerInfo.hoten}</strong>
              </div>
              <div className="info-item">
                <span>Phone Number:</span>
                <strong>{customerInfo.sdt}</strong>
              </div>
              <div className="info-item">
                <span>Email Address:</span>
                <strong>{customerInfo.email}</strong>
              </div>
              <div className="info-item">
                <span>Gender:</span>
                <strong>{customerInfo.gioitinh}</strong>
              </div>
              <div className="info-item">
                <span>Date of Birth:</span>
                <strong>{formatDate(customerInfo.ngaysinh)}</strong>
              </div>
              <div className="info-item">
                <span>Address:</span>
                <strong>{customerInfo.diachi}</strong>
              </div>
            </div>
          </section>

          <section className="ticket-section">
            <h3>Booking Details</h3>

            <div className="ticket-paper">
              <div className="ticket-main">
                <div className="ticket-row-header">
                  <div className="t-col">
                    <span>Destination: </span>
                    <strong>{locationData.name}</strong>
                  </div>
                  <div className="t-col text-right">
                    <span>Visit Date: </span>
                    <strong>{formatDate(selectedDate)}</strong>
                  </div>
                </div>

                <table className="ticket-table">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Qty</th>
                      <th className="text-right">Price / Unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{ticketType} Ticket</td>
                      <td>{ticketQty}</td>
                      <td className="text-right">
                        {discountedPrice.toLocaleString()} VND
                      </td>
                    </tr>

                    {mealQty > 0 && (
                      <tr>
                        <td>Meal Voucher</td>
                        <td>{mealQty}</td>
                        <td className="text-right">500.000 VND</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="ticket-footer">
                <span>Total Amount</span>
                <span className="total-price">
                  {total.toLocaleString()} VND
                </span>
              </div>
            </div>
          </section>
        </div>

        <div className="confirm-actions">
          <button className="btn-back" onClick={() => navigate(-1)}>
            BACK TO EDIT
          </button>
          <button className="btn-pay" onClick={handleConfirm}>
            CONFIRM & PAY NOW
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirm;