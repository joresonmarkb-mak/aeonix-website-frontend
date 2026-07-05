import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import API from "../services/api.js";
import TrustBar from "../components/trustBar.jsx";

// ── Filter Sidebar ────────────────────────────────────────
function FilterSection({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-left bg-transparent border-none cursor-pointer"
      >
        <span className="text-xs font-bold tracking-[2px] uppercase text-[#1a1410]">{title}</span>
        <span className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
        </span>
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

function Sidebar({ filters, setFilters, onReset }) {
  const [minInput, setMinInput] = useState(filters.minPrice || "");
  const [maxInput, setMaxInput] = useState(filters.maxPrice || "");

  const handlePriceApply = () => {
    setFilters(f => ({ ...f, minPrice: minInput, maxPrice: maxInput, page: 1 }));
  };

  const toggle = (key, value) => {
    setFilters(f => ({ ...f, [key]: f[key] === value ? "" : value, page: 1 }));
  };

  const CheckItem = ({ label, filterKey, value }) => (
    <label className="flex items-center gap-2.5 cursor-pointer mb-2 group">
      <div
        onClick={() => toggle(filterKey, value)}
        className={`w-4 h-4 border flex items-center justify-center cursor-pointer transition-colors ${filters[filterKey] === value ? "bg-[#1a1410] border-[#1a1410]" : "border-gray-300 group-hover:border-[#1a1410]"}`}
      >
        {filters[filterKey] === value && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
      </div>
      <span className="text-sm text-gray-600">{label}</span>
    </label>
  );

  return (
    <aside className="w-64 flex-shrink-0">
      <div className="bg-white p-5 sticky top-24">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold tracking-[2px] uppercase text-[#1a1410]">Filters</h3>
          <button onClick={onReset} className="text-xs text-[#C8A03C] hover:underline bg-transparent border-none cursor-pointer">Reset all</button>
        </div>

        <FilterSection title="Condition" defaultOpen={true}>
          <CheckItem label="Brand New" filterKey="condition" value="Brand New" />
          <CheckItem label="Pre-owned" filterKey="condition" value="Pre-owned" />
        </FilterSection>

        <FilterSection title="Availability" defaultOpen={true}>
          <CheckItem label="In Stock" filterKey="availability" value="instock" />
          <CheckItem label="Out of Stock" filterKey="availability" value="outofstock" />
        </FilterSection>

        <FilterSection title="Price Range">
          <div className="flex gap-2 mb-2">
            <input
              type="number"
              placeholder="Min"
              value={minInput}
              onChange={e => setMinInput(e.target.value)}
              className="w-full border border-gray-200 px-2 py-1.5 text-sm focus:outline-none focus:border-[#C8A03C]"
            />
            <input
              type="number"
              placeholder="Max"
              value={maxInput}
              onChange={e => setMaxInput(e.target.value)}
              className="w-full border border-gray-200 px-2 py-1.5 text-sm focus:outline-none focus:border-[#C8A03C]"
            />
          </div>
          <button
            onClick={handlePriceApply}
            className="w-full py-1.5 bg-[#1a1410] text-[#C8A03C] text-xs font-bold tracking-[1px] uppercase hover:bg-[#2a2018] transition-colors border-none cursor-pointer"
          >
            Apply
          </button>
        </FilterSection>

        <FilterSection title="Function">
          <CheckItem label="Automatic" filterKey="function" value="Automatic" />
          <CheckItem label="Quartz" filterKey="function" value="Quartz" />
        </FilterSection>

        <FilterSection title="Category">
          {["Classic", "Divers", "Men's", "Women's", "Unisex"].map(cat => (
            <CheckItem key={cat} label={cat} filterKey="category" value={cat} />
          ))}
        </FilterSection>
      </div>
    </aside>
  );
}

// ── Product Card ──────────────────────────────────────────
function WatchCard({ watch }) {
         
  return (
    <Link to={`/watches/${watch._id}`} className="no-underline group">
      <div className="bg-[#f5f5f5] relative overflow-hidden">
        {watch.discount && (
          <span className="absolute top-3 right-3 z-10 bg-[#C8A03C] text-black text-[10px] font-bold px-2 py-1">
            {watch.discount}% off
          </span>
        )}
        <div className="aspect-square overflow-hidden  ">
          <img
            src={watch.images?.[0]?.replace(/"/g, '') || "https://placehold.co/400x400?text=No+Image "}
            alt={watch.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>
      <div className="pt-3 pb-5 text-center">
        <p className="text-xs font-bold tracking-[2px] uppercase text-[#1a1410] mb-1">{watch.brand}</p>
        <p className="text-sm text-gray-600 mb-0.5">{watch.name}</p>
        <p className="text-xs text-gray-400 mb-1.5">{watch.specifications?.caseDiameter}</p>
        <p className="text-[#C8A03C] text-sm font-bold">₱{watch.price.toLocaleString()} <span className="text-gray-400 font-normal">only</span></p>
      </div>
    </Link>
  );
}

// ── Skeleton ──────────────────────────────────────────────
function WatchSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 aspect-square" />
      <div className="pt-3 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-1/3 mx-auto" />
        <div className="h-3 bg-gray-200 rounded w-2/3 mx-auto" />
        <div className="h-3 bg-gray-200 rounded w-1/4 mx-auto" />
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────
const defaultFilters = {
  search: "",
  condition: "",
  availability: "",
  minPrice: "",
  maxPrice: "",
  function: "",
  category: "",
  sort: "newest",
  page: 1,
};

 function Watches() {
  const [filters, setFilters] = useState(defaultFilters);
  const [watches, setWatches] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchWatches = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append("search", filters.search);
      if (filters.condition) params.append("condition", filters.condition);
      if (filters.availability === "instock") params.append("inStock", "true");
      if (filters.availability === "outofstock") params.append("inStock", "false");
      if (filters.minPrice) params.append("minPrice", filters.minPrice);
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
      if (filters.function) params.append("movement", filters.function);
      if (filters.category) params.append("category", filters.category);
      params.append("sort", filters.sort);
      params.append("page", filters.page);
      params.append("limit", 12);

      const res = await API.get(`/products?${params.toString()}`);
      setWatches(res.data.products);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchWatches(); }, [fetchWatches]);

  const handleReset = () => setFilters(defaultFilters);

  return (
    <div className="min-h-screen bg-white">
    

      {/* Page header */}
      <div className="bg-[#1a1410] pt-28 pb-10 px-[5%]">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#C8A03C] text-[11px] tracking-[4px] uppercase mb-2">Our Collection</p>
          <h1 className=" text-4xl text-[#f0ece4] font-bold">All Watches</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-[5%] py-10">
        {/* Search + Sort bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input
              type="text"
              placeholder="Search watches..."
              value={filters.search}
              onChange={e => setFilters(f => ({ ...f, search: e.target.value, page: 1 }))}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 text-sm focus:outline-none focus:border-[#C8A03C]"
            />
          </div>

          {/* Sort */}
          <select
            value={filters.sort}
            onChange={e => setFilters(f => ({ ...f, sort: e.target.value, page: 1 }))}
            className="border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-[#C8A03C] bg-white cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>

          <p className="text-sm text-gray-400 self-center whitespace-nowrap">{total} watches</p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <Sidebar filters={filters} setFilters={setFilters} onReset={handleReset} />

          {/* Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(8)].map((_, i) => <WatchSkeleton key={i} />)}
              </div>
            ) : watches.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="text-4xl mb-4">🕰️</p>
                <p className="font-serif text-xl text-[#1a1410] mb-2">No watches found</p>
                <p className="text-sm text-gray-400 mb-6">Try adjusting your filters</p>
                <button onClick={handleReset} className="px-6 py-2.5 bg-[#1a1410] text-[#C8A03C] text-xs font-bold tracking-[2px] uppercase border-none cursor-pointer">
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {watches.map(watch => <WatchCard key={watch._id} watch={watch} />)}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && !loading && (
              <div className="flex justify-center gap-2 mt-12">
                <button
                  onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
                  disabled={filters.page === 1}
                  className="w-9 h-9 border border-gray-200 flex items-center justify-center disabled:opacity-30 hover:border-[#1a1410] transition-colors bg-transparent cursor-pointer"
                >
                  ‹
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setFilters(f => ({ ...f, page: i + 1 }))}
                    className={`w-9 h-9 border text-sm transition-colors cursor-pointer ${filters.page === i + 1 ? "bg-[#1a1410] text-[#C8A03C] border-[#1a1410]" : "border-gray-200 hover:border-[#1a1410] bg-transparent"}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
                  disabled={filters.page === totalPages}
                  className="w-9 h-9 border border-gray-200 flex items-center justify-center disabled:opacity-30 hover:border-[#1a1410] transition-colors bg-transparent cursor-pointer"
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      
    </div>
  );
}


export default function AllWatches() {
  return(
  <div className="font-sans">
      <Navbar cartCount={2} />
      <Watches />
      <TrustBar />
      <Footer />
  </div>);
    
  }
  
