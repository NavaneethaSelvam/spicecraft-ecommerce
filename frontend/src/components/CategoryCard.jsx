
import React from "react";
import { Link } from "react-router-dom";

const CategoryCard = ({ category }) => {
  if (!category) return null;

  const {
    id,
    name,
    image,
    description,
    productCount,
  } = category;

  const shopLink = `/shop?category=${encodeURIComponent(id ?? "")}`;

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-[#eadfd5] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link
        to={shopLink}
        className="relative block aspect-[4/3] overflow-hidden bg-[#f5eee5]"
        aria-label={`Explore ${name}`}
      >
        <img
          src={image || "/images/category-placeholder.jpg"}
          alt={name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/images/category-placeholder.jpg";
          }}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <span className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-4">
          <span className="rounded-lg bg-[#fffaf5] px-3 py-2 text-xs font-bold text-[#6b3d24] transition group-hover:bg-[#6b3d24] group-hover:text-white">
            Explore →
          </span>
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <h3 className="text-base font-bold text-[#382316] sm:text-lg">
          {name}
        </h3>

        {description && (
          <p className="mt-2 line-clamp-3 text-sm leading-5 text-gray-600">
            {description}
          </p>
        )}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4">
          {productCount !== undefined && (
            <span className="text-xs text-gray-500">
              {productCount} Products
            </span>
          )}

          <Link
            to={shopLink}
            className="text-sm font-bold text-[#6b3d24] transition hover:text-[#382316]"
          >
            View Category →
          </Link>
        </div>
      </div>
    </article>
  );
};

export default CategoryCard;