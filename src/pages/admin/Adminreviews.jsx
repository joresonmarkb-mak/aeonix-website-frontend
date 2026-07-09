import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import API from "../../services/Api.js";

function Stars({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} className={`text-sm ${s <= rating ? "text-[#C8A03C]" : "text-gray-200"}`}>★</span>
      ))}
    </div>
  );
}

export default function AdminReviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    API.get("/reviews/all", {
      headers: { Authorization: `Bearer ${user?.token}` },
    })
      .then(res => setReviews(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this review?")) return;
    try {
      await API.delete(`/reviews/${id}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setReviews(prev => prev.filter(r => r._id !== id));
      if (selected?._id === id) setSelected(null);
    } catch { }
  };

  const filtered = reviews.filter(r =>
    r.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.product?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex gap-6">

        {/* Reviews list */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search reviews..."
                className="pl-8 pr-4 py-2 border border-gray-200 text-sm focus:outline-none focus:border-[#1a1410] w-64" />
            </div>
            <p className="text-xs text-gray-400">{reviews.length} total reviews</p>
          </div>

          <div className="bg-white">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-[10px] font-bold tracking-[1.5px] uppercase text-gray-400">Customer</th>
                  <th className="text-left px-5 py-3 text-[10px] font-bold tracking-[1.5px] uppercase text-gray-400">Product</th>
                  <th className="text-left px-5 py-3 text-[10px] font-bold tracking-[1.5px] uppercase text-gray-400">Rating</th>
                  <th className="text-left px-5 py-3 text-[10px] font-bold tracking-[1.5px] uppercase text-gray-400">Date</th>
                  <th className="text-left px-5 py-3 text-[10px] font-bold tracking-[1.5px] uppercase text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(4)].map((_, i) => (
                    <tr key={i} className="border-b border-gray-50">
                      <td colSpan={5} className="px-5 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={5} className="px-5 py-10 text-center text-gray-400 text-sm">No reviews yet</td></tr>
                ) : (
                  filtered.map(review => (
                    <tr key={review._id}
                      onClick={() => setSelected(review)}
                      className={`border-b border-gray-50 cursor-pointer transition-colors ${selected?._id === review._id ? "bg-[#C8A03C]/5" : "hover:bg-gray-50"}`}>
                      <td className="px-5 py-3 text-xs font-semibold text-[#1a1410]">{review.user?.name || "—"}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          {review.product?.image?.[0] && (
                            <img src={review.product.image[0].replace(/"/g, '')} alt="" className="w-8 h-8 object-cover bg-gray-100" />
                          )}
                          <p className="text-xs text-gray-600">{review.product?.name || "—"}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3"><Stars rating={review.rating} /></td>
                      <td className="px-5 py-3 text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString('en-PH')}</td>
                      <td className="px-5 py-3">
                        <button onClick={e => { e.stopPropagation(); handleDelete(review._id); }}
                          className="text-xs text-red-400 hover:underline bg-transparent border-none cursor-pointer">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="w-80 flex-shrink-0 bg-white h-fit sticky top-6">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-bold text-[#1a1410]">Review Detail</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 bg-transparent border-none cursor-pointer text-lg">×</button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#C8A03C]/10 flex items-center justify-center text-[#C8A03C] text-xs font-bold">
                  {selected.user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1a1410]">{selected.user?.name}</p>
                  <Stars rating={selected.rating} />
                </div>
              </div>

              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-[1px] mb-1">Product</p>
                <p className="text-xs font-semibold text-[#1a1410]">{selected.product?.name}</p>
              </div>

              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-[1px] mb-1">Feedback</p>
                <p className="text-xs text-gray-600 leading-relaxed">{selected.feedback}</p>
              </div>

              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-[1px] mb-1">Time Received</p>
                <p className="text-xs text-gray-600">
                  {new Date(selected.timeReceived).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              {selected.images?.length > 0 && (
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-[1px] mb-2">Photos</p>
                  <div className="flex gap-2 flex-wrap">
                    {selected.images.map((img, i) => (
                      <img key={i} src={img} alt="" className="w-20 h-20 object-cover border border-gray-200" />
                    ))}
                  </div>
                </div>
              )}

              <button onClick={() => handleDelete(selected._id)}
                className="w-full py-2 text-xs text-red-400 border border-red-200 hover:bg-red-50 transition-colors bg-transparent cursor-pointer">
                Delete Review
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}