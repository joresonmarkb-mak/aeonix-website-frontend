import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "./AdminLayout.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import API from "../../services/Api.js";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-700",
  Processing: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

// ── Simple bar chart ───────────────────────────────────────
function BarChart({ data, valueKey, color, label }) {
  const max = Math.max(...data.map(d => d[valueKey]), 1);
  return (
    <div className="flex flex-col gap-1">
      <p className="text-[10px] text-gray-400 uppercase tracking-[1.5px] mb-2">{label}</p>
      <div className="flex items-end gap-1 h-24">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
            <div
              className={`w-full rounded-sm transition-all ${color}`}
              style={{ height: `${Math.max((d[valueKey] / max) * 96, 2)}px` }}
            />
            {/* Tooltip */}
            <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-[#1a1410] text-white text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
              ₱{d[valueKey].toLocaleString()}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-1">
        {data.map((d, i) => (
          <div key={i} className="flex-1 text-center text-[8px] text-gray-400">{d.monthName}</div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, link, sub }) {
  const content = (
    <div className="bg-white/15 p-4 flex items-center gap-3 hover:shadow-md transition-shadow h-full rounded-2xl border-white/20 border-[0.1px]">
      {/* <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${color}`}>
        {icon}
      </div> */}
      <div className="min-w-0">
        <p className="text-[10px] text-white tracking-[1px] uppercase mb-0.5 truncate">{title}</p>
        <p className="text-xl font-bold text-white truncate">{value}</p>
        {sub && <p className="text-[10px] text-white truncate">{sub}</p>}
      </div>
    </div>
  );
  return link ? <Link to={link} className="no-underline">{content}</Link> : <div>{content}</div>;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [invSummary, setInvSummary] = useState({ totalInventoryValue: 0, totalCostValue: 0, totalPotentialProfit: 0 });
  const [chartLoading, setChartLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());

  const headers = { Authorization: `Bearer ${user?.token}` };

  useEffect(() => {
    Promise.all([
      API.get("/products?limit=0", { headers }),
      API.get("/orders", { headers }),
      API.get("/users", { headers }),
      API.get("/analytics/inventory", { headers }),
    ]).then(([products, orders, users, inv]) => {
      setInvSummary({
        totalInventoryValue: inv.data.totalInventoryValue,
        totalCostValue: inv.data.totalCostValue,
        totalPotentialProfit: inv.data.totalPotentialProfit,
      });
      const revenue = orders.data.reduce((s, o) => s + o.totalAmount, 0);
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

  useEffect(() => {
    setChartLoading(true);
    API.get(`/analytics/monthly?year=${year}`, { headers })
      .then(res => {
        setMonthly(res.data.months);
        setCurrentMonth(res.data.currentSummary);
      })
      .catch(console.error)
      .finally(() => setChartLoading(false));
  }, [user, year]);

  return (
    <AdminLayout>
      <div className="flex flex-col gap-4 bg-black ">

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 ">
          <StatCard title="Products" value={loading ? "..." : stats.products} link="/admin/products"
            color="bg-[#C8A03C]/10 text-[#C8A03C]"
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>} />
          <StatCard title="Orders" value={loading ? "..." : stats.orders} link="/admin/orders"
            color="bg-blue-50 text-blue-500"
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>} />
          <StatCard title="Users" value={loading ? "..." : stats.users} link="/admin/users"
            color="bg-purple-50 text-purple-500"
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>} />
          <StatCard title="Total Revenue" value={loading ? "..." : `₱${stats.revenue.toLocaleString()}`} link="/admin/orders"
            color="bg-green-50 text-green-500"
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>} />
          <StatCard title="Inventory Value" value={loading ? "..." : `₱${invSummary.totalInventoryValue.toLocaleString()}`} link="/admin/products"
            color="bg-orange-50 text-orange-500"
            sub="At selling price"
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>} />
          <StatCard title="Potential Profit" value={loading ? "..." : `₱${invSummary.totalPotentialProfit.toLocaleString()}`} link="/admin/products"
            color="bg-teal-50 text-teal-500"
            sub="If all stock sells"
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>} />
        </div>

        {/* Monthly Performance */}
        <div className="bg-white/20 p-4 rounded-2xl border-white/20 border-[0.1px]">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="text-sm font-bold text-white">Monthly Performance</h2>
            <select
              value={year}
              onChange={e => setYear(Number(e.target.value))}
              className="border border-gray-200 px-3 py-1.5 text-xs focus:outline-none bg-white cursor-pointer"
            >
              {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          {/* Current month summary */}
          {currentMonth && (
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-green-50 p-3 rounded">
                <p className="text-[10px] text-gray-400 uppercase tracking-[1px]">This Month Revenue</p>
                <p className="text-base font-bold text-green-700">₱{currentMonth.revenue.toLocaleString()}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded">
                <p className="text-[10px] text-gray-400 uppercase tracking-[1px]">This Month Profit</p>
                <p className="text-base font-bold text-blue-700">₱{currentMonth.profit.toLocaleString()}</p>
              </div>
              <div className="bg-[#C8A03C]/10 p-3 rounded">
                <p className="text-[10px] text-gray-400 uppercase tracking-[1px]">This Month Orders</p>
                <p className="text-base font-bold text-[#C8A03C]">{currentMonth.orders}</p>
              </div>
            </div>
          )}

          {chartLoading ? (
            <div className="h-32 bg-gray-100 animate-pulse rounded" />
          ) : (
            <div className="flex flex-col gap-4">
              <BarChart data={monthly} valueKey="revenue" color="bg-green-400" label="Revenue (₱)" />
              <BarChart data={monthly} valueKey="profit" color="bg-blue-400" label="Profit (₱)" />
              <BarChart data={monthly} valueKey="orders" color="bg-[#C8A03C]" label="Orders" />
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h2 className="text-sm font-bold text-[#1a1410]">Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs text-[#C8A03C] no-underline hover:underline">View all</Link>
          </div>

          {/* Mobile card view */}
          <div className="block lg:hidden">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="px-4 py-3 border-b border-gray-50 animate-pulse">
                  <div className="h-3 bg-gray-100 rounded w-1/2 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                </div>
              ))
            ) : recentOrders.length === 0 ? (
              <p className="px-4 py-8 text-center text-gray-400 text-sm">No orders yet</p>
            ) : (
              recentOrders.map(order => (
                <div key={order._id} className="px-4 py-3 border-b border-gray-50">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-mono text-[#1a1410] font-bold">#{order._id.slice(-8).toUpperCase()}</p>
                    <span className={`text-[10px] font-bold tracking-[1px] uppercase px-2 py-0.5 rounded-full ${statusColors[order.status] || "bg-gray-100 text-gray-600"}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">{order.user?.name || "—"}</p>
                    <p className="text-xs font-bold text-[#1a1410]">₱{order.totalAmount.toLocaleString()}</p>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-PH')}</p>
                </div>
              ))
            )}
          </div>

          {/* Desktop table view */}
          <div className="hidden lg:block overflow-x-auto">
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