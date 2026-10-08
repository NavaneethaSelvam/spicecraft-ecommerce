import React from "react";
import CartItem from "./CartItem";

const CartDrawer = ({
  isOpen,
  cartItems = [],
  onClose,
  onIncrease,
  onDecrease,
  onRemove,
  onCheckout,
}) => {
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (!isOpen) return null;

  return (
    <div className="cart-drawer-overlay" onClick={onClose}>
      <aside
        className="cart-drawer"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cart-drawer-header">
          <h2>Your Cart</h2>

          <button
            type="button"
            onClick={onClose}
            className="cart-close-btn"
          >
            ×
          </button>
        </div>

        <div className="cart-drawer-content">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">🛒</div>

              <h3>Your cart is empty</h3>

              <p>Add some delicious spices to your cart.</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onIncrease={onIncrease}
                onDecrease={onDecrease}
                onRemove={onRemove}
              />
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-total">
              <span>Total</span>
              <strong>₹{total}</strong>
            </div>

            <button
              type="button"
              className="checkout-btn"
              onClick={onCheckout}
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </aside>
    </div>
  );
};

export default CartDrawer;
