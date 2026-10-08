import { BrowserRouter, Routes, Route } from "react-router-dom";

import AnnouncementBar from "./components/AnnouncementBar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Notification from "./components/Notification";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderTracking from "./pages/OrderTracking";

import Recipes from "./pages/Recipes";
import RecipeDetails from "./pages/RecipeDetails";

import Blog from "./pages/Blog";
import BlogDetails from "./pages/BlogDetails";

import About from "./pages/About";
import BulkOrder from "./pages/BulkOrder";
import ExportEnquiry from "./pages/ExportEnquiry";

import "./index.css";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AnnouncementBar />

      <Header />

      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Shop */}
        <Route path="/shop" element={<Shop />} />

        {/* Product Details */}
        <Route
          path="/product/:id"
          element={<ProductDetails />}
        />

        {/* Cart */}
        <Route
          path="/cart"
          element={<Cart />}
        />

        {/* Checkout */}
        <Route
          path="/checkout"
          element={<Checkout />}
        />

        {/* Order Tracking */}
        <Route
          path="/order-tracking"
          element={<OrderTracking />}
        />

        {/* Recipes */}
        <Route
          path="/recipes"
          element={<Recipes />}
        />

        {/* Recipe Details */}
        <Route
          path="/recipes/:id"
          element={<RecipeDetails />}
        />

        {/* Blog */}
        <Route
          path="/blog"
          element={<Blog />}
        />

        {/* Blog Details */}
        <Route
          path="/blog/:id"
          element={<BlogDetails />}
        />

        {/* About */}
        <Route
          path="/about"
          element={<About />}
        />

        {/* Bulk Order */}
        <Route
          path="/bulk-order"
          element={<BulkOrder />}
        />

        {/* Export Enquiry */}
        <Route
          path="/export-enquiry"
          element={<ExportEnquiry />}
        />
      </Routes>

      {/* Notification */}
      <Notification
        message="Welcome to SpiceCraft!"
        type="success"
        isVisible={false}
      />

      {/* Footer - only once */}
      <Footer />
    </BrowserRouter>
  );
}

export default App;