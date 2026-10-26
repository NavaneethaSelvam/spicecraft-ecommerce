
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  Heart,
  Menu,
  X,
  ShieldCheck,
  Package,
} from "lucide-react";

import useCartStore from "../store/cartStore";
import useWishlistStore from "../store/wishlistStore";

const navItems = [
  { label: "Home", to: "/", end: true },
  { label: "Shop", to: "/shop" },
  { label: "My Orders", to: "/my-orders", icon: Package },
  { label: "Recipes", to: "/recipes" },
  { label: "Blog", to: "/blog" },
  { label: "About", to: "/about" },
];

const navClass = ({ isActive }) =>
  [
    "rounded-full px-3 py-2 text-sm font-semibold transition-colors duration-200",
    isActive
      ? "bg-[#f2e5d5] text-[#8c3b1e]"
      : "text-stone-800 hover:bg-[#f8f1e8] hover:text-[#8c3b1e]",
  ].join(" ");

const iconButtonClass =
  "relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-stone-800 transition-colors duration-200 hover:bg-[#f2e5d5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9b6747]";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const navigate = useNavigate();

  const cartItems = useCartStore((state) => state.cartItems || []);
  const wishlist = useWishlistStore((state) => state.wishlist || []);

  const cartCount = cartItems.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );

  const wishlistCount = wishlist.length;

  const closeMenu = () => setMenuOpen(false);

  const handleSearch = (event) => {
    event.preventDefault();

    const query = searchText.trim();

    if (!query) return;

    navigate(`/shop?search=${encodeURIComponent(query)}`);
    closeMenu();
  };

  const renderSearch = (mobile = false) => (
    <form
      onSubmit={handleSearch}
      role="search"
      className={[
        "flex h-10 min-w-0 items-center gap-2 rounded-full border border-[#e7d8c7] bg-white px-3",
        "transition-colors focus-within:border-[#9b6747] focus-within:ring-2 focus-within:ring-[#ead8c6]",
        mobile ? "w-full" : "hidden w-40 lg:flex xl:w-48 2xl:w-56",
      ].join(" ")}
    >
      <Search
        size={18}
        aria-hidden="true"
        className="shrink-0 text-stone-500"
      />

      <input
        type="search"
        aria-label="Search spices"
        placeholder="Search spices..."
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        className="!h-full !min-w-0 !flex-1 !border-0 !bg-transparent !px-0 !py-0 !text-sm !text-stone-900 !shadow-none !outline-none focus:!ring-0"
      />

      {searchText && (
        <button
          type="button"
          onClick={() => setSearchText("")}
          aria-label="Clear search"
          className="shrink-0 text-xs text-stone-600 transition-colors hover:text-[#8c3b1e]"
        >
          Clear
        </button>
      )}
    </form>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#eadfd3] bg-[#fffdf8]/95 shadow-[0_3px_18px_rgba(60,35,15,0.05)] backdrop-blur-md">
      <div className="mx-auto flex min-h-[68px] max-w-[1440px] items-center justify-between gap-3 px-3 sm:min-h-[76px] sm:px-6 lg:min-h-[84px] lg:gap-5 lg:px-8 xl:px-10">
        {/* Brand */}
        <Link
          to="/"
          onClick={closeMenu}
          aria-label="SpiceCraft home"
          className="flex min-w-0 shrink-0 flex-col leading-tight"
        >
          <span className="font-serif text-[19px] font-extrabold tracking-[0.06em] text-[#8c3b1e] sm:text-[25px] sm:tracking-[0.1em]">
            SPICECRAFT
          </span>

          <span className="mt-1 hidden text-[10px] tracking-wide text-stone-600 sm:block">
            From Indian Spices to Extraordinary Meals
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center justify-center gap-0.5 lg:flex"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={navClass}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Header Actions */}
        <div className="ml-auto flex shrink-0 items-center justify-end gap-1 sm:gap-2">
          {renderSearch()}

          {/* Admin Login */}
          <Link
            to="/admin/login"
            aria-label="Admin login"
            title="Admin login"
            onClick={closeMenu}
            className={`${iconButtonClass} hidden 2xl:inline-flex`}
          >
            <ShieldCheck size={20} aria-hidden="true" />
          </Link>

          {/* My Orders */}
          <Link
            to="/my-orders"
            aria-label="My Orders"
            title="My Orders"
            onClick={closeMenu}
            className={iconButtonClass}
          >
            <Package size={21} aria-hidden="true" />
          </Link>

          {/* Wishlist */}
          <Link
            to="/wishlist"
            aria-label={`My wishlist, ${wishlistCount} saved items`}
            title="My Wishlist"
            onClick={closeMenu}
            className={iconButtonClass}
          >
            <Heart
              size={21}
              aria-hidden="true"
              className={
                wishlistCount > 0 ? "fill-rose-100 text-rose-600" : ""
              }
            />

            {wishlistCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-[#fffdf8] bg-rose-600 px-1 text-[10px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Shopping Cart */}
          <Link
            to="/cart"
            onClick={closeMenu}
            aria-label={`Shopping cart, ${cartCount} items`}
            className={iconButtonClass}
          >
            <ShoppingCart size={21} aria-hidden="true" />

            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-[#fffdf8] bg-[#743d24] px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            className={`${iconButtonClass} lg:hidden`}
          >
            {menuOpen ? (
              <X size={22} aria-hidden="true" />
            ) : (
              <Menu size={22} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-[#eadfd3] bg-[#fffdf8] px-4 py-4 shadow-lg sm:px-6 lg:hidden"
        >
          <div className="mx-auto flex max-w-3xl flex-col gap-3">
            {renderSearch(true)}

            <nav
              aria-label="Mobile navigation"
              className="flex flex-col gap-1"
            >
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={closeMenu}
                  className={navClass}
                >
                  <span className="inline-flex items-center gap-2">
                    {item.icon && <item.icon size={18} aria-hidden="true" />}
                    {item.label}
                  </span>
                </NavLink>
              ))}
            </nav>

            <div className="border-t border-[#eadfd3]" />

            <Link
              to="/my-orders"
              onClick={closeMenu}
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-stone-800 transition-colors hover:bg-[#f8f1e8]"
            >
              <Package size={19} aria-hidden="true" />
              My Orders
            </Link>

            <Link
              to="/wishlist"
              onClick={closeMenu}
              className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold text-stone-800 transition-colors hover:bg-[#f8f1e8]"
            >
              <span className="flex items-center gap-3">
                <Heart size={19} className="text-rose-600" />
                My Wishlist
              </span>

              <span className="rounded-full bg-rose-50 px-2 py-1 text-xs text-rose-600">
                {wishlistCount}
              </span>
            </Link>

            <Link
              to="/admin/login"
              onClick={closeMenu}
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-stone-800 transition-colors hover:bg-[#f8f1e8]"
            >
              <ShieldCheck size={19} aria-hidden="true" />
              Admin Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
