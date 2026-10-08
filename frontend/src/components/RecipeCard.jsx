import React from "react";
import { Link } from "react-router-dom";

import "./RecipeCard.css";

const RecipeCard = ({ recipe }) => {
  if (!recipe) return null;

  const {
    id,
    title,
    image,
    description,
    cookingTime,
    difficulty,
    category,
  } = recipe;

  return (
    <article className="recipe-card">

      {/* Recipe Image */}
      <Link
        to={`/recipes/${id}`}
        className="recipe-card-image"
      >
        <img
          src={image}
          alt={title}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src =
              "/images/recipe-placeholder.jpg";
          }}
        />

        {difficulty && (
          <span className="recipe-difficulty">
            {difficulty}
          </span>
        )}
      </Link>


      {/* Recipe Content */}
      <div className="recipe-card-content">

        {category && (
          <span className="recipe-category">
            {category}
          </span>
        )}

        <Link
          to={`/recipes/${id}`}
          className="recipe-title"
        >
          {title}
        </Link>

        {description && (
          <p className="recipe-description">
            {description}
          </p>
        )}

        <div className="recipe-meta">

          {cookingTime && (
            <span className="recipe-time">
              ⏱ {cookingTime}
            </span>
          )}

          {difficulty && (
            <span className="recipe-level">
              🔥 {difficulty}
            </span>
          )}

        </div>

        <Link
          to={`/recipes/${id}`}
          className="recipe-view-btn"
        >
          View Recipe
          <span>→</span>
        </Link>

      </div>

    </article>
  );
};

export default RecipeCard;