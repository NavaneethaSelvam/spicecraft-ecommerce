import React, { useState } from "react";
import { Heart } from "lucide-react";
import "./WishlistButton.css";

const WishlistButton = ({ productId, onWishlistChange }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleWishlist = () => {
    const newValue = !isWishlisted;

    setIsWishlisted(newValue);

    if (onWishlistChange) {
      onWishlistChange(productId, newValue);
    }
  };

  return (
    <button
      type="button"
      className={`wishlist-button ${
        isWishlisted ? "active" : ""
      }`}
      onClick={handleWishlist}
      aria-label={
        isWishlisted
          ? "Remove from wishlist"
          : "Add to wishlist"
      }
    >
      <Heart
        size={20}
        fill={isWishlisted ? "currentColor" : "none"}
      />
    </button>
  );
};

export default WishlistButton;
