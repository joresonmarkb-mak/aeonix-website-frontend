import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import API from "../services/api.js";
import { useCart } from "../context/CartContext.jsx";

// ── Image Gallery ─────────────────────────────────────────
function ImageGallery({ images }) {
  const [selected, setSelected] = useState(0);


  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 flex items-center justify-center">
        <span className="text-gray-400 text-sm">No image</span>
      </div>
    );
  }

  const clean = (url) => url?.replace(/"/g, '') || '';

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="aspect-square bg-gray-50 overflow-hidden">
        <img
          src={clean(images[selected])}
          alt="product"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`w-20 h-20 flex-shrink-0 overflow-hidden border-2 transition-all cursor-pointer bg-transparent p-0 ${i === selected ? "border-[#1a1410]" : "border-transparent hover:border-gray-300"}`}
            >
              <img src={clean(img)} alt={`thumb-${i}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Spec Row ──────────────────────────────────────────────
function SpecRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex gap-2 text-sm">
      <span className="text-gray-400 w-36 flex-shrink-0">{label}</span>
      <span className="text-[#1a1410]">{value}</span>
    </div>
  );
}

// ── Recommendation Card ───────────────────────────────────
function RecommendCard({ watch }) {
  return (
    <Link to={`/watches/${watch._id}`} className="no-underline group">
      <div className="bg-[#f5f5f5] relative overflow-hidden aspect-square">
        {watch.discount && (
          <span className="absolute top-2 right-2 z-10 bg-[#C8A03C] text-black text-[10px] font-bold px-2 py-0.5">
            {watch.discount}% off
          </span>
        )}
        <img
          src={watch.image?.[0]?.replace(/"/g, '') || "https://placehold.co/300x300?text=No+Image"}
          alt={watch.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="pt-2 text-center">
        <p className="text-[10px] font-bold tracking-[2px] uppercase text-[#1a1410] mb-0.5">{watch.brand}</p>
        <p className="text-xs text-gray-500 mb-0.5">{watch.name}</p>
        <p className="text-xs text-gray-400 mb-1">{watch.specifications?.caseDiameter}</p>
        <p className="text-[#C8A03C] text-sm font-bold">
          ₱{watch.price.toLocaleString()} <span className="text-gray-400 font-normal text-xs">only</span>
        </p>
      </div>
    </Link>
  );
}

// ── Main Page ─────────────────────────────────────────────
export default function ProductDetail() {
  const { id } = useParams();
  const [watch, setWatch] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

 
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/products/${id}`);
        setWatch(res.data);

        // Fetch recommendations from same category
        const recRes = await API.get(`/products?category=${res.data.category}&limit=4`);
        setRecommendations(recRes.data.products.filter(p => p._id !== id));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    addToCart(watch, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-5xl mx-auto px-[5%] pt-32 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
            <div className="aspect-square bg-gray-200" />
            <div className="flex flex-col gap-4">
              <div className="h-6 bg-gray-200 rounded w-1/3" />
              <div className="h-8 bg-gray-200 rounded w-2/3" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-10 bg-gray-200 rounded w-1/4 mt-4" />
              <div className="h-12 bg-gray-200 rounded mt-4" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!watch) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-400">Watch not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-5xl mx-auto px-[5%] pt-28 pb-16">

        {/* Breadcrumb */}
        <div className="flex gap-2 text-xs text-gray-400 mb-8">
          <Link to="/" className="hover:text-[#1a1410] no-underline">Home</Link>
          <span>/</span>
          <Link to="/allwatches" className="hover:text-[#1a1410] no-underline">Watches</Link>
          <span>/</span>
          <span className="text-[#1a1410]">{watch.name}</span>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">

          {/* Left — Images */}
          <ImageGallery images={watch.image} />

          {/* Right — Details */}
          <div className="flex flex-col">
            {/* Brand + name */}
            <p className="text-xs font-bold tracking-[3px] uppercase text-gray-400 mb-1">{watch.brand}</p>
            <h1 className=" text-2xl font-bold text-[#1a1410] mb-1">{watch.name}</h1>

            {/* Reference + condition */}
            {watch.referenceNumber && (
              <p className="text-xs text-gray-400 mb-1">{watch.referenceNumber}</p>
            )}
            <p className="text-xs text-gray-500 mb-4">
              Condition: <span className="font-semibold text-[#1a1410]">{watch.condition}</span>
              {watch.conditionNote && ` | ${watch.conditionNote}`}
            </p>

            {/* Price */}
            <div className="mb-1">
              <span className=" text-3xl font-bold text-[#1a1410]">
                Php {watch.price.toLocaleString()}.00
              </span>
            </div>
            <p className="text-xs text-gray-400 mb-6">+ Shipping fee</p>

            {/* Stock */}
            <p className={`text-xs font-semibold mb-6 ${watch.stock > 0 ? "text-green-600" : "text-red-500"}`}>
              {watch.stock > 0 ? `${watch.stock} in stock` : "Out of stock"}
            </p>

            {/* Quantity + Buy */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={watch.stock === 0}
                className="flex-1 py-3.5 bg-[#e0b84a] hover:bg-[#C8A03C] text-black text-sm font-bold tracking-[2px] uppercase transition-colors border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {added ? "Added!" : "Buy"}
              </button>
              <button
                onClick={handleAddToCart}
                disabled={watch.stock === 0}
                className="w-14 py-3.5 border border-[#1a1410] text-[#1a1410] hover:bg-[#1a1410] hover:text-[#C8A03C] transition-colors flex items-center justify-center border-none cursor-pointer disabled:opacity-50"
                style={{ border: "1px solid #1a1410" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
              </button>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-sm font-bold text-[#1a1410] mb-4">Details</h3>
              <div className="flex flex-col gap-2.5">
                <SpecRow label="Brand" value={watch.brand} />
                <SpecRow label="Model No." value={watch.referenceNumber} />
                <SpecRow label="Category" value={watch.category} />
                <SpecRow label="Movement" value={watch.specifications?.movement} />
                <SpecRow label="Case" value={watch.specifications?.material} />
                <SpecRow label="Glass" value={watch.specifications?.crystal} />
                <SpecRow label="Water resistant" value={watch.specifications?.waterResistance} />
                <SpecRow label="Case diameter" value={watch.specifications?.caseDiameter} />
                <SpecRow label="Case thickness" value={watch.specifications?.caseThickness} />
                <SpecRow label="Condition" value={watch.condition} />
                <SpecRow label="Stock" value={`${watch.stock} pcs`} />
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#1a1410] mb-8">
              Our Recommendations for you
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendations.map(rec => (
                <RecommendCard key={rec._id} watch={rec} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}