
import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Package,
  ShoppingBag,
  Truck,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ArrowRight,
  Search,
} from "lucide-react";
import api from "../api";

const REFRESH_INTERVAL = 5000;

const formatPrice = (amount) =>
  `₹${Number(amount ?? 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const normalizeStatus = (status) =>
  String(status ?? "").trim().toLowerCase();

const isCancelled = (status) =>
  normalizeStatus(status).includes("cancel");

const isOutForDelivery = (status) =>
  normalizeStatus(status).includes("out for delivery");

const isDelivered = (status) =>
  normalizeStatus(status) === "delivered";

const getStatusIcon = (status) => {
  const value = normalizeStatus(status);

  if (value.includes("cancel")) return XCircle;
  if (value.includes("out for delivery")) return Truck;
  if (value.includes("deliver")) return CheckCircle2;
  if (value.includes("ship") || value.includes("transit")) {
    return Truck;
  }
  if (
    value.includes("process") ||
    value.includes("confirm")
  ) {
    return Clock;
  }

  return Package;
};

const getStatusClass = (status) => {
  const value = normalizeStatus(status);

  if (value.includes("cancel")) return "track-cancelled";
  if (value.includes("out for delivery")) return "track-shipped";
  if (value.includes("deliver")) return "track-delivered";
  if (value.includes("ship") || value.includes("transit")) {
    return "track-shipped";
  }

  return "track-pending";
};

const getProgressIndex = (status) => {
  const value = normalizeStatus(status);

  if (value.includes("cancel")) return -1;
  if (value.includes("out for delivery")) return 2;
  if (value.includes("deliver")) return 3;
  if (value.includes("ship") || value.includes("transit")) {
    return 2;
  }
  if (
    value.includes("process") ||
    value.includes("confirm")
  ) {
    return 1;
  }

  return 0;
};

const getErrorMessage = (error) => {
  const status = error?.response?.status;

  if (!error?.response) {
    return "Cannot connect to the SpiceCraft backend. Please check that the backend is running.";
  }

  if (status === 404) {
    return "Order not found, or the order number and tracking token are incorrect.";
  }

  if (status === 401 || status === 403) {
    return "Tracking access was denied. Please check your private tracking token.";
  }

  if (status === 422) {
    return "Invalid tracking details. Please check the order number and token.";
  }

  if (status >= 500) {
    return "The server encountered an error. Please check the backend terminal.";
  }

  return (
    error.response?.data?.detail ||
    "Unable to load the order. Please try again."
  );
};

export default function MyOrders() {
  const [searchParams] = useSearchParams();

  const urlOrder = searchParams.get("order") || "";
  const urlToken = searchParams.get("token") || "";

  const [orderNumber, setOrderNumber] = useState(urlOrder);
  const [token, setToken] = useState(urlToken);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  // These are the credentials for the order currently being tracked.
  const [trackedOrderNumber, setTrackedOrderNumber] = useState("");
  const [trackedToken, setTrackedToken] = useState("");

  const loadOrder = useCallback(
    async (number, secret, silent = false) => {
      const cleanNumber = String(number ?? "").trim();
      const cleanToken = String(secret ?? "").trim();

      if (!cleanNumber || !cleanToken) {
        if (!silent) {
          setOrder(null);
          setError(
            "Please enter both your order number and private tracking token."
          );
        }
        return;
      }

      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
        setError("");
      }

      try {
        const response = await api.get(
          `/track/${encodeURIComponent(cleanNumber)}`,
          {
            params: { token: cleanToken },
          }
        );

        const data = response.data?.order ?? response.data;

        if (
          !data ||
          typeof data !== "object" ||
          !data.order_number
        ) {
          throw new Error(
            "The server returned an invalid order response."
          );
        }

        setOrder(data);
        setOrderNumber(cleanNumber);
        setToken(cleanToken);
        setTrackedOrderNumber(cleanNumber);
        setTrackedToken(cleanToken);
        setLastUpdated(new Date());
        setError("");
      } catch (err) {
        // During automatic refresh, keep the existing order visible.
        if (!silent) {
          setOrder(null);
          setError(
            err.message ===
              "The server returned an invalid order response."
              ? err.message
              : getErrorMessage(err)
          );
        }
      } finally {
        if (silent) {
          setRefreshing(false);
        } else {
          setLoading(false);
        }
      }
    },
    []
  );

  // Automatically load an order opened from checkout.
  useEffect(() => {
    setOrderNumber(urlOrder);
    setToken(urlToken);

    if (urlOrder && urlToken) {
      loadOrder(urlOrder, urlToken);
    } else {
      setOrder(null);
      setError("");
      setTrackedOrderNumber("");
      setTrackedToken("");
    }
  }, [urlOrder, urlToken, loadOrder]);

  // Refresh the current order from the database every 5 seconds.
  useEffect(() => {
    if (!trackedOrderNumber || !trackedToken) return;

    const intervalId = setInterval(() => {
      loadOrder(trackedOrderNumber, trackedToken, true);
    }, REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
  }, [trackedOrderNumber, trackedToken, loadOrder]);

  const handleSubmit = (event) => {
    event.preventDefault();
    loadOrder(orderNumber, token);
  };

  const handleReset = () => {
    setOrder(null);
    setError("");
    setOrderNumber("");
    setToken("");
    setTrackedOrderNumber("");
    setTrackedToken("");
    setLastUpdated(null);
  };

  const status = order?.status || "Order Placed";
  const StatusIcon = getStatusIcon(status);
  const progressIndex = getProgressIndex(status);

  const createdAt = order?.created_at ?? order?.createdAt;

  const dateLabel = createdAt
    ? new Date(createdAt).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Date unavailable";

  const items = Array.isArray(order?.items) ? order.items : [];

  const subtotal = Number(
    order?.subtotal ??
      items.reduce((sum, item) => {
        const quantity = Number(item.quantity ?? 1);
        const price = Number(
          item.unit_price ?? item.unitPrice ?? item.price ?? 0
        );
        return sum + price * quantity;
      }, 0)
  );

  const deliveryCharge = Number(
    order?.delivery_charge ?? order?.deliveryCharge ?? 0
  );

  const totalAmount = Number(
    order?.total_amount ??
      order?.totalAmount ??
      order?.total ??
      subtotal + deliveryCharge
  );

  return (
    <main className="track-page">
      <div className="track-container">
        <header className="track-heading">
          <p className="track-eyebrow">SPICECRAFT</p>
          <h1>Track My Order</h1>
          <p className="track-description">
            Check your order status, products and payment summary.
            No customer login is required.
          </p>
        </header>

        <section className="track-search-card">
          <div className="track-section-title">
            <div className="track-icon">
              <Search size={22} />
            </div>
            <div>
              <h2>Find Your Order</h2>
              <p>Use the details provided after checkout.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="track-form">
            <label htmlFor="order-number">Order Number</label>
            <input
              id="order-number"
              type="text"
              value={orderNumber}
              onChange={(event) =>
                setOrderNumber(event.target.value)
              }
              placeholder="Enter your order number"
              autoComplete="off"
              required
            />

            <label htmlFor="tracking-token">
              Private Tracking Token
            </label>
            <input
              id="tracking-token"
              type="password"
              value={token}
              onChange={(event) => setToken(event.target.value)}
              placeholder="Paste your private tracking token"
              autoComplete="off"
              required
            />

            <button
              type="submit"
              className="track-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCw size={17} className="track-spin" />
                  Checking Order...
                </>
              ) : (
                <>
                  <Search size={17} />
                  Track Order
                </>
              )}
            </button>
          </form>

          <p className="track-security">
            Keep your private tracking token safe. Do not share it
            with anyone.
          </p>
        </section>

        {error && (
          <div className="track-message track-error" role="alert">
            <XCircle size={22} />
            <p>{error}</p>
          </div>
        )}

        {loading && (
          <div className="track-message" role="status">
            <RefreshCw size={22} className="track-spin" />
            <p>Loading your order details...</p>
          </div>
        )}

        {order && (
          <section className="track-result" aria-live="polite">
            <div className="track-result-header">
              <div>
                <p className="track-label">ORDER NUMBER</p>
                <h2 className="track-order-number">
                  {order.order_number || trackedOrderNumber}
                </h2>
                <p className="track-date">{dateLabel}</p>
              </div>

              <div className={`track-status ${getStatusClass(status)}`}>
                <StatusIcon size={17} />
                <span>{status}</span>
              </div>
            </div>

            <div className="track-refresh-info">
              {refreshing ? (
                <>
                  <RefreshCw size={14} className="track-spin" />
                  Updating order status...
                </>
              ) : (
                <>
                  <CheckCircle2 size={14} />
                  Auto-refresh is on
                  {lastUpdated &&
                    ` · Updated at ${lastUpdated.toLocaleTimeString(
                      "en-IN"
                    )}`}
                </>
              )}
            </div>

            {progressIndex === -1 ? (
              <div className="track-cancel-note">
                <XCircle size={20} />
                This order has been cancelled.
              </div>
            ) : (
              <div className="track-progress">
                {[
                  { label: "Order Placed", Icon: CheckCircle2 },
                  { label: "Processing", Icon: Package },
                  { label: "Shipped", Icon: Truck },
                  { label: "Delivered", Icon: CheckCircle2 },
                ].map(({ label, Icon }, index) => (
                  <div
                    className={`track-progress-step ${
                      index <= progressIndex ? "active" : ""
                    }`}
                    key={label}
                  >
                    <Icon size={22} />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            )}

            {isOutForDelivery(status) && (
              <p className="track-status-note">
                Your order is out for delivery.
              </p>
            )}

            {isDelivered(status) && (
              <p className="track-status-note">
                Your order has been delivered successfully.
              </p>
            )}

            <div className="track-divider" />

            <h3 className="track-products-heading">
              <ShoppingBag size={19} />
              Order Items
            </h3>

            <div className="track-products">
              {items.length > 0 ? (
                items.map((item, index) => {
                  const name =
                    item.product_name ||
                    item.productName ||
                    item.name ||
                    "SpiceCraft Product";

                  const quantity = Number(item.quantity ?? 1);

                  const unitPrice = Number(
                    item.unit_price ??
                      item.unitPrice ??
                      item.price ??
                      0
                  );

                  const lineTotal = Number(
                    item.line_total ??
                      item.lineTotal ??
                      unitPrice * quantity
                  );

                  const image = item.product_image || item.image;

                  return (
                    <article
                      className="track-product"
                      key={`${
                        item.product_id || item.productId || name
                      }-${index}`}
                    >
                      {image ? (
                        <img
                          className="track-product-image"
                          src={image}
                          alt={name}
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="track-product-placeholder">
                          <ShoppingBag size={22} />
                        </div>
                      )}

                      <div className="track-product-info">
                        <h4>{name}</h4>
                        <p>
                          {formatPrice(unitPrice)} × {quantity}
                        </p>
                      </div>

                      <strong>{formatPrice(lineTotal)}</strong>
                    </article>
                  );
                })
              ) : (
                <p className="track-muted">
                  No product details were returned for this order.
                </p>
              )}
            </div>

            <div className="track-divider" />

            <h3 className="track-products-heading">
              <Package size={19} />
              Payment Summary
            </h3>

            <div className="track-payment">
              <div className="track-payment-row">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              {Number(order?.discount_amount || 0) > 0 && (
                <div className="track-payment-row" style={{ color: "#047857", fontWeight: 600 }}>
                  <span>Coupon Discount ({order?.coupon_code || "Applied"})</span>
                  <span>- {formatPrice(order?.discount_amount)}</span>
                </div>
              )}

              <div className="track-payment-row">
                <span>Delivery Charge</span>
                <span>{formatPrice(deliveryCharge)}</span>
              </div>

              <div className="track-payment-row">
                <span>Payment Method</span>
                <span>
                  {order.payment_method ??
                    order.paymentMethod ??
                    "Not available"}
                </span>
              </div>

              <div className="track-total">
                <span>Total Amount</span>
                <strong>{formatPrice(totalAmount)}</strong>
              </div>
            </div>

            {(order.delivery_address || order.deliveryAddress) && (
              <>
                <div className="track-divider" />
                <h3 className="track-products-heading">
                  Delivery Address
                </h3>
                <p className="track-address">
                  {order.delivery_address || order.deliveryAddress}
                </p>
              </>
            )}
          </section>
        )}

        <div className="track-bottom-links">
          <Link to="/shop">
            Explore Spices <ArrowRight size={16} />
          </Link>

          {order && (
            <button
              type="button"
              className="track-reset"
              onClick={handleReset}
            >
              Track Another Order
            </button>
          )}
        </div>
      </div>

      <style>{`
        .track-page {
          min-height: 65vh;
          padding: 44px 20px 72px;
          background: #faf8f3;
          color: #29251f;
        }

        .track-container { width: 100%; max-width: 800px; margin: 0 auto; }
        .track-heading { margin-bottom: 28px; }
        .track-eyebrow { margin: 0 0 8px; color: #936b2c; font-size: 12px; font-weight: 800; letter-spacing: 2px; }
        .track-heading h1 { margin: 0; font-size: clamp(28px, 4vw, 38px); }
        .track-description { max-width: 620px; margin: 10px 0 0; color: #777168; line-height: 1.7; }

        .track-search-card, .track-result, .track-message {
          padding: 25px; border: 1px solid #eae4d9; border-radius: 15px;
          background: white; box-shadow: 0 4px 18px rgba(45, 34, 15, .035);
        }

        .track-section-title { display: flex; align-items: center; gap: 13px; margin-bottom: 22px; }
        .track-icon, .track-product-placeholder {
          display: grid; flex: 0 0 44px; width: 44px; height: 44px;
          place-items: center; border-radius: 10px; background: #f7f0e2; color: #8b642b;
        }
        .track-section-title h2 { margin: 0; font-size: 19px; }
        .track-section-title p { margin: 5px 0 0; color: #777168; font-size: 13px; }
        .track-form { display: grid; gap: 10px; }
        .track-form label { margin-top: 5px; font-size: 13px; font-weight: 700; }
        .track-form input {
          box-sizing: border-box; width: 100%; min-height: 45px; padding: 12px 13px;
          border: 1px solid #ded7ca; border-radius: 8px; background: #fff;
          color: #29251f; font: inherit; font-size: 14px;
        }
        .track-form input:focus { outline: 2px solid #c9a56b; outline-offset: 1px; }
        .track-submit {
          display: flex; align-items: center; justify-content: center; gap: 9px;
          min-height: 46px; margin-top: 9px; padding: 12px 18px; border: 0;
          border-radius: 9px; background: #5b351c; color: white;
          font-size: 14px; font-weight: 700; cursor: pointer;
        }
        .track-submit:hover { background: #7b4b27; }
        .track-submit:disabled { opacity: .7; cursor: wait; }
        .track-security, .track-muted { color: #81796e; font-size: 12px; line-height: 1.7; }
        .track-security { margin: 15px 0 0; }
        .track-message { display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 20px; color: #6f5a38; }
        .track-message p { margin: 0; line-height: 1.6; }
        .track-error { color: #a42a2a; }
        .track-result { margin-top: 22px; }
        .track-result-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
        .track-label { margin: 0 0 7px; color: #8b8377; font-size: 11px; font-weight: 750; letter-spacing: 1px; }
        .track-order-number { margin: 0; font-size: 18px; overflow-wrap: anywhere; }
        .track-date { margin: 7px 0 0; color: #777168; font-size: 13px; }

        .track-status { display: inline-flex; align-items: center; gap: 7px; padding: 8px 11px; border-radius: 999px; font-size: 12px; font-weight: 700; white-space: nowrap; }
        .track-pending { background: #fff4db; color: #946313; }
        .track-shipped { background: #e9f2ff; color: #245a9a; }
        .track-delivered { background: #e6f6e9; color: #24733a; }
        .track-cancelled { background: #ffebeb; color: #b42d2d; }

        .track-refresh-info {
          display: flex; flex-wrap: wrap; align-items: center; gap: 6px;
          margin-top: 12px; color: #81796e; font-size: 11px;
        }
        .track-status-note {
          padding: 12px; border-radius: 8px; background: #f7f0e2;
          color: #70451f; font-size: 13px;
        }

        .track-progress { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; margin: 30px 0 20px; }
        .track-progress-step { display: flex; flex-direction: column; align-items: center; gap: 8px; color: #b4ac9f; text-align: center; font-size: 11px; }
        .track-progress-step.active { color: #8b642b; font-weight: 700; }
        .track-cancel-note { display: flex; align-items: center; gap: 10px; margin-top: 24px; padding: 12px; border-radius: 8px; background: #ffebeb; color: #b42d2d; font-size: 13px; }
        .track-divider { height: 1px; margin: 22px 0; background: #eee9e1; }
        .track-products-heading { display: flex; align-items: center; gap: 9px; margin: 0 0 17px; font-size: 17px; }
        .track-products { display: grid; gap: 17px; }
        .track-product { display: flex; align-items: center; gap: 12px; min-width: 0; }
        .track-product-image { width: 54px; height: 54px; flex: 0 0 54px; border-radius: 9px; object-fit: cover; background: #f7f0e2; }
        .track-product-placeholder { width: 54px; height: 54px; flex-basis: 54px; }
        .track-product-info { min-width: 0; flex: 1; }
        .track-product-info h4 { margin: 0; font-size: 14px; overflow-wrap: anywhere; }
        .track-product-info p { margin: 5px 0 0; color: #81796e; font-size: 12px; }
        .track-product > strong { font-size: 13px; white-space: nowrap; }
        .track-payment { display: grid; gap: 13px; }
        .track-payment-row, .track-total { display: flex; align-items: center; justify-content: space-between; gap: 16px; font-size: 13px; }
        .track-payment-row span:first-child { color: #777168; }
        .track-payment-row span:last-child { text-align: right; overflow-wrap: anywhere; }
        .track-total { margin-top: 5px; padding-top: 16px; border-top: 1px solid #eee9e1; font-size: 16px; }
        .track-total strong { font-size: 22px; }
        .track-address { margin: 0; color: #5f584e; font-size: 14px; line-height: 1.7; overflow-wrap: anywhere; }

        .track-bottom-links { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 18px; margin-top: 22px; }
        .track-bottom-links a { display: inline-flex; align-items: center; gap: 8px; color: #70451f; font-size: 14px; font-weight: 700; text-decoration: none; }
        .track-reset { padding: 8px 12px; border: 1px solid #ded7ca; border-radius: 8px; background: white; color: #70451f; cursor: pointer; }
        .track-spin { animation: track-spin 1s linear infinite; }
        @keyframes track-spin { to { transform: rotate(360deg); } }

        @media (max-width: 600px) {
          .track-page { padding: 30px 14px 48px; }
          .track-search-card, .track-result, .track-message { padding: 17px; }
          .track-result-header { flex-direction: column; }
          .track-progress { gap: 4px; }
          .track-progress-step { font-size: 10px; }
          .track-progress-step svg { width: 19px; height: 19px; }
          .track-product-image { width: 44px; height: 44px; flex-basis: 44px; }
          .track-product-placeholder { width: 44px; height: 44px; flex-basis: 44px; }
          .track-total strong { font-size: 19px; }
        }
      `}</style>
    </main>
  );
}
