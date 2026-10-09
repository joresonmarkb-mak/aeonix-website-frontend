import { useState, useEffect, useRef } from "react";
import AdminLayout from "./AdminLayout.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import API from "../../services/Api.js";
import ManualSaleModal from "./Manualsalemodal.jsx";

const emptyForm = {
  name: "", referenceNumber: "", brand: "", description: "", price: "",
  category: "", stock: "", condition: "", movement: "", costPrice: "",
  caseDiameter: "", caseThickness: "", material: "", waterResistance: "", crystal: "",
  isFeatured: false, isNewArrival: false, discount: "",status: "In Stock",
};

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

export default function AdminProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showInventory, setShowInventory] = useState(false);
  const [view, setView] = useState("tile");
  const [inventorySummary, setInventorySummary] = useState({ totalInventoryValue: 0, totalCostValue: 0, totalPotentialProfit: 0 });
  const [saleProduct, setSaleProduct] = useState(null);
  const fileRef = useRef();

  const headers = { Authorization: `Bearer ${user?.token}` };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await API.get("/products?limit=0", { headers });
      setProducts(res.data.products);
    } catch { } finally { setLoading(false); }
  };

  const fetchInventory = async () => {
    try {
      const res = await API.get("/analytics/inventory", { headers });
      setInventorySummary({
        totalInventoryValue: res.data.totalInventoryValue,
        totalCostValue: res.data.totalCostValue,
        totalPotentialProfit: res.data.totalPotentialProfit,
      });
    } catch { }
  };

  useEffect(() => { fetchProducts(); fetchInventory(); }, []);

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
      status: product.status || "In Stock",
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
      fetchInventory();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save product.");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await API.delete(`/products/${id}`, { headers });
      fetchProducts();
      fetchInventory();
    } catch { }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  const getMargin = (p) => {
    if (!p.costPrice || !p.price) return null;
    return Number(((p.price - p.costPrice) / p.price * 100).toFixed(1));
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-4 ">

        {/* Inventory summary
        {showInventory && (
          <div className="grid grid-cols-3 gap-3 bg-[#0a0a0a]">
            <div className="bg-[#1a1a1a] p-3">
              <p className="text-[9px] text-gray-400 uppercase tracking-[1px]">Inventory Value</p>
              <p className="text-base font-bold text-white">₱{inventorySummary.totalInventoryValue.toLocaleString()}</p>
            </div>
            <div className="bg-[#1a1a1a] p-3">
              <p className="text-[9px] text-white uppercase tracking-[1px]">Total Cost</p>
              <p className="text-base font-bold text-white">₱{inventorySummary.totalCostValue.toLocaleString()}</p>
            </div>
            <div className="bg-[#1a1a1a] p-3">
              <p className="text-[9px] text-gray-400 uppercase tracking-[1px]">Potential Profit</p>
              <p className="text-base font-bold text-green-600">₱{inventorySummary.totalPotentialProfit.toLocaleString()}</p>
            </div>
            bg-[#1a1a1a] border overflow-hidden rounded-lg border-white/5
          </div>
        )} */}

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 bg-[#0f0f0f] ">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input   value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
              className=" text-white rounded-sm pl-8 pr-4 py-2 border border-white/5 bg-[#1a1a1a] text-sm focus:outline-none focus:border-white w-full" />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setShowInventory(!showInventory)}
              className={`px-3 py-2 text-xs font-bold tracking-[1px] uppercase border transition-colors cursor-pointer ${showInventory ? "bg-[#1a1a1a] text-[#C8A03C] border-white/5" : "border-white/5 bg-[#1a1a1a] text-gray-500 rounded-sm "}`}>
               {showInventory ? "Hide Costs" : "Show Costs"}
            </button>
            <div className="flex border border-white/5 overflow-hidden rounded-sm ">
              <button onClick={() => setView("list")}
                className={`px-3 py-2 border-none cursor-pointer transition-colors ${view === "list" ? "bg-[#1a1410] text-[#C8A03C]" : "bg-[#1a1a1a] border-gray-700 text-[#C8A03C] hover:text-white"}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
              </button>
              <button onClick={() => setView("tile")}
                className={`px-3 py-2 border-none cursor-pointer transition-colors ${view === "tile" ? "bg-[#1a1410] text-[#C8A03C]" : "bg-[#1a1a1a] border-gray-700 text-[#C8A03C] hover:text-white"}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              </button>
            </div>
            <button onClick={openCreate}
              className=" px-8 py-2 bg-[#1a1a1a] rounded-xs text-[#C8A03C] text-lg  tracking-[1.5px] uppercase hover:bg-[#2a2018] transition-colors border-none cursor-pointer">
              +
            </button>
          </div>
        </div>

        {/* Tile view */}
        {view === "tile" && (
          loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
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
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 ">
              {filtered.map(p => {
                const margin = getMargin(p);
                return (
                  <div key={p._id} className="bg-[#1a1a1a] border overflow-hidden rounded-lg border-white/5">
                    <div className="aspect-square overflow-hidden bg-gray-100 relative">
                      <img src={p.images?.[0]?.replace(/"/g, '') || "https://placehold.co/200x200?text=?"} alt={p.name} className="w-full h-full object-cover" />
                      <span className={`absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 ${p.stock > 0 ? "bg-green-100 text-green-700 rounded-sm" : "rounded-sm bg-red-100 text-red-600"}`}>
                        {p.stock > 0 ? `${p.stock}` : "Out"}
                      </span>
                      <span className={`absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 
                        ${p.status === 'Servicing' ? 'bg-orange-100 text-orange-600 rounded-sm' : p.status === 'Sold' ? 'bg-red-100 text-red-600 rounded-sm' : 'bg-green-100 text-green-700 rounded-sm'}`}>
                          
                        {p.status || 'In Stock'}
                      </span>
                    </div>
                    <div className="p-2.5">
                      <p className="text-[10px] text-gray-400 uppercase tracking-[1px] truncate">{p.brand}</p>
                      <p className="text-xs font-bold text-white truncate">{p.name}</p>
                      <p className="text-xs text-[#C8A03C] font-bold mt-1">₱{p.price.toLocaleString()}</p>
                      {showInventory && margin !== null && (
                        <div className="mt-1.5 flex items-center justify-between">
                          <p className="text-[9px] text-gray-400">Cost: ₱{p.costPrice.toLocaleString()}</p>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${marginBg(margin)}`}>{margin}%</span>
                        </div>
                      )}
                      <div className="flex gap-1 mt-2">
                        <button onClick={() => openEdit(p)} className="flex-1 text-[10px] py-1 bg-gray-300 hover:bg-gray-200 text-gray-600 border-none cursor-pointer transition-colors rounded-sm">EDIT</button>
                        <button onClick={() => setSaleProduct(p)} className="flex-1 text-[10px] py-1 bg-gray-300 hover:bg-green-100 text-gray-600 border-none cursor-pointer transition-colors rounded-sm">SOLD</button>
                        <button onClick={() => handleDelete(p._id)} className="flex-1 text-[10px] py-1 bg-gray-300 hover:bg-red-100 text-gray-600 border-none cursor-pointer transition-colors rounded-sm">DEL</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* List view */}
        {view === "list" && (
          <div className="bg-white overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-[10px] font-bold tracking-[1.5px] uppercase text-gray-400">Product</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold tracking-[1.5px] uppercase text-gray-400">Price</th>
                  {showInventory && <>
                    <th className="text-left px-4 py-3 text-[10px] font-bold tracking-[1.5px] uppercase text-gray-400">Cost</th>
                    <th className="text-left px-4 py-3 text-[10px] font-bold tracking-[1.5px] uppercase text-gray-400">Profit</th>
                    <th className="text-left px-4 py-3 text-[10px] font-bold tracking-[1.5px] uppercase text-gray-400">Margin</th>
                  </>}
                  <th className="text-left px-4 py-3 text-[10px] font-bold tracking-[1.5px] uppercase text-gray-400">Stock</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold tracking-[1.5px] uppercase text-gray-400">Condition</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold tracking-[1.5px] uppercase text-gray-400">Status</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold tracking-[1.5px] uppercase text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="border-b border-gray-50">
                      <td colSpan={8} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={8} className="px-4 py-10 text-center text-gray-400 text-sm">No products found</td></tr>
                ) : (
                  filtered.map(p => {
                    const margin = getMargin(p);
                    const profit = p.costPrice ? p.price - p.costPrice : null;
                    return (
                      <tr key={p._id} className=" hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-9 h-9 bg-gray-100 overflow-hidden flex-shrink-0">
                              <img src={p.images?.[0]?.replace(/"/g, '') || "https://placehold.co/36x36?text=?"} alt={p.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-[#1a1410]">{p.name}</p>
                              <p className="text-[10px] text-gray-400">{p.referenceNumber}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs font-bold text-[#1a1410]">₱{p.price.toLocaleString()}</td>
                        {showInventory && <>
                          <td className="px-4 py-3 text-xs text-gray-500">{p.costPrice ? `₱${p.costPrice.toLocaleString()}` : "—"}</td>
                          <td className="px-4 py-3 text-xs font-bold text-green-600">{profit !== null ? `₱${profit.toLocaleString()}` : "—"}</td>
                          <td className="px-4 py-3">
                            {margin !== null ? (
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${marginBg(margin)}`}>{margin}%</span>
                            ) : <span className="text-gray-300">—</span>}
                          </td>
                        </>}
                        <td className="px-4 py-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 ${p.stock > 0 ? "bg-green-100 text-green-700 rounded-sm" : "bg-red-100 text-red-600 rounded-sm"}`}>
                            {p.stock > 0 ? p.stock : "Out"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] font-bold tracking-[1px] uppercase px-2 py-0.5 ${p.condition === "Brand New" ? "bg-[#C8A03C]/10 text-[#C8A03C]" : "bg-gray-100 text-gray-600"}`}>
                            {p.condition}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                           <span className={`text-[10px] font-bold tracking-[1px] uppercase px-2 py-0.5 ${
                              p.status === 'Sold' ? 'bg-red-100 text-red-600' :
                              p.status === 'Servicing' ? 'bg-orange-100 text-orange-600' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {p.status || 'In Stock'}
                            </span>
                          </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => openEdit(p)} className="text-xs text-blue-500 hover:underline bg-transparent border-none cursor-pointer">Edit</button>
                          {p.status === 'In Stock' && (
                            <button onClick={() => setSaleProduct(p)} className="flex-1 text-[10px] py-1 bg-green-50 hover:bg-green-100 text-green-600 border-none cursor-pointer transition-colors">Sold</button>
                          )}
                            <button onClick={() => handleDelete(p._id)} className="text-xs text-red-400 hover:underline bg-transparent border-none cursor-pointer">Delete</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="font-bold text-[#1a1410] text-sm">{editing ? "Edit Product" : "Add Product"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-[#1a1410] bg-transparent border-none cursor-pointer text-xl">×</button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <div className="grid grid-cols-2 gap-4">
                <F label="Name" name="name" form={form} setForm={setForm} />
                <F label="Reference Number" name="referenceNumber" form={form} setForm={setForm} />
                <F label="Brand" name="brand" form={form} setForm={setForm} />
                <F label="Selling Price" name="price" type="number" form={form} setForm={setForm} />
                <F label="Cost Price" name="costPrice" type="number" form={form} setForm={setForm} />
                <F label="Stock" name="stock" type="number" form={form} setForm={setForm} />
                <F label="Discount (%)" name="discount" type="number" form={form} setForm={setForm} />
                <F label="Category" name="category" options={["Classic", "Divers", "Men's", "Women's", "Unisex"]} form={form} setForm={setForm} />
                <F label="Condition" name="condition" options={["Brand New", "Pre-owned"]} form={form} setForm={setForm} />
                <F label="Status" name="status" options={["In Stock", "Servicing", "Sold"]} form={form} setForm={setForm} />
              </div>

              {form.price && form.costPrice && (
                <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                  <p className="text-xs text-gray-500">Margin preview</p>
                  <div className="flex gap-4">
                    <p className="text-xs">Profit: <span className="font-bold text-green-600">₱{(Number(form.price) - Number(form.costPrice)).toLocaleString()}</span></p>
                    <p className="text-xs">Margin: <span className={`font-bold ${marginColor(((form.price - form.costPrice) / form.price * 100))}`}>{((form.price - form.costPrice) / form.price * 100).toFixed(1)}%</span></p>
                  </div>
                </div>
              )}

              <div>
                <label className="text-[10px] tracking-[1.5px] uppercase text-gray-500 block mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
                  className="border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[#1a1410] w-full resize-none" />
              </div>

              <p className="text-[10px] tracking-[1.5px] uppercase text-gray-400 border-t pt-4">Specifications</p>
              <div className="grid grid-cols-2 gap-4">
                <F label="Movement" name="movement" options={["Automatic", "Quartz", "Manual"]} form={form} setForm={setForm} />
                <F label="Case Diameter" name="caseDiameter" form={form} setForm={setForm} />
                <F label="Case Thickness" name="caseThickness" form={form} setForm={setForm} />
                <F label="Material" name="material" form={form} setForm={setForm} />
                <F label="Water Resistance" name="waterResistance" form={form} setForm={setForm} />
                <F label="Crystal" name="crystal" form={form} setForm={setForm} />
              </div>

              <p className="text-[10px] tracking-[1.5px] uppercase text-gray-400 border-t pt-4">Flags</p>
              <div className="flex gap-6">
                <F label="Featured" name="isFeatured" type="checkbox" form={form} setForm={setForm} />
                <F label="New Arrival" name="isNewArrival" type="checkbox" form={form} setForm={setForm} />
              </div>

              <p className="text-[10px] tracking-[1.5px] uppercase text-gray-400 border-t pt-4">Images</p>
              <input ref={fileRef} type="file" multiple accept="image/*" onChange={e => setFiles(Array.from(e.target.files))}
                className="text-sm text-gray-500" />
              {files.length > 0 && <p className="text-xs text-gray-400">{files.length} file(s) selected</p>}
              {editing && editing.images?.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {editing.images.map((img, i) => (
                    <img key={i} src={img.replace(/"/g, '')} alt="" className="w-16 h-16 object-cover border border-gray-200" />
                  ))}
                </div>
              )}

              <button onClick={handleSave} disabled={saving}
                className="w-full py-3 bg-[#1a1410] text-[#C8A03C] text-xs font-bold tracking-[2px] uppercase hover:bg-[#2a2018] transition-colors border-none cursor-pointer disabled:opacity-50 mt-2">
                {saving ? "Saving..." : editing ? "Update Product" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Sale Modal */}
      {saleProduct && (
        <ManualSaleModal
          product={saleProduct}
          onClose={() => setSaleProduct(null)}
          onSuccess={() => { setSaleProduct(null); fetchProducts(); fetchInventory(); }}
        />
      )}
    </AdminLayout>
  );
}