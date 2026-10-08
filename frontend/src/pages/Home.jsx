import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import HeroCarousel from "../components/HeroCarousel";

import "./Home.css";

// =====================================================
// SHOP BY CATEGORY
// =====================================================

const categories = [
  {
    name: "Masala Powders",
    image: "/images/category-masala-powders.jpg",
  },
  {
    name: "Spice Blends",
    image: "/images/category-spice-blends.jpg",
  },
  {
    name: "Curry Pastes",
    image: "/images/category-curry-pastes.jpg",
  },
  {
    name: "Podis",
    image: "/images/category-podis.jpg",
  },
  {
    name: "Pickles",
    image: "/images/category-pickles.jpg",
  },
  {
    name: "Pure Spices",
    image: "/images/category-pure-spices.jpg",
  },
];

// =====================================================
// SHOP BY DISH
// =====================================================

const dishes = [
  {
    name: "Biryani",
    image: "/images/dish-biryani.jpg",
  },
  {
    name: "Sambar",
    image: "/images/dish-sambar.jpg",
  },
  {
    name: "Rasam",
    image: "/images/dish-rasam.jpg",
  },
  {
    name: "Kulambu",
    image: "/images/dish-kulambu.jpg",
  },
  {
    name: "Varuval",
    image: "/images/dish-varuval.jpg",
  },
  {
    name: "Idli & Dosa",
    image: "/images/dish-idli-dosa.jpg",
  },
];

// =====================================================
// BEST SELLERS
// =====================================================

const products = [
  {
    id: 1,
    name: "Chicken Biryani Masala",
    price: 149,
    image: "/images/bestseller-chicken-biryani.jpg",
    spiceLevel: 2,
  },
  {
    id: 2,
    name: "Chettinad Masala",
    price: 129,
    image: "/images/bestseller-chettinad.jpg",
    spiceLevel: 3,
  },
  {
    id: 3,
    name: "Sambar Powder",
    price: 99,
    image: "/images/bestseller-sambar.jpg",
    spiceLevel: 1,
  },
  {
    id: 4,
    name: "Garlic Podi",
    price: 89,
    image: "/images/bestseller-garlic-podi.jpg",
    spiceLevel: 2,
  },
];

// =====================================================
// HOME
// =====================================================

export default function Home() {
  return (
    <main className="home-page">

      {/* =================================================
          HERO
      ================================================= */}

      <HeroCarousel />


      {/* =================================================
          SHOP BY CATEGORY
      ================================================= */}

      <section className="section home-category-section">

        <div className="section-container">

          <SectionTitle
            eyebrow="EXPLORE"
            title="Shop by Category"
            text="Discover the flavours that make every Indian kitchen special."
          />

          <div className="category-grid">

            {categories.map((item) => (
              <motion.div
                className="category-card"
                key={item.name}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.25 }}
              >

                <div className="category-image">

                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src =
                        "/images/category-placeholder.jpg";
                    }}
                  />

                </div>

                <div className="category-content">

                  <h3>{item.name}</h3>

                  <Link to="/shop">
                    Explore →
                  </Link>

                </div>

              </motion.div>
            ))}

          </div>

        </div>

      </section>


      {/* =================================================
          SHOP BY DISH
      ================================================= */}

      <section className="section beige-section">

        <div className="section-container">

          <SectionTitle
            eyebrow="COOK SOMETHING SPECIAL"
            title="Shop by Dish"
            text="Find the right spice for your favourite dishes."
          />

          <div className="dish-grid">

            {dishes.map((dish) => (

              <Link
                to="/shop"
                className="dish-card"
                key={dish.name}
              >

                <div className="dish-image">

                  <img
                    src={dish.image}
                    alt={dish.name}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src =
                        "/images/dish-placeholder.jpg";
                    }}
                  />

                </div>

                <div className="dish-content">

                  <h3>{dish.name}</h3>

                  <span className="dish-arrow">
                    →
                  </span>

                </div>

              </Link>

            ))}

          </div>

        </div>

      </section>


      {/* =================================================
          BEST SELLERS
      ================================================= */}

      <section className="section home-products-section">

        <div className="section-container">

          <SectionTitle
            eyebrow="CUSTOMER FAVOURITES"
            title="Best Sellers"
            text="Our most-loved spices, chosen for authentic flavour."
          />

          <div className="product-grid">

            {products.map((product) => (

              <motion.article
                className="product-card"
                key={product.id}
                whileHover={{ y: -7 }}
                transition={{ duration: 0.25 }}
              >

                <Link
                  to={`/product/${product.id}`}
                  className="product-image"
                >

                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src =
                        "/images/product-placeholder.jpg";
                    }}
                  />

                </Link>


                <div className="product-info">

                  <div className="spice-level">

                    <span>
                      Spice Level
                    </span>

                    <div className="spice-bars">

                      {[1, 2, 3, 4, 5].map((level) => (

                        <span
                          key={level}
                          className={
                            level <= product.spiceLevel
                              ? "active"
                              : ""
                          }
                        />

                      ))}

                    </div>

                  </div>


                  <h3>
                    {product.name}
                  </h3>


                  <p>
                    Freshly crafted Indian spice blend.
                  </p>


                  <div className="product-bottom">

                    <strong>
                      ₹{product.price}
                    </strong>

                    <Link
                      to={`/product/${product.id}`}
                    >
                      View
                    </Link>

                  </div>

                </div>

              </motion.article>

            ))}

          </div>


          <div className="section-action">

            <Link
              to="/shop"
              className="btn btn-primary"
            >
              View All Spices →
            </Link>

          </div>

        </div>

      </section>


      {/* =================================================
    FROM SPICE TO PLATE
================================================= */}

<section className="story-section">

  <div className="story-container">

    {/* LEFT IMAGE */}

    <div className="story-image">

      <img
        src="/images/spice-to-plate.jpg"
        alt="Fresh Indian spices and traditional cooking"
        loading="lazy"
        onError={(e) => {
          e.currentTarget.src =
            "/images/story-placeholder.jpg";
        }}
      />

      <div className="story-image-label">
        <span>SPICECRAFT</span>
        <strong>From Spice to Plate</strong>
      </div>

    </div>


    {/* RIGHT CONTENT */}

    <div className="story-content">

      <span className="eyebrow">
        FROM SPICE TO PLATE
      </span>

      <h2>
        Three simple steps to
        <span> extraordinary meals.</span>
      </h2>

      <p className="story-intro">
        Great food starts with the right spices.
        Choose, cook and enjoy authentic flavours
        with SpiceCraft.
      </p>


      <div className="story-steps">

        <StoryStep
          number="01"
          title="Select the Spice"
          text="Choose the perfect blend for your favourite dish."
        />

        <StoryStep
          number="02"
          title="Cook with Confidence"
          text="Balanced spices make every recipe simple and delicious."
        />

        <StoryStep
          number="03"
          title="Enjoy the Meal"
          text="Bring everyone together around a delicious homemade meal."
        />

      </div>

    </div>

  </div>

</section>

      {/* =================================================
          WHY SPICECRAFT
      ================================================= */}

      <section className="section trust-section">

        <div className="section-container">

          <SectionTitle
            eyebrow="WHY SPICECRAFT"
            title="Good Food Starts with Good Spices"
            text="Carefully selected ingredients. Thoughtfully crafted blends."
          />

          <div className="trust-grid">

            <Trust
              image="/images/trust-quality.jpg"
              title="Quality Ingredients"
              text="Carefully selected spices for authentic flavour."
            />

            <Trust
              image="/images/trust-roasted.jpg"
              title="Freshly Roasted"
              text="Roasted and blended to preserve aroma."
            />

            <Trust
              image="/images/trust-natural.jpg"
              title="No Unnecessary Additives"
              text="Simple and honest spice blends."
            />

            <Trust
              image="/images/trust-secure.jpg"
              title="Secure Ordering"
              text="Safe and reliable shopping experience."
            />

          </div>

        </div>

      </section>


      {/* =================================================
          FINAL CTA
      ================================================= */}

      <section className="home-cta">

        <div className="home-cta-overlay">

          <div className="home-cta-content">

            <span className="eyebrow">
              READY TO COOK?
            </span>

            <h2>
              Bring authentic Indian flavour
              to your kitchen.
            </h2>

            <p>
              Explore our collection of premium
              spices and masalas.
            </p>

            <Link
              to="/shop"
              className="btn btn-primary"
            >
              Explore Collection
              <span>→</span>
            </Link>

          </div>

        </div>

      </section>
    </main>
  );
}


// =====================================================
// SECTION TITLE
// =====================================================

function SectionTitle({
  eyebrow,
  title,
  text,
}) {
  return (
    <div className="section-title">

      <span className="eyebrow">
        {eyebrow}
      </span>

      <h2>
        {title}
      </h2>

      <p>
        {text}
      </p>

    </div>
  );
}


// =====================================================
// STORY STEP
// =====================================================

function StoryStep({
  number,
  title,
  text,
}) {
  return (
    <div className="story-step">

      <span className="story-number">
        {number}
      </span>

      <div>

        <h3>
          {title}
        </h3>

        <p>
          {text}
        </p>

      </div>

    </div>
  );
}


// =====================================================
// TRUST CARD
// =====================================================

function Trust({
  image,
  title,
  text,
}) {
  return (
    <div className="trust-card">

      <div className="trust-image">

        <img
          src={image}
          alt={title}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src =
              "/images/trust-placeholder.jpg";
          }}
        />

      </div>

      <h3>
        {title}
      </h3>

      <p>
        {text}
      </p>

    </div>
  );
}