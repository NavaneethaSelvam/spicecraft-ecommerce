
import React, { useState } from "react";
import { Link } from "react-router-dom";
import useCartStore from "../store/cartStore";
import "./Cart.css";

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

  const subtotal = items.reduce(
    (total, item) =>
      total + Number(item.price || 0) * item.quantity,
    0
  );

  const delivery = subtotal === 0 || subtotal >= 500 ? 0 : 49;
  const total = subtotal + delivery;

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setCouponMessage("Please enter a coupon code.");
      return;
    }

    setCouponMessage(
      "Coupon codes are not available yet."
    );
  };

  if (items.length === 0) {
    return (
      <main className="cart-page">
        <div className="empty-cart">
          <span className="cart-eyebrow">YOUR SPICES</span>

          <h1>Your Cart is Empty</h1>

          <p>
            Looks like you haven't added any spices to your
            cart yet.
          </p>

          <Link to="/shop" className="cart-shop-btn">
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="cart-heading">
        <span className="cart-eyebrow">YOUR SPICES</span>

        <h1>Shopping Cart</h1>

        <p>
          Review your selected spices before checking out.
        </p>
      </div>

      <div className="cart-layout">
        <section className="cart-items">
          {items.map((item) => (
            <article className="cart-item" key={item.id}>
              <div className="cart-image">
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
              </div>

              <div className="cart-item-info">
                <span className="cart-item-category">
                  SPICECRAFT
                </span>

                <h3>{item.name}</h3>

                <p>
                  {item.weight ||
                    item.weight_label ||
                    item.quantity_label ||
                    "100g"}
                </p>

                <div className="cart-item-bottom">
                  <div className="quantity">
                    <button
                      type="button"
                      aria-label={`Decrease ${item.name} quantity`}
                      disabled={item.quantity <= 1}
                      onClick={() => decreaseQuantity(item.id)}
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      type="button"
                      aria-label={`Increase ${item.name} quantity`}
                      onClick={() => increaseQuantity(item.id)}
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    className="remove-item"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>

              <strong className="cart-item-price">
                ₹{(
                  Number(item.price || 0) * item.quantity
                ).toFixed(2).replace(/\.00$/, "")}
              </strong>
            </article>
          ))}

          <Link to="/shop" className="continue-shopping">
            ← Continue Shopping
          </Link>
        </section>

        <aside className="order-summary">
          <h2>Order Summary</h2>

          <div className="shipping-progress">
            {subtotal >= 500 ? (
              <strong>You've unlocked FREE SHIPPING</strong>
            ) : (
              <>
                Add ₹{500 - subtotal} more for{" "}
                <strong>FREE SHIPPING</strong>
              </>
            )}
          </div>

          <div className="coupon-box">
            <input
              type="text"
              placeholder="Coupon code"
              value={couponCode}
              onChange={(event) => {
                setCouponCode(event.target.value);
                setCouponMessage("");
              }}
            />

            <button
              type="button"
              onClick={handleApplyCoupon}
            >
              Apply
            </button>
          </div>

          {couponMessage && (
            <p role="status">{couponMessage}</p>
          )}

          <div className="summary-row">
            <span>Subtotal</span>
            <strong>₹{subtotal}</strong>
          </div>

          <div className="summary-row">
            <span>Delivery</span>

            <strong>
              {delivery === 0 ? "FREE" : `₹${delivery}`}
            </strong>
          </div>

          <div className="summary-divider" />

          <div className="summary-total">
            <span>Total</span>
            <strong>₹{total}</strong>
          </div>

          <Link
            to="/checkout"
            className="cart-checkout-btn"
          >
            Proceed to Checkout
          </Link>

          <p className="secure-checkout">
            Secure checkout • Freshly packed • Delivered
            across India
          </p>
        </aside>
      </div>
    </main>
  );
};

export default Cart;