import React from "react";
import "./OrderSummary.css";

const OrderSummary = ({
  items = [],
  subtotal = 0,
  deliveryFee = 0,
  discount = 0,
}) => {
  const total = subtotal + deliveryFee - discount;

  return (
    <section className="order-summary">
      <div className="order-summary-header">
        <h2>Order Summary</h2>
        <span>{items.length} Items</span>
      </div>

      <div className="order-summary-items">
        {items.map((item) => (
          <div className="order-summary-item" key={item.id}>
            <div className="order-summary-item-image">
              <img
                src={item.image}
                alt={item.name}
                onError={(e) => {
                  e.currentTarget.src =
                    "/images/product-placeholder.jpg";
                }}
              />
            </div>

            <div className="order-summary-item-info">
              <h3>{item.name}</h3>

              {item.weight && (
                <span>{item.weight}</span>
              )}

              <p>
                Qty: {item.quantity || 1}
              </p>
            </div>

            <strong>
              ₹{item.price * (item.quantity || 1)}
            </strong>
          </div>
        ))}
      </div>

      <div className="order-summary-calculation">
        <div>
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>

        <div>
          <span>Delivery</span>
          <span>
            {deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}
          </span>
        </div>

        {discount > 0 && (
          <div className="order-discount">
            <span>Discount</span>
            <span>-₹{discount}</span>
          </div>
        )}
      </div>

      <div className="order-summary-total">
        <span>Total Amount</span>
        <strong>₹{total}</strong>
      </div>
    </section>
  );
};

export default OrderSummary;