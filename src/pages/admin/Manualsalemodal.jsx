import { useState } from "react";
import API from "../../services/Api.js";
import { useAuth } from "../../context/AuthContext.jsx";

const SALE_CHANNELS = [
  "FB Marketplace",
  "Meetups",
  "Carousell",
  "FB Group Post",
  "FB Page",
  "Website",
  "Other",
];

function Input({ label, required, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] tracking-[1.5px] uppercase text-gray-500">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        {...props}
        className="border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a1410] transition-colors w-full"
      />
    </div>
  );
}

export default function ManualSaleModal({ product, onClose, onSuccess }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    buyerName: "",
    buyerPhone: "",
    street: "",
    city: "",
    province: "",
    postalCode: "",
    finalPrice: product?.price || "",
    channel: "Website",
    notes: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    if (!form.buyerName) return setError("Buyer name is required.");
    if (!form.finalPrice) return setError("Final price is required.");
    if (!form.city) return setError("City is required.");

    setSaving(true);
    setError("");
    try {
      const headers = { Authorization: `Bearer ${user?.token}` };

      // Create a manual order
      await API.post("/orders/manual", {
        productId: product._id,
        productName: product.name,
        productImage: product.images?.[0] || "",
        finalPrice: Number(form.finalPrice),
        buyerName: form.buyerName,
        buyerPhone: form.buyerPhone,
        shippingAddress: {
          street: form.street || "N/A",
          city: form.city,
          province: form.province,
          postalCode: form.postalCode || "N/A",
          country: "Philippines",
        },
        channel: form.channel,
        notes: form.notes,
      }, { headers });

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to record sale.");
    } finally {
      setSaving(false);
    }
  };

  const profit = form.finalPrice && product?.costPrice
    ? Number(form.finalPrice) - product.costPrice
    : null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div>
            <h2 className="font-bold text-[#1a1410] text-sm">Mark as Sold</h2>
            <p className="text-[10px] text-gray-400 mt-0.5">{product?.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-[#1a1410] bg-transparent border-none cursor-pointer text-xl">×</button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          {error && <p className="text-red-500 text-xs bg-red-50 px-3 py-2">{error}</p>}

          {/* Product preview */}
          <div className="flex gap-3 bg-gray-50 p-3">
            <div className="w-14 h-14 bg-gray-200 overflow-hidden flex-shrink-0">
              <img src={product?.images?.[0]?.replace(/"/g, '') || "https://placehold.co/56x56?text=?"} alt={product?.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#1a1410]">{product?.name}</p>
              <p className="text-[10px] text-gray-400">{product?.brand} · {product?.condition}</p>
              <p className="text-xs text-[#C8A03C] font-bold">Listed: ₱{product?.price?.toLocaleString()}</p>
            </div>
          </div>

          {/* Buyer info */}
          <p className="text-[10px] tracking-[1.5px] uppercase text-gray-400 font-bold border-t pt-3">Buyer Information</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Input label="Buyer Name" required placeholder="Juan dela Cruz" value={form.buyerName} onChange={e => set("buyerName", e.target.value)} />
            </div>
            <div className="col-span-2">
              <Input label="Buyer Phone" placeholder="+63XXXXXXXXXX" value={form.buyerPhone} onChange={e => set("buyerPhone", e.target.value)} />
            </div>
          </div>

          {/* Address */}
          <p className="text-[10px] tracking-[1.5px] uppercase text-gray-400 font-bold border-t pt-3">Delivery / Meetup Address</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Input label="Street" placeholder="123 Rizal Street (optional)" value={form.street} onChange={e => set("street", e.target.value)} />
            </div>
            <Input label="City" required placeholder="Urdaneta" value={form.city} onChange={e => set("city", e.target.value)} />
            <Input label="Province" placeholder="Pangasinan" value={form.province} onChange={e => set("province", e.target.value)} />
            <Input label="Postal Code" placeholder="2428" value={form.postalCode} onChange={e => set("postalCode", e.target.value)} />
          </div>

          {/* Sale details */}
          <p className="text-[10px] tracking-[1.5px] uppercase text-gray-400 font-bold border-t pt-3">Sale Details</p>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] tracking-[1.5px] uppercase text-gray-500">Final Deal Price <span className="text-red-400">*</span></label>
            <input
              type="number"
              placeholder={product?.price}
              value={form.finalPrice}
              onChange={e => set("finalPrice", e.target.value)}
              className="border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a1410] w-full"
            />
          </div>

          {/* Profit preview */}
          {profit !== null && (
            <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
              <p className="text-xs text-gray-500">Actual profit on this sale</p>
              <p className={`text-sm font-bold ${profit >= 0 ? "text-green-600" : "text-red-500"}`}>
                {profit >= 0 ? "+" : ""}₱{profit.toLocaleString()}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-[10px] tracking-[1.5px] uppercase text-gray-500">Where Sold <span className="text-red-400">*</span></label>
            <select
              value={form.channel}
              onChange={e => set("channel", e.target.value)}
              className="border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a1410] bg-white"
            >
              {SALE_CHANNELS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] tracking-[1.5px] uppercase text-gray-500">Notes (optional)</label>
            <textarea
              placeholder="Any additional notes about the sale..."
              rows={2}
              value={form.notes}
              onChange={e => set("notes", e.target.value)}
              className="border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a1410] resize-none w-full"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="w-full py-3 bg-[#1a1410] text-[#C8A03C] text-xs font-bold tracking-[2px] uppercase hover:bg-[#2a2018] transition-colors border-none cursor-pointer disabled:opacity-50"
          >
            {saving ? "Recording Sale..." : "✓ Confirm Sale"}
          </button>
        </div>
      </div>
    </div>
  );
}