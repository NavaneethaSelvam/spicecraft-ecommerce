import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./HeroCarousel.css";

const slides = [
  {
    id: 1,
    tag: "AUTHENTIC INDIAN FLAVOURS",
    title: "A Little Spice Can\nChange Everything.",
    description:
      "Discover premium spices and handcrafted masalas made to bring rich aroma and authentic flavour to every meal.",
    image: "/images/hero-spices-1.jpg",
    button: "Shop Spices",
    link: "/shop",
  },
  {
    id: 2,
    tag: "CRAFTED WITH CARE",
    title: "Bring Home\nThe Taste of India.",
    description:
      "Carefully selected spices and traditional blends created for delicious everyday cooking.",
    image: "/images/hero-spices-2.jpg",
    button: "Explore Masalas",
    link: "/shop?category=masala",
  },
  {
    id: 3,
    tag: "RICH AROMA • BOLD FLAVOUR",
    title: "Make Every Dish\nExtraordinary.",
    description:
      "From biryani to sambar, discover the perfect spice blend for every dish you love.",
    image: "/images/hero-spices-3.jpg",
    button: "Find Your Spice",
    link: "/shop",
  },
  {
    id: 4,
    tag: "COOK • CREATE • ENJOY",
    title: "Turn Every Meal\nInto A Memory.",
    description:
      "Quality spices that help you cook with confidence and bring everyone together around great food.",
    image: "/images/hero-spices-4.jpg",
    button: "Discover Flavours",
    link: "/shop",
  },
];

const HeroCarousel = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((current) =>
        current === slides.length - 1 ? 0 : current + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const previousSlide = () => {
    setActiveSlide((current) =>
      current === 0 ? slides.length - 1 : current - 1
    );
  };

  const nextSlide = () => {
    setActiveSlide((current) =>
      current === slides.length - 1 ? 0 : current + 1
    );
  };

  const slide = slides[activeSlide];

  return (
    <section className="hero-carousel">

      {/* Background Image */}
      <div className="hero-image-wrapper">
        <img
          src={slide.image}
          alt={slide.title.replace("\n", " ")}
          className="hero-image"
          onError={(e) => {
            e.currentTarget.src =
              "/images/hero-placeholder.jpg";
          }}
        />
      </div>

      {/* Dark Overlay */}
      <div className="hero-dark-overlay"></div>

      {/* Main Content */}
      <div className="hero-container">
        <div className="hero-content">

          <span className="hero-tag">
            {slide.tag}
          </span>

          <h1>
            {slide.title.split("\n").map((line, index) => (
              <React.Fragment key={index}>
                {line}

                {index <
                  slide.title.split("\n").length - 1 && (
                  <br />
                )}
              </React.Fragment>
            ))}
          </h1>

          <p>
            {slide.description}
          </p>

          <div className="hero-actions">

            <Link
              to={slide.link}
              className="hero-primary-btn"
            >
              {slide.button}
              <span>→</span>
            </Link>

            <Link
              to="/recipes"
              className="hero-secondary-btn"
            >
              Explore Recipes
            </Link>

          </div>

        </div>
      </div>

      {/* Previous Button */}
      <button
        type="button"
        className="hero-navigation hero-prev"
        onClick={previousSlide}
        aria-label="Previous slide"
      >
        ←
      </button>

      {/* Next Button */}
      <button
        type="button"
        className="hero-navigation hero-next"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        →
      </button>

      {/* Slide Dots */}
      <div className="hero-dots">
        {slides.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={`hero-dot ${
              activeSlide === index ? "active" : ""
            }`}
            onClick={() => setActiveSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

    </section>
  );
};

export default HeroCarousel;