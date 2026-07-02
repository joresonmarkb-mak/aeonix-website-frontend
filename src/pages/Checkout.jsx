import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import API from "../services/api.js";

function Input({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] tracking-[1.5px] uppercase text-gray-500">{label}</label>
      <input
        {...props}
        className="border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a1410] transition-colors w-full"
      />
    </div>
  );
}

export default function Checkout() {
  const { cartItems, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    province: user?.address?.province || "",
    postalCode: user?.address?.postalCode || "",
    country: "Philippines",
  });
  const [payment, setPayment] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePlaceOrder = async () => {
    if (!address.street || !address.city || !address.province || !address.postalCode) {
      return setError("Please fill in all address fields.");
    }
    setLoading(true);
    setError("");
    try {
      const items = cartItems.map(i => ({ product: i._id, quantity: i.quantity }));
      await API.post("/orders", {
        items,
        shippingAddress: address,
        paymentMethod: payment,
      }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      clearCart();
      navigate("/orders?success=true");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p className="text-gray-400 mb-4">Your cart is empty.</p>
          <a href="/allwatches" className="text-[#C8A03C] underline text-sm">Browse Watches</a>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f4ef]">
      <Navbar />

      <div className="max-w-5xl mx-auto px-[5%] pt-28 pb-16">
        <p className="text-[#C8A03C] text-[11px] tracking-[4px] uppercase mb-2">Almost there</p>
        <h1 className="font-serif text-3xl font-bold text-[#1a1410] mb-10">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">

          {/* Left — Form */}
          <div className="flex flex-col gap-6">

            {/* Shipping Address */}
            <div className="bg-white p-6">
              <h2 className="font-bold text-[#1a1410] text-sm tracking-wide mb-5">Shipping Address</h2>
              <div className="flex flex-col gap-4">
                <Input
                  label="Street"
                  placeholder="123 Rizal Street"
                  value={address.street}
                  onChange={e => setAddress(a => ({ ...a, street: e.target.value }))}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="City"
                    placeholder="Urdaneta"
                    value={address.city}
                    onChange={e => setAddress(a => ({ ...a, city: e.target.value }))}
                  />
                  <Input
                    label="Province"
                    placeholder="Pangasinan"
                    value={address.province}
                    onChange={e => setAddress(a => ({ ...a, province: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Postal Code"
                    placeholder="2428"
                    value={address.postalCode}
                    onChange={e => setAddress(a => ({ ...a, postalCode: e.target.value }))}
                  />
                  <Input
                    label="Country"
                    value={address.country}
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-6">
              <h2 className="font-bold text-[#1a1410] text-sm tracking-wide mb-5">Payment Method</h2>
              <div className="flex flex-col gap-3">

                {/* COD */}
                <label className={`flex items-center gap-4 p-4 border cursor-pointer transition-colors ${payment === "cod" ? "border-[#1a1410] bg-gray-50" : "border-gray-200 hover:border-gray-300"}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={payment === "cod"}
                    onChange={() => setPayment("cod")}
                    className="accent-[#1a1410]"
                  />
                  <div>
                    <p className="text-sm font-bold text-[#1a1410]">Cash on Delivery</p>
                    <p className="text-xs text-gray-400">Pay when your order arrives</p>
                  </div>
                  <span className="ml-auto text-2xl">💵</span>
                </label>

                {/* Card */}
                <label className={`flex items-center gap-4 p-4 border cursor-pointer transition-colors ${payment === "card" ? "border-[#1a1410] bg-gray-50" : "border-gray-200 hover:border-gray-300"}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={payment === "card"}
                    onChange={() => setPayment("card")}
                    className="accent-[#1a1410]"
                  />
                  <div>
                    <p className="text-sm font-bold text-[#1a1410]">Credit / Debit Card</p>
                    <p className="text-xs text-gray-400">Secure payment via Stripe</p>
                  </div>
                  <span className="ml-auto text-2xl">💳</span>
                </label>

                {/* Stripe card fields */}
                {payment === "card" && (
                  <div className="border border-gray-200 p-4 flex flex-col gap-3 mt-1">
                    <Input label="Card Number" placeholder="1234 5678 9012 3456" />
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Expiry" placeholder="MM / YY" />
                      <Input label="CVC" placeholder="123" />
                    </div>
                    <Input label="Name on Card" placeholder="Juan dela Cruz" />
                    <p className="text-[10px] text-gray-400 flex items-center gap-1">
                      🔒 Secured by Stripe
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right — Order Summary */}
          <div className="flex flex-col gap-4">
            <div className="bg-white p-6 sticky top-24">
              <h2 className="font-bold text-[#1a1410] text-sm tracking-wide mb-5">Order Summary</h2>

              <div className="flex flex-col gap-4 mb-5">
                {cartItems.map(item => (
                  <div key={item._id} className="flex gap-3">
                    <div className="w-14 h-14 flex-shrink-0 overflow-hidden bg-gray-100">
                      <img
                        src={item.image?.[0]?.replace(/"/g, '') || "https://placehold.co/56x56?text=?"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-[#1a1410] leading-tight">{item.name}</p>
                      <p className="text-[10px] text-gray-400">{item.referenceNumber}</p>
                      <p className="text-xs text-[#C8A03C] font-bold mt-0.5">₱{item.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="font-semibold">₱{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Shipping</span>
                  <span className="text-gray-500">To be determined</span>
                </div>
                <div className="flex justify-between text-base font-bold mt-2 pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span className="text-[#1a1410]">₱{total.toLocaleString()}</span>
                </div>
              </div>

              {error && <p className="text-red-500 text-xs mt-3">{error}</p>}

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full mt-5 py-3.5 bg-[#1a1410] text-[#C8A03C] text-xs font-bold tracking-[2px] uppercase hover:bg-[#2a2018] transition-colors border-none cursor-pointer disabled:opacity-50"
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}