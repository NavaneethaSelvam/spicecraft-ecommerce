
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Check } from "lucide-react";

import WishlistButton from "./WishlistButton";
import useCartStore from "../store/cartStore";

function ProductCard({ product }) {
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;

    const timer = window.setTimeout(() => {
      setAdded(false);
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [added]);

  if (!product) return null;

  const id = product.id ?? product.product_id;
  const name = product.name ?? product.title ?? "Indian Spice";
  const price = Number(product.price ?? 0);

  const originalPrice = Number(
    product.originalPrice ??
      product.mrp ??
      product.oldPrice ??
      product.old_price ??
      0
  );

  const weight = product.weight ?? "100g";

  const rawImage =
    product.image ??
    product.image_url ??
    product.imageUrl ??
    product.product_image ??
    "/images/product-placeholder.jpg";

  const imageSrc =
    typeof rawImage === "string" && rawImage.trim()
      ? rawImage.trim()
      : "/images/product-placeholder.jpg";

  const imageHidden = product.imageHidden === true;

  const discount =
    originalPrice > price && price > 0
      ? Math.round(
          ((originalPrice - price) / originalPrice) * 100
        )
      : 0;

  const spiceLevel =
    product.spice_level ?? product.spiceLevel ?? "Medium";

  const stock =
    product.stock === "" || product.stock == null
      ? null
      : Number(product.stock);

  const outOfStock =
    stock !== null &&
    Number.isFinite(stock) &&
    stock <= 0;

  const handleAddToCart = () => {
    if (outOfStock || id == null) {
      if (id == null) {
        console.error("Product ID is missing:", product);
      }
      return;
    }

    try {
      useCartStore.getState().addToCart({
        ...product,
        id,
        name,
        price,
        weight,
        image: imageSrc,
      });

      setAdded(true);
    } catch (error) {
      console.error("Unable to add product to cart:", error);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-[#e9e3dc] bg-white transition-shadow duration-200 hover:shadow-md"
    >
      {/* Image area stays the same size when hidden */}
      <div className="relative aspect-square overflow-hidden bg-[#f7f5f1]">
        {!imageHidden && (
          <Link
            to={`/product/${id}`}
            aria-label={`View ${name}`}
            className="block h-full w-full"
          >
            <img
              src={imageSrc}
              alt={name}
              loading="lazy"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src =
                  "/images/product-placeholder.jpg";
              }}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
            />
          </Link>
        )}

        <div className="absolute right-2 top-2 z-10">
          <WishlistButton product={product} />
        </div>

        {discount > 0 && (
          <span className="absolute left-2 top-2 z-10 rounded-md bg-[#218544] px-2 py-1 text-[11px] font-bold text-white">
            {discount}% off
          </span>
        )}
      </div>

      {/* Product details remain visible */}
      <div className="flex flex-1 flex-col p-3">
        <Link
          to={`/product/${id}`}
          className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-[#292521] transition-colors hover:text-[#754426]"
        >
          {name}
        </Link>

        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-[#77716b]">
          <span aria-hidden="true">🌶</span>
          <span>{spiceLevel}</span>
          <span className="text-[#d6cec5]">•</span>
          <span>{weight}</span>
        </div>

        <div className="mt-auto flex min-h-10 flex-wrap items-center gap-x-2 gap-y-1 pt-3">
          <span className="text-base font-bold text-[#292521]">
            ₹{Number.isFinite(price) ? price.toFixed(0) : "0"}
          </span>

          {discount > 0 && (
            <span className="text-xs text-[#8a837b] line-through">
              ₹{originalPrice.toFixed(0)}
            </span>
          )}
        </div>

        <motion.button
          type="button"
          disabled={outOfStock}
          onClick={handleAddToCart}
          whileTap={!outOfStock ? { scale: 0.98 } : undefined}
          aria-live="polite"
          className={`mt-2 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-bold text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#754426] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400 ${
            added
              ? "bg-green-800 hover:bg-green-900"
              : "bg-[#754426] hover:bg-[#5c341d]"
          }`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {outOfStock ? (
              <motion.span
                key="out"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <ShoppingBag size={16} />
                Out of Stock
              </motion.span>
            ) : added ? (
              <motion.span
                key="added"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Check size={17} />
                Added to Cart
              </motion.span>
            ) : (
              <motion.span
                key="add"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <ShoppingBag size={16} />
                Add to Cart
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.article>
  );
}

export default ProductCard;
