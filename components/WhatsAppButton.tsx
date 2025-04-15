"use client"; // Mark as a Client Component

import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false); // State for hover
  const phoneNumber: string = "+918799448782"; // Replace with your WhatsApp number
  const message: string = "Hello, I need help with my order!"; // Optional: Prefilled message

  const whatsappUrl: string = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 1000,
      }}
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none", color: "green", position: "relative" }}
        onMouseEnter={() => setIsHovered(true)} // Set hover state to true
        onMouseLeave={() => setIsHovered(false)} // Set hover state to false
      >
        <FaWhatsapp size={50} />
        {/* Tooltip message */}
        {isHovered && (
          <span
            style={{
              position: "absolute",
              bottom: "125%",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "#333",
              color: "#fff",
              padding: "5px",
              borderRadius: "5px",
              fontSize: "14px",
              whiteSpace: "nowrap",
            }}
          >
            Need help? 
          </span>
        )}
      </a>
    </div>
  );
};

export default WhatsAppButton;