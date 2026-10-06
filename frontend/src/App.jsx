import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderTracking from "./pages/OrderTracking";
import Recipes from "./pages/Recipes";
import RecipeDetails from "./pages/RecipeDetails";
import Blog from "./pages/Blog";
import About from "./pages/About";
import BulkOrder from "./pages/BulkOrder";
import ExportEnquiry from "./pages/ExportEnquiry";
import ProductDetails from "./pages/ProductDetails";

import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/shop" element={<Shop />} />

        <Route
          path="/product/:id"
          element={<ProductDetails />}
        />

        <Route path="/cart" element={<Cart />} />

        <Route path="/checkout" element={<Checkout />} />

        <Route
          path="/order-tracking"
          element={<OrderTracking />}
        />

        <Route path="/recipes" element={<Recipes />} />

        <Route
          path="/recipes/:id"
          element={<RecipeDetails />}
        />

        <Route path="/blog" element={<Blog />} />

        <Route path="/about" element={<About />} />

        <Route path="/bulk-order" element={<BulkOrder />} />

        <Route
          path="/export-enquiry"
          element={<ExportEnquiry />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;