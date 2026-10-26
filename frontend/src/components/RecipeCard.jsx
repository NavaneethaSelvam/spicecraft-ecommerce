
import React from "react";
import { Link } from "react-router-dom";

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

  const recipeLink = `/recipes/${id}`;

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-[#eadfd5] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link
        to={recipeLink}
        className="relative block aspect-[4/3] overflow-hidden bg-[#f5eee5]"
        aria-label={`View ${title} recipe`}
      >
        <img
          src={image || "/images/recipe-placeholder.jpg"}
          alt={title || "Indian spice recipe"}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/images/recipe-placeholder.jpg";
          }}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        {difficulty && (
          <span className="absolute right-3 top-3 rounded-full bg-[#fffaf5] px-3 py-1 text-xs font-semibold text-[#6b3d24] shadow-sm">
            {difficulty}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        {category && (
          <span className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#98704f] sm:text-xs">
            {category}
          </span>
        )}

        <Link
          to={recipeLink}
          className="line-clamp-2 text-base font-bold leading-6 text-[#382316] transition hover:text-[#8b4a27] sm:text-lg"
        >
          {title}
        </Link>

        {description && (
          <p className="mt-2 line-clamp-3 text-sm leading-5 text-gray-600">
            {description}
          </p>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-4 text-xs text-gray-600 sm:text-sm">
          {cookingTime && (
            <span className="flex items-center gap-1">
              <span aria-hidden="true">⏱</span>
              {cookingTime}
            </span>
          )}

          {difficulty && (
            <span className="flex items-center gap-1">
              <span aria-hidden="true">🔥</span>
              {difficulty}
            </span>
          )}
        </div>

        <Link
          to={recipeLink}
          className="mt-4 flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#6b3d24] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#4b2918]"
        >
          View Recipe <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
};

export default RecipeCard;