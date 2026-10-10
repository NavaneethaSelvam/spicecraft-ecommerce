
import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./OrderTracking.css";

const OrderTracking = () => {
  const location = useLocation();

  // Get the order passed from Checkout or saved in this browser session
  let savedOrder = null;

  try {
    const storedOrder = sessionStorage.getItem("spicecraftLatestOrder");
    savedOrder = storedOrder ? JSON.parse(storedOrder) : null;
  } catch (error) {
    console.error("Unable to read saved order:", error);
  }

  const order = location.state?.order || savedOrder;

  // No order has been placed in this session
  if (!order) {
    return (
      <main className="tracking-page">
        <div className="tracking-header">
          <span className="tracking-eyebrow">SPICECRAFT ORDERS</span>
          <h1>Order Tracking</h1>
          <p>Track your SpiceCraft order from packing to delivery.</p>
        </div>

        <section className="tracking-card tracking-empty">
          <h2>No recent order found</h2>
          <p>
            Place an order to view its details and track its status.
          </p>
          <Link to="/shop" className="tracking-btn primary">
            Explore Spices
          </Link>
        </section>
      </main>
    );
  }

  const orderDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Date unavailable";

  const paymentLabel =
    order.paymentMethod === "online"
      ? "Online Payment"
      : "Cash on Delivery";

  const stages = [
    {
      title: "Order Placed",
      description: "Your order details have been saved.",
    },
    {
      title: "Order Confirmed",
      description: "Your order is waiting for confirmation.",
    },
    {
      title: "Being Packed",
      description: "Your spices will be freshly packed.",
    },
    {
      title: "Shipped",
      description: "Your order will be handed over for delivery.",
    },
    {
      title: "Delivered",
      description: "Enjoy your authentic SpiceCraft flavours!",
    },
  ];

  // This demo currently confirms only that an order was placed.
  const currentStage = 0;

  return (
    <main className="tracking-page">
      <div className="tracking-header">
        <span className="tracking-eyebrow">SPICECRAFT ORDERS</span>
        <h1>Order Tracking</h1>
        <p>Track your spice order from packing to delivery.</p>
      </div>

      <section className="tracking-card">
        {/* Order information */}
        <div className="order-info">
          <div>
            <span>ORDER ID</span>
            <strong>#{order.orderId}</strong>
          </div>

          <div>
            <span>ORDER DATE</span>
            <strong>{orderDate}</strong>
          </div>

          <div>
            <span>PAYMENT</span>
            <strong>{paymentLabel}</strong>
          </div>
        </div>

        {/* Current status */}
        <div className="tracking-status">
          <span className="status-badge">ORDER PLACED</span>
          <h2>Thank you for your order!</h2>
          <p>
            Your SpiceCraft order has been recorded. You can review
            your order details below.
          </p>
        </div>

        {/* Order timeline */}
        <div className="order-timeline">
          {stages.map((stage, index) => {
            const completed = index < currentStage;
            const active = index === currentStage;

            return (
              <React.Fragment key={stage.title}>
                <div
                  className={`timeline-step ${
                    completed ? "completed" : ""
                  } ${active ? "active" : ""}`}
                >
                  <div className="timeline-dot" />

                  <div>
                    <h3>{stage.title}</h3>
                    <p>
                      {active
                        ? "Your order has been successfully placed."
                        : stage.description}
                    </p>
                  </div>
                </div>

                {index < stages.length - 1 && (
                  <div
                    className={`timeline-line ${
                      completed ? "completed" : ""
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Products ordered */}
        <div className="tracking-order-items">
          <h2>Items Ordered</h2>

          {(order.items || []).map((item, index) => (
            <div
              className="tracking-product"
              key={`${item.id}-${index}`}
            >
              <img
                src={
                  item.image ||
                  "/images/product-placeholder.jpg"
                }
                alt={item.name}
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src =
                    "/images/product-placeholder.jpg";
                }}
              />

              <div className="tracking-product-details">
                <strong>{item.name}</strong>
                <span>
                  ₹{Number(item.price || 0).toFixed(2)} ×{" "}
                  {item.quantity}
                </span>
              </div>

              <strong>
                ₹
                {(
                  Number(item.price || 0) *
                  Number(item.quantity || 0)
                ).toFixed(2)}
              </strong>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="tracking-total">
          <div>
            <span>Subtotal</span>
            <strong>
              ₹{Number(order.subtotal || 0).toFixed(2)}
            </strong>
          </div>

          <div>
            <span>Delivery</span>
            <strong>
              {Number(order.deliveryCharge || 0) === 0
                ? "FREE"
                : `₹${Number(order.deliveryCharge).toFixed(2)}`}
            </strong>
          </div>

          <div className="tracking-grand-total">
            <span>Total Amount</span>
            <strong>
              ₹{Number(order.total || 0).toFixed(2)}
            </strong>
          </div>
        </div>

        {/* Delivery address */}
        {order.customer && (
          <div className="tracking-address">
            <h2>Delivery Address</h2>
            <p>
              <strong>{order.customer.name}</strong>
            </p>
            <p>{order.customer.phone}</p>
            {order.customer.email && <p>{order.customer.email}</p>}
            <p>{order.customer.address}</p>
            <p>
              {order.customer.city}, {order.customer.state} -{" "}
              {order.customer.pincode}
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="tracking-actions">
          <Link to="/shop" className="tracking-btn primary">
            Continue Shopping
          </Link>

          <Link to="/" className="tracking-btn secondary">
            Back to Home
          </Link>
        </div>

        <p className="tracking-demo-note">
          Demo tracking: order status will not update automatically.
          Live delivery updates require backend integration.
        </p>
      </section>
    </main>
  );
};

export default OrderTracking;

