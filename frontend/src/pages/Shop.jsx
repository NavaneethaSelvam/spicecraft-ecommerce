import { Link } from "react-router-dom";

const products = [
  "Chicken Biryani Masala",
  "Mutton Biryani Masala",
  "Sambar Powder",
  "Rasam Powder",
  "Chettinad Masala",
  "Garam Masala",
  "Curry Masala",
  "Idli Podi",
  "Garlic Podi",
  "Turmeric Powder",
  "Chilli Powder",
  "Coriander Powder",
];

export default function Shop() {
  return (
    <main className="page">
      <div className="page-heading">
        <span className="eyebrow">SPICECRAFT COLLECTION</span>
        <h1>Explore Our Spices</h1>
        <p>Authentic flavours crafted for your everyday cooking.</p>
      </div>

      <div className="shop-layout">
        <aside className="filter-sidebar">
          <h3>Filters</h3>

          <label>Price</label>
          <select>
            <option>All Prices</option>
            <option>Under ₹100</option>
            <option>₹100 - ₹200</option>
            <option>Above ₹200</option>
          </select>

          <label>Spice Level</label>
          <select>
            <option>All Levels</option>
            <option>Mild</option>
            <option>Medium</option>
            <option>Hot</option>
          </select>

          <label>Pack Size</label>
          <select>
            <option>All Sizes</option>
            <option>100g</option>
            <option>200g</option>
            <option>500g</option>
          </select>
        </aside>

        <section>
          <div className="shop-toolbar">
            <span>{products.length} products</span>
            <select>
              <option>Sort: Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Top Rated</option>
            </select>
          </div>

          <div className="product-grid">
            {products.map((name, index) => (
              <article className="product-card" key={name}>
                <div className="product-image">🌶️</div>

                <div className="product-info">
                  <span className="spice-level">🌶️🌶️</span>
                  <h3>{name}</h3>
                  <p>Premium Indian spice blend.</p>

                  <div className="rating">★★★★★ <small>(24)</small></div>

                  <div className="product-bottom">
                    <strong>₹{99 + index * 10}</strong>
                    <Link to={`/product/${index + 1}`}>View</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}