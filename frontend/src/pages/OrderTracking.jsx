import React from "react";
import { Link } from "react-router-dom";
import "./OrderTracking.css";

const OrderTracking = () => {
  return (
    <main className="tracking-page">

      <div className="tracking-header">
        <span className="tracking-eyebrow">SPICECRAFT ORDERS</span>
        <h1>Order Tracking</h1>
        <p>Track your spice order from packing to delivery.</p>
      </div>

      <section className="tracking-card">

        <div className="order-info">
          <div>
            <span>ORDER ID</span>
            <strong>#SC10248</strong>
          </div>

          <div>
            <span>ORDER DATE</span>
            <strong>08 Oct 2026</strong>
          </div>

          <div>
            <span>PAYMENT</span>
            <strong>Cash on Delivery</strong>
          </div>
        </div>

        <div className="tracking-status">
          <span className="status-badge">ORDER CONFIRMED</span>
          <h2>Your spices are on their way!</h2>
          <p>
            Your order has been confirmed and will be packed fresh before
            dispatch.
          </p>
        </div>

        <div className="order-timeline">

          <div className="timeline-step completed">
            <div className="timeline-dot"></div>
            <div>
              <h3>Order Confirmed</h3>
              <p>Your order has been successfully placed.</p>
            </div>
          </div>

          <div className="timeline-line"></div>

          <div className="timeline-step completed">
            <div className="timeline-dot"></div>
            <div>
              <h3>Being Packed</h3>
              <p>Your spices are being freshly packed.</p>
            </div>
          </div>

          <div className="timeline-line"></div>

          <div className="timeline-step active">
            <div className="timeline-dot"></div>
            <div>
              <h3>Out for Delivery</h3>
              <p>Your order will be delivered to your address.</p>
            </div>
          </div>

          <div className="timeline-line"></div>

          <div className="timeline-step">
            <div className="timeline-dot"></div>
            <div>
              <h3>Delivered</h3>
              <p>Enjoy your authentic SpiceCraft flavours!</p>
            </div>
          </div>

        </div>

        <div className="tracking-actions">
          <Link to="/shop" className="tracking-btn primary">
            Continue Shopping
          </Link>

          <Link to="/" className="tracking-btn secondary">
            Back to Home
          </Link>
        </div>

      </section>

    </main>
  );
};

export default OrderTracking;