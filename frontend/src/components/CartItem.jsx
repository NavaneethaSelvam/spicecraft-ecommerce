import React from "react";
import "./CartItem.css";

const CartItem = ({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}) => {
  if (!item) return null;

  const {
    id,
    name,
    image,
    price,
    quantity = 1,
    weight,
  } = item;

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <img
          src={image}
          alt={name}
          onError={(e) => {
            e.target.src = "/images/product-placeholder.jpg";
          }}
        />
      </div>

      <div className="cart-item-details">
        <h3>{name}</h3>

        {weight && (
          <span className="cart-item-weight">
            {weight}
          </span>
        )}

        <div className="cart-item-price">
          ₹{price}
        </div>

        <div className="cart-item-actions">
          <div className="quantity-control">
            <button
              type="button"
              onClick={() => onDecrease?.(id)}
              aria-label="Decrease quantity"
            >
              −
            </button>

            <span>{quantity}</span>

            <button
              type="button"
              onClick={() => onIncrease?.(id)}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <button
            type="button"
            className="remove-cart-item"
            onClick={() => onRemove?.(id)}
          >
            Remove
          </button>
        </div>
      </div>

      <div className="cart-item-total">
        ₹{price * quantity}
      </div>
    </div>
  );
};

export default CartItem;