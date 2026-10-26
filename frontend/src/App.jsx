
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Link,
} from "react-router-dom";

// Common components
import AnnouncementBar from "./components/AnnouncementBar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Notification from "./components/Notification";

// Store pages
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderTracking from "./pages/OrderTracking";
import Wishlist from "./pages/Wishlist";
import MyOrders from "./pages/MyOrders";

// Recipe pages
import Recipes from "./pages/Recipes";
import RecipeDetails from "./pages/RecipeDetails";

// Blog pages
import Blog from "./pages/Blog";
import BlogDetails from "./pages/BlogDetails";

// Other pages
import About from "./pages/About";
import BulkOrder from "./pages/BulkOrder";
import ExportEnquiry from "./pages/ExportEnquiry";

// Admin pages
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminCategories from "./pages/AdminCategories";
import AdminOrders from "./pages/AdminOrders";
import AdminMedia from "./pages/AdminMedia";
import AdminCoupons from "./pages/AdminCoupons";

// Global CSS
import "./index.css";
import "./App.css";

function AppLayout() {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <AnnouncementBar />}
      {!isAdminRoute && <Header />}

      <main className="min-h-[60vh]">
        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* Shop */}
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />

          {/* Cart and checkout */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />

          {/* Customer orders */}
          <Route path="/my-orders" element={<MyOrders />} />

          {/* Order tracking */}
          <Route
            path="/order-tracking"
            element={<OrderTracking />}
          />

          {/* Recipes */}
          <Route path="/recipes" element={<Recipes />} />
          <Route
            path="/recipes/:id"
            element={<RecipeDetails />}
          />

          {/* Blog */}
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetails />} />

          {/* Other pages */}
          <Route path="/about" element={<About />} />
          <Route path="/bulk-order" element={<BulkOrder />} />
          <Route
            path="/export-enquiry"
            element={<ExportEnquiry />}
          />

          {/* Admin */}
          <Route
            path="/admin/login"
            element={<AdminLogin />}
          />
          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />
          <Route
            path="/admin"
            element={<AdminDashboard />}
          />
          <Route
            path="/admin/products"
            element={<AdminProducts />}
          />
          <Route
            path="/admin/categories"
            element={<AdminCategories />}
          />
          <Route
            path="/admin/orders"
            element={<AdminOrders />}
          />
          <Route
            path="/admin/media"
            element={<AdminMedia />}
          />
          <Route
            path="/admin/coupons"
            element={<AdminCoupons />}
          />

          {/* 404 page */}
          <Route
            path="*"
            element={
              <section className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-4xl font-bold text-[#4d2518]">
                  404
                </h1>

                <p className="mt-3 text-[#796b61]">
                  Sorry, this page could not be found.
                </p>

                <Link
                  to="/"
                  className="mt-6 inline-flex rounded-md bg-[#783b25] px-6 py-3 font-semibold text-white transition hover:bg-[#4d2518]"
                >
                  Back to Home
                </Link>
              </section>
            }
          />
        </Routes>
      </main>

      <Notification
        message="Welcome to SpiceCraft!"
        type="success"
        isVisible={false}
      />

      {!isAdminRoute && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
