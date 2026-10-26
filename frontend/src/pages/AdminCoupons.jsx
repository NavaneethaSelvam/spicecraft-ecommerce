import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Leaf,
  Plus,
  RefreshCw,
  Search,
  Tag,
  Ticket,
  Trash2,
  Pencil,
  X,
  AlertCircle,
  Clock,
  Percent,
  IndianRupee,
  ShieldCheck,
  TrendingUp,
  Power,
  Copy,
} from "lucide-react";
import api from "../api";

const emptyCouponForm = {
  code: "",
  description: "",
  discount_type: "percentage",
  discount_value: "",
  min_order_amount: "",
  max_discount_amount: "",
  total_usage_limit: "",
  max_usage_per_customer: "1",
  start_date: "",
  expiry_date: "",
  is_active: true,
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(amount || 0));

const formatDate = (dateStr) => {
  if (!dateStr) return "Lifetime";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const toDateTimeLocal = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  // Format as YYYY-MM-DDTHH:MM
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyCouponForm);
  const [formError, setFormError] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [copiedCode, setCopiedCode] = useState("");

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/admin/coupons?status=all");
      setCoupons(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Failed to load coupons:", err);
      setError(
        err.response?.data?.detail ||
          "Failed to load coupons. Please ensure backend is running."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  // Derived filtered coupons
  const filteredCoupons = useMemo(() => {
    const q = search.trim().toLowerCase();
    const now = new Date();

    return coupons.filter((c) => {
      const matchesSearch =
        !q ||
        c.code.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q));

      const isExpired = c.expiry_date && new Date(c.expiry_date) < now;

      let matchesStatus = true;
      if (statusFilter === "active") {
        matchesStatus = c.is_active && !isExpired;
      } else if (statusFilter === "inactive") {
        matchesStatus = !c.is_active;
      } else if (statusFilter === "expired") {
        matchesStatus = isExpired;
      }

      return matchesSearch && matchesStatus;
    });
  }, [coupons, search, statusFilter]);

  // Quick Stats
  const stats = useMemo(() => {
    const now = new Date();
    const total = coupons.length;
    const active = coupons.filter(
      (c) => c.is_active && (!c.expiry_date || new Date(c.expiry_date) >= now)
    ).length;
    const totalRedeemed = coupons.reduce(
      (sum, c) => sum + Number(c.times_used || 0),
      0
    );
    return { total, active, totalRedeemed };
  }, [coupons]);

  const handleCopyCode = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  const openCreateModal = () => {
    setEditingId(null);
    setForm(emptyCouponForm);
    setFormError("");
    setShowModal(true);
  };

  const openEditModal = (c) => {
    setEditingId(c.id);
    setForm({
      code: c.code,
      description: c.description || "",
      discount_type: c.discount_type || "percentage",
      discount_value: String(c.discount_value ?? ""),
      min_order_amount:
        c.min_order_amount !== null && c.min_order_amount !== undefined
          ? String(c.min_order_amount)
          : "",
      max_discount_amount:
        c.max_discount_amount !== null && c.max_discount_amount !== undefined
          ? String(c.max_discount_amount)
          : "",
      total_usage_limit:
        c.total_usage_limit !== null && c.total_usage_limit !== undefined
          ? String(c.total_usage_limit)
          : "",
      max_usage_per_customer:
        c.max_usage_per_customer !== null &&
        c.max_usage_per_customer !== undefined
          ? String(c.max_usage_per_customer)
          : "1",
      start_date: toDateTimeLocal(c.start_date),
      expiry_date: toDateTimeLocal(c.expiry_date),
      is_active: Boolean(c.is_active),
    });
    setFormError("");
    setShowModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveCoupon = async (e) => {
    e.preventDefault();
    setFormError("");
    setMessage("");

    const code = form.code.trim().toUpperCase();
    if (!code) {
      setFormError("Coupon code is required.");
      return;
    }
    if (code.includes(" ")) {
      setFormError("Coupon code cannot contain spaces.");
      return;
    }

    const discountVal = Number(form.discount_value);
    if (!Number.isFinite(discountVal) || discountVal <= 0) {
      setFormError("Please enter a valid discount value greater than 0.");
      return;
    }

    if (form.discount_type === "percentage" && discountVal > 100) {
      setFormError("Percentage discount cannot exceed 100%.");
      return;
    }

    const minOrder = form.min_order_amount ? Number(form.min_order_amount) : 0;
    if (minOrder < 0) {
      setFormError("Minimum order amount cannot be negative.");
      return;
    }

    const maxDiscount = form.max_discount_amount
      ? Number(form.max_discount_amount)
      : null;
    if (maxDiscount !== null && maxDiscount <= 0) {
      setFormError("Maximum discount amount must be greater than 0.");
      return;
    }

    const totalLimit = form.total_usage_limit
      ? Number(form.total_usage_limit)
      : null;
    if (totalLimit !== null && (!Number.isInteger(totalLimit) || totalLimit <= 0)) {
      setFormError("Total usage limit must be a positive whole number.");
      return;
    }

    const perCustomerLimit = form.max_usage_per_customer
      ? Number(form.max_usage_per_customer)
      : null;
    if (
      perCustomerLimit !== null &&
      (!Number.isInteger(perCustomerLimit) || perCustomerLimit <= 0)
    ) {
      setFormError("Max usage per customer must be a positive whole number.");
      return;
    }

    if (form.start_date && form.expiry_date) {
      if (new Date(form.expiry_date) <= new Date(form.start_date)) {
        setFormError("Expiry date must be after the start date.");
        return;
      }
    }

    const payload = {
      code,
      description: form.description.trim() || null,
      discount_type: form.discount_type,
      discount_value: discountVal,
      min_order_amount: minOrder,
      max_discount_amount:
        form.discount_type === "percentage" ? maxDiscount : null,
      total_usage_limit: totalLimit,
      max_usage_per_customer: perCustomerLimit,
      start_date: form.start_date ? new Date(form.start_date).toISOString() : null,
      expiry_date: form.expiry_date ? new Date(form.expiry_date).toISOString() : null,
      is_active: form.is_active,
    };

    setSaving(true);
    try {
      if (editingId) {
        const res = await api.put(`/admin/coupons/${editingId}`, payload);
        setCoupons((prev) =>
          prev.map((c) => (c.id === editingId ? res.data : c))
        );
        setMessage(`Coupon "${code}" updated successfully.`);
      } else {
        const res = await api.post("/admin/coupons", payload);
        setCoupons((prev) => [res.data, ...prev]);
        setMessage(`Coupon "${code}" created successfully.`);
      }
      setShowModal(false);
    } catch (err) {
      console.error("Save coupon failed:", err);
      setFormError(
        err.response?.data?.detail || "Failed to save coupon. Please check details."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (coupon) => {
    try {
      const res = await api.patch(`/admin/coupons/${coupon.id}/status`, {
        is_active: !coupon.is_active,
      });
      setCoupons((prev) =>
        prev.map((c) => (c.id === coupon.id ? res.data : c))
      );
      setMessage(
        `Coupon "${coupon.code}" is now ${
          res.data.is_active ? "active" : "inactive"
        }.`
      );
    } catch (err) {
      console.error("Toggle coupon status failed:", err);
      setError(
        err.response?.data?.detail || "Failed to update coupon status."
      );
    }
  };

  const handleDeleteCoupon = async (coupon) => {
    if (!window.confirm(`Are you sure you want to delete coupon "${coupon.code}"?`)) {
      return;
    }
    setDeletingId(coupon.id);
    try {
      await api.delete(`/admin/coupons/${coupon.id}`);
      setCoupons((prev) => prev.filter((c) => c.id !== coupon.id));
      setMessage(`Coupon "${coupon.code}" deleted successfully.`);
    } catch (err) {
      console.error("Delete coupon failed:", err);
      setError(
        err.response?.data?.detail || "Failed to delete coupon."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f7f3] px-4 py-6 text-stone-900 sm:px-7 sm:py-8 xl:px-10">
      <div className="mx-auto max-w-[1500px]">
        {/* Navigation Bar */}
        <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-[#754629] px-4 py-2.5 text-sm font-semibold !text-white transition hover:bg-[#5e3720]"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-[#754629] px-4 py-2.5 text-sm font-semibold !text-white transition hover:bg-[#5e3720]"
          >
            View Store
            <ExternalLink size={15} />
          </Link>
        </div>

        {/* Page Header */}
        <header className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[10px] font-extrabold tracking-[0.18em] text-amber-900">
              <Leaf size={13} />
              SPICECRAFT ADMIN
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
              Coupon Management
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-stone-600 sm:text-base">
              Create, configure, and monitor promotional discount coupons for
              checkout. All discounts and limits are validated securely on the
              server.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={fetchCoupons}
              disabled={loading || saving}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-stone-800 transition hover:bg-stone-50 disabled:opacity-60"
            >
              <RefreshCw
                size={17}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#8c3b1e] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#722f18] hover:shadow-md"
            >
              <Plus size={19} />
              Create Coupon
            </button>
          </div>
        </header>

        {/* Success / Error Alerts */}
        {message && (
          <div
            role="status"
            className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900"
          >
            <span className="flex items-center gap-2">
              <CheckCircle2 size={18} className="shrink-0 text-emerald-700" />
              {message}
            </span>
            <button
              type="button"
              onClick={() => setMessage("")}
              aria-label="Dismiss message"
              className="text-emerald-700 hover:text-emerald-900"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-900"
          >
            <span className="flex items-center gap-2">
              <AlertCircle size={18} className="shrink-0 text-rose-700" />
              {error}
            </span>
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
              className="text-rose-700 hover:text-rose-900"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* Stat Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Total Coupons
              </span>
              <span className="rounded-xl bg-amber-100 p-2 text-amber-900">
                <Ticket size={18} />
              </span>
            </div>
            <p className="mt-3 text-3xl font-extrabold text-stone-900">
              {stats.total}
            </p>
            <p className="mt-1 text-xs text-stone-500">Configured in store</p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Active &amp; Ready
              </span>
              <span className="rounded-xl bg-emerald-100 p-2 text-emerald-900">
                <ShieldCheck size={18} />
              </span>
            </div>
            <p className="mt-3 text-3xl font-extrabold text-stone-900">
              {stats.active}
            </p>
            <p className="mt-1 text-xs text-stone-500">
              Eligible for customer checkout
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Total Redemptions
              </span>
              <span className="rounded-xl bg-violet-100 p-2 text-violet-900">
                <TrendingUp size={18} />
              </span>
            </div>
            <p className="mt-3 text-3xl font-extrabold text-stone-900">
              {stats.totalRedeemed}
            </p>
            <p className="mt-1 text-xs text-stone-500">
              Successful redemptions across orders
            </p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="relative min-w-[260px] flex-1">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <input
              type="search"
              placeholder="Search by coupon code or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-[#fbfaf8] py-2.5 pl-10 pr-4 text-sm text-stone-900 placeholder-stone-400 outline-none transition focus:border-amber-700 focus:bg-white focus:ring-2 focus:ring-amber-700/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: "All Coupons" },
              { id: "active", label: "Active" },
              { id: "inactive", label: "Inactive" },
              { id: "expired", label: "Expired" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                  statusFilter === tab.id
                    ? "bg-[#754629] text-white shadow-sm"
                    : "border border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Coupons Table / Cards */}
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
          {loading ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 p-8 text-stone-500">
              <RefreshCw size={28} className="animate-spin text-amber-700" />
              <p className="text-sm font-medium">Loading coupons...</p>
            </div>
          ) : filteredCoupons.length === 0 ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 p-8 text-center text-stone-500">
              <div className="rounded-full bg-amber-50 p-4 text-amber-700">
                <Ticket size={36} />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-800">
                  No coupons found
                </h3>
                <p className="mt-1 text-sm text-stone-500">
                  {search
                    ? `No coupons match "${search}". Try adjusting your search or filters.`
                    : "No coupons created yet. Create your first coupon to get started."}
                </p>
              </div>
              <button
                type="button"
                onClick={openCreateModal}
                className="mt-2 inline-flex items-center gap-2 rounded-xl bg-[#8c3b1e] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#722f18]"
              >
                <Plus size={16} />
                Create Coupon
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-stone-800">
                <thead className="border-b border-stone-200 bg-[#faf8f5] text-[11px] font-bold uppercase tracking-wider text-stone-600">
                  <tr>
                    <th className="px-5 py-4">Coupon Code</th>
                    <th className="px-5 py-4">Discount</th>
                    <th className="px-5 py-4">Min. Order</th>
                    <th className="px-5 py-4">Max. Discount</th>
                    <th className="px-5 py-4">Usage / Limit</th>
                    <th className="px-5 py-4">Per Customer</th>
                    <th className="px-5 py-4">Validity</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredCoupons.map((coupon) => {
                    const now = new Date();
                    const isExpired =
                      coupon.expiry_date &&
                      new Date(coupon.expiry_date) < now;

                    return (
                      <tr
                        key={coupon.id}
                        className="transition hover:bg-stone-50/70"
                      >
                        {/* Coupon Code */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold tracking-wide text-stone-900">
                              {coupon.code}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyCode(coupon.code)}
                              title="Copy code"
                              className="text-stone-400 hover:text-stone-700"
                            >
                              <Copy size={13} />
                            </button>
                            {copiedCode === coupon.code && (
                              <span className="rounded bg-stone-900 px-1.5 py-0.5 text-[10px] text-white">
                                Copied!
                              </span>
                            )}
                          </div>
                          {coupon.description && (
                            <p className="mt-1 line-clamp-1 max-w-xs text-xs text-stone-500">
                              {coupon.description}
                            </p>
                          )}
                        </td>

                        {/* Discount */}
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1 font-semibold text-stone-900">
                            {coupon.discount_type === "percentage" ? (
                              <>
                                <Percent size={14} className="text-amber-700" />
                                {coupon.discount_value}% OFF
                              </>
                            ) : (
                              <>
                                <IndianRupee
                                  size={14}
                                  className="text-emerald-700"
                                />
                                {formatCurrency(coupon.discount_value)} OFF
                              </>
                            )}
                          </span>
                        </td>

                        {/* Min. Order */}
                        <td className="px-5 py-4 text-stone-700">
                          {Number(coupon.min_order_amount) > 0
                            ? formatCurrency(coupon.min_order_amount)
                            : "No minimum"}
                        </td>

                        {/* Max. Discount */}
                        <td className="px-5 py-4 text-stone-700">
                          {coupon.discount_type === "percentage" &&
                          coupon.max_discount_amount
                            ? formatCurrency(coupon.max_discount_amount)
                            : "—"}
                        </td>

                        {/* Usage / Limit */}
                        <td className="px-5 py-4">
                          <div className="text-xs">
                            <span className="font-bold text-stone-900">
                              {coupon.times_used || 0}
                            </span>
                            <span className="text-stone-500">
                              {" / "}
                              {coupon.total_usage_limit !== null
                                ? coupon.total_usage_limit
                                : "∞"}
                            </span>
                            <span className="ml-1 text-[11px] text-stone-500">
                              used
                            </span>
                          </div>
                        </td>

                        {/* Per Customer Limit */}
                        <td className="px-5 py-4 text-stone-700">
                          {coupon.max_usage_per_customer !== null
                            ? `${coupon.max_usage_per_customer} use${
                                coupon.max_usage_per_customer > 1 ? "s" : ""
                              }`
                            : "Unlimited"}
                        </td>

                        {/* Validity */}
                        <td className="px-5 py-4 text-xs">
                          {isExpired ? (
                            <span className="font-semibold text-rose-700">
                              Expired {formatDate(coupon.expiry_date)}
                            </span>
                          ) : coupon.expiry_date ? (
                            <span className="text-stone-700">
                              Until {formatDate(coupon.expiry_date)}
                            </span>
                          ) : (
                            <span className="text-stone-500">No expiry</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          {isExpired ? (
                            <span className="inline-flex rounded-full bg-rose-100 px-2.5 py-1 text-xs font-bold text-rose-800">
                              Expired
                            </span>
                          ) : coupon.is_active ? (
                            <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full bg-stone-200 px-2.5 py-1 text-xs font-bold text-stone-700">
                              Inactive
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Toggle Active Button */}
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(coupon)}
                              title={
                                coupon.is_active
                                  ? "Deactivate coupon"
                                  : "Activate coupon"
                              }
                              className={`rounded-lg p-2 transition ${
                                coupon.is_active
                                  ? "text-emerald-700 hover:bg-emerald-50"
                                  : "text-stone-400 hover:bg-stone-100 hover:text-stone-700"
                              }`}
                            >
                              <Power size={16} />
                            </button>

                            {/* Edit Button */}
                            <button
                              type="button"
                              onClick={() => openEditModal(coupon)}
                              title="Edit coupon"
                              className="rounded-lg p-2 text-stone-600 transition hover:bg-stone-100 hover:text-amber-800"
                            >
                              <Pencil size={16} />
                            </button>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => handleDeleteCoupon(coupon)}
                              disabled={deletingId === coupon.id}
                              title="Delete coupon"
                              className="rounded-lg p-2 text-stone-400 transition hover:bg-rose-50 hover:text-rose-700 disabled:opacity-50"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-stone-200 bg-white p-6 shadow-2xl sm:p-8">
            <div className="mb-6 flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <h2 className="text-xl font-bold text-stone-900 sm:text-2xl">
                  {editingId ? "Edit Coupon" : "Create New Coupon"}
                </h2>
                <p className="mt-1 text-xs text-stone-500">
                  {editingId
                    ? "Update coupon settings, limits and active status."
                    : "Configure a promotional discount coupon for store checkout."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-xl p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
              >
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div className="mb-5 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-sm font-medium text-rose-800">
                <AlertCircle size={18} className="shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveCoupon} className="space-y-5">
              {/* Code & Description */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    Coupon Code *
                  </label>
                  <input
                    type="text"
                    name="code"
                    required
                    value={form.code}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        code: e.target.value.toUpperCase().replace(/\s+/g, ""),
                      }))
                    }
                    placeholder="e.g. SPICE10, WELCOME100"
                    className="mt-1.5 w-full rounded-xl border border-stone-300 bg-stone-50/50 px-3.5 py-2.5 font-mono text-sm font-bold text-stone-900 placeholder-stone-400 outline-none transition focus:border-amber-700 focus:bg-white focus:ring-2 focus:ring-amber-700/20"
                  />
                  <span className="mt-1 block text-[11px] text-stone-500">
                    Uppercase, no spaces.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    Discount Type *
                  </label>
                  <div className="mt-1.5 flex gap-2">
                    <label
                      className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-bold transition ${
                        form.discount_type === "percentage"
                          ? "border-amber-700 bg-amber-50 text-amber-900"
                          : "border-stone-300 bg-white text-stone-700 hover:bg-stone-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="discount_type"
                        value="percentage"
                        checked={form.discount_type === "percentage"}
                        onChange={handleFormChange}
                        className="sr-only"
                      />
                      <Percent size={14} />
                      Percentage (%)
                    </label>

                    <label
                      className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-bold transition ${
                        form.discount_type === "fixed"
                          ? "border-amber-700 bg-amber-50 text-amber-900"
                          : "border-stone-300 bg-white text-stone-700 hover:bg-stone-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="discount_type"
                        value="fixed"
                        checked={form.discount_type === "fixed"}
                        onChange={handleFormChange}
                        className="sr-only"
                      />
                      <IndianRupee size={14} />
                      Fixed (₹)
                    </label>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  Description / Note (Optional)
                </label>
                <input
                  type="text"
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  placeholder="e.g. 10% off on all spices for orders above ₹499"
                  className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20"
                />
              </div>

              {/* Value, Min Order, Max Discount */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    Discount Value *
                  </label>
                  <div className="relative mt-1.5">
                    <input
                      type="number"
                      name="discount_value"
                      required
                      step="0.01"
                      min="0.01"
                      max={form.discount_type === "percentage" ? "100" : undefined}
                      value={form.discount_value}
                      onChange={handleFormChange}
                      placeholder={
                        form.discount_type === "percentage" ? "10" : "100"
                      }
                      className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-stone-900 placeholder-stone-400 outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-500">
                      {form.discount_type === "percentage" ? "%" : "₹"}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    Min Order Amount (₹)
                  </label>
                  <input
                    type="number"
                    name="min_order_amount"
                    step="0.01"
                    min="0"
                    value={form.min_order_amount}
                    onChange={handleFormChange}
                    placeholder="0.00"
                    className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-stone-900 placeholder-stone-400 outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20"
                  />
                  <span className="mt-1 block text-[11px] text-stone-500">
                    0 = no minimum required.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    Max Discount (₹)
                  </label>
                  <input
                    type="number"
                    name="max_discount_amount"
                    step="0.01"
                    min="0.01"
                    disabled={form.discount_type !== "percentage"}
                    value={form.max_discount_amount}
                    onChange={handleFormChange}
                    placeholder={
                      form.discount_type === "percentage"
                        ? "e.g. 100.00"
                        : "N/A for fixed"
                    }
                    className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-stone-900 placeholder-stone-400 outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20 disabled:bg-stone-100 disabled:text-stone-400"
                  />
                  <span className="mt-1 block text-[11px] text-stone-500">
                    Cap for % discount.
                  </span>
                </div>
              </div>

              {/* Usage Limits */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    Total Redemptions Limit
                  </label>
                  <input
                    type="number"
                    name="total_usage_limit"
                    min="1"
                    step="1"
                    value={form.total_usage_limit}
                    onChange={handleFormChange}
                    placeholder="Leave empty for unlimited"
                    className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20"
                  />
                  <span className="mt-1 block text-[11px] text-stone-500">
                    Total times all customers can use it.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    Max Uses Per Customer
                  </label>
                  <input
                    type="number"
                    name="max_usage_per_customer"
                    min="1"
                    step="1"
                    value={form.max_usage_per_customer}
                    onChange={handleFormChange}
                    placeholder="1 (default)"
                    className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20"
                  />
                  <span className="mt-1 block text-[11px] text-stone-500">
                    Tracked via email &amp; phone at checkout.
                  </span>
                </div>
              </div>

              {/* Validity Dates */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    Start Date &amp; Time (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    name="start_date"
                    value={form.start_date}
                    onChange={handleFormChange}
                    className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-sm text-stone-900 outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    Expiry Date &amp; Time (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    name="expiry_date"
                    value={form.expiry_date}
                    onChange={handleFormChange}
                    className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-sm text-stone-900 outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                <label className="flex cursor-pointer items-center justify-between">
                  <div>
                    <span className="block text-sm font-bold text-stone-900">
                      Coupon Active Status
                    </span>
                    <span className="text-xs text-stone-500">
                      When active, eligible customers can apply this coupon at
                      checkout.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={form.is_active}
                    onChange={handleFormChange}
                    className="h-5 w-5 rounded border-stone-300 text-amber-700 accent-amber-700 focus:ring-amber-700"
                  />
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 border-t border-stone-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={saving}
                  className="rounded-xl border border-stone-300 bg-white px-5 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#8c3b1e] px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#722f18] disabled:opacity-60"
                >
                  {saving && <RefreshCw size={15} className="animate-spin" />}
                  {editingId ? "Update Coupon" : "Create Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
