import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const categories = [
  "Masala Powders",
  "Spice Blends",
  "Curry Pastes",
  "Podis",
  "Pickles",
  "Pure Spices",
];

const dishes = ["Biryani", "Sambar", "Rasam", "Kulambu", "Varuval", "Idli & Dosa"];

const products = [
  { name: "Chicken Biryani Masala", price: 149, spice: "🌶️🌶️" },
  { name: "Chettinad Masala", price: 129, spice: "🌶️🌶️🌶️" },
  { name: "Sambar Powder", price: 99, spice: "🌶️" },
  { name: "Garlic Podi", price: 89, spice: "🌶️🌶️" },
];

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow">AUTHENTIC • FRESH • INDIAN</span>

          <h1>
            Bring the Soul of Indian
            <span> Spices </span>
            to Your Kitchen.
          </h1>

          <p>
            Premium masalas crafted with carefully selected Indian spices
            to turn everyday cooking into extraordinary meals.
          </p>

          <div className="hero-buttons">
            <Link to="/shop" className="btn btn-primary">
              Explore Spices
            </Link>

            <Link to="/recipes" className="btn btn-outline">
              Discover Recipes
            </Link>
          </div>
        </div>

        <div className="hero-spice">
          <div className="spice-circle">🌶️</div>
          <div className="spice-small spice-one">🌿</div>
          <div className="spice-small spice-two">🫚</div>
          <div className="spice-small spice-three">✨</div>
        </div>
      </section>

      <section className="section">
        <SectionTitle
          eyebrow="EXPLORE"
          title="Shop by Category"
          text="Discover the flavours that make every Indian kitchen special."
        />

        <div className="category-grid">
          {categories.map((item, index) => (
            <motion.div
              className="category-card"
              key={item}
              whileHover={{ y: -8 }}
            >
              <div className="category-icon">
                {["🌶️", "🫙", "🥣", "🌿", "🥭", "🧂"][index]}
              </div>
              <h3>{item}</h3>
              <Link to="/shop">Explore →</Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section beige-section">
        <SectionTitle
          eyebrow="COOK SOMETHING SPECIAL"
          title="Shop by Dish"
          text="Find the right spice for your favourite dishes."
        />

        <div className="dish-grid">
          {dishes.map((dish) => (
            <Link to="/shop" className="dish-card" key={dish}>
              <span>🍛</span>
              <h3>{dish}</h3>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <SectionTitle
          eyebrow="CUSTOMER FAVOURITES"
          title="Best Sellers"
          text="Our most-loved spices, chosen for authentic flavour."
        />

        <div className="product-grid">
          {products.map((product) => (
            <motion.article
              className="product-card"
              key={product.name}
              whileHover={{ y: -7 }}
            >
              <div className="product-image">🌶️</div>
              <div className="product-info">
                <span className="spice-level">{product.spice}</span>
                <h3>{product.name}</h3>
                <p>Freshly crafted Indian spice blend.</p>

                <div className="product-bottom">
                  <strong>₹{product.price}</strong>
                  <Link to="/product/1">View</Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="story-section">
        <div>
          <span className="eyebrow">FROM SPICE TO PLATE</span>
          <h2>Three simple steps to extraordinary meals.</h2>
        </div>

        <div className="story-steps">
          <StoryStep number="01" title="Select the Spice" text="Choose the perfect blend for your dish." />
          <StoryStep number="02" title="Cook with Confidence" text="Balanced spices make cooking simple." />
          <StoryStep number="03" title="Enjoy the Meal" text="Bring everyone together around great food." />
        </div>
      </section>

      <section className="trust-section">
        <SectionTitle
          eyebrow="WHY SPICECRAFT"
          title="Good Food Starts with Good Spices"
          text="Carefully selected ingredients. Thoughtfully crafted blends."
        />

        <div className="trust-grid">
          <Trust icon="🌿" title="Quality Ingredients" />
          <Trust icon="🔥" title="Freshly Roasted" />
          <Trust icon="✓" title="No Unnecessary Additives" />
          <Trust icon="🔒" title="Secure Ordering" />
        </div>
      </section>
    </main>
  );
}

function SectionTitle({ eyebrow, title, text }) {
  return (
    <div className="section-title">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}

function StoryStep({ number, title, text }) {
  return (
    <div className="story-step">
      <span>{number}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

function Trust({ icon, title }) {
  return (
    <div className="trust-card">
      <span>{icon}</span>
      <h3>{title}</h3>
    </div>
  );
}