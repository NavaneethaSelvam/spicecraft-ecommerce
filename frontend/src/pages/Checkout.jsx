
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import useCartStore from "../store/cartStore";

const DELIVERY_CHARGE = 40;
const FREE_DELIVERY_MINIMUM = 499;

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const getProductId = (item) =>
  item?.product_id ??
  item?.productId ??
  item?.product?.id ??
  item?.id ??
  null;

const getProductName = (item) =>
  item?.name ??
  item?.product_name ??
  item?.productName ??
  item?.title ??
  item?.product?.name ??
  "Unknown product";

const getQuantity = (item) => Number(item?.quantity);

const getPrice = (item) =>
  Number(item?.price ?? item?.unit_price ?? item?.unitPrice ?? 0);

const formatPrice = (amount) =>
  `₹${Number(amount ?? 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function Checkout() {
  const navigate = useNavigate();

  const cartItems = useCartStore((store) => store.cartItems);
  const clearCart = useCartStore((store) => store.clearCart);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const items = Array.isArray(cartItems) ? cartItems : [];

  const subtotal = items.reduce((sum, item) => {
    const price = getPrice(item);
    const quantity = getQuantity(item);

    if (
      !Number.isFinite(price) ||
      !Number.isFinite(quantity) ||
      price < 0 ||
      quantity < 0
    ) {
      return sum;
    }

    return sum + price * quantity;
  }, 0);

  const deliveryCharge =
    subtotal === 0 || subtotal >= FREE_DELIVERY_MINIMUM
      ? 0
      : DELIVERY_CHARGE;

  // Coupon state
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  const discountAmount = appliedCoupon ? Number(appliedCoupon.discount_amount || 0) : 0;
  const total = Math.max(0, subtotal - discountAmount + deliveryCharge);

  // Revalidate coupon if subtotal changes
  useEffect(() => {
    if (appliedCoupon && subtotal > 0) {
      api.post("/coupons/validate", {
        code: appliedCoupon.code,
        subtotal,
        email: formData.email.trim().toLowerCase() || null,
        phone: formData.phone.replace(/\D/g, "") || null,
      })
      .then((res) => {
        setAppliedCoupon({
          code: res.data.code,
          discount_amount: Number(res.data.discount_amount),
          discount_type: res.data.discount_type,
          discount_value: Number(res.data.discount_value),
          description: res.data.description,
        });
      })
      .catch((err) => {
        setAppliedCoupon(null);
        setCouponError(
          err.response?.data?.detail || `Coupon "${appliedCoupon.code}" is no longer applicable.`
        );
        setCouponSuccess("");
      });
    }
  }, [subtotal]);

  const handleApplyCoupon = async (e) => {
    if (e) e.preventDefault();
    setCouponError("");
    setCouponSuccess("");

    const code = couponInput.trim().toUpperCase();
    if (!code) {
      setCouponError("Please enter a coupon code.");
      return;
    }

    if (subtotal <= 0) {
      setCouponError("Cart is empty.");
      return;
    }

    setCouponLoading(true);
    try {
      const response = await api.post("/coupons/validate", {
        code,
        subtotal,
        email: formData.email.trim().toLowerCase() || null,
        phone: formData.phone.replace(/\D/g, "") || null,
      });

      const data = response.data;
      setAppliedCoupon({
        code: data.code,
        discount_amount: Number(data.discount_amount),
        discount_type: data.discount_type,
        discount_value: Number(data.discount_value),
        description: data.description,
      });
      setCouponSuccess(data.message || `Coupon "${data.code}" applied!`);
      setCouponError("");
    } catch (err) {
      console.error("Apply coupon error:", err);
      setAppliedCoupon(null);
      setCouponError(
        err.response?.data?.detail || "Invalid coupon code or not eligible for this order."
      );
      setCouponSuccess("");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError("");
    setCouponSuccess("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    if (isPlacingOrder) return;

    // Read the latest cart directly from Zustand.
    const currentCartItems = useCartStore.getState().cartItems;

    if (
      !Array.isArray(currentCartItems) ||
      currentCartItems.length === 0
    ) {
      alert("Your cart is empty. Please add products first.");
      navigate("/shop");
      return;
    }

    const name = formData.name.trim();
    const phone = formData.phone.replace(/\D/g, "");
    const email = formData.email.trim().toLowerCase();
    const address = formData.address.trim();
    const city = formData.city.trim();
    const state = formData.state.trim();
    const pincode = formData.pincode.trim();

    if (name.length < 2) {
      alert("Please enter your full name.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      alert("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!address || !city || !state) {
      alert("Please complete your delivery address.");
      return;
    }

    if (!/^\d{6}$/.test(pincode)) {
      alert("Enter a valid 6-digit PIN code.");
      return;
    }

    // Validate each cart item before contacting the backend.
    const invalidItem = currentCartItems.find((item) => {
      const id = getProductId(item);
      const quantity = getQuantity(item);
      const price = getPrice(item);

      return (
        typeof id !== "string" ||
        !UUID_REGEX.test(id.trim()) ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        !Number.isFinite(price) ||
        price < 0
      );
    });

    if (invalidItem) {
      // Log only the fields needed to diagnose the cart issue.
      // Never log the customer's private tracking token.
      console.error("Invalid cart item details:", {
        name: getProductName(invalidItem),
        id: getProductId(invalidItem),
        quantity: invalidItem?.quantity,
        price: getPrice(invalidItem),
        availableKeys:
          invalidItem && typeof invalidItem === "object"
            ? Object.keys(invalidItem)
            : [],
      });

      alert(
        `The product "${getProductName(
          invalidItem
        )}" has an invalid product ID, quantity, or price. Please remove it from your cart and add it again from the Shop page. If the issue continues, the cart store must be corrected to use the product UUID returned by the backend.`
      );
      return;
    }

    const deliveryAddress = [
      address,
      city,
      state,
      `PIN: ${pincode}`,
    ].join(", ");

    const orderPayload = {
      customer_name: name,
      email,
      phone,
      delivery_address: deliveryAddress,
      payment_method:
        paymentMethod === "cod"
          ? "Cash on Delivery"
          : "Online Payment",
      coupon_code: appliedCoupon ? appliedCoupon.code : null,
      items: currentCartItems.map((item) => ({
        product_id: getProductId(item).trim(),
        quantity: getQuantity(item),
      })),
    };

    setIsPlacingOrder(true);

    try {
      const response = await api.post("/orders", orderPayload);
      const data = response.data ?? {};

      const orderNumber = data.order_number;
      const trackingToken = data.tracking_token;

      if (!orderNumber || !trackingToken) {
        console.error(
          "Order response is missing tracking details.",
          {
            hasOrderNumber: Boolean(orderNumber),
            hasTrackingToken: Boolean(trackingToken),
          }
        );

        alert(
          "The server did not return the required tracking details. Please check the backend before trying again."
        );
        return;
      }

      // Save the private tracking details in this browser session.
      try {
        sessionStorage.setItem(
          "spicecraft-last-order",
          JSON.stringify({
            order_number: orderNumber,
            tracking_token: trackingToken,
          })
        );

        const savedTokens = JSON.parse(
          sessionStorage.getItem("spicecraftTrackingTokens") || "{}"
        );

        savedTokens[orderNumber] = trackingToken;

        sessionStorage.setItem(
          "spicecraftTrackingTokens",
          JSON.stringify(savedTokens)
        );
      } catch {
        // The tracking token is still passed directly to the next page.
        console.warn(
          "Browser session storage is unavailable. Keep the tracking page open."
        );
      }

      // Clear the cart only after the backend confirms order creation.
      clearCart();

      navigate(
        `/my-orders?order=${encodeURIComponent(
          orderNumber
        )}&token=${encodeURIComponent(trackingToken)}`,
        { replace: true }
      );
    } catch (error) {
      console.error("Order placement failed:", {
        status: error.response?.status,
        detail: error.response?.data?.detail,
        message: error.message,
      });

      const detail = error.response?.data?.detail;
      let message = "Unable to place your order. Please try again.";

      if (typeof detail === "string") {
        message = detail;

        if (detail.toLowerCase().includes("invalid product id")) {
          message =
            "The product ID is invalid. Please refresh the Shop page and add the product again.";
        } else if (detail.toLowerCase().includes("unavailable")) {
          message =
            "One or more products are unavailable. Refresh the Shop page and try again.";
        } else if (detail.toLowerCase().includes("insufficient stock")) {
          message = detail;
        }
      } else if (Array.isArray(detail)) {
        message = detail
          .map((item) => item.msg ?? "Invalid order details")
          .join("\n");
      } else if (!error.response) {
        message =
          "Cannot connect to the backend. Start the FastAPI server and try again.";
      } else if (error.response.status >= 500) {
        message =
          "A backend error occurred. Check the FastAPI terminal.";
      }

      alert(message);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-stone-900">
          Your cart is empty
        </h1>

        <p className="mt-3 text-stone-600">
          Add some delicious spices before checking out.
        </p>

        <Link
          to="/shop"
          className="mt-6 inline-block rounded-lg bg-[#8c3b1e] px-6 py-3 font-semibold text-white hover:bg-[#722f18]"
        >
          Browse Spices
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold text-stone-900">
        Checkout
      </h1>

      <p className="mb-8 text-stone-600">
        Complete your delivery details. No customer login required.
      </p>

      <form
        onSubmit={handlePlaceOrder}
        className="grid grid-cols-1 gap-8 lg:grid-cols-3"
      >
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="mb-5 text-xl font-semibold text-stone-900">
              Delivery Details
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-stone-800">
                Full Name *
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  minLength={2}
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-[#783b25]"
                  placeholder="Enter your full name"
                />
              </label>

              <label className="text-sm font-medium text-stone-800">
                Mobile Number *
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  maxLength={10}
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-[#783b25]"
                  placeholder="10-digit mobile number"
                />
              </label>

              <label className="text-sm font-medium text-stone-800 sm:col-span-2">
                Email Address *
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  autoComplete="email"
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-[#783b25]"
                  placeholder="you@example.com"
                />
              </label>

              <label className="text-sm font-medium text-stone-800 sm:col-span-2">
                Door No. / Street Address *
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  autoComplete="street-address"
                  rows={3}
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-[#783b25]"
                  placeholder="House number, street, area"
                />
              </label>

              <label className="text-sm font-medium text-stone-800">
                City *
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  autoComplete="address-level2"
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-[#783b25]"
                  placeholder="Your city"
                />
              </label>

              <label className="text-sm font-medium text-stone-800">
                State *
                <input
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  autoComplete="address-level1"
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-[#783b25]"
                  placeholder="Your state"
                />
              </label>

              <label className="text-sm font-medium text-stone-800 sm:col-span-2">
                PIN Code *
                <input
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  inputMode="numeric"
                  autoComplete="postal-code"
                  maxLength={6}
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-[#783b25]"
                  placeholder="6-digit PIN code"
                />
              </label>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="mb-4 text-xl font-semibold text-stone-900">
              Payment Method
            </h2>

            <label className="mb-3 flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-4">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={(event) =>
                  setPaymentMethod(event.target.value)
                }
              />

              <span>
                <span className="block font-semibold">
                  Cash on Delivery
                </span>
                <span className="text-sm text-stone-500">
                  Pay when your order arrives.
                </span>
              </span>
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-4">
              <input
                type="radio"
                name="paymentMethod"
                value="online"
                checked={paymentMethod === "online"}
                onChange={(event) =>
                  setPaymentMethod(event.target.value)
                }
              />

              <span>
                <span className="block font-semibold">
                  Online Payment
                </span>
                <span className="text-sm text-stone-500">
                  A payment gateway must be configured to collect online payments.
                </span>
              </span>
            </label>
          </div>
        </div>

        <aside className="h-fit rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
          <h2 className="mb-5 text-xl font-semibold text-stone-900">
            Order Summary
          </h2>

          <div className="mb-5 space-y-4">
            {items.map((item, index) => (
              <div
                key={`${getProductId(item) ?? "product"}-${index}`}
                className="flex justify-between gap-4 text-sm"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    {getProductName(item)}
                  </p>
                  <p className="text-stone-500">
                    Qty: {getQuantity(item) || 0}
                  </p>
                </div>

                <p className="shrink-0 font-semibold">
                  {formatPrice(getPrice(item) * getQuantity(item))}
                </p>
              </div>
            ))}
          </div>

          {/* Coupon Code Section */}
          <div className="border-t border-gray-200 pt-4 pb-2">
            <label htmlFor="coupon-code-input" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
              Have a Coupon?
            </label>
            {appliedCoupon ? (
              <div className="flex items-center justify-between gap-2 rounded-xl border border-emerald-300 bg-emerald-50/90 p-3 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-700 text-xs font-bold text-white">
                    %
                  </span>
                  <div>
                    <span className="font-mono font-bold text-emerald-950 text-sm">
                      {appliedCoupon.code}
                    </span>
                    <span className="block text-xs font-semibold text-emerald-800">
                      Saved {formatPrice(appliedCoupon.discount_amount)}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="rounded-lg px-2.5 py-1 text-xs font-bold text-rose-700 hover:bg-rose-100 transition"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  id="coupon-code-input"
                  type="text"
                  placeholder="Enter code (e.g. SPICE10)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleApplyCoupon();
                    }
                  }}
                  className="min-w-0 flex-1 rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm font-mono uppercase text-stone-900 placeholder-stone-400 outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={couponLoading || !couponInput.trim()}
                  className="shrink-0 rounded-xl bg-[#8c3b1e] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#722f18] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {couponLoading ? "Applying..." : "Apply"}
                </button>
              </div>
            )}

            {couponError && (
              <p className="mt-2 text-xs font-semibold text-rose-700">{couponError}</p>
            )}
            {couponSuccess && (
              <p className="mt-2 text-xs font-semibold text-emerald-800">{couponSuccess}</p>
            )}
          </div>

          <div className="space-y-3 border-t border-gray-200 pt-4 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-stone-600">Subtotal</span>
              <span className="font-semibold text-stone-900">{formatPrice(subtotal)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between gap-3 text-emerald-800 font-semibold">
                <span>Coupon Discount ({appliedCoupon?.code})</span>
                <span>- {formatPrice(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between gap-3">
              <span className="text-stone-600">Delivery</span>
              <span className="font-semibold text-stone-900">
                {deliveryCharge === 0
                  ? "FREE"
                  : formatPrice(deliveryCharge)}
              </span>
            </div>

            <div className="flex justify-between border-t border-gray-200 pt-4 text-lg font-bold text-stone-900">
              <span>Payable Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPlacingOrder}
            className="mt-6 w-full rounded-lg bg-[#8c3b1e] px-5 py-3 font-semibold text-white transition hover:bg-[#722f18] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPlacingOrder ? "Placing Order..." : "Place Order"}
          </button>

          <p className="mt-3 text-center text-xs text-stone-500">
            Keep your order tracking details private after checkout.
          </p>

          <Link
            to="/cart"
            className="mt-4 block text-center text-sm font-medium text-[#783b25] hover:underline"
          >
            Return to Cart
          </Link>
        </aside>
      </form>
    </section>
  );
}

export default Checkout;
