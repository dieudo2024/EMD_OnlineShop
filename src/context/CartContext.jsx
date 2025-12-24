import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loadCartFromStorage, saveCartToStorage } from "../services/storage";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => loadCartFromStorage());

  useEffect(() => {
    saveCartToStorage(cartItems); 
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          discountPercentage: product.discountPercentage,
          thumbnail: product.thumbnail,
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const getDiscountedPrice = (item) => {
    if (!item.discountPercentage) return item.price;
    const price = item.price * (1 - item.discountPercentage / 100);
    return Number(price.toFixed(2));
  };

  const { itemCount, subtotal } = useMemo(() => {
    const count = cartItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const sub = cartItems.reduce((sum, item) => {
      const effectivePrice = getDiscountedPrice(item);
      return sum + effectivePrice * item.quantity;
    }, 0);
    return {
      itemCount: count,
      subtotal: Number(sub.toFixed(2)),
    };
  }, [cartItems]);

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