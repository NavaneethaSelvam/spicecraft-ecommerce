
import React from "react";
import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaFacebookF,
  FaPinterestP,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  const linkClass =
    "block py-1 text-sm text-stone-200 transition hover:text-white hover:translate-x-1";

  const headingClass =
    "mb-4 text-base font-bold text-white";

  return (
    <footer className="bg-[#382316] text-stone-200">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-5 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:gap-10 lg:px-8">
        {/* Brand */}
        <div>
          <Link to="/" className="inline-block">
            <h2 className="text-2xl font-extrabold tracking-[0.12em] text-white">
              SPICECRAFT
            </h2>
          </Link>

          <p className="mt-2 text-sm font-medium text-amber-200 font-semibold">
            From Indian Spices to Extraordinary Meals.
          </p>

          <p className="mt-3 max-w-xs text-sm leading-6">
            Discover authentic flavours crafted for everyday cooking.
          </p>

          {/* Social Media */}
          <div className="mt-5 flex gap-3">
            <a
              href="#"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#8a6a53] transition hover:bg-[#6b3d24] hover:text-white"
            >
              <FaInstagram />
            </a>

            <a
              href="#"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#8a6a53] transition hover:bg-[#6b3d24] hover:text-white"
            >
              <FaFacebookF />
            </a>

            <a
              href="#"
              aria-label="Pinterest"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#8a6a53] transition hover:bg-[#6b3d24] hover:text-white"
            >
              <FaPinterestP />
            </a>

            <a
              href="#"
              aria-label="LinkedIn"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#8a6a53] transition hover:bg-[#6b3d24] hover:text-white"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* Explore */}
        <div>
          <h3 className={headingClass}>Explore</h3>
          <nav className="flex flex-col">
            <Link to="/" className={linkClass}>Home</Link>
            <Link to="/shop" className={linkClass}>Shop</Link>
            <Link to="/recipes" className={linkClass}>Recipes</Link>
            <Link to="/blog" className={linkClass}>Blog</Link>
            <Link to="/about" className={linkClass}>About</Link>
          </nav>
        </div>

        {/* Customer Care */}
        <div>
          <h3 className={headingClass}>Customer Care</h3>
          <nav className="flex flex-col">
            <Link to="/cart" className={linkClass}>My Cart</Link>
            <Link to="/order-tracking" className={linkClass}>Track Order</Link>
            <Link to="/bulk-order" className={linkClass}>Bulk Orders</Link>
            <Link to="/export-enquiry" className={linkClass}>Export Enquiry</Link>
          </nav>
        </div>

        {/* Contact */}
        <div>
          <h3 className={headingClass}>Get In Touch</h3>
          <address className="space-y-3 text-sm not-italic leading-6">
            <p>Coimbatore, Tamil Nadu, India</p>
            <p>+91 98765 43210</p>
            <p>hello@spicecraft.in</p>
          </address>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-[#6b5140] px-5 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 text-center text-xs sm:text-sm lg:flex-row lg:justify-between">
          <p className="font-semibold text-white">
            Fresh Spices. Authentic Taste.
          </p>

          <p>© 2026 SpiceCraft. All rights reserved.</p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/privacy-policy"
              className="transition hover:text-white"
            >
              Privacy Policy
            </Link>

            <Link
              to="/terms"
              className="transition hover:text-white"
            >
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;