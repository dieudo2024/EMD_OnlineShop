import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { loadCartFromStorage, saveCartToStorage } from "../services/storage";
import { Cart } from "../domain/Cart";
import { CartItem } from "../domain/CartItem";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => Cart.fromStorage(loadCartFromStorage()));

  useEffect(() => {
    saveCartToStorage(cart.toJSON());
  }, [cart]);

  const addToCart = useCallback((product) => {
    setCart((prev) => prev.addProduct(product));
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart((prev) => prev.removeItem(id));
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    setCart((prev) => prev.updateQuantity(id, quantity));
  }, []);

  const clearCart = useCallback(() => {
    setCart(() => new Cart());
  }, []);

  const getDiscountedPrice = useCallback((item) => {
    if (item instanceof CartItem) {
      return item.getEffectivePrice();
    }
    return CartItem.computeEffectivePrice(item.price, item.discountPercentage);
  }, []);

  const cartItems = useMemo(() => cart.getItems(), [cart]);
  const itemCount = useMemo(() => cart.getItemCount(), [cart]);
  const subtotal = useMemo(() => cart.getSubtotal(), [cart]);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    itemCount,
    subtotal, 
    getDiscountedPrice,
  };

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}