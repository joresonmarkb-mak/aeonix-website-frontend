import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("aeonix_cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("aeonix_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (watch) => {
    setCartItems(prev => {
      const existing = prev.find(i => i._id === watch._id);
      if (existing) return prev; // already in cart
      return [...prev, { ...watch, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(i => i._id !== id));
  };

  const clearCart = () => setCartItems([]);

  const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = cartItems.length;

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, cartOpen, setCartOpen, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);