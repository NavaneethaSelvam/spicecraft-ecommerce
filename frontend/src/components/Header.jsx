import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="container header-inner">

        {/* Logo */}
        <Link to="/" className="logo">
          <strong>SPICECRAFT</strong>
          <span>From Indian Spices to Extraordinary Meals.</span>
        </Link>

        {/* Navigation */}
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/recipes">Recipes</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/about">About</Link>
        </nav>

        {/* Actions */}
        <div className="header-actions">
          <Link to="/shop" className="header-icon">
            🔍
          </Link>

          <Link to="/cart" className="header-icon">
            🛒
            <span className="cart-badge">0</span>
          </Link>
        </div>

      </div>
    </header>
  );
}

export default Header;