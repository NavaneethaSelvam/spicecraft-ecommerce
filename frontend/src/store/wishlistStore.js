
import { create } from "zustand";
import { persist } from "zustand/middleware";

const getProductId = (item) =>
  String(
    typeof item === "object" && item !== null
      ? item.id ?? item.product_id
      : item
  );

const useWishlistStore = create(
  persist(
    (set) => ({
      wishlist: [],

      toggleWishlist: (product) =>
        set((state) => {
          const productId = getProductId(product);

          const exists = state.wishlist.some(
            (item) => getProductId(item) === productId
          );

          return {
            wishlist: exists
              ? state.wishlist.filter(
                  (item) => getProductId(item) !== productId
                )
              : [
                  ...state.wishlist.filter(
                    (item) => typeof item === "object" && item !== null
                  ),
                  product,
                ],
          };
        }),
    }),
    {
      name: "spicecraft-wishlist",
    }
  )
);

export default useWishlistStore;
