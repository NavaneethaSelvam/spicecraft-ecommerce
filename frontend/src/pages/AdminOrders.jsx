
import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  RefreshCw,
  Package,
  Tag,
  Search,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  IndianRupee,
  User,
  MapPin,
  Phone,
  Mail,
  AlertCircle,
} from "lucide-react";

import { Link } from "react-router-dom";
import api from "../api";

const ORDER_STATUSES = [
  "Order Placed",
  "Confirmed",
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

const statusStyles = {
  "Order Placed": "bg-amber-100 text-amber-800",
  Confirmed: "bg-blue-100 text-blue-800",
  Processing: "bg-purple-100 text-purple-800",
  Shipped: "bg-indigo-100 text-indigo-800",
  "Out for Delivery": "bg-orange-100 text-orange-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

const formatPrice = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(amount || 0));

const formatDate = (date) => {
  if (!date) return "Date unavailable";

  return new Date(date).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [updatingOrder, setUpdatingOrder] = useState(null);
  const [selectedStatuses, setSelectedStatuses] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/admin/orders");
      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.orders || [];

      setOrders(data);

      setSelectedStatuses((previous) => {
        const next = { ...previous };

        data.forEach((order) => {
          if (!(order.order_number in next)) {
            next[order.order_number] = order.status;
          }
        });

        return next;
      });
    } catch (err) {
      console.error("Failed to fetch orders:", err);

      setError(
        err.response?.data?.detail ||
          "Orders load aagala. Backend server and admin login check pannunga."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = (orderNumber, status) => {
    setSelectedStatuses((previous) => ({
      ...previous,
      [orderNumber]: status,
    }));
    setSuccess("");
  };

  const updateStatus = async (order) => {
    const newStatus = selectedStatuses[order.order_number];

    if (!newStatus || newStatus === order.status) {
      setError("Status-la change pannunga.");
      return;
    }

    const confirmed = window.confirm(
      `Order ${order.order_number} status-ai "${newStatus}"-ku change pannalama?`
    );

    if (!confirmed) return;

    setUpdatingOrder(order.order_number);
    setError("");
    setSuccess("");

    try {
      await api.patch(
        `/admin/orders/${encodeURIComponent(order.order_number)}/status`,
        { status: newStatus }
      );

      setOrders((previous) =>
        previous.map((item) =>
          item.order_number === order.order_number
            ? { ...item, status: newStatus }
            : item
        )
      );

      setSuccess(`Order ${order.order_number} status updated successfully.`);
    } catch (err) {
      console.error("Failed to update order:", err);

      setError(
        err.response?.data?.detail ||
          "Status update aagala. Backend API check pannunga."
      );
    } finally {
      setUpdatingOrder(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const query = search.trim().toLowerCase();

    const matchesSearch =
      !query ||
      String(order.order_number || "").toLowerCase().includes(query) ||
      String(order.customer_name || "").toLowerCase().includes(query) ||
      String(order.email || "").toLowerCase().includes(query) ||
      String(order.phone || "").toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const deliveredCount = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  const pendingCount = orders.filter(
    (order) =>
      order.status !== "Delivered" && order.status !== "Cancelled"
  ).length;

  const totalRevenue = orders
    .filter((order) => order.status !== "Cancelled")
    .reduce(
      (total, order) => total + Number(order.total_amount || 0),
      0
    );

  return (
    <div className="min-h-screen bg-[#faf7f0] text-[#35251b]">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-[#eadfce] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#5b351f] text-amber-100">
              <Package size={23} />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight">
                SPICECRAFT
              </h1>
              <p className="text-xs text-stone-500">
                Admin · Order Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchOrders}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-[#e4d5c2] bg-white px-3 py-2 text-sm font-semibold hover:bg-[#f7efe4] disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <Link
              to="/admin/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-[#5b351f] px-3 py-2 text-sm font-semibold text-white hover:bg-[#442717]"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page title */}
        <div className="mb-7">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-amber-800">
            Store operations
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Customer Orders
          </h2>
          <p className="mt-2 text-sm text-stone-600">
            View purchases, check delivery details, and update order status.
          </p>
        </div>

        {/* Error and success messages */}
        {error && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
          >
            <AlertCircle size={20} className="mt-0.5 shrink-0" />
            <div className="flex-1">{error}</div>
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Close error"
            >
              <XCircle size={18} />
            </button>
          </div>
        )}

        {success && (
          <div
            role="status"
            className="mb-5 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
          >
            <CheckCircle2 size={20} className="shrink-0" />
            <div>{success}</div>
          </div>
        )}

        {/* Summary cards */}
        <section className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            icon={<ShoppingBag size={21} />}
            label="Total Orders"
            value={orders.length}
            color="bg-amber-100 text-amber-800"
          />

          <SummaryCard
            icon={<Clock size={21} />}
            label="Active Orders"
            value={pendingCount}
            color="bg-blue-100 text-blue-800"
          />

          <SummaryCard
            icon={<CheckCircle2 size={21} />}
            label="Delivered"
            value={deliveredCount}
            color="bg-green-100 text-green-800"
          />

          <SummaryCard
            icon={<IndianRupee size={21} />}
            label="Non-cancelled Order Value"
            value={formatPrice(totalRevenue)}
            color="bg-purple-100 text-purple-800"
          />
        </section>

        {/* Search and filter */}
        <section className="mb-6 rounded-2xl border border-[#eadfce] bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search
                size={19}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search order number, customer, email or phone..."
                className="w-full rounded-xl border border-[#e6dacb] bg-[#fffdf9] py-3 pl-10 pr-4 text-sm outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-100"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-xl border border-[#e6dacb] bg-[#fffdf9] px-4 py-3 text-sm outline-none focus:border-amber-700"
            >
              <option value="All">All statuses</option>
              {ORDER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <p className="mt-3 text-xs text-stone-500">
            Showing {filteredOrders.length} of {orders.length} orders
          </p>
        </section>

        {/* Orders list */}
        {loading ? (
          <div className="rounded-2xl border border-[#eadfce] bg-white px-5 py-16 text-center">
            <RefreshCw
              size={30}
              className="mx-auto mb-3 animate-spin text-amber-800"
            />
            <p className="font-semibold">Loading orders...</p>
            <p className="mt-1 text-sm text-stone-500">
              Please wait while we fetch order details.
            </p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#d9c6af] bg-white px-5 py-16 text-center">
            <Package size={38} className="mx-auto mb-3 text-stone-400" />
            <h3 className="text-lg font-bold">No orders found</h3>
            <p className="mt-2 text-sm text-stone-500">
              {orders.length === 0
                ? "Orders will appear here after customers place them."
                : "Try changing your search or status filter."}
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter("All");
              }}
              className="mt-4 rounded-lg bg-[#5b351f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#442717]"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <section className="space-y-5">
            {filteredOrders.map((order) => (
              <article
                key={order.order_number}
                className="overflow-hidden rounded-2xl border border-[#eadfce] bg-white shadow-sm"
              >
                {/* Order top */}
                <div className="flex flex-col justify-between gap-4 border-b border-[#f0e7dc] bg-[#fffdf9] p-5 md:flex-row md:items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold">
                        {order.order_number || "Order"}
                      </h3>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          statusStyles[order.status] ||
                          "bg-stone-100 text-stone-700"
                        }`}
                      >
                        {order.status || "Unknown"}
                      </span>

                      {order.coupon_code && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">
                          <Tag size={12} />
                          {order.coupon_code} (-{formatPrice(order.discount_amount)})
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-sm text-stone-500">
                      Placed on {formatDate(order.created_at)}
                    </p>
                  </div>

                  <div className="md:text-right">
                    <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                      Order total
                    </p>
                    <p className="mt-1 text-2xl font-bold text-[#5b351f]">
                      {formatPrice(order.total_amount)}
                    </p>
                  </div>
                </div>

                <div className="grid gap-6 p-5 lg:grid-cols-[1fr_1fr]">
                  {/* Customer details */}
                  <div>
                    <h4 className="mb-4 flex items-center gap-2 font-bold">
                      <User size={18} className="text-amber-800" />
                      Customer Details
                    </h4>

                    <div className="space-y-3 text-sm">
                      <DetailRow
                        icon={<User size={16} />}
                        value={order.customer_name || "Not provided"}
                      />
                      <DetailRow
                        icon={<Mail size={16} />}
                        value={order.email || "Not provided"}
                      />
                      <DetailRow
                        icon={<Phone size={16} />}
                        value={order.phone || "Not provided"}
                      />
                      <DetailRow
                        icon={<MapPin size={16} />}
                        value={order.delivery_address || "Not provided"}
                      />
                    </div>
                  </div>

                  {/* Order items */}
                  <div>
                    <h4 className="mb-4 flex items-center gap-2 font-bold">
                      <Package size={18} className="text-amber-800" />
                      Ordered Products
                    </h4>

                    {Array.isArray(order.items) && order.items.length > 0 ? (
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div
                            key={`${item.product_id || item.product_name}-${index}`}
                            className="flex items-start justify-between gap-3 rounded-xl border border-[#f0e7dc] p-3"
                          >
                            <div className="flex min-w-0 items-start gap-3">
                              {item.product_image ? (
                                <img
                                  src={item.product_image}
                                  alt={item.product_name || "Product"}
                                  className="h-14 w-14 rounded-lg border border-[#eadfce] object-cover"
                                  onError={(event) => {
                                    event.currentTarget.style.display = "none";
                                  }}
                                />
                              ) : (
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-[#f7efe4] text-amber-800">
                                  <Package size={22} />
                                </div>
                              )}

                              <div className="min-w-0">
                                <p className="break-words text-sm font-semibold">
                                  {item.product_name || "Product"}
                                </p>
                                <p className="mt-1 text-xs text-stone-500">
                                  {formatPrice(item.unit_price)} ×{" "}
                                  {item.quantity || 0}
                                </p>
                              </div>
                            </div>

                            <p className="shrink-0 text-sm font-bold">
                              {formatPrice(item.line_total)}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="rounded-xl bg-[#fffdf9] p-4 text-sm text-stone-500">
                        Product item details are not available.
                      </p>
                    )}

                    <div className="mt-4 space-y-2 border-t border-[#f0e7dc] pt-4 text-sm">
                      <AmountRow
                        label="Subtotal"
                        value={formatPrice(order.subtotal)}
                      />
                      {(order.coupon_code || Number(order.discount_amount || 0) > 0) && (
                        <AmountRow
                          label={`Coupon Discount (${order.coupon_code || "Applied"})`}
                          value={`- ${formatPrice(order.discount_amount)}`}
                          className="font-medium text-emerald-700"
                        />
                      )}
                      <AmountRow
                        label="Delivery"
                        value={formatPrice(order.delivery_charge)}
                      />
                      <AmountRow
                        label="Payment method"
                        value={order.payment_method || "Not provided"}
                      />
                      <AmountRow
                        label="Total"
                        value={formatPrice(order.total_amount)}
                        strong
                      />
                    </div>
                  </div>
                </div>

                {/* Status update */}
                <div className="border-t border-[#eadfce] bg-[#fffdf9] p-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div className="w-full md:max-w-sm">
                      <label
                        htmlFor={`status-${order.order_number}`}
                        className="mb-2 block text-sm font-bold"
                      >
                        Update order status
                      </label>

                      <select
                        id={`status-${order.order_number}`}
                        value={
                          selectedStatuses[order.order_number] ??
                          order.status ??
                          "Order Placed"
                        }
                        onChange={(event) =>
                          handleStatusChange(
                            order.order_number,
                            event.target.value
                          )
                        }
                        className="w-full rounded-xl border border-[#e6dacb] bg-white px-4 py-3 text-sm outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-100"
                      >
                        {ORDER_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => updateStatus(order)}
                      disabled={
                        updatingOrder === order.order_number ||
                        selectedStatuses[order.order_number] === order.status
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#5b351f] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#442717] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {updatingOrder === order.order_number ? (
                        <RefreshCw size={17} className="animate-spin" />
                      ) : (
                        <Truck size={17} />
                      )}
                      {updatingOrder === order.order_number
                        ? "Updating..."
                        : "Save Status"}
                    </button>
                  </div>

                  {order.status === "Cancelled" && (
                    <p className="mt-3 text-xs text-red-700">
                      This order is cancelled. Check backend stock-restoration
                      logic before changing its status again.
                    </p>
                  )}
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

function SummaryCard({ icon, label, value, color }) {
  return (
    <div className="rounded-2xl border border-[#eadfce] bg-white p-5 shadow-sm">
      <div
        className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${color}`}
      >
        {icon}
      </div>
      <p className="text-sm text-stone-500">{label}</p>
      <p className="mt-1 break-words text-2xl font-bold">{value}</p>
    </div>
  );
}

function DetailRow({ icon, value }) {
  return (
    <div className="flex items-start gap-3 text-stone-600">
      <span className="mt-0.5 shrink-0 text-amber-800">{icon}</span>
      <span className="break-words">{value}</span>
    </div>
  );
}

function AmountRow({ label, value, strong = false, className = "" }) {
  return (
    <div
      className={`flex items-start justify-between gap-4 ${
        strong ? "text-base font-bold text-stone-900" : "text-stone-600"
      } ${className}`}
    >
      <span>{label}</span>
      <span className="break-words text-right">{value}</span>
    </div>
  );
}
