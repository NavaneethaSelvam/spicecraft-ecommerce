import React, { useMemo, useState } from "react";

import ProductGrid from "../components/ProductGrid";
import ProductFilter from "../components/ProductFilter";
import SortDropdown from "../components/SortDropdown";
import Pagination from "../components/Pagination";

import "./Shop.css";

// =====================================================
// PRODUCTS
// =====================================================

const products = [
  {
    id: 1,
    name: "Premium Red Chilli Powder",
    image: "/images/product-chilli-powder.jpg",
    price: 149,
    oldPrice: 179,
    rating: 4.8,
    category: "masala",
    weight: "100g",
  },
  {
    id: 2,
    name: "Turmeric Powder",
    image: "/images/product-turmeric.jpg",
    price: 99,
    oldPrice: 119,
    rating: 4.7,
    category: "masala",
    weight: "100g",
  },
  {
    id: 3,
    name: "Garam Masala",
    image: "/images/product-garam-masala.jpg",
    price: 179,
    oldPrice: 219,
    rating: 4.9,
    category: "masala",
    weight: "100g",
  },
  {
    id: 4,
    name: "Cumin Seeds",
    image: "/images/product-cumin.jpg",
    price: 129,
    rating: 4.6,
    category: "whole-spices",
    weight: "100g",
  },
  {
    id: 5,
    name: "Coriander Powder",
    image: "/images/product-coriander.jpg",
    price: 109,
    oldPrice: 129,
    rating: 4.7,
    category: "masala",
    weight: "100g",
  },
  {
    id: 6,
    name: "Chicken Masala",
    image: "/images/product-chicken-masala.jpg",
    price: 159,
    oldPrice: 189,
    rating: 4.8,
    category: "masala",
    weight: "100g",
  },
  {
    id: 7,
    name: "Black Pepper",
    image: "/images/product-black-pepper.jpg",
    price: 199,
    rating: 4.9,
    category: "whole-spices",
    weight: "100g",
  },
  {
    id: 8,
    name: "Biryani Masala",
    image: "/images/product-biryani-masala.jpg",
    price: 189,
    oldPrice: 229,
    rating: 4.9,
    category: "masala",
    weight: "100g",
  },
];

// =====================================================
// FILTER CATEGORIES
// =====================================================

const categories = [
  {
    id: "masala",
    name: "Masala Powders",
  },
  {
    id: "whole-spices",
    name: "Whole Spices",
  },
];

// =====================================================
// SHOP
// =====================================================

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPrice, setSelectedPrice] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");

  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 6;

  // =====================================================
  // FILTER + SORT
  // =====================================================

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category
    if (selectedCategory !== "all") {
      result = result.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Price
    if (selectedPrice === "under-250") {
      result = result.filter((product) => product.price < 250);
    }

    if (selectedPrice === "250-500") {
      result = result.filter(
        (product) =>
          product.price >= 250 && product.price <= 500
      );
    }

    if (selectedPrice === "500-1000") {
      result = result.filter(
        (product) =>
          product.price > 500 && product.price <= 1000
      );
    }

    if (selectedPrice === "above-1000") {
      result = result.filter(
        (product) => product.price > 1000
      );
    }

    // Rating
    if (selectedRating !== "all") {
      result = result.filter(
        (product) =>
          product.rating >= Number(selectedRating)
      );
    }

    // Sort
    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    if (sortBy === "popular") {
      result.sort((a, b) => b.rating - a.rating);
    }

    if (sortBy === "newest") {
      result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [
    selectedCategory,
    selectedPrice,
    selectedRating,
    sortBy,
  ]);

  // =====================================================
  // PAGINATION
  // =====================================================

  const totalPages = Math.ceil(
    filteredProducts.length / productsPerPage
  );

  const startIndex =
    (currentPage - 1) * productsPerPage;

  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  // =====================================================
  // FILTER HANDLERS
  // =====================================================

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  const handlePriceChange = (value) => {
    setSelectedPrice(value);
    setCurrentPage(1);
  };

  const handleRatingChange = (value) => {
    setSelectedRating(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const handleClearFilters = () => {
    setSelectedCategory("all");
    setSelectedPrice("all");
    setSelectedRating("all");
    setSortBy("default");
    setCurrentPage(1);
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <main className="shop-page">

      {/* =================================================
          SHOP HERO
      ================================================= */}

      <section className="shop-hero">

        <div className="shop-hero-overlay">

          <div className="shop-hero-content">

            <span className="shop-hero-label">
              SPICECRAFT COLLECTION
            </span>

            <h1>
              Explore Our
              <br />
              Signature Spices
            </h1>

            <p>
              Discover premium spices, handcrafted masalas
              and authentic Indian flavours for every kitchen.
            </p>

          </div>

        </div>

      </section>

      {/* =================================================
          SHOP SECTION
      ================================================= */}

      <section className="shop-section">

        <div className="shop-container">

          {/* HEADER */}

          <div className="shop-header">

            <div className="shop-header-content">

              <span className="shop-label">
                OUR COLLECTION
              </span>

              <h2>
                Shop Spices & Masalas
              </h2>

              <p>
                Carefully selected ingredients for rich aroma
                and authentic flavour.
              </p>

            </div>

            <div className="shop-count">

              <strong>
                {filteredProducts.length}
              </strong>

              <span>
                {filteredProducts.length === 1
                  ? " Product"
                  : " Products"}
              </span>

            </div>

          </div>

          {/* =================================================
              SHOP PRODUCTS AREA
          ================================================= */}

          <div className="shop-products-layout">

            {/* FILTER SIDEBAR */}

            <aside className="shop-filter-sidebar">

              <ProductFilter
                categories={categories}
                selectedCategory={selectedCategory}
                selectedPrice={selectedPrice}
                selectedRating={selectedRating}
                onCategoryChange={handleCategoryChange}
                onPriceChange={handlePriceChange}
                onRatingChange={handleRatingChange}
                onClear={handleClearFilters}
              />

            </aside>

            {/* PRODUCTS */}

            <div className="shop-products-content">

              {/* PRODUCT TOP BAR */}

              <div className="shop-products-topbar">

                <div className="shop-results">

                  <span>
                    Showing
                  </span>

                  <strong>
                    {" "}
                    {filteredProducts.length}
                  </strong>

                  <span>
                    {" "}
                    {filteredProducts.length === 1
                      ? "product"
                      : "products"}
                  </span>

                </div>

                <SortDropdown
                  value={sortBy}
                  onChange={handleSortChange}
                />

              </div>

              {/* PRODUCT GRID */}

              {paginatedProducts.length > 0 ? (

                <ProductGrid
                  products={paginatedProducts}
                />

              ) : (

                <div className="shop-empty">

                  <div className="shop-empty-line" />

                  <h3>
                    No products found
                  </h3>

                  <p>
                    Try adjusting your filters to discover
                    more SpiceCraft products.
                  </p>

                  <button
                    type="button"
                    onClick={handleClearFilters}
                  >
                    Clear Filters
                  </button>

                </div>

              )}

              {/* PAGINATION */}

              {totalPages > 1 && (

                <div className="shop-pagination">

                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />

                </div>

              )}

            </div>

          </div>

        </div>

      </section>

      {/* =================================================
          SHOP STORY
      ================================================= */}

      <section className="shop-story">

        <div className="shop-story-container">

          <div className="shop-story-content">

            <span>
              THE SPICECRAFT PROMISE
            </span>

            <h2>
              From carefully selected spices
              to your everyday kitchen.
            </h2>

            <p>
              We believe great food begins with great
              ingredients. Our spices are carefully selected
              and crafted to bring authentic Indian flavour
              to every meal.
            </p>

            <div className="shop-story-line" />

          </div>

          <div className="shop-story-image">

            <img
              src="/images/shop-story.jpg"
              alt="Indian spices"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />

          </div>

        </div>

      </section>

    </main>
  );
};

export default Shop;