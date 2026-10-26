
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Package,
  ArrowLeft,
  X,
  ImagePlus,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Tags,
  Boxes,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Leaf,
  IndianRupee,
  SlidersHorizontal,
} from "lucide-react";
import api from "../api";

const emptyForm = {
  name: "",
  description: "",
  category: "Masala Powders",
  price: "",
  stock: "",
  image: "",
};

const defaultCategories = [
  "Masala Powders",
  "Spice Blends",
  "Curry Pastes",
  "Podis",
  "Pickles",
  "Pure Spices",
];

const PRODUCTS_PER_PAGE = 10;

const formatProduct = (product) => ({
  ...product,
  id: product.id ?? product.product_id,
  name: product.name ?? product.product_name ?? "",
  description: product.description ?? "",
  category: product.category ?? "Masala Powders",
  price: Number(product.price ?? 0),
  stock: Number(product.stock ?? 0),
  image: product.image ?? product.image_url ?? "",
  is_active: product.is_active ?? true,
});

const imageUrl = (image) => {
  if (!image) return "";
  return image;
};

function ProductImage({ src, name, large = false }) {
  const [failed, setFailed] = useState(false);
  const source = imageUrl(src);

  useEffect(() => {
    setFailed(false);
  }, [source]);

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-stone-200 bg-[#f6efe4] text-amber-800 ${
        large ? "h-36 w-36" : "h-14 w-14"
      }`}
    >
      {source && !failed ? (
        <img
          src={source}
          alt={name || "SpiceCraft product"}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex flex-col items-center gap-1 text-center">
          <ImagePlus size={large ? 30 : 20} />
          {large && (
            <span className="px-2 text-[10px] text-stone-500">
              Image preview
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, detail, icon: Icon, tone }) {
  return (
    <article className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-stone-500">{title}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-stone-900">
            {value}
          </p>
        </div>
        <span className={`rounded-xl p-3 ${tone}`}>
          <Icon size={21} />
        </span>
      </div>
      <p className="mt-4 border-t border-stone-100 pt-3 text-xs text-stone-500">
        {detail}
      </p>
    </article>
  );
}

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(defaultCategories);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [stockFilter, setStockFilter] = useState("All Stock");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/products");
      const data = response.data;

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.products)
          ? data.products
          : Array.isArray(data?.items)
            ? data.items
            : [];

      setProducts(list.map(formatProduct));
    } catch (err) {
      console.error("Loading products failed:", err);
      setError(
        err.response?.data?.detail ||
          "Unable to load products. Please check the backend."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      const response = await api.get("/categories");
      const data = response.data;

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.categories)
          ? data.categories
          : Array.isArray(data?.items)
            ? data.items
            : [];

      const names = list
        .filter(
          (item) =>
            typeof item === "string" || item?.is_active !== false
        )
        .map((item) =>
          typeof item === "string"
            ? item.trim()
            : (
                item?.name ??
                item?.category_name ??
                item?.title ??
                ""
              ).trim()
        )
        .filter(Boolean);

      // Database is the primary source when it returns categories.
      // Keep fallback categories only when the API returns no usable list.
      if (names.length > 0) {
        setCategories([
          ...new Map(
            names.map((name) => [name.toLocaleLowerCase(), name])
          ).values(),
        ]);
      } else {
        setCategories(defaultCategories);
      }
    } catch (err) {
      console.warn(
        "Could not load categories. Using default categories.",
        err
      );
      setCategories(defaultCategories);
    }
  }, []);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [loadProducts, loadCategories]);

  // Combine loaded categories with categories currently used by products.
  // This keeps existing product categories available when editing/filtering.
  const availableCategories = useMemo(() => {
    const names = [
      ...categories,
      ...products.map((product) => product.category),
      form.category,
    ].filter((name) => typeof name === "string" && name.trim());

    return [
      ...new Map(
        names.map((name) => [
          name.trim().toLocaleLowerCase(),
          name.trim(),
        ])
      ).values(),
    ];
  }, [categories, products, form.category]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        `${product.name} ${product.category} ${product.description}`
          .toLowerCase()
          .includes(query);

      const matchesCategory =
        categoryFilter === "All Categories" ||
        product.category === categoryFilter;

      const matchesStock =
        stockFilter === "All Stock" ||
        (stockFilter === "Out of Stock" && product.stock === 0) ||
        (stockFilter === "Low Stock" &&
          product.stock > 0 &&
          product.stock < 10) ||
        (stockFilter === "In Stock" && product.stock >= 10);

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, search, categoryFilter, stockFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
  );

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;

    return filteredProducts.slice(
      startIndex,
      startIndex + PRODUCTS_PER_PAGE
    );
  }, [filteredProducts, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const totalStock = products.reduce(
    (total, product) => total + product.stock,
    0
  );

  const outOfStockCount = products.filter(
    (product) => product.stock === 0
  ).length;

  const lowStockCount = products.filter(
    (product) => product.stock > 0 && product.stock < 10
  ).length;

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setMessage("");
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      image: product.image,
    });
    setFormError("");
    setMessage("");
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");
    setMessage("");
    setError("");

    const name = form.name.trim();
    const price = Number(form.price);
    const stock = Number(form.stock);

    if (!name) {
      setFormError("Please enter a product name.");
      return;
    }

    if (
      form.price === "" ||
      !Number.isFinite(price) ||
      price <= 0
    ) {
      setFormError("Enter a valid price greater than zero.");
      return;
    }

    if (
      form.stock === "" ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      setFormError("Enter a valid stock quantity.");
      return;
    }

    if (!form.category.trim()) {
      setFormError("Please select a product category.");
      return;
    }

    const payload = {
      name,
      description: form.description.trim(),
      category: form.category.trim(),
      price,
      stock,
      image: form.image.trim() || null,
      is_active: true,
    };

    setSaving(true);

    try {
      if (editingId !== null) {
        const response = await api.put(
          `/products/${encodeURIComponent(editingId)}`,
          payload
        );

        const updatedProduct = formatProduct(response.data);

        setProducts((previous) =>
          previous.map((product) =>
            String(product.id) === String(editingId)
              ? { ...product, ...updatedProduct }
              : product
          )
        );

        setMessage("Product updated successfully.");
      } else {
        const response = await api.post("/products", payload);
        const createdProduct = formatProduct(response.data);

        setProducts((previous) => [
          createdProduct,
          ...previous.filter(
            (product) =>
              String(product.id) !== String(createdProduct.id)
          ),
        ]);

        setCurrentPage(1);
        setSearch("");
        setCategoryFilter("All Categories");
        setStockFilter("All Stock");
        setMessage("Product added successfully.");
      }

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      await loadProducts();
      await loadCategories();
    } catch (err) {
      console.error("Saving product failed:", err);
      setFormError(
        err.response?.data?.detail ||
          "Unable to save the product. Check the form and backend."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Delete "${product.name}" from the database?`
    );

    if (!confirmed) return;

    setDeletingId(product.id);
    setMessage("");
    setError("");

    try {
      await api.delete(
        `/products/${encodeURIComponent(product.id)}`
      );

      setProducts((previous) =>
        previous.filter(
          (item) => String(item.id) !== String(product.id)
        )
      );

      setMessage("Product deleted successfully.");
    } catch (err) {
      console.error("Deleting product failed:", err);
      setError(
        err.response?.data?.detail ||
          "Unable to delete the product. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const labelClass = "block text-sm font-semibold text-stone-700";

  const inputClass =
    "mt-2 min-h-11 w-full rounded-xl border border-stone-200 bg-white px-3.5 py-3 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-amber-700 focus:ring-4 focus:ring-amber-700/10 disabled:opacity-60";

  return (
    <main className="min-h-screen bg-[#f8f7f3] px-4 py-6 text-stone-900 sm:px-7 sm:py-8 xl:px-10">
      <div className="mx-auto max-w-[1500px]">
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

        <header className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[10px] font-extrabold tracking-[0.18em] text-amber-800">
              <Leaf size={13} />
              SPICECRAFT ADMIN
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Product Management
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-stone-500 sm:text-base">
              Manage your spice collection, product images, pricing and
              inventory from one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                loadProducts();
                loadCategories();
              }}
              disabled={loading || saving}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 disabled:opacity-60"
            >
              <RefreshCw
                size={17}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={openAddForm}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-amber-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-amber-800 hover:shadow-md"
            >
              <Plus size={19} />
              Add Product
            </button>
          </div>
        </header>

        {message && (
          <div
            role="status"
            className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
          >
            <span className="flex items-center gap-2">
              <CheckCircle2 size={18} />
              {message}
            </span>
            <button
              type="button"
              onClick={() => setMessage("")}
              aria-label="Dismiss message"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            <span>{error}</span>
            <button
              type="button"
              onClick={() => {
                loadProducts();
                loadCategories();
              }}
              className="font-bold underline"
            >
              Try again
            </button>
          </div>
        )}

        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Products"
            value={loading ? "—" : products.length}
            detail="Products in your catalogue"
            icon={Package}
            tone="bg-amber-50 text-amber-800"
          />
          <StatCard
            title="Total Stock Units"
            value={loading ? "—" : totalStock.toLocaleString("en-IN")}
            detail="Combined stock quantity"
            icon={Boxes}
            tone="bg-emerald-50 text-emerald-800"
          />
          <StatCard
            title="Low Stock"
            value={loading ? "—" : lowStockCount}
            detail="Products with fewer than 10 units"
            icon={AlertTriangle}
            tone="bg-orange-50 text-orange-800"
          />
          <StatCard
            title="Out of Stock"
            value={loading ? "—" : outOfStockCount}
            detail="Products needing restock"
            icon={IndianRupee}
            tone="bg-rose-50 text-rose-800"
          />
        </section>

        {showForm && (
          <section className="mb-8 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
            <div className="flex items-start justify-between gap-4 border-b border-stone-100 bg-[#fcfaf6] px-5 py-5 sm:px-7">
              <div>
                <p className="text-[10px] font-extrabold tracking-[0.18em] text-amber-800">
                  PRODUCT CATALOGUE
                </p>
                <h2 className="mt-2 text-xl font-bold">
                  {editingId !== null ? "Edit Product" : "Add New Product"}
                </h2>
                <p className="mt-1 text-sm text-stone-500">
                  Fill in the details below.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                aria-label="Close form"
                className="rounded-xl border border-stone-200 bg-white p-2.5 text-stone-600 transition hover:bg-stone-100 disabled:opacity-50"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-7">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
                <label className={labelClass}>
                  Product name *
                  <input
                    className={inputClass}
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Chettinad Masala"
                    required
                    disabled={saving}
                  />
                </label>

                <label className={labelClass}>
                  Category *
                  <select
                    className={inputClass}
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                    disabled={saving}
                  >
                    {availableCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>

                <label className={labelClass}>
                  Price (₹) *
                  <input
                    className={inputClass}
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    min="0.01"
                    step="0.01"
                    placeholder="149"
                    required
                    disabled={saving}
                  />
                </label>

                <label className={labelClass}>
                  Stock quantity *
                  <input
                    className={inputClass}
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    placeholder="25"
                    required
                    disabled={saving}
                  />
                </label>

                <label className={`${labelClass} md:col-span-2`}>
                  Description
                  <textarea
                    className={`${inputClass} min-h-28 resize-y`}
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe the aroma, flavour and best uses..."
                    disabled={saving}
                  />
                </label>

                <label className={`${labelClass} md:col-span-2`}>
                  Product image path or URL
                  <input
                    className={inputClass}
                    type="text"
                    name="image"
                    value={form.image}
                    onChange={handleChange}
                    placeholder="/images/mango-pickle.jpg"
                    disabled={saving}
                  />
                  <span className="mt-2 block text-xs font-normal leading-5 text-stone-500">
                    For files inside public/images, use a path such as
                    /images/garam-masala.jpg.
                  </span>
                </label>

                <div className="md:col-span-2">
                  <p className="mb-2 text-sm font-semibold text-stone-700">
                    Image preview
                  </p>
                  <ProductImage
                    src={form.image}
                    name={form.name}
                    large
                  />
                </div>
              </div>

              {formError && (
                <div
                  role="alert"
                  className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                >
                  {formError}
                </div>
              )}

              <div className="mt-7 flex flex-col-reverse gap-3 border-t border-stone-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-xl border border-stone-200 px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving && (
                    <RefreshCw size={16} className="animate-spin" />
                  )}
                  {saving
                    ? "Saving..."
                    : editingId !== null
                      ? "Save Changes"
                      : "Add Product"}
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm">
          <div className="flex flex-col gap-5 border-b border-stone-100 p-5 sm:p-6 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                All Products
              </h2>
              <p className="mt-1.5 text-sm text-stone-500">
                {loading
                  ? "Loading catalogue..."
                  : `${filteredProducts.length} product${
                      filteredProducts.length === 1 ? "" : "s"
                    } found`}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:flex">
              <label className="flex min-h-11 min-w-0 items-center gap-2.5 rounded-xl border border-stone-200 px-3.5 text-stone-400 transition focus-within:border-amber-700 focus-within:ring-4 focus-within:ring-amber-700/10 xl:w-64">
                <Search size={18} />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search products..."
                  aria-label="Search products"
                  className="min-w-0 flex-1 bg-transparent py-2 text-sm text-stone-800 outline-none placeholder:text-stone-400"
                />
              </label>

              <label className="flex min-h-11 items-center gap-2 rounded-xl border border-stone-200 px-3 text-stone-500">
                <Tags size={16} />
                <select
                  value={categoryFilter}
                  onChange={(event) => {
                    setCategoryFilter(event.target.value);
                    setCurrentPage(1);
                  }}
                  aria-label="Filter by category"
                  className="min-w-0 flex-1 bg-transparent py-2 text-sm text-stone-700 outline-none"
                >
                  <option>All Categories</option>
                  {availableCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex min-h-11 items-center gap-2 rounded-xl border border-stone-200 px-3 text-stone-500">
                <SlidersHorizontal size={16} />
                <select
                  value={stockFilter}
                  onChange={(event) => {
                    setStockFilter(event.target.value);
                    setCurrentPage(1);
                  }}
                  aria-label="Filter by stock"
                  className="min-w-0 flex-1 bg-transparent py-2 text-sm text-stone-700 outline-none"
                >
                  <option>All Stock</option>
                  <option>In Stock</option>
                  <option>Low Stock</option>
                  <option>Out of Stock</option>
                </select>
              </label>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-3 px-5 text-center">
              <RefreshCw size={28} className="animate-spin text-amber-700" />
              <p className="text-sm text-stone-500">
                Loading products from the database...
              </p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[850px] border-collapse text-left">
                <thead className="bg-[#faf8f4]">
                  <tr>
                    {[
                      "Product",
                      "Category",
                      "Price",
                      "Stock",
                      "Availability",
                      "Actions",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="border-y border-stone-100 px-5 py-4 text-[10px] font-extrabold uppercase tracking-[0.12em] text-stone-500"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {paginatedProducts.map((product) => {
                    const stockStatus =
                      product.stock === 0
                        ? {
                            label: "Out of Stock",
                            className: "bg-red-50 text-red-700",
                          }
                        : product.stock < 10
                          ? {
                              label: "Low Stock",
                              className: "bg-amber-50 text-amber-800",
                            }
                          : {
                              label: "In Stock",
                              className: "bg-emerald-50 text-emerald-800",
                            };

                    return (
                      <tr
                        key={product.id ?? product.name}
                        className="border-b border-stone-100 transition last:border-0 hover:bg-[#fdfbf7]"
                      >
                        <td className="px-5 py-4">
                          <div className="flex min-w-56 items-center gap-3">
                            <ProductImage
                              src={product.image}
                              name={product.name}
                            />
                            <div className="min-w-0">
                              <p className="max-w-56 truncate text-sm font-bold text-stone-800">
                                {product.name}
                              </p>
                              <p className="mt-1 max-w-56 truncate text-xs text-stone-400">
                                {product.description || "No description"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span className="inline-flex max-w-48 rounded-lg bg-stone-100 px-2.5 py-1.5 text-xs font-semibold text-stone-600">
                            {product.category}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-sm font-bold text-stone-800">
                          ₹{product.price.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>

                        <td className="px-5 py-4 text-sm font-semibold text-stone-700">
                          {product.stock}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-bold ${stockStatus.className}`}
                          >
                            <span className="mr-1.5">●</span>
                            {stockStatus.label}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => openEditForm(product)}
                              title="Edit product"
                              aria-label={`Edit ${product.name}`}
                              className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 text-stone-600 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-800"
                            >
                              <Pencil size={16} />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(product)}
                              disabled={deletingId !== null}
                              title="Delete product"
                              aria-label={`Delete ${product.name}`}
                              className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 text-stone-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              {deletingId === product.id ? (
                                <RefreshCw size={16} className="animate-spin" />
                              ) : (
                                <Trash2 size={16} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {paginatedProducts.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-16 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-800">
                          <Package size={26} />
                        </div>
                        <h3 className="mt-4 text-sm font-bold text-stone-800">
                          {error
                            ? "Products could not be loaded"
                            : search ||
                                categoryFilter !== "All Categories" ||
                                stockFilter !== "All Stock"
                              ? "No matching products"
                              : "Your catalogue is empty"}
                        </h3>
                        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-stone-500">
                          {search ||
                          categoryFilter !== "All Categories" ||
                          stockFilter !== "All Stock"
                            ? "Try changing the search or filters."
                            : "Add your first spice product to start building the catalogue."}
                        </p>
                        {!search &&
                          categoryFilter === "All Categories" &&
                          stockFilter === "All Stock" && (
                            <button
                              type="button"
                              onClick={openAddForm}
                              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-amber-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-amber-800"
                            >
                              <Plus size={17} />
                              Add First Product
                            </button>
                          )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {!loading && filteredProducts.length > 0 && (
            <div className="flex flex-col gap-3 border-t border-stone-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-stone-500 sm:text-sm">
                Showing {(currentPage - 1) * PRODUCTS_PER_PAGE + 1}–
                {Math.min(
                  currentPage * PRODUCTS_PER_PAGE,
                  filteredProducts.length
                )}{" "}
                of {filteredProducts.length} products
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((page) => Math.max(1, page - 1))
                  }
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                <span className="min-w-20 text-center text-xs font-semibold text-stone-600 sm:text-sm">
                  Page {currentPage} / {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((page) => Math.min(totalPages, page + 1))
                  }
                  disabled={currentPage >= totalPages}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </section>

        <footer className="flex flex-col gap-2 py-6 text-center text-xs text-stone-400 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <span>© {new Date().getFullYear()} SpiceCraft Admin</span>
          <span className="flex items-center justify-center gap-1.5">
            <CheckCircle2 size={14} />
            Product changes are saved through your backend API
          </span>
        </footer>
      </div>
    </main>
  );
}

export default AdminProducts;
