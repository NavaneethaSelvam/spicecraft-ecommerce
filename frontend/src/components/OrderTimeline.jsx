import React from "react";

const OrderTimeline = ({ currentStatus = "Placed" }) => {
  const steps = [
    {
      id: "Placed",
      title: "Order Placed",
      icon: "🛒",
    },
    {
      id: "Confirmed",
      title: "Confirmed",
      icon: "✓",
    },
    {
      id: "Packed",
      title: "Packed",
      icon: "📦",
    },
    {
      id: "Shipped",
      title: "Shipped",
      icon: "🚚",
    },
    {
      id: "Delivered",
      title: "Delivered",
      icon: "🏠",
    },
  ];

  const currentIndex = steps.findIndex(
    (step) => step.id === currentStatus
  );

  return (
    <div className="order-timeline">
      {steps.map((step, index) => {
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div
            key={step.id}
            className={`timeline-step ${
              isCompleted ? "completed" : ""
            } ${isCurrent ? "current" : ""}`}
          >
            <div className="timeline-icon">
              {step.icon}
            </div>

            <div className="timeline-content">
              <h4>{step.title}</h4>

              {isCurrent && (
                <span>Current Status</span>
              )}
            </div>

            {index < steps.length - 1 && (
              <div className="timeline-line" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OrderTimeline;