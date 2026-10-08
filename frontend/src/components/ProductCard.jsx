import React from "react";
import { Link } from "react-router-dom";

import RatingStars from "./RatingStars";
import SpiceLevel from "./SpiceLevel";

import "./ProductCard.css";

const ProductCard = ({ product, onAddToCart }) => {
  if (!product) return null;

  const {
    id,
    name,
    image,
    price,
    oldPrice,
    originalPrice,
    rating = 4.5,
    reviews = 0,
    spiceLevel,
    category,
    weight = "100g",
  } = product;

  const comparePrice = originalPrice || oldPrice;

  const discount =
    comparePrice && comparePrice > price
      ? Math.round(((comparePrice - price) / comparePrice) * 100)
      : 0;

  const handleAddToCart = () => {
    onAddToCart?.(product);
  };

  return (
    <article className="product-card">

      {/* Product Image */}
      <Link
        to={`/product/${id}`}
        className="product-card-image"
      >
        {discount > 0 && (
          <span className="product-discount">
            {discount}% OFF
          </span>
        )}

        <img
          src={image}
          alt={name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = "/images/product-placeholder.jpg";
          }}
        />
      </Link>

      {/* Product Content */}
      <div className="product-card-content">

        {category && (
          <span className="product-category">
            {category}
          </span>
        )}

        <Link
          to={`/product/${id}`}
          className="product-title"
        >
          {name}
        </Link>

        {/* Rating */}
        <div className="product-rating">
          <RatingStars rating={rating} />
          <span>
            {rating} ({reviews})
          </span>
        </div>

        {/* Spice Level */}
        {spiceLevel && (
          <SpiceLevel level={spiceLevel} />
        )}

        {/* Weight */}
        {weight && (
          <div className="product-weight">
            {weight}
          </div>
        )}

        {/* Price */}
        <div className="product-price">
          <span className="current-price">
            ₹{price}
          </span>

          {comparePrice && comparePrice > price && (
            <span className="original-price">
              ₹{comparePrice}
            </span>
          )}
        </div>

        {/* Add To Cart */}
        <button
          type="button"
          className="add-to-cart-btn"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>

      </div>
    </article>
  );
};

export default ProductCard;