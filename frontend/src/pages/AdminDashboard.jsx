
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingBag,
  Users,
  ArrowUpRight,
  ArrowRight,
  Search,
  Bell,
  Menu,
  X,
  Leaf,
  Sparkles,
  Boxes,
  CircleHelp,
  Settings,
  ExternalLink,
  Clock3,
  ShieldCheck,
  TrendingUp,
  ChartNoAxesCombined,
    Images,
  Ticket,
} from "lucide-react";

import api from "../api";

const navigation = [
  { label: "Overview", to: "/admin", icon: LayoutDashboard },
  { label: "Products", to: "/admin/products", icon: Package },
  { label: "Categories", to: "/admin/categories", icon: Tags },
  { label: "Orders", to: "/admin/orders", icon: ShoppingBag },
  { label: "Media Manager", to: "/admin/media", icon: Images },
  { label: "Coupons", to: "/admin/coupons", icon: Ticket },
];

function StatCard({ title, value, subtitle, icon: Icon, color, loading }) {
  return (
    <article className="group rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-stone-500">{title}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-stone-900">
            {loading ? "..." : value}
          </p>
        </div>

        <div className={`rounded-2xl p-3 ${color}`}>
          <Icon size={22} strokeWidth={1.8} />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 border-t border-stone-100 pt-4">
        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700">
          <TrendingUp size={14} />
          Live data
        </span>
        <span className="text-xs text-stone-400">{subtitle}</span>
      </div>
    </article>
  );
}

function AdminDashboard() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [productCount, setProductCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  const location = useLocation();

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      setLoading(true);
      setApiError("");

      const results = await Promise.allSettled([
        api.get("/products"),
        api.get("/categories"),
        api.get("/admin/orders"),
      ]);

      if (!mounted) return;

      const [productsResult, categoriesResult, ordersResult] = results;

      if (productsResult.status === "fulfilled") {
        const data = productsResult.value.data;
        const products = Array.isArray(data) ? data : data?.items ?? [];
        setProductCount(products.length);
      } else {
        setApiError("Products data load aagala. Backend check pannunga.");
      }

      if (categoriesResult.status === "fulfilled") {
        const data = categoriesResult.value.data;
        const categories = Array.isArray(data) ? data : data?.items ?? [];
        setCategoryCount(categories.length);
      }

      if (ordersResult.status === "fulfilled") {
        const data = ordersResult.value.data;
        const orders = Array.isArray(data) ? data : data?.orders ?? [];
        setOrderCount(orders.length);

        const customerEmails = new Set(
          orders.map((order) => order.email).filter(Boolean)
        );
        setCustomerCount(customerEmails.size);
      }

      setLoading(false);
    }

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, [location.pathname]);

  const closeMenu = () => setMobileMenu(false);

  return (
    <div className="min-h-screen bg-[#f8f7f3] text-stone-900">
      <div className="flex min-h-screen">
        {mobileMenu && (
          <button
            aria-label="Close navigation"
            onClick={closeMenu}
            className="fixed inset-0 z-40 bg-stone-950/50 lg:hidden"
          />
        )}

        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col bg-[#211c17] text-white transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
            mobileMenu ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-[88px] items-center justify-between border-b border-white/10 px-6">
            <Link
              to="/"
              className="flex items-center gap-3"
              onClick={closeMenu}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500 text-xl font-black text-stone-950">
                S
              </div>
              <div>
                <p className="text-[17px] font-extrabold tracking-[0.15em]">
                  SPICECRAFT
                </p>
                <p className="mt-1 text-[10px] font-semibold tracking-[0.24em] text-amber-400">
                  ADMIN WORKSPACE
                </p>
              </div>
            </Link>

            <button
              onClick={closeMenu}
              className="rounded-lg p-2 text-stone-300 hover:bg-white/10 lg:hidden"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          <div className="px-5 pt-8">
            <p className="mb-3 px-3 text-[10px] font-bold tracking-[0.2em] text-stone-500">
              WORKSPACE
            </p>

            <nav className="space-y-1.5">
              {navigation.map(({ label, to, icon: Icon }) => {
                const isActive =
                  location.pathname === to ||
                  (to !== "/admin" &&
                    location.pathname.startsWith(`${to}/`));

                return (
                  <Link
                    key={label}
                    to={to}
                    onClick={closeMenu}
                    className={`group flex items-center gap-3 rounded-xl px-3.5 py-3.5 text-sm font-medium transition ${
                      isActive
                        ? "bg-amber-500 text-stone-950 shadow-lg shadow-black/10"
                        : "text-stone-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon size={19} />
                    <span>{label}</span>

                    {isActive && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-stone-900" />
                    )}
                  </Link>
                );
              })}
            </nav>

            <p className="mb-3 mt-9 px-3 text-[10px] font-bold tracking-[0.2em] text-stone-500">
              STORE
            </p>

            <Link
              to="/"
              className="flex items-center gap-3 rounded-xl px-3.5 py-3.5 text-sm font-medium text-stone-300 transition hover:bg-white/10 hover:text-white"
              onClick={closeMenu}
            >
              <ExternalLink size={19} />
              <span>View storefront</span>
            </Link>
          </div>

          <div className="mt-auto p-5">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="flex items-center gap-2 text-amber-400">
                <ShieldCheck size={18} />
                <span className="text-xs font-semibold">Store workspace</span>
              </div>
              <p className="mt-2 text-xs leading-5 text-stone-400">
                Manage products, categories and customer orders in one place.
              </p>
            </div>

            <div className="mt-5 flex items-center gap-2 px-2 text-[11px] text-stone-500">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              SpiceCraft Management
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-[#f8f7f3]/95 backdrop-blur-xl">
            <div className="flex h-[76px] items-center justify-between gap-4 px-4 sm:px-7 xl:px-10">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  onClick={() => setMobileMenu(true)}
                  className="rounded-xl border border-stone-200 bg-white p-2.5 lg:hidden"
                  aria-label="Open menu"
                >
                  <Menu size={20} />
                </button>

                <div className="min-w-0">
                  <p className="hidden text-[10px] font-bold tracking-[0.19em] text-stone-400 sm:block">
                    STORE MANAGEMENT / OVERVIEW
                  </p>
                  <h1 className="mt-0.5 truncate text-lg font-bold tracking-tight sm:text-xl">
                    Dashboard
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-xs text-stone-400 md:flex">
                  <Search size={15} />
                  <span>SpiceCraft workspace</span>
                </div>

                <button
                  aria-label="Notifications"
                  className="relative rounded-xl border border-stone-200 bg-white p-2.5 text-stone-600 transition hover:bg-stone-100"
                >
                  <Bell size={19} />
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-amber-500" />
                </button>

                <div className="flex items-center gap-2.5 border-l border-stone-200 pl-3 sm:pl-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e9d6b7] font-bold text-[#69451f]">
                    A
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-bold">Administrator</p>
                    <p className="mt-0.5 text-xs text-stone-500">
                      Store Manager
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[1500px] space-y-8 px-4 py-6 sm:px-7 sm:py-8 xl:px-10">
            <section className="relative isolate overflow-hidden rounded-[28px] bg-[#302318] shadow-xl shadow-stone-900/10">
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#50351f] via-[#302318] to-[#211c17]" />
              <div className="absolute -right-12 -top-24 -z-10 h-80 w-80 rounded-full border border-amber-300/10" />
              <div className="absolute -right-1 -top-12 -z-10 h-64 w-64 rounded-full border border-amber-300/10" />
              <div className="absolute -bottom-32 right-20 -z-10 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />

              <div className="grid items-center gap-8 p-6 sm:p-9 lg:grid-cols-[1.35fr_0.65fr] lg:p-11">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-400/10 px-3 py-1.5 text-[10px] font-bold tracking-[0.17em] text-amber-300 sm:text-xs">
                    <Sparkles size={14} />
                    YOUR STORE WORKSPACE
                  </span>

                  <h2 className="mt-6 max-w-2xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl xl:text-[46px]">
                    Every great meal starts with a little{" "}
                    <span className="text-amber-400">spice.</span>
                  </h2>

                  <p className="mt-4 max-w-xl text-sm leading-7 text-stone-300 sm:text-base">
                    Keep your products, categories and orders organised from
                    one place.
                  </p>

                  <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <Link
                      to="/admin/products"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3.5 text-sm font-bold text-stone-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-amber-400"
                    >
                      <Package size={18} />
                      Manage Products
                      <ArrowRight size={16} />
                    </Link>

                    <Link
                      to="/admin/categories"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                      <Tags size={18} />
                      Manage Categories
                    </Link>

                    <Link
                      to="/admin/orders"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-300/30 bg-amber-400/10 px-5 py-3.5 text-sm font-semibold text-amber-200 transition hover:bg-amber-400/20"
                    >
                      <ShoppingBag size={18} />
                      Manage Orders
                      <ArrowRight size={16} />
                    </Link>

                    <Link
  to="/admin/media"
  className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-300/30 bg-white/10 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-white/20"
>
  <Images size={18} />
  Manage Media
  <ArrowRight size={16} />
</Link>
                  </div>
                </div>

                <div className="hidden justify-center lg:flex">
                  <div className="relative flex h-64 w-64 items-center justify-center rounded-full border border-amber-200/15 bg-amber-300/[0.04]">
                    <div className="absolute inset-5 rounded-full border border-amber-200/15" />
                    <div className="absolute inset-10 rounded-full border border-amber-200/15" />
                    <div className="flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-amber-600 text-[#382214] shadow-2xl shadow-black/30">
                      <Leaf size={65} strokeWidth={1.1} />
                    </div>
                    <span className="absolute right-3 top-9 rounded-xl border border-white/10 bg-white/10 p-3 text-amber-300 backdrop-blur">
                      <Sparkles size={21} />
                    </span>
                    <span className="absolute bottom-8 left-2 rounded-xl border border-white/10 bg-white/10 p-3 text-amber-300 backdrop-blur">
                      <Boxes size={21} />
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/10 bg-black/10 px-6 py-4 text-xs text-stone-300 sm:px-9">
                <span className="flex items-center gap-2">
                  <ShieldCheck size={15} className="text-amber-400" />
                  Catalogue management
                </span>
               <span className="flex items-center gap-2">
  <Leaf size={15} className="text-amber-400" />
  Authentic Indian spices
</span>

<span className="flex items-center gap-2">
  <ShoppingBag size={15} className="text-amber-400" />
  Order management
</span>

<span className="flex items-center gap-2">
  <Images size={15} className="text-amber-400" />
  Media management
</span>
              </div>
            </section>

            <section>
              <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.2em] text-amber-700">
                    STORE AT A GLANCE
                  </p>
                  <h2 className="mt-1.5 text-xl font-bold tracking-tight sm:text-2xl">
                    Your store overview
                  </h2>
                  <p className="mt-1 text-sm text-stone-500">
                    A quick look at your current store data.
                  </p>
                </div>

                <span className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs text-stone-500">
                  <Clock3 size={13} className="mr-1.5 inline" />
                  Current data
                </span>
              </div>

              {apiError && (
                <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  {apiError}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  title="Total Products"
                  value={productCount}
                  subtitle="Products in catalogue"
                  icon={Package}
                  color="bg-amber-50 text-amber-700"
                  loading={loading}
                />

                <StatCard
                  title="Categories"
                  value={categoryCount}
                  subtitle="Available collections"
                  icon={Tags}
                  color="bg-emerald-50 text-emerald-700"
                  loading={loading}
                />

                <StatCard
                  title="Total Orders"
                  value={orderCount}
                  subtitle="Orders in system"
                  icon={ShoppingBag}
                  color="bg-sky-50 text-sky-700"
                  loading={loading}
                />

                <StatCard
                  title="Customers"
                  value={customerCount}
                  subtitle="Unique emails in orders"
                  icon={Users}
                  color="bg-violet-50 text-violet-700"
                  loading={loading}
                />
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.18em] text-stone-400">
                      STORE CONTROL
                    </p>
                    <h2 className="mt-2 text-xl font-bold">
                      Manage your store
                    </h2>
                    <p className="mt-2 max-w-lg text-sm leading-6 text-stone-500">
                      Keep products, spice categories and customer orders
                      organised in one workspace.
                    </p>
                  </div>

                  <div className="rounded-xl bg-amber-50 p-3 text-amber-700">
                    <ChartNoAxesCombined size={22} />
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <ManagementLink
                    to="/admin/products"
                    icon={<Package size={21} />}
                    title="Product management"
                    description="Add spices, update prices, stock and product images."
                    color="bg-amber-100 text-amber-800"
                  />

                  <ManagementLink
                    to="/admin/categories"
                    icon={<Tags size={21} />}
                    title="Category management"
                    description="Organise spice blends, pure spices, podis and pickles."
                    color="bg-emerald-100 text-emerald-800"
                  />

                  <ManagementLink
                    to="/admin/orders"
                    icon={<ShoppingBag size={21} />}
                    title="Order management"
                    description="View customer orders and update delivery status."
                    color="bg-sky-100 text-sky-800"
                  />

                  <ManagementLink
                    to="/admin/coupons"
                    icon={<Ticket size={21} />}
                    title="Coupon management"
                    description="Create discount codes, set usage limits and expiry dates."
                    color="bg-rose-100 text-rose-800"
                  />
                </div>
              </div>

              <div className="flex flex-col rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm sm:p-7">
                <p className="text-[10px] font-bold tracking-[0.18em] text-stone-400">
                  NEXT STEPS
                </p>
                <h2 className="mt-2 text-xl font-bold">Store checklist</h2>
                <p className="mt-2 text-sm leading-6 text-stone-500">
                  Use these shortcuts to prepare your store for customers.
                </p>

                <div className="mt-6 space-y-5">
                  <ChecklistItem
                    icon={<Package size={16} />}
                    title="Review product details"
                    description="Confirm names, prices, stock and image paths."
                    to="/admin/products"
                  />

                  <ChecklistItem
                    icon={<Tags size={16} />}
                    title="Check categories"
                    description="Make sure categories match the store filters."
                    to="/admin/categories"
                  />

                  <ChecklistItem
                    icon={<ShoppingBag size={16} />}
                    title="Review customer orders"
                    description="Track new orders and update their status."
                    to="/admin/orders"
                  />

                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-700">
                      <CircleHelp size={16} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">
                        Check store API
                      </p>
                      <p className="mt-1 text-xs leading-5 text-stone-500">
                        Ensure the backend and database are running.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-auto border-t border-stone-100 pt-5">
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 transition hover:text-amber-800"
                  >
                    View storefront
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </section>

            <footer className="flex flex-col gap-2 border-t border-stone-200 py-5 text-xs text-stone-400 sm:flex-row sm:items-center sm:justify-between">
              <span>
                © {new Date().getFullYear()} SpiceCraft · Admin Workspace
              </span>
              <span className="flex items-center gap-1.5">
                <Settings size={13} />
                Store management
              </span>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}

function ManagementLink({ to, icon, title, description, color }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-4 rounded-xl border border-stone-200 p-4 transition hover:border-amber-300 hover:bg-amber-50/50"
    >
      <span className={`rounded-xl p-3 ${color}`}>{icon}</span>

      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold">{title}</span>
        <span className="mt-1 block text-xs leading-5 text-stone-500">
          {description}
        </span>
      </span>

      <ArrowUpRight
        size={19}
        className="shrink-0 text-stone-400 transition group-hover:text-amber-700"
      />
    </Link>
  );
}

function ChecklistItem({ icon, title, description, to }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-700">
        {icon}
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 text-xs leading-5 text-stone-500">
          {description}
        </p>
      </div>

      <Link
        to={to}
        className="text-xs font-bold text-amber-800 hover:underline"
      >
        Open
      </Link>
    </div>
  );
}

export default AdminDashboard;
