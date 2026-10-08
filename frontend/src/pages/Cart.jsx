import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Cart.css";

const Cart = () => {
  const [items, setItems] = useState([
    {
      id: 1,
      name: "Chicken Biryani Masala",
      price: 149,
      quantity: 1,
      weight: "100g",
      image: "/images/bestseller-chicken-biryani.jpg",
    },
    {
      id: 2,
      name: "Sambar Powder",
      price: 99,
      quantity: 2,
      weight: "100g",
      image: "/images/bestseller-sambar.jpg",
    },
  ]);

  const increaseQuantity = (id) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== id)
    );
  };

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const delivery = subtotal >= 500 ? 0 : 49;
  const total = subtotal + delivery;

  if (items.length === 0) {
    return (
      <main className="cart-page">
        <div className="empty-cart">
          <span className="cart-eyebrow">YOUR SPICES</span>

          <h1>Your Cart is Empty</h1>

          <p>
            Looks like you haven't added any spices to your cart yet.
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
                  src={item.image}
                  alt={item.name}
                  onError={(e) => {
                    e.currentTarget.src =
                      "/images/product-placeholder.jpg";
                  }}
                />
              </div>

              <div className="cart-item-info">
                <span className="cart-item-category">
                  SPICECRAFT
                </span>

                <h3>{item.name}</h3>

                <p>{item.weight}</p>

                <div className="cart-item-bottom">
                  <div className="quantity">
                    <button
                      type="button"
                      onClick={() => decreaseQuantity(item.id)}
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      type="button"
                      onClick={() => increaseQuantity(item.id)}
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    className="remove-item"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>

              <strong className="cart-item-price">
                ₹{item.price * item.quantity}
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
            />

            <button type="button">
              Apply
            </button>
          </div>

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

          <div className="summary-divider"></div>

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
            Secure checkout • Freshly packed • Delivered across India
          </p>
        </aside>
      </div>
    </main>
  );
};

export default Cart;