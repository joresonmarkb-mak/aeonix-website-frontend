import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";

export default function CartSidebar({ onLoginRequired }) {
  const { cartItems, removeFromCart, cartOpen, setCartOpen, total, count } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePlaceOrder = () => {
    if (!user) {
      onLoginRequired();
      return;
    }
    setCartOpen(false);
    navigate("/checkout");
  };

  return (
    <>
      {/* Backdrop */}
      {cartOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setCartOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ${cartOpen ? "translate-x-0" : "translate-x-full"}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-[#1a1410] tracking-wide">
            Carts <span className="text-gray-400 font-normal text-sm">({count})</span>
          </h2>
          <button
            onClick={() => setCartOpen(false)}
            className="text-gray-400 hover:text-[#1a1410] bg-transparent border-none cursor-pointer text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <span className="text-4xl mb-3">🕰️</span>
              <p className="text-gray-400 text-sm">Your cart is empty</p>
              <button
                onClick={() => setCartOpen(false)}
                className="mt-4 text-xs text-[#C8A03C] underline bg-transparent border-none cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item._id} className="flex gap-3 bg-gray-50 p-3">
                {/* Image */}
                <div className="w-16 h-16 flex-shrink-0 overflow-hidden">
                  <img
                    src={item.images?.[0]?.replace(/"/g, '') || "https://placehold.co/64x64?text=?"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold tracking-[2px] uppercase text-gray-400">{item.brand}</p>
                  <p className="text-sm font-semibold text-[#1a1410] leading-tight truncate">{item.name}</p>
                  <p className="text-[10px] text-gray-400">{item.referenceNumber}</p>
                  <p className="text-[#C8A03C] text-sm font-bold mt-1">₱{item.price.toLocaleString()} only</p>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-400 hover:text-red-600 text-[11px] bg-transparent border-none cursor-pointer p-0 mt-1"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-4 flex flex-col gap-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total</span>
              <span className="font-bold text-[#1a1410]">₱{total.toLocaleString()}</span>
            </div>
            <button
              onClick={handlePlaceOrder}
              className="w-full py-3 bg-[#1a1410] text-[#C8A03C] text-xs font-bold tracking-[2px] uppercase hover:bg-[#2a2018] transition-colors border-none cursor-pointer"
            >
              Place Order
            </button>
          </div>
        )}
      </div>
    </>
  );
}