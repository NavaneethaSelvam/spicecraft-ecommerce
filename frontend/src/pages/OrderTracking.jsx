
import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import api from "../api";

const formatPrice = (value) =>
  `₹${Number(value ?? 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const getStatusStage = (status) => {
  const normalized = String(status || "").trim().toLowerCase();

  if (["cancelled", "canceled"].includes(normalized)) return -1;
  if (["delivered", "completed"].includes(normalized)) return 4;

  if (["shipped", "out for delivery", "out_for_delivery"].includes(normalized))
    return 3;

  if (
    ["being packed", "packed", "processing", "preparing", "order processing"].includes(normalized)
  )
    return 2;

  if (["order confirmed", "confirmed", "accepted"].includes(normalized))
    return 1;

  return 0;
};

export default function OrderTracking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orderNumber = searchParams.get("order")?.trim() || "";
  const token = searchParams.get("token")?.trim() || "";

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showTrackForm, setShowTrackForm] = useState(false);
  const [newOrderNumber, setNewOrderNumber] = useState("");
  const [newTrackingToken, setNewTrackingToken] = useState("");
  const [formError, setFormError] = useState("");

  // Auto-fill latest guest order, if Checkout saved it in sessionStorage.
  useEffect(() => {
    try {
      const savedOrder = JSON.parse(
        sessionStorage.getItem("spicecraft-last-order") || "null"
      );

      if (savedOrder) {
        setNewOrderNumber(savedOrder.order_number || "");
        setNewTrackingToken(savedOrder.tracking_token || "");
      }
    } catch {
      // Ignore invalid session data.
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchOrder() {
      setLoading(true);
      setError("");
      setOrder(null);

      if (!orderNumber || !token) {
        setError(
          "Tracking details are missing. Use your checkout tracking link or enter your order details below."
        );
        setLoading(false);
        setShowTrackForm(true);
        return;
      }

      try {
        const response = await api.get(
          `/track/${encodeURIComponent(orderNumber)}`,
          { params: { token } }
        );

        if (cancelled) return;

        const data = response.data?.order ?? response.data;

        if (!data || typeof data !== "object" || !data.order_number) {
          setError("We could not verify this order. Please check your tracking details.");
          return;
        }

        setOrder(data);
      } catch (err) {
        if (cancelled) return;

        const statusCode = err.response?.status;

        if ([401, 403, 404].includes(statusCode)) {
          setError(
            "This tracking link is invalid, or the order could not be found. Check your order number and private tracking token."
          );
        } else {
          setError(
            "Unable to load your order. Please check that the SpiceCraft backend is running."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchOrder();

    return () => {
      cancelled = true;
    };
  }, [orderNumber, token]);

  const handleTrackAnotherOrder = (event) => {
    event.preventDefault();

    const number = newOrderNumber.trim();
    const privateToken = newTrackingToken.trim();

    if (!number || !privateToken) {
      setFormError("Please enter both the order number and private tracking token.");
      return;
    }

    setFormError("");

    navigate(
      `/order-tracking?order=${encodeURIComponent(number)}&token=${encodeURIComponent(privateToken)}`
    );
  };

  const trackAnotherOrderForm = (
    <section className="mx-auto mt-6 max-w-xl rounded-2xl border border-[#eee0d2] bg-[#fffdf9] p-5 shadow-sm sm:p-7">
      <h2 className="font-serif text-xl font-bold text-stone-900">
        Track Another Order
      </h2>

      <p className="mt-2 text-sm leading-6 text-stone-600">
        Enter the order number and private tracking token from that order's checkout.
      </p>

      <form className="mt-5 space-y-4" onSubmit={handleTrackAnotherOrder}>
        <label className="block text-sm font-semibold text-stone-900">
          Order Number
          <input
            type="text"
            value={newOrderNumber}
            onChange={(event) => {
              setNewOrderNumber(event.target.value);
              setFormError("");
            }}
            placeholder="Enter order number"
            autoComplete="off"
            required
            className="mt-2 w-full rounded-xl border border-[#dcc8b7] bg-white px-4 py-3 outline-none focus:border-[#8c3b1e]"
          />
        </label>

        <label className="block text-sm font-semibold text-stone-900">
          Private Tracking Token
          <input
            type="password"
            value={newTrackingToken}
            onChange={(event) => {
              setNewTrackingToken(event.target.value);
              setFormError("");
            }}
            placeholder="Enter private tracking token"
            autoComplete="off"
            required
            className="mt-2 w-full rounded-xl border border-[#dcc8b7] bg-white px-4 py-3 outline-none focus:border-[#8c3b1e]"
          />
        </label>

        {formError && (
          <p role="alert" className="text-sm text-red-700">
            {formError}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="flex-1 rounded-xl bg-[#8c3b1e] px-5 py-3 font-bold text-white hover:bg-[#722f18]"
          >
            Track Order
          </button>

          <button
            type="button"
            onClick={() => {
              setShowTrackForm(false);
              setFormError("");
            }}
            className="rounded-xl border border-[#dcc8b7] px-5 py-3 font-bold text-[#8c3b1e] hover:bg-[#f9eee3]"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#fcf8f3] px-4 py-20 text-center">
        <div>
          <div className="mb-4 text-5xl">📦</div>
          <p className="font-semibold text-[#8c3b1e]">
            Loading your order securely...
          </p>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-[70vh] bg-[#fcf8f3] px-4 py-16">
        <div className="mx-auto max-w-xl rounded-3xl border border-[#eee0d2] bg-[#fffdf9] p-8 text-center shadow-sm">
          <div className="text-5xl">📦</div>

          <h1 className="mt-4 font-serif text-3xl font-bold text-stone-900">
            Order Tracking
          </h1>

          <p className="mt-4 text-sm leading-6 text-red-700">
            {error || "Order details are unavailable."}
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => setShowTrackForm((previous) => !previous)}
              className="rounded-xl bg-[#8c3b1e] px-6 py-3 font-bold text-white hover:bg-[#722f18]"
            >
              {showTrackForm ? "Close Tracking Form" : "Track Another Order"}
            </button>

            <Link
              to="/shop"
              className="rounded-xl border border-[#8c3b1e] px-6 py-3 font-bold text-[#8c3b1e] hover:bg-[#f9eee3]"
            >
              Browse Spices
            </Link>

            <Link
              to="/"
              className="rounded-xl border border-[#8c3b1e] px-6 py-3 font-bold text-[#8c3b1e] hover:bg-[#f9eee3]"
            >
              Go Home
            </Link>
          </div>
        </div>

        {showTrackForm && trackAnotherOrderForm}
      </main>
    );
  }

  const status = String(order.status || "Order Placed");
  const currentStage = getStatusStage(status);
  const cancelled = currentStage === -1;

  const stages = [
    "Order Placed",
    "Order Confirmed",
    "Being Packed",
    "Shipped",
    "Delivered",
  ];

  const paymentMethod = String(order.payment_method || "");
  const paymentLabel = /online/i.test(paymentMethod)
    ? "Online Payment"
    : "Cash on Delivery";

  const orderDate = order.created_at
    ? new Date(order.created_at).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Date unavailable";

  const items = Array.isArray(order.items) ? order.items : [];
  const subtotal = Number(order.subtotal ?? 0);
  const deliveryCharge = Number(order.delivery_charge ?? 0);
  const total = Number(
    order.total_amount ?? order.total ?? subtotal + deliveryCharge
  );

  return (
    <main className="min-h-screen bg-[#fcf8f3] px-4 py-8 text-[#39251d] sm:px-6 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <header className="mb-9 text-center">
          <span className="text-xs font-extrabold tracking-[0.25em] text-[#8c3b1e]">
            SPICECRAFT ORDERS
          </span>
          <h1 className="mt-3 font-serif text-3xl font-bold text-stone-900 sm:text-5xl">
            Order Tracking
          </h1>
          <p className="mt-3 text-sm text-stone-600">
            Track the progress of your SpiceCraft delivery.
          </p>
        </header>

        <section className="mb-6 rounded-2xl border border-[#eee0d2] bg-[#fffdf9] p-5 shadow-sm sm:p-7">
          <p className="text-xs font-bold tracking-wider text-[#968476]">ORDER NUMBER</p>
          <h2 className="mt-2 break-all text-xl font-extrabold text-stone-900">
            {order.order_number}
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-[#968476]">Order Date</p>
              <p className="mt-1 font-semibold">{orderDate}</p>
            </div>
            <div>
              <p className="text-xs text-[#968476]">Payment Method</p>
              <p className="mt-1 font-semibold">{paymentLabel}</p>
            </div>
            <div>
              <p className="text-xs text-[#968476]">Order Status</p>
              <p className={`mt-1 font-bold ${cancelled ? "text-red-700" : currentStage === 4 ? "text-green-700" : "text-[#527b45]"}`}>
                {status}
              </p>
            </div>
          </div>
        </section>

        <section className="mb-6 rounded-2xl border border-[#eee0d2] bg-[#fffdf9] p-5 shadow-sm sm:p-7">
          <h2 className="font-serif text-2xl font-bold text-stone-900">
            Delivery Progress
          </h2>

          {cancelled ? (
            <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4">
              <p className="font-bold text-red-700">This order has been cancelled.</p>
              <p className="mt-1 text-sm text-red-600">
                Please contact SpiceCraft support if you need help with this order.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-5">
              {stages.map((stage, index) => {
                const completed = index < currentStage;
                const active = index === currentStage;

                return (
                  <div key={stage} className="flex items-start gap-3">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-bold ${
                      completed || active
                        ? "bg-[#527b45] text-white"
                        : "border border-[#e4d6c9] bg-[#f7f0e8] text-[#9b897b]"
                    }`}>
                      {completed ? "✓" : index + 1}
                    </div>

                    <div className="pt-1">
                      <p className={`font-bold ${
                        active ? "text-[#8c3b1e]" : completed ? "text-[#527b45]" : "text-[#6d5a4d]"
                      }`}>
                        {stage}{active ? " — Current Stage" : ""}
                      </p>
                      <p className="mt-1 text-sm text-stone-600">
                        {completed
                          ? "This stage is completed."
                          : active
                            ? "Your order is currently at this stage."
                            : "Waiting for this stage."}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <p className="mt-6 rounded-xl bg-[#f9eee3] p-4 text-sm leading-6 text-stone-800">
            Tracking progress updates when the SpiceCraft administrator changes your order status.
          </p>
        </section>

        <section className="mb-6 rounded-2xl border border-[#eee0d2] bg-[#fffdf9] p-5 shadow-sm sm:p-7">
          <h2 className="mb-5 font-serif text-2xl font-bold text-stone-900">
            Items Ordered
          </h2>

          {items.length === 0 ? (
            <p className="text-sm text-stone-600">Item details are unavailable.</p>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => {
                const itemName = item.product_name || item.name || "SpiceCraft Product";
                const quantity = Number(item.quantity ?? 1);
                const unitPrice = Number(item.unit_price ?? item.price ?? 0);
                const lineTotal = Number(item.line_total ?? unitPrice * quantity);
                const image = item.product_image || item.image_url || item.image || "/images/product-placeholder.jpg";

                return (
                  <div
                    key={`${item.product_id ?? itemName}-${index}`}
                    className="flex items-center gap-4 border-b border-[#f0e5da] pb-4 last:border-0 last:pb-0"
                  >
                    <img
                      src={image}
                      alt={itemName}
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = "/images/product-placeholder.jpg";
                      }}
                      className="h-16 w-16 shrink-0 rounded-xl border border-[#eee0d2] bg-[#f5ede4] object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="break-words font-bold text-stone-900">{itemName}</p>
                      <p className="mt-1 text-sm text-stone-600">
                        {formatPrice(unitPrice)} × {quantity}
                      </p>
                    </div>
                    <strong className="shrink-0 text-right text-stone-900">
                      {formatPrice(lineTotal)}
                    </strong>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-[#eee0d2] bg-[#fffdf9] p-5 shadow-sm sm:p-7">
          <h2 className="mb-5 font-serif text-2xl font-bold text-stone-900">
            Payment Summary
          </h2>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-stone-600">Subtotal</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>
            {Number(order?.discount_amount || 0) > 0 && (
              <div className="flex justify-between gap-3 text-emerald-800 font-semibold">
                <span>Coupon Discount ({order?.coupon_code || "Applied"})</span>
                <span>- {formatPrice(order?.discount_amount)}</span>
              </div>
            )}
            <div className="flex justify-between gap-3">
              <span className="text-stone-600">Delivery</span>
              <strong>{deliveryCharge === 0 ? "FREE" : formatPrice(deliveryCharge)}</strong>
            </div>
            <div className="flex justify-between gap-3 border-t border-dashed border-[#dcc8b7] pt-5">
              <span className="font-bold">Total Amount</span>
              <strong className="text-2xl text-[#8c3b1e]">{formatPrice(total)}</strong>
            </div>
            <p className="rounded-xl bg-[#f9eee3] p-3 text-xs leading-5 text-stone-800">
              {paymentLabel === "Cash on Delivery"
                ? "Please pay the order amount when your delivery arrives."
                : "Check your payment gateway for the actual payment confirmation."}
            </p>
          </div>
        </section>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              setShowTrackForm((previous) => !previous);
              setFormError("");
            }}
            className="inline-flex rounded-xl border border-[#8c3b1e] px-6 py-3.5 text-sm font-bold text-[#8c3b1e] hover:bg-[#f9eee3]"
          >
            {showTrackForm ? "Close Tracking Form" : "Track Another Order"}
          </button>

          <Link
            to="/shop"
            className="inline-flex rounded-xl bg-[#8c3b1e] px-7 py-3.5 text-sm font-bold text-white hover:bg-[#722f18]"
          >
            Continue Shopping
          </Link>
        </div>

        {showTrackForm && trackAnotherOrderForm}
      </div>
    </main>
  );
}
