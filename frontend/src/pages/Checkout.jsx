import { Link } from "react-router-dom";

export default function Checkout() {
  return (
    <main className="page">
      <div className="page-heading">
        <span className="eyebrow">ALMOST THERE</span>
        <h1>Checkout</h1>
      </div>

      <div className="checkout-layout">
        <form className="checkout-form">
          <h2>Delivery Details</h2>

          <input placeholder="Customer Name" required />
          <input placeholder="Phone Number" required />
          <input type="email" placeholder="Email (Optional)" />

          <textarea placeholder="Full Address" rows="4" required />

          <div className="two-columns">
            <input placeholder="City" required />
            <input placeholder="State" required />
          </div>

          <input placeholder="Pincode" required />

          <div className="offline-payment">
            <h3>Payment Information</h3>
            <p>
              Payment will be confirmed offline by our team after
              your order is reviewed.
            </p>
          </div>

          <Link to="/order-success" className="btn btn-primary">
            Place Order
          </Link>
        </form>

        <aside className="order-summary">
          <h2>Your Order</h2>

          <div className="summary-row">
            <span>Chicken Biryani Masala × 1</span>
            <strong>₹149</strong>
          </div>

          <div className="summary-row">
            <span>Sambar Powder × 2</span>
            <strong>₹198</strong>
          </div>

          <div className="summary-total">
            <span>Total</span>
            <strong>₹347</strong>
          </div>
        </aside>
      </div>
    </main>
  );
}