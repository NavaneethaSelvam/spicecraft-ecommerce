import React from "react";
import "./ProductFilter.css";

const ProductFilter = ({
  categories = [],
  selectedCategory = "all",
  selectedPrice = "all",
  selectedRating = "all",
  onCategoryChange,
  onPriceChange,
  onRatingChange,
  onClear,
}) => {
  return (
    <aside className="product-filter">

      {/* HEADER */}

      <div className="filter-header">

        <div>
          <span className="filter-eyebrow">
            REFINE
          </span>

          <h2>Filters</h2>
        </div>

        <button
          type="button"
          onClick={onClear}
          className="filter-clear"
        >
          Clear All
        </button>

      </div>

      {/* CATEGORY */}

      <div className="filter-section">

        <h3>Category</h3>

        <div className="filter-options">

          <label className="filter-option">

            <input
              type="radio"
              name="category"
              value="all"
              checked={selectedCategory === "all"}
              onChange={(e) =>
                onCategoryChange?.(e.target.value)
              }
            />

            <span>All Products</span>

          </label>

          {categories.map((category) => (

            <label
              className="filter-option"
              key={category.id}
            >

              <input
                type="radio"
                name="category"
                value={category.id}
                checked={
                  selectedCategory === String(category.id)
                }
                onChange={(e) =>
                  onCategoryChange?.(e.target.value)
                }
              />

              <span>
                {category.name}
              </span>

            </label>

          ))}

        </div>

      </div>

      {/* PRICE */}

      <div className="filter-section">

        <h3>Price</h3>

        <div className="filter-options">

          <label className="filter-option">

            <input
              type="radio"
              name="price"
              value="all"
              checked={selectedPrice === "all"}
              onChange={(e) =>
                onPriceChange?.(e.target.value)
              }
            />

            <span>All Prices</span>

          </label>

          <label className="filter-option">

            <input
              type="radio"
              name="price"
              value="under-250"
              checked={selectedPrice === "under-250"}
              onChange={(e) =>
                onPriceChange?.(e.target.value)
              }
            />

            <span>Under ₹250</span>

          </label>

          <label className="filter-option">

            <input
              type="radio"
              name="price"
              value="250-500"
              checked={selectedPrice === "250-500"}
              onChange={(e) =>
                onPriceChange?.(e.target.value)
              }
            />

            <span>₹250 - ₹500</span>

          </label>

          <label className="filter-option">

            <input
              type="radio"
              name="price"
              value="500-1000"
              checked={selectedPrice === "500-1000"}
              onChange={(e) =>
                onPriceChange?.(e.target.value)
              }
            />

            <span>₹500 - ₹1000</span>

          </label>

          <label className="filter-option">

            <input
              type="radio"
              name="price"
              value="above-1000"
              checked={selectedPrice === "above-1000"}
              onChange={(e) =>
                onPriceChange?.(e.target.value)
              }
            />

            <span>Above ₹1000</span>

          </label>

        </div>

      </div>

      {/* RATING */}

      <div className="filter-section">

        <h3>Rating</h3>

        <div className="filter-options">

          {[4, 3, 2, 1].map((rating) => (

            <label
              className="filter-option filter-rating"
              key={rating}
            >

              <input
                type="radio"
                name="rating"
                value={rating}
                checked={
                  selectedRating === String(rating)
                }
                onChange={(e) =>
                  onRatingChange?.(e.target.value)
                }
              />

              <span className="rating-stars">
                {"★".repeat(rating)}
                {"☆".repeat(5 - rating)}
              </span>

              <small>& above</small>

            </label>

          ))}

        </div>

      </div>

    </aside>
  );
};

export default ProductFilter;