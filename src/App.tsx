
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import { CartProvider } from "./contexts/CartContext";
import { ProductFilterProvider } from "./contexts/ProductFilterContext";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import { Toaster } from "@/components/ui/sonner";
import FloatingCart from "./components/FloatingCart";

function App() {
  return (
    <ProductFilterProvider>
      <CartProvider>
        <AdminAuthProvider>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <FloatingCart />
              <Toaster />
            </div>
          </Router>
        </AdminAuthProvider>
      </CartProvider>
    </ProductFilterProvider>
  );
}

export default App;
