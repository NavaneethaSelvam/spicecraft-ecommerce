import React from "react";
import "./ComparisonStrip.css";

const ComparisonStrip = () => {
  const features = [
    {
      icon: "🌿",
      title: "Premium Quality",
      text: "Carefully selected spices"
    },
    {
      icon: "🚚",
      title: "Fast Delivery",
      text: "Fresh products delivered safely"
    },
    {
      icon: "🔒",
      title: "Secure Shopping",
      text: "Safe & trusted checkout"
    },
    {
      icon: "🌶️",
      title: "Authentic Taste",
      text: "Traditional Indian flavors"
    }
  ];

  return (
    <section className="comparison-strip">
      <div className="comparison-container">
        {features.map((feature, index) => (
          <div className="comparison-item" key={index}>
            <div className="comparison-icon">{feature.icon}</div>

            <div className="comparison-content">
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ComparisonStrip;