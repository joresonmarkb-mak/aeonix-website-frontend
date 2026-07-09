import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/navbar.jsx";
import Footer from "../components/footer.jsx";
import TrustBar from "../components/trustBar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import API from "../services/api.js";
import ReviewModal from "../components/ReviewModal.jsx";

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-700",
  Processing: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [reviewData, setReviewData] = useState(null);
  const success = searchParams.get("success");
  const [reviewedItems, setReviewedItems] = useState({});

  useEffect(() => {
    if (!user) return;
    API.get("/orders/mine", {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then(res => setOrders(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);
  useEffect(() => {
  if (!user || orders.length === 0) return;
  const deliveredItems = orders
    .filter(o => o.status === "Delivered")
    .flatMap(o => o.items.map(i => ({
      productId: i.product?._id || i.product,
      orderId: o._id
    })));

  deliveredItems.forEach(async ({ productId, orderId }) => {
    try {
      const res = await API.get(`/reviews/can-review/${productId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setReviewedItems(prev => ({
        ...prev,
        [`${orderId}_${productId}`]: !res.data.canReview && res.data.reason === "Already reviewed",
      }));
    } catch { }
  });
}, [orders, user]);

  return (
    <div className="min-h-screen bg-[#f7f4ef]">
      <Navbar />

      <div className="max-w-4xl mx-auto px-[5%] pt-28 pb-16">
        <p className="text-[#C8A03C] text-[11px] tracking-[4px] uppercase mb-2">My Account</p>
        <h1 className="font-serif text-3xl font-bold text-[#1a1410] mb-10">My Orders</h1>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-5 py-4 mb-8 flex items-center gap-3">
            <span>✅</span>
            <span>Your order has been placed successfully! We'll process it shortly.</span>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-5 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
                <div className="h-3 bg-gray-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-12 text-center">
            <p className="text-4xl mb-4">📦</p>
            <p className="font-serif text-xl text-[#1a1410] mb-2">No orders yet</p>
            <p className="text-gray-400 text-sm mb-6">Start shopping to see your orders here.</p>
            <Link to="/allwatches" className="inline-block px-8 py-3 bg-[#1a1410] text-[#C8A03C] text-xs font-bold tracking-[2px] uppercase no-underline hover:bg-[#2a2018] transition-colors">
              Browse Watches
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map(order => (
              <div key={order._id} className="bg-white p-5">

                {/* Order header */}
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <div>
                    <p className="text-[10px] text-gray-400 tracking-[1px] uppercase mb-0.5">Order ID</p>
                    <p className="text-xs font-mono text-[#1a1410]">#{order._id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 tracking-[1px] uppercase mb-0.5">Date</p>
                    <p className="text-xs text-[#1a1410]">{new Date(order.createdAt).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 tracking-[1px] uppercase mb-0.5">Total</p>
                    <p className="text-xs font-bold text-[#1a1410]">₱{order.totalAmount.toLocaleString()}</p>
                  </div>
                  <span className={`text-[10px] font-bold tracking-[1px] uppercase px-3 py-1.5 rounded-full ${statusColors[order.status] || "bg-gray-100 text-gray-600"}`}>
                    {order.status}
                  </span>
                </div>

                {/* Order items */}
                <div className="border-t border-gray-100 pt-4 flex flex-col gap-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex gap-3 items-center">
                      <div className="w-12 h-12 flex-shrink-0 bg-gray-100 overflow-hidden">
                        <img
                          src={item.image?.replace(/"/g, '') || "https://placehold.co/48x48?text=?"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-[#1a1410]">{item.name}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <p className="text-sm font-bold text-[#C8A03C]">₱{item.price.toLocaleString()}</p>
                        {/* Review button — only on Delivered orders */}
                        {order.status === "Delivered" && (
  <>
    {reviewedItems[`${order._id}_${item.product?._id || item.product}`] ? (
      // Already reviewed — show View Review
      <button
        onClick={() => window.location.href = `/watches/${item.product?._id || item.product}`}
        className="text-[10px] text-gray-400 hover:underline bg-transparent border-none cursor-pointer tracking-[1px] uppercase font-bold"
      >
        👁 View Review
      </button>
    ) : (
      // Not yet reviewed — show Write Review
      <button
        onClick={() => setReviewData({
          productId: item.product?._id || item.product,
          productName: item.name,
          orderId: order._id,
        })}
        className="text-[10px] text-[#C8A03C] hover:underline bg-transparent border-none cursor-pointer tracking-[1px] uppercase font-bold"
      >
        ★ Write Review
      </button>
    )}
  </>
)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping + payment */}
                <div className="border-t border-gray-100 pt-3 mt-3 flex flex-col gap-1">
                  <p className="text-[10px] text-gray-400 tracking-[1px] uppercase mb-1">Ship to</p>
                  <p className="text-xs text-gray-500">
                    {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.postalCode}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Payment: <span className="font-semibold text-[#1a1410]">{order.paymentMethod}</span>
                    {order.isPaid && <span className="ml-2 text-green-600 text-[10px] font-bold">✓ Paid</span>}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewData && (
        <ReviewModal
          productId={reviewData.productId}
          productName={reviewData.productName}
          orderId={reviewData.orderId}
          onClose={() => setReviewData(null)}
          onSuccess={() => setReviewData(null)}
        />
      )}

      <Footer />
    </div>
  );
}