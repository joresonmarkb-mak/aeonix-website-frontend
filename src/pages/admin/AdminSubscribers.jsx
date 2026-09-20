import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import API from "../../services/Api.js";

export default function AdminSubscribers() {
  const { user } = useAuth();
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showNotify, setShowNotify] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [notifyForm, setNotifyForm] = useState({ subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState("");

  const headers = { Authorization: `Bearer ${user?.token}` };

  useEffect(() => {
    Promise.all([
      API.get("/subscribers", { headers }),
      API.get("/products?limit=0", { headers }),
    ]).then(([subs, prods]) => {
      setSubscribers(subs.data);
      setProducts(prods.data.products || []);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const handleDelete = async (id) => {
    if (!confirm("Remove this subscriber?")) return;
    try {
      await API.delete(`/subscribers/${id}`, { headers });
      setSubscribers(prev => prev.filter(s => s._id !== id));
    } catch { }
  };

  const handleNotify = async () => {
    setSending(true); setSendResult("");
    try {
      const watches = selectedProducts.map(id => {
        const p = products.find(p => p._id === id);
        return { name: p.name, brand: p.brand, price: p.price, image: p.images?.[0]?.replace(/"/g, '') || '' };
      });
      const res = await API.post("/subscribers/notify", {
        subject: notifyForm.subject,
        message: notifyForm.message,
        watches,
      }, { headers });
      setSendResult(res.data.message);
      setShowNotify(false);
      setSelectedProducts([]);
      setNotifyForm({ subject: "", message: "" });
    } catch (err) {
      setSendResult(err.response?.data?.message || "Failed to send.");
    } finally { setSending(false); }
  };

  const toggleProduct = (id) => {
    setSelectedProducts(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const filtered = subscribers.filter(s =>
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = subscribers.filter(s => s.isActive).length;

  return (
    <AdminLayout>
      <div className="flex flex-col gap-4">

        {/* Header stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-[10px] text-white uppercase tracking-[1px] mb-1">Total Subscribers</p>
            <p className="text-2xl font-bold text-white">{subscribers.length}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-[10px] text-gray-400 uppercase tracking-[1px] mb-1">Active</p>
            <p className="text-2xl font-bold text-green-600">{activeCount}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 col-span-2 sm:col-span-1">
            <p className="text-[10px] text-gray-400 uppercase tracking-[1px] mb-1">Unsubscribed</p>
            <p className="text-2xl font-bold text-gray-400">{subscribers.length - activeCount}</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search emails..."
              className="pl-8 pr-4 py-2 border rounded-sm border-gray-500 text-white text-sm focus:outline-none focus:border-[#1a1410] w-full" />
          </div>
          <button
            onClick={() => setShowNotify(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#1a1410] text-[#C8A03C] text-xs font-bold tracking-[1.5px] uppercase hover:bg-[#2a2018] transition-colors border-none cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            Email All Subscribers
          </button>
        </div>

        {sendResult && (
          <p className="text-xs text-green-600 bg-green-50 px-3 py-2">{sendResult}</p>
        )}

        {/* Subscribers table */}
        <div className="bg-white/5 rounded-lg">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-[10px] font-bold tracking-[1.5px] uppercase text-gray-400">Email</th>
                <th className="text-left px-5 py-3 text-[10px] font-bold tracking-[1.5px] uppercase text-gray-400">Status</th>
                <th className="text-left px-5 py-3 text-[10px] font-bold tracking-[1.5px] uppercase text-gray-400">Date</th>
                <th className="text-left px-5 py-3 text-[10px] font-bold tracking-[1.5px] uppercase text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td colSpan={4} className="px-5 py-3"><div className="h-3 bg-gray-100 rounded animate-pulse" /></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={4} className="px-5 py-10 text-center text-white text-sm">No subscribers yet</td></tr>
              ) : (
                filtered.map(s => (
                  <tr key={s._id} className="  hover:bg-black transition-colors">
                    <td className="px-5 py-3 text-xs text-white">{s.email}</td>
                    <td className="px-5 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 ${s.isActive ? "bg-green-100 text-green-700 rounded-sm" : "bg-gray-100 text-gray-500 rounded-sm"}`}>
                        {s.isActive ? "Active" : "Unsubscribed"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-400">
                      {new Date(s.createdAt).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-5 py-3">
                      <button onClick={() => handleDelete(s._id)} className="text-xs text-red-400 hover:underline bg-transparent border-none cursor-pointer">
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notify Modal */}
      {showNotify && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowNotify(false)} />
          <div className="relative bg-white w-full max-w-lg max-h-[90vh] rounded-lg overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="font-bold text-[#1a1410] text-sm">Email All Subscribers</h2>
              <button onClick={() => setShowNotify(false)} className="text-gray-400 text-xl bg-transparent border-none cursor-pointer">×</button>
            </div>
 
            <div className="p-5 flex flex-col gap-4">
              <div className="bg-blue-50 px-3 py-2 text-xs text-green-600">
                This will send to <strong>{activeCount} active subscribers</strong>
              </div>
 
              <div className="flex flex-col gap-1">
                <label className="text-[10px] tracking-[1.5px] uppercase text-gray-500">Subject</label>
                <input
                  value={notifyForm.subject}
                  onChange={e => setNotifyForm(f => ({ ...f, subject: e.target.value }))}
                  placeholder="New Watches Just Arrived at Aeonix!"
                  className="border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a1410]"
                />
              </div>
 
              <div className="flex flex-col gap-1">
                <label className="text-[10px] tracking-[1.5px] uppercase text-gray-500">Message</label>
                <textarea
                  value={notifyForm.message}
                  onChange={e => setNotifyForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="We have exciting new timepieces in stock..."
                  rows={3}
                  className="border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a1410] resize-none"
                />
              </div>
 
              {/* Select watches to feature */}
              <div>
                <label className="text-[10px] tracking-[1.5px] uppercase text-gray-500 block mb-2">
                  Feature Watches (optional — select to show in email)
                </label>
                <div className="flex flex-col gap-2 max-h-48 overflow-y-auto border border-gray-100 p-2">
                  {products.filter(p => p.status === 'In Stock').map(p => (
                    <label key={p._id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(p._id)}
                        onChange={() => toggleProduct(p._id)}
                        className="accent-[#1a1410]"
                      />
                      <img src={p.images?.[0]?.replace(/"/g, '') || "https://placehold.co/32x32?text=?"} alt={p.name} className="w-8 h-8 object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#1a1410] truncate">{p.name}</p>
                        <p className="text-[10px] text-[#C8A03C]">₱{p.price.toLocaleString()}</p>
                      </div>
                    </label>
                  ))}
                </div>
                {selectedProducts.length > 0 && (
                  <p className="text-[10px] text-gray-400 mt-1">{selectedProducts.length} watch(es) selected</p>
                )}
              </div>
 
              <button
                onClick={handleNotify}
                disabled={sending}
                className="w-full py-3 bg-[#1a1410] text-[#C8A03C] text-xs font-bold tracking-[2px] uppercase hover:bg-[#2a2018] rounded-sm transition-colors border-none cursor-pointer disabled:opacity-50"
              >
                {sending ? "Sending..." : `Send to ${activeCount} Subscribers`}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
