import React from "react";

import "./TrustBadges.css";

const trustItems = [
  {
    icon: "🌿",
    title: "100% Authentic Spices",
    description: "Carefully selected for genuine Indian flavour.",
  },
  {
    icon: "📦",
    title: "Freshly Packed",
    description: "Packed with care to preserve aroma and freshness.",
  },
  {
    icon: "🚚",
    title: "Safe Delivery",
    description: "Secure packaging with reliable delivery across India.",
  },
  {
    icon: "🤝",
    title: "Quality You Can Trust",
    description: "Made with quality ingredients and consistent standards.",
  },
];

const TrustBadges = () => {
  return (
    <section className="trust-badges">
      <div className="container">

        <div className="trust-grid">
          {trustItems.map((item) => (
            <div className="trust-item" key={item.title}>

              <div className="trust-icon">
                {item.icon}
              </div>

              <div className="trust-content">
                <h3>{item.title}</h3>

                <p>{item.description}</p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TrustBadges;