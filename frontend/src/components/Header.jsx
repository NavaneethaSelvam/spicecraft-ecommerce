
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  UserRound,
  ShieldCheck,
} from "lucide-react";

import useCartStore from "../store/cartStore";
import "./Header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const cartItems = useCartStore((state) => state.cartItems);

  const cartCount = cartItems.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );

  const handleSearch = (event) => {
    event.preventDefault();

    const query = searchText.trim();

    if (query) {
      window.location.href = `/shop?search=${encodeURIComponent(query)}`;
      closeMenu();
    }
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="brand-logo" onClick={closeMenu}>
          <span className="brand-name">SPICECRAFT</span>
          <span className="brand-tagline">
            From Indian Spices to Extraordinary Meals
          </span>
        </Link>

        {/* Navigation */}
        <nav className={`main-nav ${menuOpen ? "nav-open" : ""}`}>
          <NavLink to="/" onClick={closeMenu}>
            Home
          </NavLink>

          <NavLink to="/shop" onClick={closeMenu}>
            Shop
          </NavLink>

          <NavLink to="/recipes" onClick={closeMenu}>
            Recipes
          </NavLink>

          <NavLink to="/blog" onClick={closeMenu}>
            Blog
          </NavLink>

          <NavLink to="/about" onClick={closeMenu}>
            About
          </NavLink>

          {/* Mobile Login and Admin Links */}
          <div className="mobile-account-links">
            <Link to="/login" onClick={closeMenu}>
              <UserRound size={17} />
              Login
            </Link>

            <Link to="/admin/login" onClick={closeMenu}>
              <ShieldCheck size={17} />
              Admin
            </Link>
          </div>
        </nav>

        {/* Header Actions */}
        <div className="header-actions">
          {/* Search */}
          <form className="header-search" onSubmit={handleSearch}>
            <input
              type="search"
              placeholder="Search spices..."
              aria-label="Search spices"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
            />

            <button type="submit" aria-label="Search">
              <Search size={20} />
            </button>
          </form>

          {/* Customer Login */}
          <Link to="/login" className="header-login">
            <UserRound size={17} />
            <span>Login</span>
          </Link>

          {/* Admin */}
          <Link to="/admin/login" className="header-admin">
            <ShieldCheck size={17} />
            <span>Admin</span>
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="header-cart"
            aria-label={`Shopping cart, ${cartCount} items`}
            onClick={closeMenu}
          >
            <ShoppingCart size={23} />

            {cartCount > 0 && (
              <span className="cart-count">{cartCount}</span>
            )}
          </Link>

          {/* Mobile Menu */}
          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={() => setMenuOpen((previous) => !previous)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={25} /> : <Menu size={25} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;