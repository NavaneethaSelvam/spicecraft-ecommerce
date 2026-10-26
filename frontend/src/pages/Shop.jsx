
import React, { useCallback, useEffect, useMemo, useState } from "react";

import api from "../api";
import ProductGrid from "../components/ProductGrid";
import ProductFilter from "../components/ProductFilter";
import SortDropdown from "../components/SortDropdown";
import Pagination from "../components/Pagination";

import "./Shop.css";

// =====================================================
// SHOP FILTER CATEGORIES
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
// NORMALIZE CATEGORY
// =====================================================

const normalizeCategory = (rawCategory) => {
  const categoryText = String(rawCategory ?? "")
    .toLowerCase()
    .replace(/_/g, "-")
    .trim();

  const wholeSpiceWords = [
    "whole-spice",
    "whole spices",
    "whole spice",
    "seeds",
    "peppercorn",
  ];

  return wholeSpiceWords.some((word) => categoryText.includes(word))
    ? "whole-spices"
    : "masala";
};

// =====================================================
// FORMAT BACKEND PRODUCT
// =====================================================

const formatProduct = (item, index) => ({
  ...item,

  id: item.id ?? item.product_id ?? index + 1,

  name:
    item.name ??
    item.product_name ??
    item.title ??
    "SpiceCraft Product",

  image:
    item.image ??
    item.image_url ??
    item.imageUrl ??
    item.product_image ??
    "/images/product-placeholder.jpg",

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

  rating: Number(item.rating ?? item.average_rating ?? 4.5),

  category: normalizeCategory(
    item.category_name ?? item.category
  ),

  weight:
    item.weight ??
    item.weight_label ??
    item.quantity ??
    "100g",
});

// =====================================================
// NORMALIZE IMAGE IDENTIFIERS
// Supports full URLs, relative URLs and RustFS object keys
// =====================================================

const getImageIdentifiers = (value) => {
  if (typeof value !== "string" || !value.trim()) {
    return [];
  }

  const identifiers = new Set();
  const raw = value.trim();

  const addPath = (input) => {
    if (!input) return;

    let path = input;

    try {
      path = decodeURIComponent(path);
    } catch {
      // Keep original path if decoding fails.
    }

    path = path
      .split("?")[0]
      .split("#")[0]
      .replace(/\/+$/, "");

    if (!path) return;

    identifiers.add(path);
    identifiers.add(path.replace(/^\/+/, ""));

    // Also compare the part following the image-serving route.
    const marker = "/product-images/";
    const markerIndex = path.indexOf(marker);

    if (markerIndex !== -1) {
      const objectKey = path.slice(markerIndex + marker.length);

      if (objectKey) {
        identifiers.add(objectKey);
        identifiers.add(objectKey.replace(/^\/+/, ""));
      }
    }
  };

  addPath(raw);

  try {
    const baseURL =
      api.defaults?.baseURL || window.location.origin;

    const parsed = new URL(raw, baseURL);

    addPath(parsed.pathname);
  } catch {
    // Relative paths are already handled above.
  }

  return [...identifiers].filter(Boolean);
};

// =====================================================
// CHECK WHETHER MEDIA IS INACTIVE
// =====================================================

const isInactiveMedia = (asset) => {
  return (
    asset?.is_active === false ||
    asset?.is_active === 0 ||
    asset?.is_active === "false"
  );
};

// =====================================================
// SHOP PAGE
// =====================================================

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [mediaAssets, setMediaAssets] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mediaError, setMediaError] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPrice, setSelectedPrice] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");

  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 6;

  // ===================================================
  // FETCH PRODUCTS
  // ===================================================

  const fetchProducts = useCallback(async () => {
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

      const formattedProducts = productList
        .filter((item) => {
          // If backend supplies is_active, don't show inactive products.
          return (
            item?.is_active !== false &&
            item?.is_active !== 0 &&
            item?.is_active !== "false"
          );
        })
        .map((item, index) => formatProduct(item, index));

      setProducts(formattedProducts);
    } catch (err) {
      console.error("Products API error:", err);

      setError(
        "Unable to load products. Please check whether the backend server is running."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // ===================================================
  // FETCH PRODUCT MEDIA STATUS
  // This endpoint should return active AND inactive media.
  // ===================================================

  const fetchMediaStatus = useCallback(async () => {
    try {
      setMediaError("");

      const response = await api.get("/media/status", {
        params: {
          section: "product",
        },
      });

      const responseData = response.data;

      const assets = Array.isArray(responseData)
        ? responseData
        : Array.isArray(responseData?.items)
          ? responseData.items
          : [];

      setMediaAssets(assets);
    } catch (err) {
      console.error("Product media status API error:", err);

      setMediaError(
        "Product image status could not be loaded."
      );

      setMediaAssets([]);
    }
  }, []);

  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {
    fetchProducts();
    fetchMediaStatus();
  }, [fetchProducts, fetchMediaStatus]);

  // ===================================================
  // REFRESH MEDIA STATUS WHEN SHOP BECOMES VISIBLE AGAIN
  // ===================================================

  useEffect(() => {
    const handleFocus = () => {
      fetchMediaStatus();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchMediaStatus();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [fetchMediaStatus]);

  // ===================================================
  // MATCH PRODUCT IMAGE TO MEDIA MANAGER ASSET
  // ===================================================

  const productsWithImageStatus = useMemo(() => {
    return products.map((product) => {
      const productImage =
        product.image ??
        product.image_url ??
        product.imageUrl ??
        product.product_image ??
        "";

      const productIdentifiers = new Set(
        getImageIdentifiers(productImage)
      );

      const matchingAsset = mediaAssets.find((asset) => {
        const assetIdentifiers = [
          ...getImageIdentifiers(asset?.image_url),
          ...getImageIdentifiers(asset?.object_key),
        ];

        return assetIdentifiers.some((identifier) =>
          productIdentifiers.has(identifier)
        );
      });

      return {
        ...product,

        // ProductCard already supports this flag.
        imageHidden:
          matchingAsset != null &&
          isInactiveMedia(matchingAsset),
      };
    });
  }, [products, mediaAssets]);

  // ===================================================
  // FILTER + SORT PRODUCTS
  // ===================================================

  const filteredProducts = useMemo(() => {
    let result = [...productsWithImageStatus];

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
      result = result.filter((product) => product.price > 1000);
    }

    if (selectedRating !== "all") {
      result = result.filter(
        (product) =>
          product.rating >= Number(selectedRating)
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
        const dateA = new Date(a.created_at ?? 0).getTime();
        const dateB = new Date(b.created_at ?? 0).getTime();

        if (Number.isFinite(dateA) && Number.isFinite(dateB)) {
          return dateB - dateA;
        }

        return String(b.id).localeCompare(String(a.id));
      });
    }

    return result;
  }, [
    productsWithImageStatus,
    selectedCategory,
    selectedPrice,
    selectedRating,
    sortBy,
  ]);

  // ===================================================
  // PAGINATION
  // ===================================================

  const totalPages = Math.ceil(
    filteredProducts.length / productsPerPage
  );

  const safeCurrentPage = Math.max(
    1,
    Math.min(currentPage, Math.max(totalPages, 1))
  );

  const startIndex = (safeCurrentPage - 1) * productsPerPage;

  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  // ===================================================
  // FILTER HANDLERS
  // ===================================================

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

  const handleClearFilters = () => {
    setSelectedCategory("all");
    setSelectedPrice("all");
    setSelectedRating("all");
    setSortBy("default");
    setCurrentPage(1);
  };

  // ===================================================
  // RENDER
  // ===================================================

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
                  <span>Showing</span>

                  <strong>
                    {" "}
                    {loading ? "..." : filteredProducts.length}
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

              {loading && (
                <div className="shop-empty">
                  <h3>Loading SpiceCraft products...</h3>
                  <p>Please wait while we fetch our products.</p>
                </div>
              )}

              {!loading && error && (
                <div className="shop-empty" role="alert">
                  <h3>Products could not be loaded</h3>
                  <p>{error}</p>

                  <button
                    type="button"
                    onClick={() => {
                      fetchProducts();
                      fetchMediaStatus();
                    }}
                  >
                    Try Again
                  </button>
                </div>
              )}

              {!loading &&
                !error &&
                paginatedProducts.length > 0 && (
                  <ProductGrid products={paginatedProducts} />
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
                    currentPage={safeCurrentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}

              {mediaError && (
                <p className="mt-3 text-sm text-amber-700">
                  {mediaError}
                </p>
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
