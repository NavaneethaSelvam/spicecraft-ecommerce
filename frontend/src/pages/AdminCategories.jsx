
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Tags,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Store,
  LayoutDashboard,
  ImagePlus,
  CheckCircle2,
  AlertCircle,
  Package,
} from "lucide-react";
import api from "../api";

const PAGE_SIZE = 10;

const emptyForm = {
  name: "",
  description: "",
  image: "",
  is_active: true,
};

function getErrorMessage(error, fallback) {
  const detail = error?.response?.data?.detail;

  if (typeof detail === "string") return detail;

  if (Array.isArray(detail)) {
    return detail.map((item) => item.msg).filter(Boolean).join(", ");
  }

  return fallback;
}

function normalizeCategory(category) {
  return {
    ...category,
    id: category.id ?? category.category_id,
    name: category.name ?? category.category_name ?? "",
    description: category.description ?? "",
    image: category.image ?? category.image_url ?? "",
    is_active: category.is_active ?? true,
  };
}

function CategoryImage({ image, name }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [image]);

  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-stone-200 bg-[#f5eadc] text-amber-900">
      {image && !failed ? (
        <img
          src={image}
          alt={name || "Category"}
          loading="lazy"
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <Tags size={20} />
      )}
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, tone }) {
  return (
    <article className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-stone-500">{label}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-stone-900">
            {value}
          </p>
        </div>

        <div className={`rounded-xl p-3 ${tone}`}>
          <Icon size={21} />
        </div>
      </div>
      <div className="mt-4 border-t border-stone-100 pt-3 text-xs text-stone-500">
        SpiceCraft category overview
      </div>
    </article>
  );
}

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadCategories = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);
    setError("");

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

      setCategories(list.map(normalizeCategory));
    } catch (err) {
      console.error("Loading categories failed:", err);
      setError(
        getErrorMessage(
          err,
          "Categories load aagala. Backend server running-aa check pannunga."
        )
      );
    } finally {
      if (showLoader) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return categories;

    return categories.filter((category) => {
      const name = String(category.name || "").toLowerCase();
      const description = String(category.description || "").toLowerCase();

      return name.includes(query) || description.includes(query);
    });
  }, [categories, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCategories.length / PAGE_SIZE)
  );

  const safePage = Math.min(currentPage, totalPages);

  const visibleCategories = filteredCategories.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const activeCount = categories.filter(
    (category) => category.is_active !== false
  ).length;

  const inactiveCount = categories.length - activeCount;

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const name = form.name.trim();

    if (!name) {
      setError("Category name enter pannunga.");
      return;
    }

    const payload = {
      name,
      description: form.description.trim(),
      image: form.image.trim() || null,
      is_active: form.is_active,
    };

    setSaving(true);

    try {
      if (editingId !== null) {
        await api.put(
          `/categories/${encodeURIComponent(editingId)}`,
          payload
        );

        setSuccess("Category successfully updated.");
      } else {
        await api.post("/categories", payload);
        setSuccess("New category successfully added.");
      }

      resetForm();
      setCurrentPage(1);
      setSearch("");

      await loadCategories(false);
    } catch (err) {
      console.error("Saving category failed:", err);

      setError(
        getErrorMessage(
          err,
          "Category save panna mudiyala. Backend schema check pannunga."
        )
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category.id);

    setForm({
      name: category.name || "",
      description: category.description || "",
      image: category.image || "",
      is_active: category.is_active !== false,
    });

    setError("");
    setSuccess("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggleStatus = async (category) => {
    setError("");
    setSuccess("");
    setActionId(category.id);

    try {
      const newStatus = category.is_active === false;

      await api.put(
        `/categories/${encodeURIComponent(category.id)}`,
        {
          ...category,
          is_active: newStatus,
        }
      );

      setSuccess(
        newStatus
          ? "Category activated successfully."
          : "Category deactivated successfully."
      );

      await loadCategories(false);
    } catch (err) {
      console.error("Updating category status failed:", err);

      setError(
        getErrorMessage(err, "Category status update panna mudiyala.")
      );
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (category) => {
    const confirmed = window.confirm(
      `"${category.name}" category-ai permanently delete pannalama?`
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");
    setActionId(category.id);

    try {
      await api.delete(
        `/categories/${encodeURIComponent(category.id)}`
      );

      if (String(editingId) === String(category.id)) {
        resetForm();
      }

      setSuccess("Category deleted successfully.");

      await loadCategories(false);
    } catch (err) {
      console.error("Deleting category failed:", err);

      setError(
        getErrorMessage(
          err,
          "Category delete panna mudiyala. Indha category products use pannudha check pannunga."
        )
      );
    } finally {
      setActionId(null);
    }
  };

  const startItem =
    filteredCategories.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;

  const endItem = Math.min(
    safePage * PAGE_SIZE,
    filteredCategories.length
  );

  const inputClass =
    "mt-2 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-amber-700 focus:ring-4 focus:ring-amber-700/10 disabled:opacity-60";

  const labelClass = "block text-sm font-semibold text-stone-700";

  return (
    <main className="min-h-screen bg-[#f8f7f3] px-4 py-6 text-stone-900 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1500px]">
        {/* Header */}
        <header className="mb-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
            >
              <LayoutDashboard size={17} />
              Dashboard
            </Link>

            <Link
              to="/"
className="inline-flex items-center gap-2 rounded-xl bg-[#754629] px-4 py-2.5 text-sm font-semibold !text-white transition hover:bg-[#5e3720]"            >
              <Store size={17} />
              Back to Store
            </Link>
          </div>

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[10px] font-extrabold tracking-[0.18em] text-amber-900">
                <Tags size={14} />
                SPICECRAFT ADMIN
              </div>

              <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Category Management
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-stone-500 sm:text-base">
                Organise your spice collection with clear categories.
                Create, update and manage categories from one workspace.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setSuccess("");
                setError("");
                resetForm();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-amber-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-amber-800"
            >
              <Plus size={18} />
              New Category
            </button>
          </div>
        </header>

        {/* Alerts */}
        {error && (
          <div
            role="alert"
            className="mb-5 flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            <span className="flex items-start gap-2">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              {error}
            </span>

            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
              className="shrink-0 rounded-lg p-1 hover:bg-red-100"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {success && (
          <div
            role="status"
            className="mb-5 flex items-start justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
          >
            <span className="flex items-start gap-2">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
              {success}
            </span>

            <button
              type="button"
              onClick={() => setSuccess("")}
              aria-label="Dismiss success"
              className="shrink-0 rounded-lg p-1 hover:bg-emerald-100"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* Summary */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SummaryCard
            icon={Tags}
            label="Total Categories"
            value={loading ? "—" : categories.length}
            tone="bg-amber-50 text-amber-800"
          />

          <SummaryCard
            icon={CheckCircle2}
            label="Active Categories"
            value={loading ? "—" : activeCount}
            tone="bg-emerald-50 text-emerald-800"
          />

          <SummaryCard
            icon={Package}
            label="Inactive Categories"
            value={loading ? "—" : inactiveCount}
            tone="bg-stone-100 text-stone-700"
          />
        </section>

        <div className="grid items-start gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          {/* Add / Edit form */}
          <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-stone-100 bg-[#fcfaf6] p-5 sm:p-6">
              <div>
                <p className="text-[10px] font-extrabold tracking-[0.16em] text-amber-800">
                  CATEGORY DETAILS
                </p>

                <h2 className="mt-2 text-xl font-bold">
                  {editingId !== null ? "Edit Category" : "Add Category"}
                </h2>

                <p className="mt-1 text-sm text-stone-500">
                  {editingId !== null
                    ? "Update the selected category."
                    : "Create a new store category."}
                </p>
              </div>

              <div className="rounded-xl bg-amber-50 p-3 text-amber-800">
                {editingId !== null ? (
                  <Pencil size={21} />
                ) : (
                  <Plus size={21} />
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
              <label htmlFor="category-name" className={labelClass}>
                Category Name *
                <input
                  id="category-name"
                  name="name"
                  value={form.name}
                  onChange={updateField}
                  placeholder="e.g. Masala Powders"
                  required
                  maxLength={100}
                  disabled={saving}
                  className={inputClass}
                />
              </label>

              <label htmlFor="category-description" className={labelClass}>
                Description
                <textarea
                  id="category-description"
                  name="description"
                  value={form.description}
                  onChange={updateField}
                  placeholder="Describe this category..."
                  rows={4}
                  maxLength={500}
                  disabled={saving}
                  className={`${inputClass} resize-y`}
                />
              </label>

              <label htmlFor="category-image" className={labelClass}>
                Image URL or local path
                <input
                  id="category-image"
                  name="image"
                  type="text"
                  value={form.image}
                  onChange={updateField}
                  placeholder="/images/masala-powders.jpg"
                  disabled={saving}
                  className={inputClass}
                />
                <span className="mt-2 block text-xs font-normal leading-5 text-stone-500">
                  Local images can use a path like
                  /images/masala-powders.jpg.
                </span>
              </label>

              <div>
                <p className="mb-2 text-sm font-semibold text-stone-700">
                  Image Preview
                </p>

                <div className="flex items-center gap-3 rounded-xl border border-dashed border-stone-300 bg-stone-50 p-3">
                  <CategoryImage image={form.image} name={form.name} />

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-stone-800">
                      {form.name || "Category name"}
                    </p>
                    <p className="mt-1 text-xs text-stone-500">
                      {form.image ? "Preview of selected image" : "No image selected"}
                    </p>
                  </div>
                </div>
              </div>

              <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-stone-50 p-3">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={form.is_active}
                  onChange={updateField}
                  disabled={saving}
                  className="h-4 w-4 accent-amber-800"
                />

                <span>
                  <span className="block text-sm font-semibold text-stone-800">
                    Active Category
                  </span>
                  <span className="mt-0.5 block text-xs text-stone-500">
                    Allow this category to be used in your store.
                  </span>
                </span>
              </label>

              <button
                type="submit"
                disabled={saving}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-amber-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <RefreshCw size={17} className="animate-spin" />
                ) : editingId !== null ? (
                  <Pencil size={17} />
                ) : (
                  <Plus size={18} />
                )}

                {saving
                  ? "Saving..."
                  : editingId !== null
                    ? "Update Category"
                    : "Add Category"}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={saving}
                  className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 disabled:opacity-50"
                >
                  Cancel Editing
                </button>
              )}
            </form>
          </section>

          {/* Category list */}
          <section className="min-w-0 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-stone-100 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-bold">All Categories</h2>
                <p className="mt-1 text-sm text-stone-500">
                  {loading
                    ? "Loading categories..."
                    : `${filteredCategories.length} categories found`}
                </p>
              </div>

              <button
                type="button"
                onClick={() => loadCategories()}
                disabled={loading}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-stone-200 px-3 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 disabled:opacity-60"
              >
                <RefreshCw
                  size={16}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh
              </button>
            </div>

            <div className="p-4 sm:p-6">
              <label className="mb-5 flex min-h-11 items-center gap-3 rounded-xl border border-stone-200 px-3.5 text-stone-400 transition focus-within:border-amber-700 focus-within:ring-4 focus-within:ring-amber-700/10">
                <Search size={18} />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search category name or description..."
                  aria-label="Search categories"
                  className="min-w-0 flex-1 bg-transparent py-2 text-sm text-stone-800 outline-none placeholder:text-stone-400"
                />
              </label>

              {loading ? (
                <div className="flex min-h-52 flex-col items-center justify-center gap-3 text-sm text-stone-500">
                  <RefreshCw size={24} className="animate-spin text-amber-700" />
                  Loading categories from the database...
                </div>
              ) : filteredCategories.length === 0 ? (
                <div className="flex min-h-56 flex-col items-center justify-center px-4 text-center">
                  <div className="rounded-2xl bg-amber-50 p-4 text-amber-800">
                    <Tags size={28} />
                  </div>

                  <h3 className="mt-4 font-bold">
                    {search ? "No matching categories" : "No categories yet"}
                  </h3>

                  <p className="mt-2 max-w-xs text-sm leading-6 text-stone-500">
                    {search
                      ? "Try another search term."
                      : "Create your first category using the form."}
                  </p>

                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="mt-4 text-sm font-bold text-amber-800 hover:underline"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[650px] text-left">
                      <thead className="bg-[#faf8f4]">
                        <tr>
                          <th className="border-y border-stone-100 px-3 py-4 text-[10px] font-extrabold uppercase tracking-wider text-stone-500">
                            Category
                          </th>
                          <th className="border-y border-stone-100 px-3 py-4 text-[10px] font-extrabold uppercase tracking-wider text-stone-500">
                            Status
                          </th>
                          <th className="border-y border-stone-100 px-3 py-4 text-right text-[10px] font-extrabold uppercase tracking-wider text-stone-500">
                            Actions
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-stone-100">
                        {visibleCategories.map((category) => {
                          const isActive = category.is_active !== false;
                          const busy =
                            String(actionId) === String(category.id);

                          return (
                            <tr
                              key={category.id ?? category.name}
                              className="transition hover:bg-[#fdfbf7]"
                            >
                              <td className="px-3 py-4">
                                <div className="flex items-center gap-3">
                                  <CategoryImage
                                    image={category.image}
                                    name={category.name}
                                  />

                                  <div className="min-w-0">
                                    <p className="max-w-64 truncate text-sm font-bold text-stone-800">
                                      {category.name}
                                    </p>
                                    <p className="mt-1 max-w-64 truncate text-xs text-stone-500">
                                      {category.description || "No description"}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              <td className="px-3 py-4">
                                <span
                                  className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-bold ${
                                    isActive
                                      ? "bg-emerald-50 text-emerald-800"
                                      : "bg-stone-100 text-stone-600"
                                  }`}
                                >
                                  <span className="text-[9px]">●</span>
                                  {isActive ? "Active" : "Inactive"}
                                </span>
                              </td>

                              <td className="px-3 py-4">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleEdit(category)}
                                    disabled={actionId !== null || saving}
                                    title="Edit category"
                                    aria-label={`Edit ${category.name}`}
                                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 text-stone-600 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-800 disabled:opacity-40"
                                  >
                                    <Pencil size={16} />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleToggleStatus(category)}
                                    disabled={actionId !== null || saving}
                                    className={`rounded-xl px-3 py-2 text-xs font-bold transition disabled:opacity-40 ${
                                      isActive
                                        ? "bg-amber-50 text-amber-800 hover:bg-amber-100"
                                        : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                                    }`}
                                  >
                                    {busy
                                      ? "Saving..."
                                      : isActive
                                        ? "Deactivate"
                                        : "Activate"}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleDelete(category)}
                                    disabled={actionId !== null || saving}
                                    title="Delete category"
                                    aria-label={`Delete ${category.name}`}
                                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 text-stone-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:opacity-40"
                                  >
                                    {busy ? (
                                      <RefreshCw
                                        size={16}
                                        className="animate-spin"
                                      />
                                    ) : (
                                      <Trash2 size={16} />
                                    )}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="mt-5 flex flex-col gap-3 border-t border-stone-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-stone-500 sm:text-sm">
                      Showing{" "}
                      <span className="font-bold text-stone-800">
                        {startItem}–{endItem}
                      </span>{" "}
                      of{" "}
                      <span className="font-bold text-stone-800">
                        {filteredCategories.length}
                      </span>{" "}
                      categories
                    </p>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={safePage <= 1}
                        onClick={() =>
                          setCurrentPage((page) => Math.max(1, page - 1))
                        }
                        className="inline-flex items-center gap-1 rounded-xl border border-stone-200 px-3 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ChevronLeft size={16} />
                        Previous
                      </button>

                      <span className="min-w-16 text-center text-sm font-semibold text-stone-600">
                        {safePage} / {totalPages}
                      </span>

                      <button
                        type="button"
                        disabled={safePage >= totalPages}
                        onClick={() =>
                          setCurrentPage((page) =>
                            Math.min(totalPages, page + 1)
                          )
                        }
                        className="inline-flex items-center gap-1 rounded-xl border border-stone-200 px-3 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Next
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>
        </div>

        <footer className="flex flex-col gap-2 py-6 text-center text-xs text-stone-400 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <span>© {new Date().getFullYear()} SpiceCraft Admin</span>
          <span className="flex items-center justify-center gap-1.5">
            <CheckCircle2 size={14} />
            Category management workspace
          </span>
        </footer>
      </div>
    </main>
  );
}

export default AdminCategories;
