import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import API from "../../services/api.js";

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-700",
  Processing: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const statuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(false);

  const headers = { Authorization: `Bearer ${user?.token}` };

  useEffect(() => {
    API.get("/orders", { headers })
      .then(res => setOrders(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (orderId, status) => {
    setUpdating(true);
    try {
      await API.put(`/orders/${orderId}/status`, { status }, { headers });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
      if (selected?._id === orderId) setSelected(prev => ({ ...prev, status }));
    } catch { } finally { setUpdating(false); }
  };

  return (
    <AdminLayout>
      <div className="flex gap-6">

        {/* Orders list */}
        <div className="flex-1 bg-white">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-bold text-[#1a1410]">All Orders ({orders.length})</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-[10px] font-bold tracking-[1.5px] uppercase text-gray-400">Order</th>
                <th className="text-left px-5 py-3 text-[10px] font-bold tracking-[1.5px] uppercase text-gray-400">Customer</th>
                <th className="text-left px-5 py-3 text-[10px] font-bold tracking-[1.5px] uppercase text-gray-400">Total</th>
                <th className="text-left px-5 py-3 text-[10px] font-bold tracking-[1.5px] uppercase text-gray-400">Status</th>
                <th className="text-left px-5 py-3 text-[10px] font-bold tracking-[1.5px] uppercase text-gray-400">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td colSpan={5} className="px-5 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-gray-400 text-sm">No orders yet</td></tr>
              ) : (
                orders.map(order => (
                  <tr key={order._id}
                    onClick={() => setSelected(order)}
                    className={`border-b border-gray-50 cursor-pointer transition-colors ${selected?._id === order._id ? "bg-[#C8A03C]/5" : "hover:bg-gray-50"}`}>
                    <td className="px-5 py-3 text-xs font-mono text-[#1a1410]">#{order._id.slice(-8).toUpperCase()}</td>
                    <td className="px-5 py-3 text-xs text-gray-600">{order.user?.name || "—"}</td>
                    <td className="px-5 py-3 text-xs font-bold">₱{order.totalAmount.toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <span className={`text-[10px] font-bold tracking-[1px] uppercase px-2 py-0.5 rounded-full ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('en-PH')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Order detail panel */}
        {selected && (
          <div className="w-80 flex-shrink-0 bg-white h-fit sticky top-6">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-bold text-[#1a1410]">Order Detail</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 bg-transparent border-none cursor-pointer text-lg">×</button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-[1px] mb-1">Order ID</p>
                <p className="text-xs font-mono">#{selected._id.slice(-8).toUpperCase()}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-[1px] mb-1">Customer</p>
                <p className="text-xs font-semibold">{selected.user?.name}</p>
                <p className="text-xs text-gray-400">{selected.user?.email}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-[1px] mb-2">Items</p>
                {selected.items.map((item, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <img src={item.image?.replace(/"/g, '') || "https://placehold.co/40x40?text=?"} alt="" className="w-10 h-10 object-cover bg-gray-100" />
                    <div>
                      <p className="text-xs font-semibold text-[#1a1410]">{item.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity} · ₱{item.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-[1px] mb-1">Ship to</p>
                <p className="text-xs text-gray-500">
                  {selected.shippingAddress.street}, {selected.shippingAddress.city}, {selected.shippingAddress.province} {selected.shippingAddress.postalCode}
                </p>
              </div>
              <div className="border-t border-gray-100 pt-3 flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Payment</span>
                  <span className="font-semibold text-[#1a1410]">{selected.paymentMethod || (selected.paid ? "Credit/Debit Card" : "Cash on Delivery")}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Paid</span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${selected.paid ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                    {selected.isPaid ? "Yes" : "No"}
                  </span>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-3">
                <p className="text-[10px] text-gray-400 uppercase tracking-[1px] mb-2">Update Status</p>
                <select
                  value={selected.status}
                  onChange={e => handleStatusChange(selected._id, e.target.value)}
                  disabled={updating}
                  className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[#1a1410] bg-white cursor-pointer"
                >
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex justify-between text-sm font-bold border-t border-gray-100 pt-3">
                <span>Total</span>
                <span>₱{selected.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}