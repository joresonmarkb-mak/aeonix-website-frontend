import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext.jsx";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();

  // Use user-specific key so each account has its own cart
  const cartKey = user ? `aeonix_cart_${user._id}` : "aeonix_cart_guest";

  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem(cartKey);
    return saved ? JSON.parse(saved) : [];
  });
  const [cartOpen, setCartOpen] = useState(false);

  // Reload cart when user changes (login/logout/switch account)
  useEffect(() => {
    const saved = localStorage.getItem(cartKey);
    setCartItems(saved ? JSON.parse(saved) : []);
  }, [cartKey]);

  // Save cart whenever it changes
  useEffect(() => {
    localStorage.setItem(cartKey, JSON.stringify(cartItems));
  }, [cartItems, cartKey]);

  const addToCart = (watch) => {
    setCartItems(prev => {
      const existing = prev.find(i => i._id === watch._id);
      if (existing) return prev;
      return [...prev, { ...watch, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(i => i._id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(cartKey);
  };

  const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = cartItems.length;

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, cartOpen, setCartOpen, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);