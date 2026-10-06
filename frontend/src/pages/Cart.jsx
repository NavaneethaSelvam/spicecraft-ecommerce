import { Link } from "react-router-dom";

export default function Cart() {
  const items = [
    {
      id: 1,
      name: "Chicken Biryani Masala",
      price: 149,
      quantity: 1,
    },
    {
      id: 2,
      name: "Sambar Powder",
      price: 99,
      quantity: 2,
    },
  ];

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <main className="page">
      <div className="page-heading">
        <span className="eyebrow">YOUR SPICES</span>
        <h1>Shopping Cart</h1>
      </div>

      <div className="cart-layout">
        <section className="cart-items">
          {items.map((item) => (
            <div className="cart-item" key={item.id}>
              <div className="cart-image">🌶️</div>

              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p>200g</p>

                <div className="quantity">
                  <button>−</button>
                  <span>{item.quantity}</span>
                  <button>+</button>
                </div>
              </div>

              <strong>₹{item.price * item.quantity}</strong>
            </div>
          ))}
        </section>

        <aside className="order-summary">
          <h2>Order Summary</h2>

          <div className="shipping-progress">
            Add ₹152 more for <strong>FREE SHIPPING</strong>
          </div>

          <input placeholder="Coupon code" />

          <div className="summary-row">
            <span>Subtotal</span>
            <strong>₹{subtotal}</strong>
          </div>

          <div className="summary-row">
            <span>Delivery</span>
            <strong>₹49</strong>
          </div>

          <div className="summary-total">
            <span>Total</span>
            <strong>₹{subtotal + 49}</strong>
          </div>

          <Link to="/checkout" className="btn btn-primary full-width">
            Proceed to Checkout
          </Link>
        </aside>
      </div>
    </main>
  );
}