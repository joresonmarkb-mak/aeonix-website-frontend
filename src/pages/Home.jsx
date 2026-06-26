import { useState, useEffect } from "react";
import {getNewArrivals} from "../services/Api.js";
import Footer from "../components/footer.jsx";
import Navbar from "../components/navbar.jsx";
import TrustBar from "../components/trustBar.jsx";
// ── Mock Data ──────────────────────────────────────────────


const collections = [
  { id: 1, name: "Men's Watches", image: "https://res.cloudinary.com/dp3iviwzj/image/upload/v1782275334/c46b6ab7-4a2a-4ec6-a882-c2bcda2ab99a_rbpoax.jpg" },
  { id: 2, name: "Dive Watches", image: "https://res.cloudinary.com/dp3iviwzj/image/upload/v1782275334/3fa0ed44-17a4-456d-92d5-a45c4ec6b0de_ncsjkr.jpg" },
  { id: 3, name: "Women's Watches", image: "https://res.cloudinary.com/dp3iviwzj/image/upload/v1782275334/e98c93fe-aad8-4a88-b6ac-e041248b0052_v504ye.jpg" },
  { id: 4, name: "Unisex Watches", image: "https://res.cloudinary.com/dp3iviwzj/image/upload/v1782275334/ee6b8355-d71f-4570-89e8-c6c275eb83e3_hd7bdf.jpg" },
];







// ── Hero ──────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0a0a0a]">
     <div
  className="absolute inset-0 overflow-hidden"
  style={{
    backgroundImage:
      "url(https://res.cloudinary.com/dp3iviwzj/image/upload/v1782254292/Untitled_Facebook_Cover_rt2bo3.png)",
    backgroundSize: "130%",
    backgroundPosition: "right 120% bottom 80%",
    backgroundRepeat: "no-repeat",
  }}
/>
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/95 via-[#0a0a0a]/70 to-[#0a0a0a]/20" />

      <div className="relative max-w-7xl mx-auto px-[5%] w-full">
        <div className="max-w-xl">
          <p className="text-[#C8A03C] text-[11px] tracking-[4px] uppercase mb-5">
            Est. 2024 · Urdaneta, Pangasinan
          </p>
          <h1 className="font-serif text-4xl md:text-6xl  text-[#f0ece4] leading-tight mb-6">
            Timeless Elegance<br />
            <span className="text-[#C8A03C]">on Your Wrist</span>
          </h1>
          <p className="text-gray-400 text-base leading-relaxed mb-10 max-w-md">
            Discover the world of Timeless Elegance, where every timepiece tells a story of craftsmanship, heritage, and sophistication.
          </p>
          <div className="flex gap-4 flex-wrap">
            <a href="#" className="px-9 py-3.5 bg-[#C8A03C] hover:bg-[#e0b84a] text-black text-xs font-bold tracking-[2px] uppercase transition-colors no-underline">
              Shop Now
            </a>
            <a href="#" className="px-9 py-3.5 border border-[#C8A03C]/40 text-[#C8A03C] hover:border-[#C8A03C] text-xs font-semibold tracking-[2px] uppercase transition-colors no-underline">
              View Catalog
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-gray-600 text-[10px] tracking-[3px] uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-[#C8A03C] to-transparent" />
      </div>
    </section>
  );
}


// ── New Arrivals ──────────────────────────────────────────
function NewArrivals() {
  const [watches, setWatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    getNewArrivals()
      .then(res => setWatches(res.data.products))
      .catch(() => setError("Failed to load new arrivals."))
      .finally(() => setLoading(false));
  }, []);

  const itemsPerPage = 4;
  const totalPages = Math.ceil(watches.length / itemsPerPage);
  const visible = watches.slice(current * itemsPerPage, current * itemsPerPage + itemsPerPage);

  return (
    <section className="bg-[#f7f4ef] py-20 px-[5%]">
      <div className="max-w-7xl mx-auto">

        {/* Header + arrows */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-[#C8A03C] text-[11px] tracking-[4px] uppercase mb-3">Just Landed</p>
            <h2 className="font-serif text-4xl text-[#1a1410] font-bold">New Arrivals</h2>
          </div>
          {!loading && watches.length > itemsPerPage && (
            <div className="flex gap-3">
              <button
                onClick={() => setCurrent(p => Math.max(p - 1, 0))}
                disabled={current === 0}
                className="w-10 h-10 border border-[#1a1410] flex items-center justify-center disabled:opacity-30 hover:bg-[#1a1410] hover:text-[#C8A03C] transition-colors"
              >
                ‹
              </button>
              <button
                onClick={() => setCurrent(p => Math.min(p + 1, totalPages - 1))}
                disabled={current === totalPages - 1}
                className="w-10 h-10 border border-[#1a1410] flex items-center justify-center disabled:opacity-30 hover:bg-[#1a1410] hover:text-[#C8A03C] transition-colors"
              >
                ›
              </button>
            </div>
          )}
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white animate-pulse">
                <div className="aspect-square bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-center text-red-400 text-sm">{error}</p>}

        {/* Cards */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {visible.map(watch => (
                <div key={watch._id} className="bg-white group cursor-pointer hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300">
                  <div className="relative overflow-hidden aspect-square">
                    <img
                      src={watch.image?.[0]?.replace(/"/g, '') || "https://placehold.co/300x300?text=No+Image"}
                      alt={watch.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className={`absolute top-3 left-3 text-[10px] font-bold tracking-[1.5px] uppercase px-2.5 py-1 ${watch.condition === "Pre-owned" ? "bg-[#1a1410] text-[#C8A03C]" : "bg-[#C8A03C] text-black"}`}>
                      {watch.condition}
                    </span>
                  </div>
                  <div className="p-4 text-center">
                    <p className="text-gray-400 text-[11px] tracking-[2px] uppercase mb-1">{watch.brand}</p>
                    <p className="text-base text-[#1a1410] font-bold mb-2">{watch.name}</p>
                    <p className="text-[#C8A03C] text-base font-bold">₱{watch.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Dot indicators */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-[#C8A03C] w-6" : "bg-gray-300"}`}
                  />
                ))}
              </div>
            )}
          </>
        )}

        <div className="text-center mt-12">
          <a href="/watches" className="inline-block px-10 py-3 border border-[#1a1410] text-[#1a1410] hover:bg-[#1a1410] hover:text-[#C8A03C] text-xs font-semibold tracking-[2px] uppercase transition-all no-underline">
            View All Watches
          </a>
        </div>
      </div>
    </section>
  );
}
// ── Style Budget Banner ───────────────────────────────────
function StyleBudgetBanner() {
  return (
    <section className="relative py-24 px-[5%] bg-[#1a1410] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center "
        style={{ backgroundImage: "url(https://res.cloudinary.com/dp3iviwzj/image/upload/v1782254291/product-pc_top_SPB121J1__75373_jymsen.jpg)" }}
      />
      <div className="relative max-w-7xl mx-auto flex justify-end">
        <div className="max-w-lg">
          <p className="text-yellow-400 text-[11px] tracking-[4px] uppercase mb-4">For Every Budget</p>
          <h2 className="font-serif text-5xl md:text-6xl text-[#f0ece4]  leading-tight mb-5">
            Style That Fits<br />Your Budget
          </h2>
          <p className="text-white text-base leading-relaxed mb-8">
            Carefully selected watches designed to elevate your everyday look without compromising your budget.
          </p>
          <div className="flex items-center gap-2 mb-8">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => <span key={i} className="text-yellow-400 text-xl">★</span>)}
            </div>
            <span className="text-white text-sm ml-2">4.9 · 120+ reviews</span>
          </div>
          <a href="#" className=" inline-block px-10 py-3.5 bg-black hover:bg-[#e0b84a] text-white text-xs font-bold tracking-[2px] uppercase transition-colors no-underline">
            Explore Our Collection
          </a>
        </div>
      </div>
    </section>
  );
}

// ── Seiko 5 Feature ───────────────────────────────────────

function FeatureCard({ feature }) {
  return (
    <div className="py-4">
      <span className="font-serif text-4xl text-[#C8A03C]/20 font-bold block mb-2">{feature.num}</span>
      <h3 className="text-[#f0ece4] text-xs font-bold tracking-wide mb-2">{feature.title}</h3>
      <p className="text-gray-500 text-xs leading-relaxed">{feature.desc}</p>
    </div>
  );
}

// ── Find Your Watch ───────────────────────────────────────
function FindYourWatch() {
  return (
    <section className="bg-[#f7f4ef] py-20 px-[5%] ">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#C8A03C] text-[11px] tracking-[4px] uppercase mb-3">Browse by Style</p>
          <h2 className="font-serif text-4xl text-[#1a1410] font-bold">Find Your Perfect Watch</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 ">
          {collections.map(col => (
            <a key={col.id} href="#" className="relative overflow-hidden aspect-[4/3] block group no-underline">
              <img
                src={col.image}
                alt={col.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/85 to-transparent" />
              <span className="absolute bottom-5 left-5 text-bold text-lg font-semibold text-[#f0ece4] text-sm">{col.name}</span>
            </a>
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="#" className="inline-block px-11 py-3.5 bg-[#1a1410] hover:bg-yellow-400 text-white text-xs font-bold tracking-[2px] uppercase transition-colors no-underline">
            Explore All Collections
          </a>
        </div>
      </div>
    </section>
  );
}





// ── Footer ────────────────────────────────────────────────


// ── Page ──────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="font-sans">
      <Navbar cartCount={2} />
      <Hero />
      <NewArrivals />
      <StyleBudgetBanner />
      <FindYourWatch />
     
      <TrustBar />
      <Footer />
    </div>
  );
}