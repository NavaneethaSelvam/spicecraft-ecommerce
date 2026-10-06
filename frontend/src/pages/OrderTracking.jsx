import { useState } from "react";

const steps = [
  "Placed",
  "Under Review",
  "Confirmed",
  "Shipped",
  "Delivered",
];

export default function OrderTracking() {
  const [tracking, setTracking] = useState(false);

  return (
    <main className="page tracking-page">
      <div className="page-heading">
        <span className="eyebrow">SPICECRAFT DELIVERY</span>
        <h1>Track Your Order</h1>
        <p>Enter your order details to check the latest status.</p>
      </div>

      <div className="tracking-box">
        <input placeholder="Order ID" />
        <input placeholder="Phone Number" />

        <button
          className="btn btn-primary"
          onClick={() => setTracking(true)}
        >
          Track Order
        </button>
      </div>

      {tracking && (
        <div className="timeline">
          {steps.map((step, index) => (
            <div className="timeline-item" key={step}>
              <div className="timeline-dot">{index + 1}</div>

              <div>
                <h3>{step}</h3>
                <p>
                  {index === 0
                    ? "Your order has been successfully placed."
                    : "Waiting for the next update."}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}