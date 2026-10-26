
import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";

import useWishlistStore from "../store/wishlistStore";
import ProductGrid from "../components/ProductGrid";

export default function Wishlist() {
  const wishlist = useWishlistStore(
    (state) => state.wishlist
  );

  const wishlistProducts = wishlist.filter(
    (item) => typeof item === "object" && item !== null
  );

  return (
    <main className="min-h-[70vh] bg-[#fffdf8] px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#8c3b1e]">
          Your favourites
        </p>

        <h1 className="flex items-center gap-3 font-serif text-3xl font-bold text-[#8c3b1e] sm:text-4xl">
          My Wishlist
          <Heart size={28} className="text-rose-600" />
        </h1>

        <p className="mt-2 text-sm text-stone-600">
          Your favourite SpiceCraft products, all in one place.
        </p>

        <p className="mt-3 text-sm font-semibold text-[#8c3b1e]">
          Saved products: {wishlistProducts.length}
        </p>

        {wishlistProducts.length > 0 ? (
          <div className="mt-8">
            <ProductGrid products={wishlistProducts} />
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-[#eadfd3] bg-white px-5 py-14 text-center shadow-sm">
            <Heart
              size={48}
              className="mx-auto mb-4 text-[#c8ad98]"
            />

            <h2 className="text-xl font-bold text-stone-800">
              Your wishlist is empty
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-stone-600">
              Open the Shop page and tap the heart icon on a product
              to save it here.
            </p>

            <Link
              to="/shop"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#743d24] px-6 py-3 font-semibold text-white hover:bg-[#5c2e1b]"
            >
              <ShoppingBag size={18} />
              Explore Spices
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
