import React from "react";
import { Link } from "react-router-dom";

import "./CategoryCard.css";

const CategoryCard = ({ category }) => {
  if (!category) return null;

  const {
    id,
    name,
    image,
    description,
    productCount,
  } = category;

  return (
    <article className="category-card">

      {/* Category Image */}
      <Link
        to={`/shop?category=${id}`}
        className="category-image"
      >
        <img
          src={image}
          alt={name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src =
              "/images/category-placeholder.jpg";
          }}
        />

        <span className="category-overlay">
          Explore
        </span>
      </Link>


      {/* Category Content */}
      <div className="category-content">

        <h3>{name}</h3>

        {description && (
          <p>{description}</p>
        )}

        <div className="category-bottom">

          {productCount !== undefined && (
            <span className="category-count">
              {productCount} Products
            </span>
          )}

          <Link
            to={`/shop?category=${id}`}
            className="category-link"
          >
            Explore →
          </Link>

        </div>

      </div>

    </article>
  );
};

export default CategoryCard;