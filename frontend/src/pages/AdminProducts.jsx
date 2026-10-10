
import React, { useEffect, useState } from "react";
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
} from "lucide-react";
import "./AdminProducts.css";

const initialProducts = [
  {
    id: 1,
    name: "Chicken Biryani Masala",
    category: "Spice Blends",
    price: 149,
    stock: 35,
    image:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400",
  },
  {
    id: 2,
    name: "Chettinad Masala",
    category: "Masala Powders",
    price: 129,
    stock: 20,
    image:
      "https://images.unsplash.com/photo-1599909533608-6e6c2c2e0c8b?w=400",
  },
  {
    id: 3,
    name: "Sambar Powder",
    category: "Masala Powders",
    price: 99,
    stock: 0,
    image:
      "https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=400",
  },
  {
    id: 4,
    name: "Garlic Podi",
    category: "Podis",
    price: 89,
    stock: 42,
    image:
      "https://images.unsplash.com/photo-1603905179139-d6c4f6a1e0e6?w=400",
  },
];

const emptyForm = {
  name: "",
  category: "Masala Powders",
  price: "",
  stock: "",
  image: "",
};

function AdminProducts() {
  const [products, setProducts] = useState(() => {
    try {
      const savedProducts = localStorage.getItem("spicecraft_products");
      return savedProducts
        ? JSON.parse(savedProducts)
        : initialProducts;
    } catch {
      return initialProducts;
    }
  });

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");

  useEffect(() => {
    localStorage.setItem(
      "spicecraft_products",
      JSON.stringify(products)
    );
  }, [products]);

  const filteredProducts = products.filter((product) =>
    `${product.name} ${product.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalStock = products.reduce(
    (total, product) => total + Number(product.stock || 0),
    0
  );

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
    setMessage("");
  };

  const openEditForm = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      image: product.image || "",
    });
    setShowForm(true);
    setMessage("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const newProduct = {
      id: editingId ?? Date.now(),
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock),
      image: form.image.trim(),
    };

    if (!newProduct.name) {
      setMessage("Please enter a product name.");
      return;
    }

    if (
      form.price === "" ||
      !Number.isFinite(newProduct.price) ||
      newProduct.price <= 0
    ) {
      setMessage("Please enter a valid price greater than zero.");
      return;
    }

    if (
      form.stock === "" ||
      !Number.isInteger(newProduct.stock) ||
      newProduct.stock < 0
    ) {
      setMessage("Please enter a valid stock quantity.");
      return;
    }

    if (editingId !== null) {
      setProducts((previous) =>
        previous.map((product) =>
          product.id === editingId ? newProduct : product
        )
      );
      setMessage("Product updated successfully!");
    } else {
      setProducts((previous) => [newProduct, ...previous]);
      setMessage("Product added successfully!");
    }

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleDelete = (id, name) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"?`
    );

    if (!confirmed) return;

    setProducts((previous) =>
      previous.filter((product) => product.id !== id)
    );
    setMessage("Product deleted successfully!");
  };

  return (
    <main className="admin-products-page">
      <div className="admin-products-container">
        <Link to="/admin/dashboard" className="admin-back-link">
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        <header className="admin-products-header">
          <div>
            <span className="admin-eyebrow">SPICECRAFT ADMIN</span>
            <h1>Product Management</h1>
            <p>
              Manage your spice collection, pricing and inventory.
            </p>
          </div>

          <button
            type="button"
            className="admin-add-button"
            onClick={openAddForm}
          >
            <Plus size={19} />
            Add Product
          </button>
        </header>

        {message && (
          <div className="admin-product-message" role="status">
            <span>{message}</span>
            <button
              type="button"
              onClick={() => setMessage("")}
              aria-label="Dismiss message"
            >
              <X size={17} />
            </button>
          </div>
        )}

        <section className="admin-product-stats">
          <article className="admin-product-stat">
            <span className="admin-stat-icon">
              <Package size={22} />
            </span>
            <div>
              <p>Total Products</p>
              <h2>{products.length}</h2>
            </div>
          </article>

          <article className="admin-product-stat">
            <span className="admin-stat-icon">
              <ImagePlus size={22} />
            </span>
            <div>
              <p>Total Stock Units</p>
              <h2>{totalStock}</h2>
            </div>
          </article>

          <article className="admin-product-stat">
            <span className="admin-stat-icon">
              <Package size={22} />
            </span>
            <div>
              <p>Out of Stock</p>
              <h2>
                {products.filter((product) => Number(product.stock) === 0)
                  .length}
              </h2>
            </div>
          </article>
        </section>

        {showForm && (
          <section className="admin-product-form-card">
            <div className="admin-form-heading">
              <div>
                <h2>
                  {editingId !== null ? "Edit Product" : "Add New Product"}
                </h2>
                <p>Enter the product details below.</p>
              </div>

              <button
                type="button"
                className="admin-close-button"
                onClick={() => {
                  setShowForm(false);
                  setMessage("");
                }}
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="admin-form-grid">
                <label>
                  Product Name *
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Madras Curry Powder"
                    required
                  />
                </label>

                <label>
                  Category *
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                  >
                    <option>Masala Powders</option>
                    <option>Spice Blends</option>
                    <option>Curry Pastes</option>
                    <option>Podis</option>
                    <option>Pickles</option>
                    <option>Pure Spices</option>
                  </select>
                </label>

                <label>
                  Price (₹) *
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="149"
                    min="0.01"
                    step="0.01"
                    required
                  />
                </label>

                <label>
                  Stock Quantity *
                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    placeholder="25"
                    min="0"
                    step="1"
                    required
                  />
                </label>

                <label className="admin-form-full">
                  Product Image URL
                  <input
                    type="url"
                    name="image"
                    value={form.image}
                    onChange={handleChange}
                    placeholder="https://example.com/spice-image.jpg"
                  />
                  <small>
                    Optional. You can add a hosted image URL here.
                  </small>
                </label>
              </div>

              {message && (
                <p className="admin-form-error" role="alert">
                  {message}
                </p>
              )}

              <div className="admin-form-actions">
                <button
                  type="button"
                  className="admin-cancel-button"
                  onClick={() => {
                    setShowForm(false);
                    setMessage("");
                  }}
                >
                  Cancel
                </button>

                <button type="submit" className="admin-save-button">
                  {editingId !== null ? "Save Changes" : "Add Product"}
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="admin-product-list-card">
          <div className="admin-product-list-heading">
            <div>
              <h2>All Products</h2>
              <p>{filteredProducts.length} products found</p>
            </div>

            <div className="admin-product-search">
              <Search size={18} />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products..."
                aria-label="Search products"
              />
            </div>
          </div>

          <div className="admin-product-table-wrap">
            <table className="admin-product-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="admin-product-info">
                        <div className="admin-product-image">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              onError={(event) => {
                                event.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <Package size={23} />
                          )}
                        </div>
                        <strong>{product.name}</strong>
                      </div>
                    </td>

                    <td>{product.category}</td>

                    <td className="admin-product-price">
                      ₹{Number(product.price).toFixed(2)}
                    </td>

                    <td>{product.stock}</td>

                    <td>
                      <span
                        className={`admin-stock-badge ${
                          Number(product.stock) === 0
                            ? "stock-out"
                            : Number(product.stock) < 10
                              ? "stock-low"
                              : "stock-available"
                        }`}
                      >
                        {Number(product.stock) === 0
                          ? "Out of Stock"
                          : Number(product.stock) < 10
                            ? "Low Stock"
                            : "In Stock"}
                      </span>
                    </td>

                    <td>
                      <div className="admin-product-actions">
                        <button
                          type="button"
                          className="admin-edit-button"
                          onClick={() => openEditForm(product)}
                          aria-label={`Edit ${product.name}`}
                          title="Edit product"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          className="admin-delete-button"
                          onClick={() =>
                            handleDelete(product.id, product.name)
                          }
                          aria-label={`Delete ${product.name}`}
                          title="Delete product"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan="6" className="admin-no-products">
                      No products found. Try another search or add a product.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <p className="admin-demo-note">
          Demo mode: product changes are saved in this browser only.
          Connect the backend to store products in the database.
        </p>
      </div>
    </main>
  );
}

export default AdminProducts;

