
import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import "./HeroCarousel.css";

const fallbackSlides = [
  {
    id: "fallback-1",
    tag: "AUTHENTIC INDIAN FLAVOURS",
    title: "A Little Spice Can\nChange Everything.",
    description:
      "Discover premium spices and handcrafted masalas made to bring rich aroma and authentic flavour to every meal.",
    image: "/images/hero-spices-1.jpg",
    button: "Shop Spices",
    link: "/shop",
  },
  {
    id: "fallback-2",
    tag: "CRAFTED WITH CARE",
    title: "Bring Home\nThe Taste of India.",
    description:
      "Carefully selected spices and traditional blends created for delicious everyday cooking.",
    image: "/images/hero-spices-2.jpg",
    button: "Explore Masalas",
    link: "/shop?category=masala",
  },
  {
    id: "fallback-3",
    tag: "RICH AROMA • BOLD FLAVOUR",
    title: "Make Every Dish\nExtraordinary.",
    description:
      "From biryani to sambar, discover the perfect spice blend for every dish you love.",
    image: "/images/hero-spices-3.jpg",
    button: "Find Your Spice",
    link: "/shop",
  },
  {
    id: "fallback-4",
    tag: "COOK • CREATE • ENJOY",
    title: "Turn Every Meal\nInto A Memory.",
    description:
      "Quality spices that help you cook with confidence and bring everyone together around great food.",
    image: "/images/hero-spices-4.jpg",
    button: "Discover Flavours",
    link: "/shop",
  },
];

function HeroCarousel() {
  const [slides, setSlides] = useState(fallbackSlides);
  const [activeSlide, setActiveSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mediaLoaded, setMediaLoaded] = useState(false);

  const loadHeroImages = useCallback(async () => {
    try {
      const response = await api.get("/media", {
        params: { section: "hero" },
      });

      const responseData = response.data;

      const data = Array.isArray(responseData)
        ? responseData
        : responseData?.items ?? responseData?.media ?? [];

      const dynamicSlides = data
        .filter(
          (item) =>
            item.is_active !== false &&
            Boolean(item.image_url)
        )
        .map((item, index) => ({
          id: item.id ?? `hero-${index}`,
          tag: item.tag || "AUTHENTIC INDIAN FLAVOURS",
          title: item.title || "Bring Home\nThe Taste of India.",
          description:
            item.description ||
            "Discover premium spices and handcrafted masalas made to bring rich aroma and authentic flavour to every meal.",
          image: item.image_url,
          alt: item.alt_text || item.title || "Authentic Indian spices",
          button: item.button_text || "Shop Spices",
          link: item.link || "/shop",
        }));

      // Important: empty array-um set pannanum.
      // Ella Hero images-um inactive na old fallback slides show aagadhu.
      setSlides(dynamicSlides);
      setActiveSlide(0);
      setMediaLoaded(true);
    } catch (error) {
      console.error("Unable to load hero images:", error);

      // API fail aana mattum fallback slides use pannuvom.
      // API success + zero active images na empty state show aagum.
      setSlides((currentSlides) =>
        mediaLoaded ? currentSlides : fallbackSlides
      );
    } finally {
      setLoading(false);
    }
  }, [mediaLoaded]);

  useEffect(() => {
    loadHeroImages();
  }, [loadHeroImages]);

  // Admin-la changes pannitu homepage tab-ku thirumbina refresh.
  useEffect(() => {
    const handleFocus = () => {
      loadHeroImages();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadHeroImages();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [loadHeroImages]);

  useEffect(() => {
    if (slides.length < 2) return undefined;

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 2000);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  const previousSlide = () => {
    setActiveSlide(
      (current) => (current - 1 + slides.length) % slides.length
    );
  };

  const nextSlide = () => {
    setActiveSlide((current) => (current + 1) % slides.length);
  };

  // Loading state
  if (loading) {
    return (
      <section
        className="hero-carousel"
        aria-label="Loading hero images"
      />
    );
  }

  // API returned successfully, but there are no active Hero images.
  if (mediaLoaded && slides.length === 0) {
    return (
      <section
        className="hero-carousel"
        aria-label="Hero images unavailable"
      />
    );
  }

  const slide = slides[activeSlide];

  if (!slide) return null;

  return (
    <section className="hero-carousel">
      <div className="hero-image-wrapper">
        <img
          key={slide.image}
          src={slide.image}
          alt={slide.alt || slide.title.replace(/\n/g, " ")}
          className="hero-image"
          onError={(event) => {
            const image = event.currentTarget;
            image.onerror = null;
            image.src = "/images/hero-placeholder.jpg";
          }}
        />
      </div>

      <div className="hero-dark-overlay" />

      <div className="hero-container">
        <div className="hero-content">
          <span className="hero-tag">{slide.tag}</span>

          <h1>
            {slide.title.split("\n").map((line, index, lines) => (
              <React.Fragment key={`${line}-${index}`}>
                {line}
                {index < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </h1>

          <p>{slide.description}</p>

          <div className="hero-actions">
            <Link to={slide.link} className="hero-primary-btn">
              {slide.button}
              <span>→</span>
            </Link>

            <Link to="/recipes" className="hero-secondary-btn">
              Explore Recipes
            </Link>
          </div>
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            className="hero-navigation hero-prev"
            onClick={previousSlide}
            aria-label="Previous slide"
          >
            ←
          </button>

          <button
            type="button"
            className="hero-navigation hero-next"
            onClick={nextSlide}
            aria-label="Next slide"
          >
            →
          </button>
        </>
      )}
    </section>
  );
}

export default HeroCarousel;
