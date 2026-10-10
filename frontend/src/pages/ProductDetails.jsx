
import React from "react";
import {
  Link,
  useParams,
  useNavigate,
} from "react-router-dom";

import products from "../assets/data/products";
import useCartStore from "../store/cartStore";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const addToCart = useCartStore(
    (state) => state.addToCart
  );

  // Find the selected product using its ID
  const product = products.find(
    (item) => String(item.id) === String(id)
  );

  // Add product to cart and open Cart page
  const handleAddToCart = () => {
    if (!product) return;

    addToCart(product);
    navigate("/cart");
  };

  // Product not found
  if (!product) {
    return (
      <main className="product-details-page">
        <div className="product-not-found">
          <span className="product-details-eyebrow">
            SPICECRAFT
          </span>

          <h1>Product Not Found</h1>

          <p>
            Sorry, we couldn't find this product.
            Please explore our spice collection.
          </p>

          <Link to="/shop" className="details-btn">
            Explore Spices
          </Link>
        </div>
      </main>
    );
  }

  const image =
    product.image ||
    product.image_url ||
    "/images/product-placeholder.jpg";

  const price = Number(product.price || 0);
  const originalPrice = Number(
    product.originalPrice || product.oldPrice || 0
  );

  const discount =
    originalPrice > price
      ? Math.round(
          ((originalPrice - price) / originalPrice) * 100
        )
      : 0;

  return (
    <main className="product-details-page">
      {/* Breadcrumb */}
      <div className="product-details-breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/shop">Shop</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      {/* Product Details */}
      <section className="product-details-container">
        {/* Product Image */}
        <div className="product-details-image-wrap">
          <span className="product-details-tag">
            AUTHENTIC INDIAN SPICES
          </span>

          <img
            src={image}
            alt={product.name}
            className="product-details-image"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src =
                "/images/product-placeholder.jpg";
            }}
          />

          <div className="image-caption">
            From Indian Spices to Extraordinary Meals
          </div>
        </div>

        {/* Product Information */}
        <div className="product-details-info">
          <span className="product-details-eyebrow">
            FROM OUR SPICE COLLECTION
          </span>

          <h1>{product.name}</h1>

          {product.rating != null && (
            <div className="product-details-rating">
              <span>★</span>
              <strong>{product.rating}</strong>

              <span className="rating-label">
                {product.reviews != null
                  ? `(${product.reviews} reviews)`
                  : "Customer Rating"}
              </span>
            </div>
          )}

          {/* Price and Discount */}
          <div className="product-details-price">
            <span>₹{price}</span>

            {discount > 0 && (
              <>
                <del>₹{originalPrice}</del>

                <span className="product-details-discount">
                  {discount}% OFF
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="product-details-description">
            {product.description ||
              `Discover the rich aroma and authentic Indian flavour of ${product.name}. A delicious addition to your everyday cooking.`}
          </p>

          {/* Category */}
          {product.category && (
            <div className="product-details-meta">
              <span>Category</span>
              <strong>{product.category}</strong>
            </div>
          )}

          {/* Pack Size */}
          {product.weight && (
            <div className="product-details-meta">
              <span>Pack Size</span>
              <strong>{product.weight}</strong>
            </div>
          )}

          {/* Spice Level */}
          {product.spiceLevel && (
            <div className="product-details-meta">
              <span>Spice Level</span>
              <strong>{product.spiceLevel}</strong>
            </div>
          )}

          {/* Product Benefits */}
          <div className="product-details-benefits">
            <div>
              <span className="benefit-check">✓</span>
              <span>Authentic Indian flavours</span>
            </div>

            <div>
              <span className="benefit-check">✓</span>
              <span>Carefully packed spices</span>
            </div>

            <div>
              <span className="benefit-check">✓</span>
              <span>Perfect for everyday cooking</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="product-details-actions">
            <button
              type="button"
              className="details-btn"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>

            <Link
              to="/cart"
              className="details-btn details-btn-outline"
            >
              View Cart
            </Link>
          </div>

          {/* Delivery Information */}
          <div className="product-details-delivery">
            <span>📦</span>
            <p>
              Freshly packed spices delivered to your doorstep.
            </p>
          </div>
        </div>
      </section>

      {/* Additional Information */}
      <section className="product-extra-info">
        <div>
          <span className="extra-info-number">01</span>
          <h3>Authentic Taste</h3>
          <p>
            Bring traditional Indian flavours into your kitchen.
          </p>
        </div>

        <div>
          <span className="extra-info-number">02</span>
          <h3>Everyday Cooking</h3>
          <p>
            A flavourful addition to your favourite home-cooked meals.
          </p>
        </div>

        <div>
          <span className="extra-info-number">03</span>
          <h3>Made for Food Lovers</h3>
          <p>
            Discover spices that make everyday meals special.
          </p>
        </div>
      </section>
    </main>
  );
}

export default ProductDetails;