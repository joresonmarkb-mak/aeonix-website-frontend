import { useState, useEffect } from "react";
import {getNewArrivals} from "../services/Api.js";
import Navbar from "../components/navbar.jsx";
import Footer from "../components/footer.jsx";
import TrustBar from "../components/trustBar.jsx";
import AuthModal from "./Authmodal.jsx";
import CategorySplit from "../components/categorySplit.jsx";
import Featuredarticle from "../components/Featuredarticle.jsx";
// ── Mock Data ──────────────────────────────────────────────


const collections = [
  { id: 1, name: "Men's Watches", image: "https://res.cloudinary.com/dp3iviwzj/image/upload/v1782254292/png_mens_foxkua.png" },
  { id: 2, name: "Dive Watches", image: "https://res.cloudinary.com/dp3iviwzj/image/upload/v1782254291/png_divers_aawqqw.png" },
  { id: 3, name: "Women's Watches", image: "https://res.cloudinary.com/dp3iviwzj/image/upload/v1782254291/Untitled-2_urd5tj.png" },
  { id: 4, name: "Unisex Watches", image: "https://res.cloudinary.com/dp3iviwzj/image/upload/v1782254296/Untitled-2_unisex_k9jae6.png" },
];
const carouselImages = [
  "https://res.cloudinary.com/dp3iviwzj/image/upload/v1788965217/cat_ax5keq.png",
  "https://res.cloudinary.com/dp3iviwzj/image/upload/v1789106203/The_emoji_we_have_4_ru3npd.png",
  "https://res.cloudinary.com/dp3iviwzj/image/upload/v1789106203/The_emoji_we_have_3_hrxaka.png",
  // add more transparent-background watch images here
];
 
// ── Hero ──────────────────────────────────────────────────
 function Hero({ onShopNow }) {
  const [activeIndex, setActiveIndex] = useState(0);
 
  useEffect(() => {
    if (carouselImages.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
 
  return (
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0a0a0a]">
     <div
        className="absolute inset-0 overflow-hidden"
        style={{
          backgroundImage:
            "url(https://res.cloudinary.com/dp3iviwzj/image/upload/v1788961817/image_31_w4tvfo.png)",
          backgroundSize: "100%",
          backgroundPosition: "",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/85 to-[#0a0a0a]/40" />

      {/* Two-column grid: text left, watches right */}
      <div className="relative max-w-[100rem] mx-auto px-[4%] w-full grid md:grid-cols-[55%_45%] gap-12 items-center">
        {/* Text column */}
        <div className="max-w-3xl">
          <h1 className="font-sans text-3xl sm:text-7xl lg:text-7xl text-[#f0ece4]  mb-6 font-bold leading-tight">
            Timeless elegance   <br/>   on your wrist
          </h1>  
          <p className="text-gray-400 text-xl leading-relaxed mb-8 max-w-xl">
            Discover the world of Timeless Elegance, where every timepiece
            tells a story of craftsmanship, heritage, and sophistication.
          </p>
          <button
            type="button"
            onClick={onShopNow}
            className="px-10 py-4 bg-[#C8A03C] hover:bg-[#e0b84a] text-black text-base font-bold transition-colors border-none cursor-pointer rounded-sm"
          >
            Discover Collection
          </button>
        </div>

        {/* Image column */}
        <div className="relative hidden md:flex items-center justify-center h-full">
          <div
            className="absolute w-[640px] h-[640px] rounded-full opacity-30 blur-3xl pointer-events-none"
            style={{
              background: "radial-gradient(circle, #C8A03C 0%, transparent 70%)",
            }}
          />

          {/* Clamped size: min 400px, scales at 65vw, caps at 820px */}
          <div className="relative z-10 w-[clamp(400px,65vw,820px)] h-[clamp(400px,65vw,920px)]">
            {carouselImages.map((src, i) => (
              <img
                key={src + i}
                src={src}
                alt={`Featured watches ${i + 1}`}
                className="absolute inset-0 w-full h-full object-contain transition-opacity duration-1000 ease-in-out"
                style={{ opacity: i === activeIndex ? 1 : 0 }}
              />
            ))}
          </div>

          {/* Carousel dots */}
          {carouselImages.length > 1 && (
            <div className="absolute -bottom-2 flex gap-2 z-10">
              {carouselImages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className={`h-1.5 rounded-full transition-all border-none cursor-pointer ${
                    i === activeIndex ? "w-6 bg-[#C8A03C]" : "w-1.5 bg-[#C8A03C]/30"
                  }`}
                  aria-label={`Show slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
     
 
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-gray-600 text-[10px] tracking-[3px] uppercase">
          Scroll
        </span>
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
    <section className="bg-[#0a0a0a] py-20 px-[5%]">
      <div className="max-w-8xl mx-auto">

        {/* Header + arrows */}
        <div className="flex items-center  justify-between mb-12">
          <div>
            <p className="text-[#C8A03C] text-[11px] tracking-[4px] uppercase mb-3">Just Landed</p>
            <h2 className="font-serif text-4xl text-white font-bold">New Arrivals</h2>
          </div>
          {!loading && watches.length > itemsPerPage && (
            <div className="flex gap-3">
              <button
                onClick={() => setCurrent(p => Math.max(p - 1, 0))}
                disabled={current === 0}
                className="w-10 h-10 border border-[#C8A03C] flex items-center justify-center disabled:opacity-30 hover:bg-[#1a1410] hover:text-[#C8A03C] text-[#C8A03C] transition-colors"
              >
                ‹
              </button>
              <button
                onClick={() => setCurrent(p => Math.min(p + 1, totalPages - 1))}
                disabled={current === totalPages - 1}
                className="w-10 h-10 border border-[#C8A03C] flex items-center justify-center disabled:opacity-30 hover:bg-[#1a1410] hover:text-[#C8A03C] text-[#C8A03C] transition-colors"
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
            <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6  ">
              {visible.map(watch => (
                <div key={watch._id} className="bg-white group cursor-pointer hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 ">
                  <div className="relative overflow-hidden aspect-square">
                    <img
                      src={watch.images?.[0]?.replace(/"/g, '') || "https://placehold.co/300x300?text=No+Image"}
                      alt={watch.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className={`absolute top-3 left-3 text-[10px] font-bold tracking-[1.5px] uppercase px-2.5 py-1 ${watch.condition === "Pre-owned" ? "bg-[#1a1410] text-[#C8A03C]" : "bg-[#C8A03C] text-black"}`}>
                      {watch.condition}
                    </span>
                  </div>
                  <div className="p-4 text-center ">
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
          <a href="/allwatches" className="inline-block px-10 py-3 border border-white text-white hover:bg-[#1a1410] hover:text-[#C8A03C] text-xs font-semibold tracking-[2px] uppercase transition-all no-underline">
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
        style={{ backgroundImage: "url(https://res.cloudinary.com/dp3iviwzj/image/upload/v1789173532/Group_15_ml8jdv.png)" }}
      />
      <div className="relative max-w-7xl mx-auto flex justify-start">
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
          <a href="/allwatches" className=" inline-block px-10 py-3.5 bg-black hover:bg-[#e0b84a] text-white text-xs font-bold tracking-[2px] uppercase transition-colors no-underline">
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

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5 ">
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
          <a href="/allwatches" className="inline-block px-11 py-3.5 bg-[#1a1410] hover:bg-yellow-400 text-white text-xs font-bold tracking-[2px] uppercase transition-colors no-underline">
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
  const [showAuth, setShowAuth] = useState(false);

  return (
    <div className="font-sans">
      <Navbar cartCount={2} />
      <Hero onShopNow={() => setShowAuth(true)} />
      <NewArrivals />
      <TrustBar />
      <CategorySplit />
      <StyleBudgetBanner />
      <Featuredarticle />
      <FindYourWatch />
      
      
      <Footer />
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  );
}