import React from "react";

const WhatsAppButton = ({
  phoneNumber = "919999999999",
  message = "Hello SpiceCraft, I need help with my order.",
}) => {
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-button"
      aria-label="Chat with us on WhatsApp"
    >
      <span className="whatsapp-icon">💬</span>
      <span className="whatsapp-text">Chat with us</span>
    </a>
  );
};

export default WhatsAppButton;