
import { useState } from "react";
import { Link } from "react-router-dom";
import useCartStore from "../store/cartStore";

const Cart = () => {
  const items = useCartStore((state) => state.cartItems);

  const increaseQuantity = useCartStore(
    (state) => state.increaseQuantity
  );

  const decreaseQuantity = useCartStore(
    (state) => state.decreaseQuantity
  );

  const removeFromCart = useCartStore(
    (state) => state.removeFromCart
  );

  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState("");

  // Calculate subtotal safely
  const subtotal = items.reduce((total, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;

    return total + price * quantity;
  }, 0);

  // Free delivery for orders of ₹500 or more
  const delivery = subtotal === 0 || subtotal >= 500 ? 0 : 49;

  const total = subtotal + delivery;

  const totalItems = items.reduce(
    (count, item) => count + (Number(item.quantity) || 0),
    0
  );

  // Format prices using Indian number formatting
  const formatPrice = (amount) =>
    Number(amount).toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

  // Coupon validation
  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setCouponMessage("Please enter a coupon code.");
      return;
    }

    setCouponMessage("Coupon codes are not available yet.");
  };

  // Empty cart
  if (items.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffaf5] px-4 py-12">
        <div className="flex min-h-[55vh] w-full max-w-2xl flex-col items-center justify-center text-center">
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#f8f1eb]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="38"
              height="38"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#8c3b1e]"
              aria-hidden="true"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </div>

          <span className="text-xs font-bold tracking-[2px] text-[#8c3b1e]">
            YOUR SPICES
          </span>

          <h1 className="my-3 text-3xl font-bold text-[#2d241f] sm:text-4xl">
            Your Cart is Empty
          </h1>

          <p className="mb-6 max-w-md text-sm leading-6 text-stone-600">
            Looks like you haven't added any spices to your cart yet.
            Discover authentic Indian flavours for your kitchen.
          </p>

          <Link
            to="/shop"
            className="rounded-lg bg-[#a33b20] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#822d18]"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffaf5] px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <header className="mb-8 sm:mb-10">
          <span className="text-xs font-bold tracking-[2px] text-[#8c3b1e]">
            YOUR SPICES
          </span>

          <h1 className="my-2 text-3xl font-bold text-[#2d241f] sm:text-4xl">
            Shopping Cart
          </h1>

          <p className="text-sm text-stone-600">
            Review your selected spices before checking out.
          </p>
        </header>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_370px] lg:gap-8">
          {/* Cart Items */}
          <section
            className="flex min-w-0 flex-col gap-4"
            aria-label="Cart items"
          >
            {items.map((item) => {
              const quantity = Number(item.quantity) || 0;
              const price = Number(item.price) || 0;

              const image =
                item.image ||
                item.image_url ||
                item.imageUrl ||
                "/images/product-placeholder.jpg";

              return (
                <article
                  key={item.id}
                  className="grid min-w-0 grid-cols-[84px_minmax(0,1fr)] gap-3 rounded-xl border border-[#eadfd4] bg-white p-3 sm:grid-cols-[120px_minmax(0,1fr)_auto] sm:gap-5 sm:p-5"
                >
                  {/* Product Image */}
                  <div className="aspect-square w-full overflow-hidden rounded-lg bg-[#f8f1eb] sm:h-[120px] sm:w-[120px]">
                    <img
                      src={image}
                      alt={item.name || "Indian spice"}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src =
                          "/images/product-placeholder.jpg";
                      }}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex min-w-0 flex-col py-1">
                    <span className="text-[10px] font-bold tracking-wider text-[#8c3b1e]">
                      SPICECRAFT
                    </span>

                    <h2 className="mt-1 break-words text-sm font-bold text-[#2d241f] sm:text-base">
                      {item.name || "Indian Spice"}
                    </h2>

                    <p className="mt-1 text-xs text-stone-600">
                      {item.weight ||
                        item.weight_label ||
                        item.quantity_label ||
                        "100g"}
                    </p>

                    <p className="mt-2 text-sm font-semibold text-stone-900">
                      ₹{formatPrice(price)} each
                    </p>

                    {/* Quantity and Remove */}
                    <div className="mt-4 flex flex-wrap items-center gap-3 sm:mt-auto sm:pt-4">
                      <div className="flex h-9 items-center overflow-hidden rounded-lg border border-[#ddd0c6]">
                        <button
                          type="button"
                          aria-label={`Decrease ${item.name} quantity`}
                          disabled={quantity <= 1}
                          onClick={() => decreaseQuantity(item.id)}
                          className="h-full w-8 bg-[#f8f1eb] text-lg text-stone-900 transition hover:bg-[#eadfd4] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          −
                        </button>

                        <span
                          className="w-9 text-center text-sm font-semibold"
                          aria-live="polite"
                        >
                          {quantity}
                        </span>

                        <button
                          type="button"
                          aria-label={`Increase ${item.name} quantity`}
                          onClick={() => increaseQuantity(item.id)}
                          className="h-full w-8 bg-[#f8f1eb] text-lg text-stone-900 transition hover:bg-[#eadfd4]"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-xs font-medium text-[#8c3b1e] hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Item Subtotal */}
                  <strong className="col-span-2 text-right text-sm font-bold text-[#8c3b1e] sm:col-span-1 sm:self-center sm:whitespace-nowrap sm:text-base">
                    ₹{formatPrice(price * quantity)}
                  </strong>
                </article>
              );
            })}

            <Link
              to="/shop"
              className="mt-1 w-fit text-sm font-semibold text-[#8c3b1e] hover:underline"
            >
              ← Continue Shopping
            </Link>
          </section>

          {/* Order Summary */}
          <aside className="h-fit rounded-xl border border-[#eadfd4] bg-white p-5 sm:p-6 lg:sticky lg:top-6">
            <h2 className="mb-5 text-xl font-bold text-[#2d241f]">
              Order Summary
            </h2>

            {/* Free Shipping Notice */}
            <div
              className="mb-5 rounded-lg bg-[#f8f1eb] p-3 text-xs leading-5 text-stone-600"
              role="status"
            >
              {subtotal >= 500 ? (
                <strong className="text-green-700">
                  You've unlocked FREE SHIPPING!
                </strong>
              ) : (
                <>
                  Add ₹{formatPrice(500 - subtotal)} more for{" "}
                  <strong className="text-stone-900">
                    FREE SHIPPING
                  </strong>
                </>
              )}
            </div>

            {/* Coupon */}
            <form
              className="mb-6"
              onSubmit={(event) => {
                event.preventDefault();
                handleApplyCoupon();
              }}
            >
              <label
                htmlFor="couponCode"
                className="mb-2 block text-sm font-semibold text-stone-900"
              >
                Have a coupon?
              </label>

              <div className="flex min-w-0">
                <input
                  id="couponCode"
                  type="text"
                  placeholder="Coupon code"
                  value={couponCode}
                  onChange={(event) => {
                    setCouponCode(event.target.value);
                    setCouponMessage("");
                  }}
                  className="min-w-0 flex-1 rounded-l-lg border border-[#ddd0c6] bg-white px-3 py-3 text-sm outline-none focus:border-[#a33b20]"
                />

                <button
                  type="submit"
                  className="rounded-r-lg bg-[#3b2118] px-4 text-xs font-semibold text-white transition hover:bg-[#a33b20]"
                >
                  Apply
                </button>
              </div>

              {couponMessage && (
                <p
                  role="status"
                  className="mt-2 text-xs text-[#8c3b1e]"
                >
                  {couponMessage}
                </p>
              )}
            </form>

            {/* Price Breakdown */}
            <div className="mb-4 flex items-center justify-between gap-3 text-sm text-stone-600">
              <span>Subtotal ({totalItems} items)</span>

              <strong className="text-stone-900">
                ₹{formatPrice(subtotal)}
              </strong>
            </div>

            <div className="mb-4 flex items-center justify-between gap-3 text-sm text-stone-600">
              <span>Delivery</span>

              <strong className="text-stone-900">
                {delivery === 0 ? "FREE" : `₹${formatPrice(delivery)}`}
              </strong>
            </div>

            <div className="my-5 h-px bg-[#eadfd4]" />

            {/* Final Total */}
            <div className="mb-6 flex items-center justify-between gap-3">
              <span className="font-semibold text-[#2d241f]">
                Total
              </span>

              <strong className="text-2xl font-extrabold text-[#8c3b1e]">
                ₹{formatPrice(total)}
              </strong>
            </div>

            {/* Checkout */}
            <Link
              to="/checkout"
              className="flex min-h-[50px] w-full items-center justify-center rounded-lg bg-[#a33b20] px-4 py-3 text-center text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#822d18]"
            >
              Proceed to Checkout
            </Link>

            <p className="mt-3 text-center text-[11px] leading-5 text-stone-500">
              Secure checkout • Freshly packed • Delivered across India
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Cart;
