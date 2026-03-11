import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import bookingConfig from "../data/bookingData";
import "./BookingCheckout.css";

const BookingCheckout = () => {
  const { location: locationId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { ticketType, discountedPrice, originalPrice } = location.state || {};
  const data = bookingConfig[locationId];

  const [ticketQty, setTicketQty] = useState(0);
  const [mealQty, setMealQty] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");

  const dateInputRef = useRef(null);

  useEffect(() => {
    if (!location.state) {
      navigate(`/booking/${locationId}`);
    }
  }, [location.state, navigate, locationId]);

  if (!data) return <div>Location not found</div>;

  const ticketPrice = discountedPrice || 0;
  const mealPrice = 500000;
  const total = ticketQty * ticketPrice + mealQty * mealPrice;

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = () => {
    if (!selectedDate) {
      alert("Please select a date first!");
      return;
    }

    if (ticketQty <= 0) {
      alert("Please select at least 1 ticket!");
      return;
    }

    navigate(`/booking/${locationId}/form`, {
      state: {
        ticketQty,
        mealQty,
        selectedDate,
        locationData: data,
        total,
        ticketType,
        discountedPrice
      }
    });
  };

  return (
    <div className="booking-checkout">
      <div className="left-panel">
        <img
          src="https://i.pinimg.com/1200x/98/80/bf/9880bf7c9f29b578d57025be0297ce22.jpg"
          alt="Disney character"
        />
        <h3>{ticketType} to {data.name} (9:00)</h3>
        <p>Cannot change schedule</p>
        <p>Non-refundable</p>
        <button className="review-btn">Review ticket information</button>
      </div>

      <div className="right-panel">
        <div className="day-select">
          <button
            className="calendar-btn"
            onClick={() => dateInputRef.current?.showPicker()}
          >
            <span className="emoji">📅</span>
            <span className="label">
              {selectedDate || "View calendar"}
            </span>
          </button>

          <input
            ref={dateInputRef}
            type="date"
            min={today}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ display: "none" }}
          />
        </div>

        <hr />

        <div className="ticket-row">
          <div>
            <h3>{ticketType} to {data.name} (9:00)</h3>
            <p className="price">
              <span className="highlight">
                {ticketPrice.toLocaleString()} VND
              </span>
              <del>{originalPrice?.toLocaleString()} VND</del>
            </p>
          </div>
          <div className="qty-control">
            <button onClick={() => setTicketQty(Math.max(0, ticketQty - 1))}>
              -
            </button>
            <span>{ticketQty}</span>
            <button onClick={() => setTicketQty(ticketQty + 1)}>+</button>
          </div>
        </div>

        <hr />

        <div className="ticket-row">
          <div>
            <h4>
              BUY MORE <br /> Meal Voucher <br />
              include 2 random dishes in the park
            </h4>
            <p className="price">
              <span className="highlight">500.000 VND</span>
              <del>600.000 VND</del>
            </p>
          </div>
          <div className="qty-control">
            <button onClick={() => setMealQty(Math.max(0, mealQty - 1))}>
              -
            </button>
            <span>{mealQty}</span>
            <button onClick={() => setMealQty(mealQty + 1)}>+</button>
          </div>
        </div>

        <hr />

        <div className="total-row">
          <div className="total-text">
            <strong>Total:</strong>
            <span>{total.toLocaleString()} VND</span>
          </div>
          <button className="book-now-btn" onClick={handleSubmit}>
            BOOK NOW
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingCheckout;