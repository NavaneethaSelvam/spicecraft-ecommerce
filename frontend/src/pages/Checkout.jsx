
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useCartStore from "../store/cartStore";
import "./Checkout.css";

const Checkout = () => {
  const navigate = useNavigate();

  const cartItems = useCartStore((state) => state.cartItems);
  const clearCart = useCartStore((state) => state.clearCart);

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Calculate subtotal from actual cart items
  const subtotal = cartItems.reduce(
    (total, item) =>
      total + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  // Free delivery for orders of Rs. 500 or more
  const deliveryCharge =
    cartItems.length === 0 || subtotal >= 500 ? 0 : 49;

  const total = subtotal + deliveryCharge;

  // Redirect to cart if it is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/cart", { replace: true });
    }
  }, [cartItems.length, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handlePlaceOrder = (event) => {
    event.preventDefault();

    if (cartItems.length === 0) {
      alert("Your cart is empty. Please add products first.");
      navigate("/shop");
      return;
    }

    const phone = formData.phone.replace(/\D/g, "");
    const pincode = formData.pincode.trim();

    if (!/^[6-9]\d{9}$/.test(phone)) {
      alert("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    if (!/^\d{6}$/.test(pincode)) {
      alert("Please enter a valid 6-digit PIN code.");
      return;
    }

    const order = {
      orderId: `SC${Date.now()}`,
      customer: {
        ...formData,
        phone,
        pincode,
      },
      items: cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        image: item.image || item.image_url || "",
        price: Number(item.price || 0),
        quantity: Number(item.quantity || 1),
      })),
      subtotal,
      deliveryCharge,
      total,
      paymentMethod,
      status: "Order Placed",
      createdAt: new Date().toISOString(),
    };

    // Save the order for the frontend order-tracking page
    try {
      sessionStorage.setItem("spicecraftLatestOrder", JSON.stringify(order));
    } catch (error) {
      console.error("Unable to save order details:", error);
      alert("Could not save your order details. Please try again.");
      return;
    }

    // Clear cart only after the order details are saved
    clearCart();

    navigate("/order-tracking", {
      state: { order },
    });
  };

  if (cartItems.length === 0) {
    return (
      <main className="checkout-page">
        <div className="checkout-heading">
          <h1>Your cart is empty</h1>
          <p>Add some delicious spices before checking out.</p>
          <Link to="/shop" className="place-order-btn">
            Explore Spices
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <div className="checkout-heading">
        <span className="checkout-eyebrow">SPICECRAFT CHECKOUT</span>
        <h1>Complete Your Order</h1>
        <p>
          Enter your delivery details and choose your payment method.
        </p>
      </div>

      <form
        className="checkout-layout"
        onSubmit={handlePlaceOrder}
      >
        {/* LEFT SIDE */}
        <section className="checkout-form">
          {/* Delivery Details */}
          <div className="checkout-card">
            <div className="checkout-section-title">
              <span>01</span>
              <div>
                <h2>Delivery Details</h2>
                <p>Where should we deliver your spices?</p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="checkout-name">Full Name *</label>
                <input
                  id="checkout-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="checkout-phone">
                  Phone Number *
                </label>
                <input
                  id="checkout-phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  autoComplete="tel"
                  inputMode="numeric"
                  maxLength={10}
                  required
                />
              </div>

              <div className="form-group full">
                <label htmlFor="checkout-email">
                  Email Address
                </label>
                <input
                  id="checkout-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  autoComplete="email"
                />
              </div>

              <div className="form-group full">
                <label htmlFor="checkout-address">
                  Delivery Address *
                </label>
                <textarea
                  id="checkout-address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="House / Door No, Street, Area"
                  rows={4}
                  autoComplete="street-address"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="checkout-city">City *</label>
                <input
                  id="checkout-city"
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  autoComplete="address-level2"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="checkout-state">State *</label>
                <input
                  id="checkout-state"
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State"
                  autoComplete="address-level1"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="checkout-pincode">PIN Code *</label>
                <input
                  id="checkout-pincode"
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="6-digit PIN code"
                  inputMode="numeric"
                  maxLength={6}
                  autoComplete="postal-code"
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="checkout-card">
            <div className="checkout-section-title">
              <span>02</span>
              <div>
                <h2>Payment Method</h2>
                <p>Select your preferred payment option.</p>
              </div>
            </div>

            <div className="payment-options">
              <label
                className={`payment-option ${
                  paymentMethod === "cod" ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(event) =>
                    setPaymentMethod(event.target.value)
                  }
                />

                <div>
                  <strong>Cash on Delivery</strong>
                  <span>Pay when your order arrives</span>
                </div>
              </label>

              <label
                className={`payment-option ${
                  paymentMethod === "online" ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="online"
                  checked={paymentMethod === "online"}
                  onChange={(event) =>
                    setPaymentMethod(event.target.value)
                  }
                />

                <div>
                  <strong>Online Payment</strong>
                  <span>UPI / Card / Net Banking</span>
                  <small>
                    Demo option — payment gateway not connected yet.
                  </small>
                </div>
              </label>
            </div>
          </div>
        </section>

        {/* RIGHT SIDE: DYNAMIC ORDER SUMMARY */}
        <aside className="checkout-summary">
          <h2>Order Summary</h2>

          <div className="checkout-products-list">
            {cartItems.map((item) => (
              <div
                className="checkout-product"
                key={item.id}
              >
                <img
                  src={
                    item.image ||
                    item.image_url ||
                    "/images/product-placeholder.jpg"
                  }
                  alt={item.name}
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src =
                      "/images/product-placeholder.jpg";
                  }}
                />

                <div className="checkout-product-info">
                  <strong>{item.name}</strong>
                  <span>
                    ₹{Number(item.price || 0).toFixed(2)} ×{" "}
                    {item.quantity}
                  </span>
                </div>

                <strong className="checkout-item-total">
                  ₹
                  {(
                    Number(item.price || 0) *
                    Number(item.quantity || 0)
                  ).toFixed(2)}
                </strong>
              </div>
            ))}
          </div>

          <div className="checkout-divider" />

          <div className="checkout-summary-row">
            <span>Subtotal</span>
            <strong>₹{subtotal.toFixed(2)}</strong>
          </div>

          <div className="checkout-summary-row">
            <span>Delivery</span>
            <strong>
              {deliveryCharge === 0
                ? "FREE"
                : `₹${deliveryCharge.toFixed(2)}`}
            </strong>
          </div>

          {subtotal < 500 && (
            <p className="checkout-delivery-hint">
              Add ₹{(500 - subtotal).toFixed(2)} more for free delivery.
            </p>
          )}

          <div className="checkout-total">
            <span>Total</span>
            <strong>₹{total.toFixed(2)}</strong>
          </div>

          <button
            type="submit"
            className="place-order-btn"
          >
            Place Order — ₹{total.toFixed(2)}
          </button>

          <Link to="/cart" className="back-cart">
            ← Back to Cart
          </Link>

          <p className="checkout-note">
            Freshly packed • Quality spices • Delivered across India
          </p>
        </aside>
      </form>
    </main>
  );
};

export default Checkout;

