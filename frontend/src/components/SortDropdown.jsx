import React from "react";
import "./SortDropdown.css";

const SortDropdown = ({
  value = "default",
  onChange,
}) => {
  return (
    <div className="sort-dropdown">

      <label htmlFor="sort-products">
        Sort By
      </label>

      <select
        id="sort-products"
        value={value}
        onChange={(e) =>
          onChange?.(e.target.value)
        }
      >
        <option value="default">
          Recommended
        </option>

        <option value="newest">
          Newest
        </option>

        <option value="popular">
          Popular
        </option>

        <option value="price-low">
          Price: Low to High
        </option>

        <option value="price-high">
          Price: High to Low
        </option>

        <option value="rating">
          Highest Rated
        </option>

      </select>

    </div>
  );
};

export default SortDropdown;