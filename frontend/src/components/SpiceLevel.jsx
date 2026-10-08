import React from "react";

const SpiceLevel = ({ level = "Medium" }) => {
  const spiceCount = {
    Mild: 1,
    Medium: 2,
    Hot: 3,
    ExtraHot: 4,
  };

  const count = spiceCount[level] || 1;

  return (
    <div className="spice-level">
      <span className="spice-label">Spice:</span>

      <div className="spice-icons">
        {[1, 2, 3, 4].map((item) => (
          <span
            key={item}
            className={item <= count ? "chilli active" : "chilli"}
          >
            🌶️
          </span>
        ))}
      </div>

      <span className="spice-name">{level}</span>
    </div>
  );
};

export default SpiceLevel;