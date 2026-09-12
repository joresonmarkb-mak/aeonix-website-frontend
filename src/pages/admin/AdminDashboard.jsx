import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "./AdminLayout.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import API from "../../services/Api.js";

const statusColors = {
  Pending: "bg-blue-500",
  Processing: "bg-teal-500",
  Shipped: "bg-purple-500",
  Delivered: "bg-green-500",
  Cancelled: "bg-red-500",
};

const statusText = {
  Pending: "text-blue-400",
  Processing: "text-teal-400",
  Shipped: "text-purple-400",
  Delivered: "text-green-400",
  Cancelled: "text-red-400",
};

// ── Bar Chart ─────────────────────────────────────────────
function BarChart({ data }) {
  const max = Math.max(...data.map(d => d.revenue), 1);
  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="flex items-end gap-1 flex-1 min-h-0">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
            <div
              className="w-full bg-gray-600 hover:bg-[#C8A03C] rounded-sm transition-colors cursor-pointer"
              style={{ height: `${Math.max((d.revenue / max) * 100, 2)}%` }}
            />
            <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-white text-black text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
              ₱{d.revenue.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-1">
        {data.filter((_, i) => i % 2 === 0).map((d, i) => (
          <div key={i} className="flex-1 text-center" style={{ flex: 2 }}>
            <span className="text-[9px] text-gray-500">{d.monthName}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, revenue: 0 });
  const [invSummary, setInvSummary] = useState({ totalInventoryValue: 0, totalCostValue: 0, totalPotentialProfit: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(null);
  const [orderStats, setOrderStats] = useState({ pending: 0, processing: 0, delivered: 0, cancelled: 0 });
  const [loading, setLoading] = useState(true);
  const [bestByCategory, setBestByCategory] = useState([]);
  const [channels, setChannels] = useState([]);
  const [year] = useState(new Date().getFullYear());
  const [orderFilter, setOrderFilter] = useState("");

  const headers = { Authorization: `Bearer ${user?.token}` };

  useEffect(() => {
    Promise.all([
      API.get("/products?limit=0", { headers }),
      API.get("/orders", { headers }),
      API.get("/users", { headers }),
      API.get("/analytics/inventory", { headers }),
      API.get(`/analytics/monthly?year=${year}`, { headers }),
      API.get('/analytics/best-by-category', { headers }),
      API.get('/analytics/channels', { headers }),
    ]).then(([products, orders, users, inv, monthly, bestCat, chan]) => {
      setBestByCategory(bestCat.data);
      setChannels(chan.data.channels || []);
      const revenue = orders.data.reduce((s, o) => s + o.totalAmount, 0);
      setStats({
        products: products.data.total,
        orders: orders.data.length,
        users: users.data.length,
        revenue,
      });
      setInvSummary({
        totalInventoryValue: inv.data.totalInventoryValue,
        totalCostValue: inv.data.totalCostValue,
        totalPotentialProfit: inv.data.totalPotentialProfit,
      });
      setRecentOrders(orders.data.slice(0, 10));
      setMonthly(monthly.data.months);
      setCurrentMonth(monthly.data.currentSummary);

      // Order status breakdown
      const os = { pending: 0, processing: 0, delivered: 0, cancelled: 0 };
      orders.data.forEach(o => {
        if (o.status === 'Pending') os.pending++;
        else if (o.status === 'Processing' || o.status === 'Shipped') os.processing++;
        else if (o.status === 'Delivered') os.delivered++;
        else if (o.status === 'Cancelled') os.cancelled++;
      });
      setOrderStats(os);

      // Top selling products by order count
      const productMap = {};
      orders.data.forEach(o => {
        o.items?.forEach(item => {
          const id = item.product?._id || item.product;
          if (!productMap[id]) productMap[id] = { name: item.name, image: item.image, count: 0 };
          productMap[id].count += item.quantity;
        });
      });
      const sorted = Object.values(productMap).sort((a, b) => b.count - a.count).slice(0, 4);
      setTopProducts(sorted);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const filteredOrders = recentOrders.filter(o =>
    o._id.slice(-8).toLowerCase().includes(orderFilter.toLowerCase()) ||
    o.user?.name?.toLowerCase().includes(orderFilter.toLowerCase())
  );

  const now = new Date();
  const dateRange = `${now.toLocaleDateString('en-PH', { day: '2-digit', month: 'short', year: 'numeric' })}`;

function BarChart({ data }) {
  const max = Math.max(...data.map(d => d.revenue), 1);
  return (
    <div className="flex flex-col h-full">
      {/* Bars */}
      <div className="flex items-end gap-1 flex-1" style={{ minHeight: 0 }}>
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col justify-end group relative h-full">
            <div
              className="w-full bg-gray-600 hover:bg-[#C8A03C] rounded-sm transition-colors cursor-pointer"
              style={{ height: `${Math.max((d.revenue / max) * 100, d.revenue > 0 ? 4 : 0)}%` }}
            />
            {d.revenue > 0 && (
              <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-white text-black text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                ₱{d.revenue.toLocaleString()}
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Month labels */}
      <div className="flex gap-1 mt-1 flex-shrink-0">
        {data.map((d, i) => (
          i % 2 === 0 && (
            <div key={i} className="text-center" style={{ flex: 2 }}>
              <span className="text-[9px] text-gray-500">{d.monthName}</span>
            </div>
          )
        ))}
      </div>
    </div>
  );
}

  return (
    <AdminLayout>
      <div className="flex flex-col gap-4 bg-[#0f0f0f] min-h-full -m-4 lg:-m-6 p-4 lg:p-6  ">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3 ">
          <h1 className="text-xl font-bold text-white">Sales Dashboard</h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#1a1a1a] border border-gray-700 px-3 py-2 text-xs text-gray-300">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              {dateRange}
            </div>
          </div>
        </div>

        {/* Top row — chart + stat cards */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 ">

          {/* Revenue chart */}
          <div className="bg-[#1a1a1a] border border-gray-800 p-5 rounded-2xl ">
            <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
              <div>
                <p className="text-sm font-bold text-white">Revenue Chart</p>
                <p className="text-xs text-gray-500">Monthly {year}</p>
              </div>
              <div className="flex gap-4">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-[1px]">This Month</p>
                  <p className="text-lg font-bold text-white">₱{currentMonth?.revenue?.toLocaleString() || 0}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-[1px]">Profit</p>
                  <p className="text-lg font-bold text-[#C8A03C]">₱{currentMonth?.profit?.toLocaleString() || 0}</p>
                </div>
              </div>
            </div>
            <div className="h-40">
              {loading ? (
                <div className="h-full bg-gray-800 animate-pulse rounded" />
              ) : (
                <BarChart data={monthly} />
              )}
            </div>
          </div>

          {/* Stat cards 2x2 */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Total Revenue", value: `₱${stats.revenue.toLocaleString()}`, sub: `${stats.orders} orders`, color: "text-green-400", icon: "↑" },
              { label: "Total Income", value: `₱${invSummary.totalPotentialProfit.toLocaleString()}`, sub: "Potential profit", color: "text-green-400", icon: "↑" },
              { label: "Total Expense", value: `₱${invSummary.totalCostValue.toLocaleString()}`, sub: "Cost of inventory", color: "text-red-400", icon: "↓" },
              { label: "Inventory Value", value: `₱${invSummary.totalInventoryValue.toLocaleString()}`, sub: "At selling price", color: "text-green-400", icon: "↑" },
            ].map((card, i) => (
              <div key={i} className="bg-[#1a1a1a] border border-white/5 pt-4 rounded-2xl  ">
                <p className=" text-1xl font-bold  text-white  tracking-[1px] pl-4 mb-2">{card.label}</p>
                 <div key={i} className="bg-[#1a1a1a] border border-white/5  p-4 rounded-2xl ">           
                <p className="text-2xl font-bold text-white mb-1">{loading ? "..." : card.value}</p>
                <p className={`text-sm ${card.color}`}>{card.icon} {card.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom row — best selling + order tracking */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">

          {/* Best selling by category + channel analytics */}
          <div className="flex flex-col gap-4">

            {/* Best by category */}
            <div className="bg-[#1a1a1a] border border-gray-800 p-5 rounded-2xl">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-bold text-white">Best by Category</p>
                <Link to="/admin/products" className="w-7 h-7 bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white no-underline">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                </Link>
              </div>
              <p className="text-[10px] text-gray-500 mb-4">Top sellers per category</p>
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="h-3 bg-gray-800 rounded animate-pulse mb-2" />
                ))
              ) : bestByCategory.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-4">No sales yet</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {bestByCategory.map((cat, i) => (
                    <div key={i} className="border border-white/5 p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] font-bold text-[#C8A03C] uppercase tracking-[1.5px]">{cat.category}</p>
                        <p className="text-[10px] text-gray-500">{cat.totalSold} sold</p>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {cat.topProducts.map((p, j) => (
                          <div key={j} className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-gray-800 overflow-hidden flex-shrink-0">
                              <img src={p.image || "https://placehold.co/28x28?text=?"} alt={p.name} className="w-full h-full object-cover" />
                            </div>
                            <p className="text-[11px] text-gray-300 flex-1 truncate">{p.name}</p>
                            <p className="text-[11px] text-green-400 font-bold">{p.count}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sales by channel */}
            <div className="bg-[#1a1a1a] border border-gray-800 p-5 rounded-2xl">
              <p className="text-sm font-bold text-white mb-1">Sales by Channel</p>
              <p className="text-[10px] text-gray-500 mb-4">Where you sell the most</p>
              {loading ? (
                <div className="h-20 bg-gray-800 rounded animate-pulse" />
              ) : channels.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-4">No sales data yet</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {channels.map((c, i) => {
                    const colors = ["bg-blue-500","bg-green-500","bg-[#C8A03C]","bg-purple-500","bg-teal-500","bg-orange-500","bg-red-500"];
                    return (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-[11px] text-gray-300">{c.channel}</p>
                          <div className="flex items-center gap-2">
                            <p className="text-[11px] text-gray-400">{c.count} orders</p>
                            <p className="text-[11px] font-bold text-white">{c.percentage}%</p>
                          </div>
                        </div>
                        <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                          <div className={`h-full ${colors[i % colors.length]} rounded-full transition-all`} style={{ width: `${c.percentage}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Order tracking */}
          <div className="bg-[#1a1a1a] border border-gray-800 p-5 rounded-2xl">
            <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
              <div>
                <p className="text-sm font-bold text-white">Track Order Status</p>
                <p className="text-[10px] text-gray-500">Analyze growth and changes in order patterns</p>
              </div>
              <button className="flex items-center gap-1.5 text-xs text-gray-300 border border-gray-700 px-3 py-1.5 bg-transparent cursor-pointer hover:border-gray-500 transition-colors">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Export
              </button>
            </div>

            {/* Status counters */}
            <div className="grid grid-cols-4 gap-3 mb-5">
              {[
                { label: "New Order", value: orderStats.pending, color: "bg-blue-500", pct: "0.5%", up: true },
                { label: "On Progress", value: orderStats.processing, color: "bg-teal-500", pct: "0.3%", up: false },
                { label: "Completed", value: orderStats.delivered, color: "bg-green-500", pct: "0.5%", up: true },
                { label: "Cancelled", value: orderStats.cancelled, color: "bg-orange-500", pct: "0.5%", up: false },
              ].map((s, i) => (
                <div key={i}>
                  <p className="text-2xl font-bold text-white">{loading ? "..." : s.value}</p>
                  <p className="text-[10px] text-gray-400 mb-1.5">{s.label} <span className={s.up ? "text-green-400" : "text-red-400"}>• {s.pct}</span></p>
                  <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full ${s.color} rounded-full`} style={{ width: `${Math.max((s.value / (stats.orders || 1)) * 100, 4)}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Orders table */}
            <div className="flex items-center gap-3 mb-3">
              <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input
                  value={orderFilter}
                  onChange={e => setOrderFilter(e.target.value)}
                  placeholder="Filter orders..."
                  className="w-full bg-[#0f0f0f] border border-gray-700 pl-8 pr-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-gray-500 placeholder-gray-600"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-2 text-[10px] font-bold text-gray-500 uppercase tracking-[1px]">ID</th>
                    <th className="text-left py-2 text-[10px] font-bold text-gray-500 uppercase tracking-[1px]">Customer</th>
                    <th className="text-left py-2 text-[10px] font-bold text-gray-500 uppercase tracking-[1px] hidden sm:table-cell">Qty</th>
                    <th className="text-left py-2 text-[10px] font-bold text-gray-500 uppercase tracking-[1px]">Amount</th>
                    <th className="text-left py-2 text-[10px] font-bold text-gray-500 uppercase tracking-[1px] hidden md:table-cell">Payment</th>
                    <th className="text-left py-2 text-[10px] font-bold text-gray-500 uppercase tracking-[1px]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    [...Array(4)].map((_, i) => (
                      <tr key={i} className="border-b border-gray-800/50">
                        <td colSpan={6} className="py-2"><div className="h-3 bg-gray-800 rounded animate-pulse" /></td>
                      </tr>
                    ))
                  ) : filteredOrders.length === 0 ? (
                    <tr><td colSpan={6} className="py-6 text-center text-gray-500 text-xs">No orders found</td></tr>
                  ) : (
                    filteredOrders.map(order => (
                      <tr key={order._id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                        <td className="py-2.5 text-[10px] font-mono text-gray-400">#{order._id.slice(-6).toUpperCase()}</td>
                        <td className="py-2.5 text-xs text-gray-300">{order.user?.name || "—"}</td>
                        <td className="py-2.5 text-xs text-gray-400 hidden sm:table-cell">{order.items?.reduce((s, i) => s + i.quantity, 0) || 0}</td>
                        <td className="py-2.5 text-xs font-bold text-white">₱{order.totalAmount?.toLocaleString()}</td>
                        <td className="py-2.5 text-[10px] text-gray-400 hidden md:table-cell">{order.paymentMethod || "COD"}</td>
                        <td className="py-2.5">
                          <div className="flex items-center gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${statusColors[order.status] || "bg-gray-500"}`} />
                            <span className={`text-[10px] font-semibold ${statusText[order.status] || "text-gray-400"}`}>{order.status}</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}