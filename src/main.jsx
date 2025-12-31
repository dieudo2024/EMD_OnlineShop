import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { CartProvider } from "./context/CartContext";
import { ReviewsProvider } from "./context/ReviewsContext";
import { ProductCatalogProvider } from "./context/ProductCatalogContext";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ProductCatalogProvider>
        <CartProvider>
          <ReviewsProvider>
            <App />
          </ReviewsProvider>
        </CartProvider>
      </ProductCatalogProvider>
    </BrowserRouter>
  </React.StrictMode>
);