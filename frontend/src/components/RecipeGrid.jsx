import React from "react";
import RecipeCard from "./RecipeCard";

import "./RecipeGrid.css";

const RecipeGrid = ({ recipes = [] }) => {
  if (recipes.length === 0) {
    return (
      <div className="recipe-empty">
        <p>No recipes available.</p>
      </div>
    );
  }

  return (
    <div className="recipe-grid">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
        />
      ))}
    </div>
  );
};

export default RecipeGrid;