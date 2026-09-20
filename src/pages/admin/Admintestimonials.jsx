import { useState, useEffect, useRef } from "react";
import AdminLayout from "./AdminLayout.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import API from "../../services/Api.js";

const SOLD_VIA = ['Meetup', 'COD', 'Facebook', 'Ship via J&T', 'Ship via LBC', 'Website', 'Carousell', 'Other'];

const emptyForm = { clientName: "", feedback: "", rating: 5, soldVia: "Facebook" };

function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(s => (
        <button key={s} type="button"
          onClick={() => onChange(s)}
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          className="bg-transparent border-none cursor-pointer text-2xl p-0">
          <span className={`${(hover || value) >= s ? "text-[#C8A03C]" : "text-gray-300"}`}>★</span>
        </button>
      ))}
    </div>
  );
}

export default function AdminTestimonials() {
  const { user } = useAuth();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef();

  const headers = { Authorization: `Bearer ${user?.token}` };

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await API.get("/testimonials/all", { headers });
      setTestimonials(res.data);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchTestimonials(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFile(null);
    setPreview(null);
    setError("");
    setShowModal(true);
  };

  const openEdit = (t) => {
    setEditing(t);
    setForm({ clientName: t.clientName, feedback: t.feedback, rating: t.rating, soldVia: t.soldVia });
    setPreview(t.image || null);
    setFile(null);
    setError("");
    setShowModal(true);
  };

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSave = async () => {
    if (!form.clientName || !form.feedback) return setError("Name and feedback are required.");
    setSaving(true); setError("");
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (file) data.append("image", file);

      if (editing) {
        await API.put(`/testimonials/${editing._id}`, data, { headers });
      } else {
        await API.post("/testimonials", data, { headers });
      }
      setShowModal(false);
      fetchTestimonials();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save.");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this testimonial?")) return;
    try {
      await API.delete(`/testimonials/${id}`, { headers });
      fetchTestimonials();
    } catch { }
  };

  const toggleActive = async (t) => {
    try {
      await API.put(`/testimonials/${t._id}`, { ...t, isActive: !t.isActive }, { headers });
      fetchTestimonials();
    } catch { }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-4">

        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">{testimonials.length} testimonials</p>
          <button onClick={openCreate}
            className="px-4 py-2 bg-[#1a1410] text-[#C8A03C] text-xs font-bold tracking-[1.5px] uppercase hover:bg-[#2a2018] transition-colors border-none cursor-pointer">
            + Add Testimonial
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-white animate-pulse">
                <div className="h-40 bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                </div>
              </div>
            ))
          ) : testimonials.length === 0 ? (
            <p className="col-span-3 text-center text-gray-400 text-sm py-10">No testimonials yet</p>
          ) : (
            testimonials.map(t => (
              <div key={t._id} className={`bg-white rounded-lg overflow-hidden ${!t.isActive ? "opacity-50" : ""}`}>
                {t.image ? (
                  <div className="h-40 overflow-hidden">
                    <img src={t.image} alt={t.clientName} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="h-40 bg-gray-100 flex items-center justify-center text-gray-300 text-4xl">🕰️</div>
                )}
                <div className="p-4">
                  <div className="flex gap-0.5 mb-2">
                    {[1,2,3,4,5].map(s => (
                      <span key={s} className={`text-sm ${s <= t.rating ? "text-[#C8A03C]" : "text-gray-300"}`}>★</span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 italic mb-2 line-clamp-2">"{t.feedback}"</p>
                  <p className="text-xs font-bold text-[#1a1410]">{t.clientName}</p>
                  <p className="text-[10px] text-gray-400">Sold via {t.soldVia}</p>
                  <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                    <button onClick={() => openEdit(t)} className="text-xs text-blue-500 hover:underline bg-transparent border-none cursor-pointer">Edit</button>
                    <button onClick={() => toggleActive(t)} className={`text-xs hover:underline bg-transparent border-none cursor-pointer ${t.isActive ? "text-orange-400" : "text-green-500"}`}>
                      {t.isActive ? "Hide" : "Show"}
                    </button>
                    <button onClick={() => handleDelete(t._id)} className="text-xs text-red-400 hover:underline bg-transparent border-none cursor-pointer">Delete</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 ">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          <div className="relative bg-white w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl rounded-lg">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white z-10 ">
              <h2 className="font-bold text-[#1a1410] text-sm">{editing ? "Edit Testimonial" : "Add Testimonial"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 text-xl bg-transparent border-none cursor-pointer">×</button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              {error && <p className="text-red-500 text-xs">{error}</p>}

              {/* Image upload */}
              <div>
                <label className="text-[10px] tracking-[1.5px] uppercase text-gray-500 block mb-2">Client Photo</label>
                <div
                  onClick={() => fileRef.current.click()}
                  className="border-2 border-dashed border-gray-200 h-36 flex items-center justify-center cursor-pointer hover:border-[#C8A03C] transition-colors overflow-hidden"
                >
                  {preview ? (
                    <img src={preview} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <p className="text-gray-400 text-xs">Click to upload photo</p>
                      <p className="text-gray-300 text-[10px] mt-1">JPG, PNG, WEBP</p>
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] tracking-[1.5px] uppercase text-gray-500">Client Name</label>
                <input value={form.clientName} onChange={e => setForm(f => ({ ...f, clientName: e.target.value }))}
                  placeholder="James Von"
                  className="border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a1410]" />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] tracking-[1.5px] uppercase text-gray-500">Feedback</label>
                <textarea value={form.feedback} onChange={e => setForm(f => ({ ...f, feedback: e.target.value }))}
                  placeholder="The watch is looks like brand new even its pre owned"
                  rows={3}
                  className="border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a1410] resize-none" />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] tracking-[1.5px] uppercase text-gray-500">Rating</label>
                <StarPicker value={form.rating} onChange={v => setForm(f => ({ ...f, rating: v }))} />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] tracking-[1.5px] uppercase text-gray-500">Sold Via</label>
                <select value={form.soldVia} onChange={e => setForm(f => ({ ...f, soldVia: e.target.value }))}
                  className="border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a1410] bg-white">
                  {SOLD_VIA.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>

              <button onClick={handleSave} disabled={saving}
                className="w-full py-3 bg-[#1a1410] text-[#C8A03C] text-xs font-bold tracking-[2px] uppercase hover:bg-[#2a2018] transition-colors border-none cursor-pointer disabled:opacity-50">
                {saving ? "Saving..." : editing ? "Update" : "Add Testimonial"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}