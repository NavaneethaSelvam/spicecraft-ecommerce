import React, { useEffect } from "react";

import "./Notification.css";

const Notification = ({
  message,
  type = "success",
  isVisible = false,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const icons = {
    success: "✓",
    error: "✕",
    warning: "!",
    info: "i",
  };

  return (
    <div
      className={`notification notification-${type}`}
      role="alert"
    >
      <div className="notification-icon">
        {icons[type] || "✓"}
      </div>

      <p className="notification-message">
        {message}
      </p>

      <button
        type="button"
        className="notification-close"
        onClick={onClose}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};

export default Notification;
