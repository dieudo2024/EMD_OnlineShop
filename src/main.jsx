import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { CartProvider } from "./context/CartContext";
import { ReviewsProvider } from "./context/ReviewsContext";
import { ProductCatalogProvider } from "./context/ProductCatalogContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AdminAuthProvider>
        <ProductCatalogProvider>
          <CartProvider>
            <ReviewsProvider>
              <App />
            </ReviewsProvider>
          </CartProvider>
        </ProductCatalogProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);