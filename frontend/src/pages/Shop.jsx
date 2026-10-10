
import React, { useEffect, useMemo, useState } from "react";

import api from "../api";
import ProductGrid from "../components/ProductGrid";
import ProductFilter from "../components/ProductFilter";
import SortDropdown from "../components/SortDropdown";
import Pagination from "../components/Pagination";
import useCartStore from "../store/cartStore";

import "./Shop.css";

// SHOP CATEGORIES
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

// FORMAT BACKEND PRODUCT DATA
const formatProduct = (item, index) => {
  const rawCategory = String(item.category ?? "")
    .toLowerCase()
    .replace(/_/g, "-")
    .trim();

  const isWholeSpice =
    rawCategory.includes("whole-spice") ||
    rawCategory.includes("whole spice") ||
    rawCategory.includes("peppercorn") ||
    rawCategory.includes("seeds");

  const imagePath =
    item.image ??
    item.image_url ??
    item.imageUrl ??
    item.product_image ??
    "/images/product-placeholder.jpg";

  return {
    ...item,

    id: item.id ?? item.product_id ?? index + 1,

    name:
      item.name ??
      item.product_name ??
      item.title ??
      "SpiceCraft Product",

    image: imagePath,

    price: Number(
      item.price ??
        item.selling_price ??
        item.discount_price ??
        0
    ),

    oldPrice:
      item.oldPrice != null
        ? Number(item.oldPrice)
        : item.old_price != null
          ? Number(item.old_price)
          : item.original_price != null
            ? Number(item.original_price)
            : undefined,

    description: item.description ?? "",

    category: isWholeSpice ? "whole-spices" : "masala",

    stock: Number(item.stock ?? 0),

    rating: Number(item.rating ?? item.average_rating ?? 0),

    weight:
      item.weight ??
      item.weight_label ??
      item.quantity ??
      "100g",
  };
};

// SHOP PAGE
const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Connect Zustand cart store
  const addToCart = useCartStore((state) => state.addToCart);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPrice, setSelectedPrice] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");

  // Sorting and pagination
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 6;

  // FETCH PRODUCTS FROM BACKEND
  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/products");
        const responseData = response.data;

        const productList = Array.isArray(responseData)
          ? responseData
          : Array.isArray(responseData?.products)
            ? responseData.products
            : Array.isArray(responseData?.items)
              ? responseData.items
              : [];

        const activeProducts = productList.filter(
          (item) => item.is_active !== false
        );

        const formattedProducts = activeProducts.map(
          (item, index) => formatProduct(item, index)
        );

        if (isMounted) {
          setProducts(formattedProducts);
        }
      } catch (err) {
        console.error("Products API error:", err);

        if (isMounted) {
          setError(
            "Unable to load products. Please check the backend server and try again."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  // FILTER AND SORT PRODUCTS
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== "all") {
      result = result.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (selectedPrice === "under-250") {
      result = result.filter((product) => product.price < 250);
    }

    if (selectedPrice === "250-500") {
      result = result.filter(
        (product) => product.price >= 250 && product.price <= 500
      );
    }

    if (selectedPrice === "500-1000") {
      result = result.filter(
        (product) => product.price > 500 && product.price <= 1000
      );
    }

    if (selectedPrice === "above-1000") {
      result = result.filter((product) => product.price > 1000);
    }

    if (selectedRating !== "all") {
      result = result.filter(
        (product) => product.rating >= Number(selectedRating)
      );
    }

    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sortBy === "rating" || sortBy === "popular") {
      result.sort((a, b) => b.rating - a.rating);
    }

    if (sortBy === "newest") {
      result.sort((a, b) => {
        const dateA = a.created_at
          ? new Date(a.created_at).getTime()
          : 0;

        const dateB = b.created_at
          ? new Date(b.created_at).getTime()
          : 0;

        return dateB - dateA;
      });
    }

    return result;
  }, [
    products,
    selectedCategory,
    selectedPrice,
    selectedRating,
    sortBy,
  ]);

  // PAGINATION
  const totalPages = Math.ceil(
    filteredProducts.length / productsPerPage
  );

  const startIndex = (currentPage - 1) * productsPerPage;

  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  // FILTER HANDLERS
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

  // CLEAR FILTERS
  const handleClearFilters = () => {
    setSelectedCategory("all");
    setSelectedPrice("all");
    setSelectedRating("all");
    setSortBy("default");
    setCurrentPage(1);
  };

  // RENDER SHOP PAGE
  return (
    <main className="shop-page">
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

      <section className="shop-section">
        <div className="shop-container">
          <div className="shop-header">
            <div className="shop-header-content">
              <span className="shop-label">
                OUR COLLECTION
              </span>

              <h2>Shop Spices &amp; Masalas</h2>

              <p>
                Carefully selected ingredients for rich aroma
                and authentic flavour.
              </p>
            </div>

            <div className="shop-count">
              <strong>
                {loading ? "..." : filteredProducts.length}
              </strong>

              <span>
                {filteredProducts.length === 1
                  ? " Product"
                  : " Products"}
              </span>
            </div>
          </div>

          <div className="shop-products-layout">
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

            <div className="shop-products-content">
              <div className="shop-products-topbar">
                <div className="shop-results">
                  <span>Showing</span>{" "}

                  <strong>
                    {loading ? "..." : filteredProducts.length}
                  </strong>{" "}

                  <span>
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

              {loading && (
                <div className="shop-empty">
                  <h3>Loading SpiceCraft products...</h3>
                  <p>
                    Please wait while we fetch our products.
                  </p>
                </div>
              )}

              {!loading && error && (
                <div className="shop-empty" role="alert">
                  <h3>Products could not be loaded</h3>
                  <p>{error}</p>

                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                  >
                    Try Again
                  </button>
                </div>
              )}

              {!loading && !error && paginatedProducts.length > 0 && (
                <ProductGrid
                  products={paginatedProducts}
                  onAddToCart={addToCart}
                />
              )}

              {!loading &&
                !error &&
                paginatedProducts.length === 0 && (
                  <div className="shop-empty">
                    <div className="shop-empty-line" />

                    <h3>No products found</h3>

                    <p>
                      {products.length === 0
                        ? "No products are available in the database yet."
                        : "Try adjusting your filters to discover more SpiceCraft products."}
                    </p>

                    <button
                      type="button"
                      onClick={handleClearFilters}
                    >
                      Clear Filters
                    </button>
                  </div>
                )}

              {!loading && !error && totalPages > 1 && (
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

      <section className="shop-story">
        <div className="shop-story-container">
          <div className="shop-story-content">
            <span>THE SPICECRAFT PROMISE</span>

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
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Shop;