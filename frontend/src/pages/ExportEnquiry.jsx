import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ExportEnquiry.css";

const ExportEnquiry = () => {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    country: "",
    product: "",
    quantity: "",
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
      country: "",
      product: "",
      quantity: "",
      message: "",
    });
  };

  return (
    <main className="export-page">

      {/* Hero */}
      <section className="export-hero">
        <div className="export-hero-content">
          <span className="eyebrow">GLOBAL SOURCING</span>

          <h1>
            Bringing Indian
            <span> Spices Worldwide.</span>
          </h1>

          <p>
            Looking to source authentic Indian spices for your
            international business? Send us your requirements.
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="export-intro">
        <div className="export-intro-content">

          <div className="export-intro-text">
            <span className="eyebrow">EXPORT ENQUIRY</span>

            <h2>
              Authentic flavours,
              <span> beyond borders.</span>
            </h2>

            <p>
              SpiceCraft connects businesses with quality Indian spices
              for international sourcing requirements.
            </p>

            <p>
              Share your country, product requirements and estimated
              quantity. Our team can review your enquiry and get back
              to you with the next steps.
            </p>
          </div>

          <div className="export-highlights">

            <div className="export-highlight">
              <strong>01</strong>
              <h3>Indian Spices</h3>
              <p>
                Authentic spice products from Indian cuisine.
              </p>
            </div>

            <div className="export-highlight">
              <strong>02</strong>
              <h3>Bulk Sourcing</h3>
              <p>
                Requirements for international businesses.
              </p>
            </div>

            <div className="export-highlight">
              <strong>03</strong>
              <h3>Global Enquiries</h3>
              <p>
                Enquiries from businesses across countries.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Form */}
      <section className="export-form-section">

        <div className="export-form-wrapper">

          <div className="export-form-heading">
            <span className="eyebrow">GET IN TOUCH</span>

            <h2>
              Tell us about
              <span> your requirement.</span>
            </h2>

            <p>
              Please provide your business and product requirements
              so our team can understand your enquiry.
            </p>
          </div>

          {submitted && (
            <div className="export-success">
              Your export enquiry has been submitted successfully.
              Our team will contact you soon.
            </div>
          )}

          <form
            className="export-form"
            onSubmit={handleSubmit}
          >

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
                <label>Company Name</label>

                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Enter company name"
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
                <label>Country</label>

                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Enter your country"
                  required
                />
              </div>

              <div className="form-group">
                <label>Product Requirement</label>

                <select
                  name="product"
                  value={formData.product}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select product
                  </option>

                  <option value="Masala Powders">
                    Masala Powders
                  </option>

                  <option value="Spice Blends">
                    Spice Blends
                  </option>

                  <option value="Whole Spices">
                    Whole Spices
                  </option>

                  <option value="Curry Pastes">
                    Curry Pastes
                  </option>

                  <option value="Podis">
                    Podis
                  </option>

                  <option value="Pickles">
                    Pickles
                  </option>

                  <option value="Multiple Products">
                    Multiple Products
                  </option>
                </select>
              </div>

            </div>

            <div className="form-group">
              <label>Estimated Quantity</label>

              <select
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select quantity
                </option>

                <option value="10-25 kg">
                  10 - 25 kg
                </option>

                <option value="25-50 kg">
                  25 - 50 kg
                </option>

                <option value="50-100 kg">
                  50 - 100 kg
                </option>

                <option value="100-500 kg">
                  100 - 500 kg
                </option>

                <option value="500+ kg">
                  500+ kg
                </option>
              </select>
            </div>

            <div className="form-group">
              <label>Additional Requirements</label>

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your requirements..."
                rows="6"
              ></textarea>
            </div>

            <button
              type="submit"
              className="export-submit-btn"
            >
              Submit Export Enquiry
            </button>

          </form>
        </div>

      </section>

      {/* Bottom CTA */}
      <section className="export-bottom">

        <span className="eyebrow">
          BULK BUSINESS
        </span>

        <h2>
          Need spices for your
          <span> local business?</span>
        </h2>

        <p>
          For restaurants, retailers, hotels and catering businesses,
          explore our bulk order options.
        </p>

        <Link
          to="/bulk-order"
          className="export-bulk-btn"
        >
          Explore Bulk Orders
        </Link>

      </section>

    </main>
  );
};

export default ExportEnquiry;