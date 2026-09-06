import { useState, useEffect,useRef } from "react";
import AdminLayout from "./AdminLayout.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import API from "../../services/Api.js";

const marginColor = (margin) => {
  if (margin >= 30) return "text-green-600";
  if (margin >= 15) return "text-[#C8A03C]";
  return "text-red-500";
};

const marginBg = (margin) => {
  if (margin >= 30) return "bg-green-100 text-green-700";
  if (margin >= 15) return "bg-[#C8A03C]/10 text-[#C8A03C]";
  return "bg-red-100 text-red-600";
};

const emptyForm = {
  name: "", referenceNumber: "", brand: "", description: "", price: "",
  category: "", stock: "", condition: "", movement: "",
  caseDiameter: "", caseThickness: "", material: "", waterResistance: "", crystal: "",
  isFeatured: false, isNewArrival: false, discount: "", costPrice: "",
};
const F = ({ label, name, form, setForm, type = "text", options }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] tracking-[1.5px] uppercase text-gray-500">{label}</label>
    {options ? (
      <select value={form[name]} onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
        className="border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[#1a1410] bg-white">
        <option value="">Select...</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    ) : type === "checkbox" ? (
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={form[name]} onChange={e => setForm(f => ({ ...f, [name]: e.target.checked }))} className="accent-[#1a1410]" />
        <span className="text-sm text-gray-600">{label}</span>
      </label>
    ) : (
      <input type={type} value={form[name]} onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
        className="border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[#1a1410]" />
    )}
  </div>
);

// ── Tile Card ─────────────────────────────────────────────
function TileCard({ p }) {
  return (
    <div className="bg-white overflow-hidden">
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={p.image || "https://placehold.co/200x200?text=?"}
          alt={p.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3">
        <p className="text-[10px] text-gray-400 uppercase tracking-[1.5px] truncate">{p.brand}</p>
        <p className="text-xs font-bold text-[#1a1410] truncate mb-2">{p.name}</p>

        <div className="flex items-center justify-between mb-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 ${p.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
            {p.stock > 0 ? `${p.stock} pcs` : "Out"}
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${marginBg(p.margin)}`}>
            {p.margin}% margin
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1 text-center">
          <div className="bg-gray-50 p-1.5 rounded">
            <p className="text-[9px] text-gray-400">Cost</p>
            <p className="text-[11px] font-bold text-[#1a1410]">₱{p.costPrice.toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 p-1.5 rounded">
            <p className="text-[9px] text-gray-400">Price</p>
            <p className="text-[11px] font-bold text-[#1a1410]">₱{p.sellingPrice.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
          <p className="text-[9px] text-gray-400">Profit/unit</p>
          <p className="text-xs font-bold text-green-600">+₱{p.profit.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

// ── List Row ──────────────────────────────────────────────
function ListRow({ p }) {
  return (
    <div className="bg-white p-3 flex gap-3 items-center border-b border-gray-100">
      <div className="w-12 h-12 flex-shrink-0 bg-gray-100 overflow-hidden">
        <img src={p.image || "https://placehold.co/48x48?text=?"} alt={p.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-[#1a1410] truncate">{p.name}</p>
        <p className="text-[10px] text-gray-400">{p.brand} · {p.condition}</p>
        <div className="flex gap-2 mt-1 flex-wrap">
          <span className="text-[9px] text-gray-500">Cost: <b>₱{p.costPrice.toLocaleString()}</b></span>
          <span className="text-[9px] text-gray-500">Price: <b>₱{p.sellingPrice.toLocaleString()}</b></span>
          <span className="text-[9px] text-gray-500">Profit: <b className="text-green-600">₱{p.profit.toLocaleString()}</b></span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${marginBg(p.margin)}`}>{p.margin}%</span>
        <span className={`text-[10px] font-bold px-2 py-0.5 ${p.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
          {p.stock > 0 ? `${p.stock} pcs` : "Out"}
        </span>
      </div>
    </div>
  );
}

export default function AdminInventory() {
  const { user } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [summary, setSummary] = useState({ totalInventoryValue: 0, totalCostValue: 0, totalPotentialProfit: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("margin");
  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [view, setView] = useState("tile"); // tile | list | table
  const fileRef = useRef();
  const [editing, setEditing] = useState(null);
  

  const headers = { Authorization: `Bearer ${user?.token}` };

  useEffect(() => {
    API.get("/analytics/inventory", { headers })
      .then(res => {
        setInventory(res.data.inventory);
        setSummary({
          totalInventoryValue: res.data.totalInventoryValue,
          totalCostValue: res.data.totalCostValue,
          totalPotentialProfit: res.data.totalPotentialProfit,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

   const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFiles([]);
    setError("");
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    setForm({
      name: product.name || "",
      referenceNumber: product.referenceNumber || "",
      brand: product.brand || "",
      description: product.description || "",
      price: product.price || "",
      costPrice: product.costPrice || "",
      category: product.category || "",
      stock: product.stock || "",
      condition: product.condition || "",
      movement: product.specifications?.movement || "",
      caseDiameter: product.specifications?.caseDiameter || "",
      caseThickness: product.specifications?.caseThickness || "",
      material: product.specifications?.material || "",
      waterResistance: product.specifications?.waterResistance || "",
      crystal: product.specifications?.crystal || "",
      isFeatured: product.isFeatured || false,
      isNewArrival: product.isNewArrival || false,
      discount: product.discount || "",

    });
    setFiles([]);
    setError("");
    setShowModal(true);
  };

 const handleSave = async () => {
    setSaving(true); setError("");
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (!["movement","caseDiameter","caseThickness","material","waterResistance","crystal"].includes(k)) {
          data.append(k, v);
        }
      });
      data.append("specifications.movement", form.movement);
      data.append("specifications.caseDiameter", form.caseDiameter);
      data.append("specifications.caseThickness", form.caseThickness);
      data.append("specifications.material", form.material);
      data.append("specifications.waterResistance", form.waterResistance);
      data.append("specifications.crystal", form.crystal);
      files.forEach(f => data.append("images", f));

      if (editing) {
        await API.put(`/products/${editing._id}`, data, { headers });
      } else {
        await API.post("/products", data, { headers });
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save product.");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await API.delete(`/products/${id}`, { headers });
      fetchProducts();
    } catch { }
  };

  
  const filtered = inventory
    .filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "margin") return b.margin - a.margin;
      if (sortBy === "profit") return b.profit - a.profit;
      if (sortBy === "stock") return b.stock - a.stock;
      if (sortBy === "price") return b.sellingPrice - a.sellingPrice;
      return 0;
    });

  return (
    <AdminLayout>
      <div className="flex flex-col gap-4">

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white p-4">
            <p className="text-[10px] text-gray-400 uppercase tracking-[1px] mb-1">Inventory Value</p>
            <p className="text-xl font-bold text-[#1a1410]">₱{summary.totalInventoryValue.toLocaleString()}</p>
            <p className="text-[10px] text-gray-400 mt-1">At selling price</p>
          </div>
          <div className="bg-white p-4">
            <p className="text-[10px] text-gray-400 uppercase tracking-[1px] mb-1">Total Cost</p>
            <p className="text-xl font-bold text-[#1a1410]">₱{summary.totalCostValue.toLocaleString()}</p>
            <p className="text-[10px] text-gray-400 mt-1">What you paid</p>
          </div>
          <div className="bg-white p-4">
            <p className="text-[10px] text-gray-400 uppercase tracking-[1px] mb-1">Potential Profit</p>
            <p className="text-xl font-bold text-green-600">₱{summary.totalPotentialProfit.toLocaleString()}</p>
            <p className="text-[10px] text-gray-400 mt-1">If all stock sells</p>
          </div>
          <button onClick={openCreate}
            className="px-4 py-2 bg-[#1a1410] text-[#C8A03C] text-xs font-bold tracking-[1.5px] uppercase hover:bg-[#2a2018] transition-colors border-none cursor-pointer">
            + Add Product
          </button>
        </div>
        

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
              className="pl-8 pr-4 py-2 border border-gray-200 text-sm focus:outline-none focus:border-[#1a1410] w-full" />
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="border border-gray-200 px-3 py-2 text-sm focus:outline-none bg-white cursor-pointer">
            <option value="margin">Sort: Margin</option>
            <option value="profit">Sort: Profit</option>
            <option value="stock">Sort: Stock</option>
            <option value="price">Sort: Price</option>
          </select>

          {/* View toggle */}
          <div className="flex border border-gray-200 overflow-hidden">
            {[
              { key: "tile", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
              { key: "list", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg> },
              { key: "table", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="12" y1="3" x2="12" y2="21"/></svg> },
            ].map(v => (
              <button key={v.key} onClick={() => setView(v.key)}
                className={`px-3 py-2 border-none cursor-pointer transition-colors ${view === v.key ? "bg-[#1a1410] text-[#C8A03C]" : "bg-white text-gray-400 hover:text-[#1a1410]"}`}>
                {v.icon}
              </button>
            ))}
          </div>
        </div>

        {/* Tile view */}
        {view === "tile" && (
          loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white animate-pulse">
                  <div className="aspect-square bg-gray-200" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {filtered.map(p => <TileCard key={p._id} p={p} />)}
            </div>
          )
        )}

        {/* List view */}
        {view === "list" && (
          <div className="bg-white overflow-hidden">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="p-3 border-b border-gray-100 animate-pulse">
                  <div className="h-3 bg-gray-100 rounded w-1/2 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                </div>
              ))
            ) : filtered.length === 0 ? (
              <p className="p-8 text-center text-gray-400 text-sm">No products found</p>
            ) : (
              filtered.map(p => <ListRow key={p._id} p={p} />)
            )}
          </div>
        )}

        {/* Table view */}
        {view === "table" && (
          <div className="bg-white overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-[10px] font-bold tracking-[1.5px] uppercase text-gray-400">Product</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold tracking-[1.5px] uppercase text-gray-400">Stock</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold tracking-[1.5px] uppercase text-gray-400">Cost</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold tracking-[1.5px] uppercase text-gray-400">Price</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold tracking-[1.5px] uppercase text-gray-400">Profit</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold tracking-[1.5px] uppercase text-gray-400">Margin</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold tracking-[1.5px] uppercase text-gray-400">Total Value</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="border-b border-gray-50">
                      <td colSpan={7} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-400 text-sm">No products found</td></tr>
                ) : (
                  filtered.map(p => (
                    <tr key={p._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <img src={p.image || "https://placehold.co/32x32?text=?"} alt={p.name} className="w-8 h-8 object-cover bg-gray-100 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-[#1a1410]">{p.name}</p>
                            <p className="text-[10px] text-gray-400">{p.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 ${p.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                          {p.stock > 0 ? p.stock : "Out"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">₱{p.costPrice.toLocaleString()}</td>
                      <td className="px-4 py-3 text-xs font-bold text-[#1a1410]">₱{p.sellingPrice.toLocaleString()}</td>
                      <td className="px-4 py-3 text-xs font-bold text-green-600">₱{p.profit.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold ${marginColor(p.margin)}`}>{p.margin}%</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">₱{p.totalInventoryValue.toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}