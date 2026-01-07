import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import AdminPrinciplesPage from "./pages/AdminPrinciplesPage";
import TodaysDealsPage from "./pages/TodaysDealsPage";
import GiftCardsPage from "./pages/GiftCardsPage";
import GiftCardPurchasePage from "./pages/GiftCardPurchasePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/deals" element={<TodaysDealsPage />} />
          <Route path="/gift-cards" element={<GiftCardsPage />} />
          <Route path="/gift-cards/purchase" element={<GiftCardPurchasePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
          <Route path="/admin/principles" element={<AdminPrinciplesPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;