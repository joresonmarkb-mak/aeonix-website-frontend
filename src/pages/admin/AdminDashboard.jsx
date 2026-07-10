import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "./AdminLayout.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import API from "../../services/Api.js";

function StatCard({ title, value, icon, color, link }) {
  return (
    <Link to={link} className="no-underline">
      <div className="bg-white p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${color}`}>
          {icon}
        </div>
        <div>
          <p className="text-xs text-gray-400 tracking-[1px] uppercase mb-1">{title}</p>
          <p className="text-2xl font-bold text-[#1a1410]">{value}</p>
        </div>
      </div>
    </Link>
  );
}

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-700",
  Processing: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${user?.token}` };
    Promise.all([
      API.get("/products?limit=0", { headers }),
      API.get("/orders", { headers }),
      API.get("/users", { headers }),
    ]).then(([products, orders, users]) => {
      const revenue = orders.data.reduce((sum, o) => sum + o.totalAmount, 0);
      setStats({
        products: products.data.total,
        orders: orders.data.length,
        users: users.data.length,
        revenue,
      });
      setRecentOrders(orders.data.slice(0, 5));
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            title="Total Products"
            value={loading ? "..." : stats.products}
            link="/admin/products"
            color="bg-[#C8A03C]/10 text-[#C8A03C]"
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>}
          />
          <StatCard
            title="Total Orders"
            value={loading ? "..." : stats.orders}
            link="/admin/orders"
            color="bg-blue-50 text-blue-500"
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
          />
          <StatCard
            title="Total Users"
            value={loading ? "..." : stats.users}
            link="/admin/users"
            color="bg-purple-50 text-purple-500"
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>}
          />
          <StatCard
            title="Total Revenue"
            value={loading ? "..." : `₱${stats.revenue.toLocaleString()}`}
            link="/admin/orders"
            color="bg-green-50 text-green-500"
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>}
          />
        </div>

        {/* Recent Orders */}
        <div className="bg-white">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-bold text-[#1a1410] tracking-wide">Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs text-[#C8A03C] no-underline hover:underline">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-[10px] font-bold tracking-[1.5px] uppercase text-gray-400">Order ID</th>
                  <th className="text-left px-5 py-3 text-[10px] font-bold tracking-[1.5px] uppercase text-gray-400">Customer</th>
                  <th className="text-left px-5 py-3 text-[10px] font-bold tracking-[1.5px] uppercase text-gray-400">Amount</th>
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
                ) : recentOrders.length === 0 ? (
                  <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-400 text-sm">No orders yet</td></tr>
                ) : (
                  recentOrders.map(order => (
                    <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 text-xs font-mono text-[#1a1410]">#{order._id.slice(-8).toUpperCase()}</td>
                      <td className="px-5 py-3 text-xs text-gray-600">{order.user?.name || "—"}</td>
                      <td className="px-5 py-3 text-xs font-bold text-[#1a1410]">₱{order.totalAmount.toLocaleString()}</td>
                      <td className="px-5 py-3">
                        <span className={`text-[10px] font-bold tracking-[1px] uppercase px-2.5 py-1 rounded-full ${statusColors[order.status] || "bg-gray-100 text-gray-600"}`}>
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
        </div>
      </div>
    </AdminLayout>
  );
}