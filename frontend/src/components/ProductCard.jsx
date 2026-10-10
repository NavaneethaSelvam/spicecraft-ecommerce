
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import RatingStars from "./RatingStars";
import SpiceLevel from "./SpiceLevel";
import "./ProductCard.css";

const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();

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
      ? Math.round(
          ((comparePrice - price) / comparePrice) * 100
        )
      : 0;

  const handleAddToCart = () => {
    if (typeof onAddToCart !== "function") {
      console.error(
        "Add to Cart error: onAddToCart function was not provided."
      );
      return;
    }

    onAddToCart(product);

    // Navigate to Cart after adding the product
    navigate("/cart");
  };

  return (
    <article className="product-card">
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
          src={image || "/images/product-placeholder.jpg"}
          alt={name}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src =
              "/images/product-placeholder.jpg";
          }}
        />
      </Link>

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

        <div className="product-rating">
          <RatingStars rating={rating} />
          <span>
            {rating} ({reviews})
          </span>
        </div>

        {spiceLevel && <SpiceLevel level={spiceLevel} />}

        {weight && (
          <div className="product-weight">{weight}</div>
        )}

        <div className="product-price">
          <span className="current-price">₹{price}</span>

          {comparePrice && comparePrice > price && (
            <span className="original-price">
              ₹{comparePrice}
            </span>
          )}
        </div>

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

