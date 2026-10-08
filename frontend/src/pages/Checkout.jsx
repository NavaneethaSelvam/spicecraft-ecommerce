import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Checkout.css";

const Checkout = () => {
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.pincode
    ) {
      alert("Please fill all required fields.");
      return;
    }

    navigate("/order-tracking");
  };

  return (
    <main className="checkout-page">

      <div className="checkout-heading">
        <span className="checkout-eyebrow">SPICECRAFT CHECKOUT</span>
        <h1>Complete Your Order</h1>
        <p>Enter your delivery details and choose your payment method.</p>
      </div>

      <form className="checkout-layout" onSubmit={handlePlaceOrder}>

        {/* LEFT SIDE */}
        <section className="checkout-form">

          <div className="checkout-card">
            <div className="checkout-section-title">
              <span>01</span>
              <div>
                <h2>Delivery Details</h2>
                <p>Where should we deliver your spices?</p>
              </div>
            </div>

            <div className="form-grid">

              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="form-group full">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group full">
                <label>Delivery Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="House / Door No, Street, Area"
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                />
              </div>

              <div className="form-group">
                <label>State *</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State"
                />
              </div>

              <div className="form-group">
                <label>Pincode *</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="6-digit pincode"
                />
              </div>

            </div>
          </div>

          {/* PAYMENT */}
          <div className="checkout-card">

            <div className="checkout-section-title">
              <span>02</span>
              <div>
                <h2>Payment Method</h2>
                <p>Select your preferred payment option.</p>
              </div>
            </div>

            <div className="payment-options">

              <label className={`payment-option ${paymentMethod === "cod" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />

                <div>
                  <strong>Cash on Delivery</strong>
                  <span>Pay when your order arrives</span>
                </div>
              </label>

              <label className={`payment-option ${paymentMethod === "online" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="payment"
                  value="online"
                  checked={paymentMethod === "online"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />

                <div>
                  <strong>Online Payment</strong>
                  <span>UPI / Card / Net Banking</span>
                </div>
              </label>

            </div>

          </div>

        </section>

        {/* RIGHT SIDE */}
        <aside className="checkout-summary">

          <h2>Order Summary</h2>

          <div className="checkout-product">
            <div>
              <strong>Chicken Biryani Masala</strong>
              <span>100g × 1</span>
            </div>
            <strong>₹149</strong>
          </div>

          <div className="checkout-product">
            <div>
              <strong>Sambar Powder</strong>
              <span>100g × 2</span>
            </div>
            <strong>₹198</strong>
          </div>

          <div className="checkout-divider"></div>

          <div className="checkout-summary-row">
            <span>Subtotal</span>
            <strong>₹347</strong>
          </div>

          <div className="checkout-summary-row">
            <span>Delivery</span>
            <strong>₹49</strong>
          </div>

          <div className="checkout-total">
            <span>Total</span>
            <strong>₹396</strong>
          </div>

          <button type="submit" className="place-order-btn">
            Place Order — ₹396
          </button>

          <Link to="/cart" className="back-cart">
            ← Back to Cart
          </Link>

          <p className="checkout-note">
            Secure checkout • Freshly packed • Delivered across India
          </p>

        </aside>

      </form>

    </main>
  );
};

export default Checkout;