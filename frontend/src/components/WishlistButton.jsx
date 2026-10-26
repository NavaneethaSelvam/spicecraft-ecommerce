
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import useWishlistStore from "../store/wishlistStore";

export default function WishlistButton({ product }) {
  const wishlist = useWishlistStore((state) => state.wishlist);
  const toggleWishlist = useWishlistStore(
    (state) => state.toggleWishlist
  );

  const productId = String(product?.id ?? product?.product_id);

  const isWishlisted = wishlist.some(
    (item) =>
      String(
        typeof item === "object" && item !== null
          ? item.id ?? item.product_id
          : item
      ) === productId
  );

  const handleWishlist = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (product) {
      toggleWishlist(product);
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handleWishlist}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={
        isWishlisted ? "Remove from wishlist" : "Add to wishlist"
      }
      title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      className={`flex h-10 w-10 items-center justify-center rounded-full border bg-white shadow-sm ${
        isWishlisted
          ? "border-rose-200 text-rose-600"
          : "border-[#eadfd5] text-[#6b3d24] hover:text-rose-600"
      }`}
    >
      <Heart
        size={20}
        fill={isWishlisted ? "currentColor" : "none"}
      />
    </motion.button>
  );
}
