import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./BulkOrder.css";

const BulkOrder = () => {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    quantity: "",
    requirement: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setSubmitted(true);

    setFormData({
      name: "",
      company: "",
      email: "",
      phone: "",
      quantity: "",
      requirement: "",
      message: "",
    });
  };

  return (
    <main className="bulk-page">

      {/* Hero */}
      <section className="bulk-hero">
        <div className="bulk-hero-content">
          <span className="eyebrow">BULK ORDERS</span>

          <h1>
            Spice Up Your
            <span> Business.</span>
          </h1>

          <p>
            Looking for quality Indian spices in larger quantities?
            Tell us what you need and our team will get back to you.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="bulk-intro">
        <div className="bulk-intro-content">
          <span className="eyebrow">FOR BUSINESS</span>

          <h2>
            Quality spices for
            <span> every scale.</span>
          </h2>

          <p>
            Whether you are a restaurant, retailer, caterer, hotel or
            food business, SpiceCraft can help you source authentic
            Indian spices for your requirements.
          </p>

          <div className="bulk-benefits">
            <div>
              <strong>01</strong>
              <h3>Bulk Quantities</h3>
              <p>Suitable quantities for growing businesses.</p>
            </div>

            <div>
              <strong>02</strong>
              <h3>Consistent Quality</h3>
              <p>Reliable spice quality across your orders.</p>
            </div>

            <div>
              <strong>03</strong>
              <h3>Business Support</h3>
              <p>Dedicated assistance for bulk requirements.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="bulk-form-section">
        <div className="bulk-form-wrapper">

          <div className="bulk-form-heading">
            <span className="eyebrow">SEND AN ENQUIRY</span>

            <h2>
              Tell us about
              <span> your requirement.</span>
            </h2>

            <p>
              Share your requirements and our team will contact you
              with the next steps.
            </p>
          </div>

          {submitted && (
            <div className="bulk-success">
              Your enquiry has been submitted successfully.
              Our team will contact you soon.
            </div>
          )}

          <form onSubmit={handleSubmit} className="bulk-form">

            <div className="form-row">

              <div className="form-group">
                <label>Your Name</label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Company / Business Name</label>

                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Enter business name"
                  required
                />
              </div>

            </div>

            <div className="form-row">

              <div className="form-group">
                <label>Email Address</label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  required
                />
              </div>

            </div>

            <div className="form-row">

              <div className="form-group">
                <label>Approximate Quantity</label>

                <select
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select quantity</option>
                  <option value="10-25 kg">10 - 25 kg</option>
                  <option value="25-50 kg">25 - 50 kg</option>
                  <option value="50-100 kg">50 - 100 kg</option>
                  <option value="100+ kg">100+ kg</option>
                </select>
              </div>

              <div className="form-group">
                <label>Requirement Type</label>

                <select
                  name="requirement"
                  value={formData.requirement}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select requirement</option>
                  <option value="Restaurant">
                    Restaurant
                  </option>
                  <option value="Retail">
                    Retail
                  </option>
                  <option value="Hotel">
                    Hotel
                  </option>
                  <option value="Catering">
                    Catering
                  </option>
                  <option value="Food Business">
                    Food Business
                  </option>
                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>

            </div>

            <div className="form-group">
              <label>Tell Us More</label>

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about the spices or products you need..."
                rows="6"
              ></textarea>
            </div>

            <button type="submit" className="bulk-submit-btn">
              Submit Enquiry
            </button>

          </form>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bulk-bottom">
        <span className="eyebrow">NEED SOMETHING ELSE?</span>

        <h2>
          Looking for
          <span> export solutions?</span>
        </h2>

        <p>
          For international sourcing and export requirements,
          visit our export enquiry page.
        </p>

        <Link to="/export-enquiry" className="bulk-export-btn">
          Export Enquiry
        </Link>
      </section>

    </main>
  );
};

export default BulkOrder;