
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Check, Minus, Plus, ShoppingBag } from "lucide-react";

import WishlistButton from "../components/WishlistButton";
import useCartStore from "../store/cartStore";

import "./ProductDetails.css";

const products = [
  {
    id: 1,
    name: "Premium Red Chilli Powder",
    image: "/images/product-chilli-powder.jpg",
    price: 149,
    oldPrice: 179,
    category: "Masala Powders",
    weight: "100g",
    description:
      "Premium red chilli powder crafted from carefully selected chillies for vibrant colour, rich aroma and authentic Indian flavour.",
    stock: 20,
  },
  {
    id: 2,
    name: "Turmeric Powder",
    image: "/images/product-turmeric.jpg",
    price: 99,
    oldPrice: 119,
    category: "Masala Powders",
    weight: "100g",
    description:
      "Pure turmeric powder with natural colour and earthy aroma, perfect for everyday Indian cooking.",
    stock: 25,
  },
  {
    id: 3,
    name: "Garam Masala",
    image: "/images/product-garam-masala.jpg",
    price: 179,
    oldPrice: 219,
    category: "Masala Powders",
    weight: "100g",
    description:
      "Aromatic Indian garam masala blended with carefully selected spices for rich depth and warmth.",
    stock: 15,
  },
  {
    id: 4,
    name: "Cumin Seeds",
    image: "/images/product-cumin.jpg",
    price: 129,
    category: "Whole Spices",
    weight: "100g",
    description:
      "Fresh and aromatic cumin seeds selected to add a warm, earthy flavour to your favourite dishes.",
    stock: 18,
  },
  {
    id: 5,
    name: "Coriander Powder",
    image: "/images/product-coriander.jpg",
    price: 109,
    oldPrice: 129,
    category: "Masala Powders",
    weight: "100g",
    description:
      "Finely ground coriander powder with a fresh aroma and balanced flavour for everyday cooking.",
    stock: 20,
  },
  {
    id: 6,
    name: "Chicken Masala",
    image: "/images/product-chicken-masala.jpg",
    price: 159,
    oldPrice: 189,
    category: "Spice Blends",
    weight: "100g",
    description:
      "A flavourful blend created to bring authentic colour, aroma and spice to chicken dishes.",
    stock: 12,
  },
  {
    id: 7,
    name: "Black Pepper",
    image: "/images/product-black-pepper.jpg",
    price: 199,
    category: "Whole Spices",
    weight: "100g",
    description:
      "Bold black pepper with a strong aroma and naturally warm flavour for everyday cooking.",
    stock: 10,
  },
  {
    id: 8,
    name: "Biryani Masala",
    image: "/images/product-biryani-masala.jpg",
    price: 189,
    oldPrice: 229,
    category: "Spice Blends",
    weight: "100g",
    description:
      "Aromatic biryani masala blended to create rich flavour and authentic Indian-style biryani.",
    stock: 14,
  },
];

function ProductDetails() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const addToCart = useCartStore((state) => state.addToCart);

  const product = useMemo(
    () => products.find((item) => String(item.id) === String(id)),
    [id]
  );

  useEffect(() => {
    setQuantity(1);
    setAdded(false);
  }, [id]);

  if (!product) {
    return (
      <main className="product-not-found">
        <span>SPICECRAFT</span>
        <h1>Product Not Found</h1>
        <p>We couldn't find the product you're looking for.</p>
        <Link to="/shop">Back to Shop</Link>
      </main>
    );
  }

  const {
    name,
    image,
    price,
    oldPrice,
    category,
    weight,
    description,
    stock,
  } = product;

  const stockValue = Number(stock ?? 0);
  const inStock = stockValue > 0;

  const discount =
    oldPrice && oldPrice > price
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : 0;

  const increaseQuantity = () => {
    if (quantity < stockValue) {
      setQuantity((current) => current + 1);
    }
  };

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  const handleAddToCart = () => {
    if (!inStock || quantity > stockValue) return;

    for (let index = 0; index < quantity; index += 1) {
      addToCart(product);
    }

    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  };

  return (
    <main className="product-details-page">
      <nav className="product-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/shop">Shop</Link>
        <span>/</span>
        <span>{name}</span>
      </nav>

      <section className="product-details">
        <div className="product-details-container">
          {/* Product image */}
          <div className="product-details-image">
            {discount > 0 && (
              <span className="product-details-discount">
                {discount}% OFF
              </span>
            )}

            <img
              src={image || "/images/product-placeholder.jpg"}
              alt={name}
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src =
                  "/images/product-placeholder.jpg";
              }}
            />

            <div className="product-wishlist">
              <WishlistButton product={product} />
            </div>
          </div>

          {/* Product information */}
          <div className="product-details-info">
            <span className="product-details-category">{category}</span>

            <h1>{name}</h1>

            <div className="product-details-price">
              <strong>₹{Number(price).toFixed(0)}</strong>

              {discount > 0 && (
                <>
                  <del>₹{Number(oldPrice).toFixed(0)}</del>
                  <span>{discount}% OFF</span>
                </>
              )}
            </div>

            <p className="product-details-description">{description}</p>

            <div className="product-details-meta">
              <div>
                <span>Weight</span>
                <strong>{weight}</strong>
              </div>

              <div>
                <span>Availability</span>
                <strong className={inStock ? "available" : "unavailable"}>
                  {inStock ? "In Stock" : "Out of Stock"}
                </strong>
              </div>
            </div>

            {/* Quantity selector */}
            {inStock && (
              <div className="product-quantity">
                <span>Quantity</span>

                <div className="quantity-control">
                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={15} />
                  </button>

                  <span aria-live="polite">{quantity}</span>

                  <button
                    type="button"
                    onClick={increaseQuantity}
                    disabled={quantity >= stockValue}
                    aria-label="Increase quantity"
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* Add to cart */}
            <button
              type="button"
              className="product-add-cart"
              disabled={!inStock}
              onClick={handleAddToCart}
            >
              {!inStock ? (
                "Currently Unavailable"
              ) : added ? (
                <>
                  <Check size={18} />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingBag size={18} />
                  Add to Cart — ₹{Number(price) * quantity}
                </>
              )}
            </button>

            <div className="product-details-note">
              Freshly packed • Authentic Indian spices • Delivered across India
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ProductDetails;
