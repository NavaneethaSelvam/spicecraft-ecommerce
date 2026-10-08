import React, { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import RatingStars from "../components/RatingStars";
import WishlistButton from "../components/WishlistButton";

import "./ProductDetails.css";

const products = [
  {
    id: 1,
    name: "Premium Red Chilli Powder",
    image: "/images/product-chilli-powder.jpg",
    price: 149,
    oldPrice: 179,
    rating: 4.8,
    reviews: 124,
    category: "Masala Powders",
    weight: "100g",
    description:
      "Premium red chilli powder crafted from carefully selected chillies for vibrant colour, rich aroma and authentic Indian flavour.",
    stock: true,
  },
  {
    id: 2,
    name: "Turmeric Powder",
    image: "/images/product-turmeric.jpg",
    price: 99,
    oldPrice: 119,
    rating: 4.7,
    reviews: 98,
    category: "Masala Powders",
    weight: "100g",
    description:
      "Pure turmeric powder with natural colour and earthy aroma, perfect for everyday Indian cooking.",
    stock: true,
  },
  {
    id: 3,
    name: "Garam Masala",
    image: "/images/product-garam-masala.jpg",
    price: 179,
    oldPrice: 219,
    rating: 4.9,
    reviews: 156,
    category: "Masala Powders",
    weight: "100g",
    description:
      "Aromatic Indian garam masala blended with carefully selected spices for rich depth and warmth.",
    stock: true,
  },
  {
    id: 4,
    name: "Cumin Seeds",
    image: "/images/product-cumin.jpg",
    price: 129,
    rating: 4.6,
    reviews: 76,
    category: "Whole Spices",
    weight: "100g",
    description:
      "Fresh and aromatic cumin seeds selected to add a warm, earthy flavour to your favourite dishes.",
    stock: true,
  },
  {
    id: 5,
    name: "Coriander Powder",
    image: "/images/product-coriander.jpg",
    price: 109,
    oldPrice: 129,
    rating: 4.7,
    reviews: 87,
    category: "Masala Powders",
    weight: "100g",
    description:
      "Finely ground coriander powder with a fresh aroma and balanced flavour for everyday cooking.",
    stock: true,
  },
  {
    id: 6,
    name: "Chicken Masala",
    image: "/images/product-chicken-masala.jpg",
    price: 159,
    oldPrice: 189,
    rating: 4.8,
    reviews: 112,
    category: "Masala Powders",
    weight: "100g",
    description:
      "A flavourful blend created to bring authentic colour, aroma and spice to chicken dishes.",
    stock: true,
  },
  {
    id: 7,
    name: "Black Pepper",
    image: "/images/product-black-pepper.jpg",
    price: 199,
    rating: 4.9,
    reviews: 143,
    category: "Whole Spices",
    weight: "100g",
    description:
      "Bold black pepper with a strong aroma and naturally warm flavour for everyday cooking.",
    stock: true,
  },
  {
    id: 8,
    name: "Biryani Masala",
    image: "/images/product-biryani-masala.jpg",
    price: 189,
    oldPrice: 229,
    rating: 4.9,
    reviews: 168,
    category: "Masala Powders",
    weight: "100g",
    description:
      "Aromatic biryani masala blended to create rich flavour and authentic Indian-style biryani.",
    stock: true,
  },
];

const ProductDetails = () => {
  const { id } = useParams();

  const [quantity, setQuantity] = useState(1);

  const product = useMemo(() => {
    return products.find(
      (item) => item.id === Number(id)
    );
  }, [id]);

  if (!product) {
    return (
      <main className="product-not-found">
        <span>SPICECRAFT</span>

        <h1>Product Not Found</h1>

        <p>
          We couldn't find the product you're looking for.
        </p>

        <Link to="/shop">
          Back to Shop
        </Link>
      </main>
    );
  }

  const {
    name,
    image,
    price,
    oldPrice,
    rating,
    reviews,
    category,
    weight,
    description,
    stock,
  } = product;

  const discount =
    oldPrice && oldPrice > price
      ? Math.round(
          ((oldPrice - price) / oldPrice) * 100
        )
      : 0;

  const increaseQuantity = () => {
    setQuantity((value) => value + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((value) =>
      value > 1 ? value - 1 : 1
    );
  };

  const handleAddToCart = () => {
    console.log("Add to cart:", {
      ...product,
      quantity,
    });
  };

  return (
    <main className="product-details-page">

      {/* Breadcrumb */}

      <div className="product-breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>

        <Link to="/shop">Shop</Link>
        <span>/</span>

        <span>{name}</span>
      </div>

      {/* Product */}

      <section className="product-details">

        <div className="product-details-container">

          {/* IMAGE */}

          <div className="product-details-image">

            {discount > 0 && (
              <span className="product-details-discount">
                {discount}% OFF
              </span>
            )}

            <img
              src={image}
              alt={name}
              onError={(e) => {
                e.currentTarget.src =
                  "/images/product-placeholder.jpg";
              }}
            />

            <div className="product-wishlist">
              <WishlistButton
                productId={product.id}
              />
            </div>

          </div>

          {/* INFORMATION */}

          <div className="product-details-info">

            <span className="product-details-category">
              {category}
            </span>

            <h1>{name}</h1>

            <div className="product-details-rating">

              <RatingStars rating={rating} />

              <span>
                {rating} · {reviews} Reviews
              </span>

            </div>

            <div className="product-details-price">

              <strong>
                ₹{price}
              </strong>

              {oldPrice && (
                <del>
                  ₹{oldPrice}
                </del>
              )}

              {discount > 0 && (
                <span>
                  {discount}% OFF
                </span>
              )}

            </div>

            <p className="product-details-description">
              {description}
            </p>

            <div className="product-details-meta">

              <div>
                <span>Weight</span>
                <strong>{weight}</strong>
              </div>

              <div>
                <span>Availability</span>

                <strong
                  className={
                    stock
                      ? "available"
                      : "unavailable"
                  }
                >
                  {stock
                    ? "In Stock"
                    : "Out of Stock"}
                </strong>
              </div>

            </div>

            {/* QUANTITY */}

            {stock && (
              <div className="product-quantity">

                <span>Quantity</span>

                <div className="quantity-control">

                  <button
                    type="button"
                    onClick={decreaseQuantity}
                  >
                    −
                  </button>

                  <span>{quantity}</span>

                  <button
                    type="button"
                    onClick={increaseQuantity}
                  >
                    +
                  </button>

                </div>

              </div>
            )}

            {/* ADD CART */}

            <button
              type="button"
              className="product-add-cart"
              disabled={!stock}
              onClick={handleAddToCart}
            >
              {stock
                ? `Add to Cart — ₹${price * quantity}`
                : "Currently Unavailable"}
            </button>

            <div className="product-details-note">
              Freshly packed • Authentic Indian spices •
              Delivered across India
            </div>

          </div>

        </div>

      </section>

    </main>
  );
};

export default ProductDetails;