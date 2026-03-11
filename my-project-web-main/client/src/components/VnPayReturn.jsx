import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

const VnPayReturn = () => {
  const query = new URLSearchParams(useLocation().search);
  const [loading, setLoading] = useState(true);
  const [dbData, setDbData] = useState(null);

  const vnp_ResponseCode = query.get("vnp_ResponseCode");
  const vnp_TxnRef = query.get("vnp_TxnRef");

  const formatPayDate = (payDate) => {
    if (!payDate || payDate.length !== 14) return "N/A";

    const year = payDate.substring(0, 4);
    const month = payDate.substring(4, 6);
    const day = payDate.substring(6, 8);
    const hour = payDate.substring(8, 10);
    const minute = payDate.substring(10, 12);
    const second = payDate.substring(12, 14);

    const date = new Date(
      `${year}-${month}-${day}T${hour}:${minute}:${second}`
    );

    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  };

  useEffect(() => {
    const verifyAndFetchData = async () => {
      try {
        const params = Object.fromEntries(query.entries());
        const res = await fetch(
          "http://localhost:3000/api/vnpay/thongtinthanhtoan",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ vnp_Params: params })
          }
        );

        const result = await res.json();
        if (result.success) {
          setDbData(result.orderDetail);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    verifyAndFetchData();
  }, []);

  if (loading)
    return <div style={styles.loading}>Processing payment...</div>;

  const isSuccess = vnp_ResponseCode === "00";

  return (
    <div style={styles.container}>
      <div style={isSuccess ? styles.ticketCard : styles.errorCard}>
        <div style={isSuccess ? styles.headerSuccess : styles.headerError}>
          <h1 style={styles.headerTitle}>
            {isSuccess ? "PAYMENT SUCCESSFUL" : "PAYMENT FAILED"}
          </h1>
          {isSuccess ? "✅" : "❌"}
        </div>

        <div style={styles.body}>
          {isSuccess ? (
            <>
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>
                  Transaction ID: {query.get("vnp_TransactionNo")}
                </h3>
                <p style={styles.textMuted}>
                  Thank you for using our service.
                </p>
              </div>

              <div style={styles.infoGrid}>
                <div style={styles.infoBox}>
                  <label style={styles.label}>CUSTOMER</label>
                  <p style={styles.value}>
                    {query.get("vnp_OrderInfo")?.split(":").pop() ||
                      "Customer"}
                  </p>
                </div>
                <div style={styles.infoBox}>
                  <label style={styles.label}>BANK</label>
                  <p style={styles.value}>{query.get("vnp_BankCode")}</p>
                </div>
              </div>

              <div style={styles.ticketDetail}>
                <label style={styles.label}>PAYMENT DETAILS</label>

                <div style={styles.tableRow}>
                  <span>Order Reference</span>
                  <span style={styles.bold}>{vnp_TxnRef}</span>
                </div>

                <div style={styles.tableRow}>
                  <span>Payment Time</span>
                  <span style={{ ...styles.bold, color: "#27ae60" }}>
                    {formatPayDate(query.get("vnp_PayDate"))}
                  </span>
                </div>

                <hr style={styles.hr} />

                <div style={styles.tableRow}>
                  <span>Total Amount</span>
                  <span style={styles.totalAmount}>
                    {(query.get("vnp_Amount") / 100).toLocaleString()} VND
                  </span>
                </div>
              </div>

              <div style={styles.note}>
                * Please keep this screen or check your email for your e-ticket.
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center" }}>
              <p>Your transaction was cancelled or failed.</p>
              <p>Error code: {vnp_ResponseCode}</p>
            </div>
          )}
        </div>

        <div style={styles.footer}>
          <Link to="/" style={styles.homeBtn}>
            BACK TO HOME
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#f4f7f6",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: "'Inter', sans-serif",
  },
  loading: { textAlign: "center", marginTop: "100px", fontSize: "20px" },
  ticketCard: {
    backgroundColor: "#fff",
    width: "100%",
    maxWidth: "500px",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    overflow: "hidden",
  },
  errorCard: {
    backgroundColor: "#fff",
    width: "100%",
    maxWidth: "500px",
    borderRadius: "15px",
    borderTop: "5px solid #ff4d4f",
    padding: "30px",
    textAlign: "center"
  },
  headerSuccess: {
    backgroundColor: "#27ae60",
    color: "#fff",
    padding: "30px",
    textAlign: "center",
    fontSize: "40px"
  },
  headerError: {
    backgroundColor: "#eb5757",
    color: "#fff",
    padding: "30px",
    textAlign: "center",
    fontSize: "40px"
  },
  headerTitle: { fontSize: "20px", margin: "10px 0 0 0", fontWeight: "700" },
  body: { padding: "30px" },
  section: { textAlign: "center", marginBottom: "25px" },
  sectionTitle: { fontSize: "16px", color: "#2c3e50", margin: "0" },
  textMuted: { fontSize: "13px", color: "#7f8c8d" },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
    marginBottom: "25px",
  },
  infoBox: {
    padding: "15px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
  },
  label: { fontSize: "11px", color: "#95a5a6", fontWeight: "bold", display: "block", marginBottom: "5px" },
  value: { fontSize: "14px", color: "#2c3e50", fontWeight: "600", margin: "0" },
  ticketDetail: {
    border: "1px solid #edf2f7",
    padding: "20px",
    borderRadius: "10px",
    backgroundColor: "#fff",
  },
  tableRow: { display: "flex", justifyContent: "space-between", fontSize: "14px", margin: "10px 0", color: "#4a5568" },
  bold: { fontWeight: "bold", color: "#2d3748" },
  totalAmount: { fontSize: "20px", fontWeight: "bold", color: "#e74c3c" },
  hr: { border: "none", borderTop: "1px dashed #cbd5e0", margin: "15px 0" },
  note: { marginTop: "20px", fontSize: "12px", color: "#a0aec0", fontStyle: "italic", textAlign: "center" },
  footer: { padding: "0 30px 30px 30px", textAlign: "center" },
  homeBtn: {
    display: "block",
    backgroundColor: "#2c3e50",
    color: "#fff",
    padding: "12px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "bold",
    transition: "0.3s"
  },
};

export default VnPayReturn;