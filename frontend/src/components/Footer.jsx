import React from "react";
import { FaInstagram, FaFacebookF, FaPinterestP, FaLinkedinIn } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand */}
        <div className="footer-brand">
          <h2>SPICECRAFT</h2>

          <p className="footer-tagline">
            From Indian Spices to Extraordinary Meals.
          </p>

          <p>
            Discover authentic flavours crafted for everyday cooking.
          </p>

          {/* Social Media */}
          <div className="footer-socials">
            <a href="#" aria-label="Instagram">
              <FaInstagram />
            </a>

            <a href="#" aria-label="Facebook">
              <FaFacebookF />
            </a>

            <a href="#" aria-label="Pinterest">
              <FaPinterestP />
            </a>

            <a href="#" aria-label="LinkedIn">
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* Explore */}
        <div className="footer-column">
          <h3>Explore</h3>

          <a href="/">Home</a>
          <a href="/shop">Shop</a>
          <a href="/recipes">Recipes</a>
          <a href="/blog">Blog</a>
          <a href="/about">About</a>
        </div>

        {/* Customer Care */}
        <div className="footer-column">
          <h3>Customer Care</h3>

          <a href="/cart">My Cart</a>
          <a href="/order-tracking">Track Order</a>
          <a href="/bulk-order">Bulk Orders</a>
          <a href="/export-enquiry">Export Enquiry</a>
        </div>

        {/* Contact */}
        <div className="footer-column footer-contact">
          <h3>Get In Touch</h3>

          <p>Coimbatore, Tamil Nadu, India</p>
          <p>+91 98765 43210</p>
          <p>hello@spicecraft.in</p>
        </div>

      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p className="footer-slogan">
          Fresh Spices. Authentic Taste.
        </p>

        <p>
          © 2026 SpiceCraft. All rights reserved.
        </p>

        <div className="footer-legal">
          <a href="/privacy-policy">Privacy Policy</a>
          <a href="/terms">Terms & Conditions</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;