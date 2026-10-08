import React from "react";
import "./CheckoutSummary.css";

const CheckoutSummary = ({
  subtotal = 0,
  deliveryFee = 0,
  discount = 0,
  onCheckout,
}) => {
  const total = subtotal + deliveryFee - discount;

  return (
    <div className="checkout-summary">
      <h2>Order Summary</h2>

      <div className="summary-row">
        <span>Subtotal</span>
        <span>₹{subtotal}</span>
      </div>

      <div className="summary-row">
        <span>Delivery</span>
        <span>
          {deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}
        </span>
      </div>

      {discount > 0 && (
        <div className="summary-row discount-row">
          <span>Discount</span>
          <span>-₹{discount}</span>
        </div>
      )}

      <div className="summary-total">
        <span>Total</span>
        <strong>₹{total}</strong>
      </div>

      <button
        type="button"
        className="checkout-summary-btn"
        onClick={onCheckout}
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default CheckoutSummary;