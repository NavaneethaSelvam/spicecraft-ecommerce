import React from "react";
import { Link } from "react-router-dom";
import "./About.css";

const About = () => {
  return (
    <main className="about-page">

      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <span className="eyebrow">OUR STORY</span>

          <h1>
            Preserving India's
            <span> Spice Heritage.</span>
          </h1>

          <p>
            SpiceCraft brings traditional Indian spice wisdom together
            with modern convenience, helping every kitchen create
            authentic and memorable meals.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="about-story">
        <div className="about-story-image">
          <img
            src="/images/about-story.jpg"
            alt="Indian spices"
            onError={(e) => {
              e.currentTarget.src = "/images/product-placeholder.jpg";
            }}
          />
        </div>

        <div className="about-story-content">
          <span className="eyebrow">WHY SPICECRAFT</span>

          <h2>
            From traditional spice knowledge
            <span> to modern kitchens.</span>
          </h2>

          <p>
            Indian cooking has always been deeply connected to spices.
            Every region has its own flavours, techniques and traditions.
          </p>

          <p>
            At SpiceCraft, we bring these flavours together in carefully
            selected spice blends designed for everyday cooking.
          </p>

          <Link to="/shop" className="about-shop-btn">
            Explore Our Spices
          </Link>
        </div>
      </section>

      {/* Process Section */}
      <section className="about-process">
        <div className="about-section-heading">
          <span className="eyebrow">OUR PROCESS</span>

          <h2>
            From carefully selected ingredients
            <span> to your kitchen.</span>
          </h2>

          <p>
            Every SpiceCraft product follows a simple process focused
            on flavour, freshness and consistency.
          </p>
        </div>

        <div className="about-grid">

          <div className="about-card">
            <span className="about-number">01</span>

            <h3>Ingredient Selection</h3>

            <p>
              We believe great masala begins with carefully selected
              ingredients chosen for their flavour and quality.
            </p>
          </div>

          <div className="about-card">
            <span className="about-number">02</span>

            <h3>Roasting & Grinding</h3>

            <p>
              Carefully balanced roasting helps preserve the natural
              aroma and flavour of our spices.
            </p>
          </div>

          <div className="about-card">
            <span className="about-number">03</span>

            <h3>Made for Modern Kitchens</h3>

            <p>
              Authentic Indian flavours made simple for everyday
              cooking, from quick meals to traditional recipes.
            </p>
          </div>

        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <span className="eyebrow">OUR MISSION</span>

        <h2>
          Make authentic Indian cooking easier,
          <span> one spice at a time.</span>
        </h2>

        <p>
          We want to make quality Indian spices accessible to modern
          home cooks while respecting the traditions behind every blend.
        </p>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div>
          <span className="eyebrow">BRING FLAVOUR HOME</span>

          <h2>
            Your next memorable meal
            <span> starts with the right spice.</span>
          </h2>

          <Link to="/shop" className="about-cta-btn">
            Shop SpiceCraft
          </Link>
        </div>
      </section>

    </main>
  );
};

export default About;