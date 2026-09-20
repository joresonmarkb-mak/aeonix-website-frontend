import { useState, useEffect } from "react";
import {getNewArrivals} from "../services/Api.js";
import Navbar from "../components/navbar.jsx";
import Footer from "../components/footer.jsx";
import TrustBar from "../components/trustBar.jsx";
import AuthModal from "./Authmodal.jsx";
import CategorySplit from "../components/categorySplit.jsx";
import Featuredarticle from "../components/Featuredarticle.jsx";
import EmailSubscription from "../components/EmailSubscription.jsx";
import ClientTestimonials from "../components/Clientestimonials.jsx";
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
      backgroundImage: "url(https://res.cloudinary.com/dp3iviwzj/image/upload/v1788961817/image_31_w4tvfo.png)",
      backgroundSize: "100%",
      backgroundPosition: "",
      backgroundRepeat: "no-repeat",
    }}
  />
  <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/85 to-[#0a0a0a]/40" />

  {/* Mobile — darker overlay so text is readable */}
  <div className="absolute inset-0 bg-[#0a0a0a]/60 md:hidden" />

  <div className="relative max-w-[100rem] mx-auto px-[4%] w-full grid md:grid-cols-[55%_45%] gap-12 items-center">
    
    {/* Text column */}
    <div className="max-w-3xl max-md:text-center max-md:flex max-md:flex-col max-md:items-center max-md:pt-24 max-md:pb-16">
      <h1 className="font-sans text-[#f0ece4] mb-6 leading-tight">
        <span className="text-[#FAD136] text-[clamp(2.5rem,8vw,10rem)] max-md:text-[clamp(5.2rem,10vw,3.5rem)] font-handwriting">
          Timeless Elegance
        </span>
        <br />
        <div className="mt-[-3rem] max-md:mt-[-1.5rem] font-sanss text-[clamp(2.5rem,4vw,6rem)] max-md:text-[clamp(1.5rem,7vw,2.5rem)]">
          ON YOUR WRIST
        </div>
      </h1>
      <p className="text-gray-400 text-xl max-md:text-sm leading-relaxed mb-8 max-w-xl max-md:max-w-xs font-sanss">
        Discover the world of Timeless Elegance, where every timepiece
        tells a story of craftsmanship, heritage, and sophistication.
      </p>
      <button
        type="button"
        onClick={onShopNow}
        className="px-10 py-4 max-md:px-7 max-md:py-3 bg-[#FAD136] font-sanss hover:bg-[#e0b84a] text-black text-base max-md:text-sm font-bold transition-colors border-none cursor-pointer rounded-sm"
      >
        Discover Collection
      </button>

      {/* Mobile carousel — shown only on mobile */}
      <div className="md:hidden mt-8 relative w-full flex items-center justify-center">
        <div className="relative w-[clamp(220px,70vw,340px)] h-[clamp(220px,70vw,340px)]">
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
        {carouselImages.length > 1 && (
          <div className="absolute -bottom-4 flex gap-2">
            {carouselImages.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={`h-1.5 rounded-full transition-all border-none cursor-pointer ${
                  i === activeIndex ? "w-6 bg-[#C8A03C]" : "w-1.5 bg-[#C8A03C]/30"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>

    {/* Desktop image column — unchanged */}
    <div className="relative hidden md:flex items-center justify-center h-full">
      <div
        className="absolute w-[640px] h-[640px] rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #C8A03C 0%, transparent 70%)" }}
      />
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
            />
          ))}
        </div>
      )}
    </div>
  </div>

  {/* Scroll indicator */}
  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 max-md:hidden">
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
    <section className="bg-[#0a0a0a] py-20 px-[5%]">
      <div className="max-w-8xl mx-auto">

        {/* Header + arrows */}
        <div className="flex items-center  justify-between mb-12">
          <div>
            <p className="text-[#C8A03C] text-[11px] tracking-[4px] uppercase mb-3">Just Landed</p>
            <h2 className="font-sanss text-4xl text-white font-bold">New Arrivals</h2>
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
            <div className=" grid grid-cols-1 max-sm:grid-cols-2 lg:grid-cols-4 gap-6  ">
              {visible.map(watch => (
                <div key={watch._id} className="bg-[#211C0A] group cursor-pointer hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 ">
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
                  <div className="p-4 text-center  font-sanss ">
                    <p className="text-gray-400 text-[clamp(10px,1.5vw,11px)] tracking-[2px] uppercase mb-1">{watch.brand}</p>
                    <p className="text-[clamp(10px,1.5vw,17px)] text-white font-bold mb-2">{watch.name}</p>
                    <p className="text-[#C8A03C] text-[clamp(10px,1.5vw,17px)]  font-bold">₱{watch.price.toLocaleString()}</p>
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
    <section className=" font-sanss relative py-30 px-[5%] bg-[#1a1410] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center  "
        style={{ backgroundImage: "url(https://res.cloudinary.com/dp3iviwzj/image/upload/v1789173532/Group_15_ml8jdv.png)" }}
      />
      <div className="relative max-w-7xl mx-auto flex justify-start">
        <div className="max-w-lg">
          <p className="text-yellow-400 text-[11px] tracking-[4px] uppercase mb-4">For Every Budget</p>
          <h2 className=" text-xl md:text-6xl text-[#f0ece4]  leading-tight mb-5">
            <div className="inline-block font-bold ">WATCH FOR</div><br /><div className="inline-block text-[#C8A03C]">OCCASION</div>
          </h2>
          <p className="text-white text-base leading-relaxed mb-8">
            Discover the world of Timeless Elegance, where every timepiece tells a story of craftsmanship, heritage, and sophistication.
          </p>
         
          <a href="/allwatches" className=" border p-5 border-white hover:bg-[#e0b84a] text-white text-xs font-bold tracking-[2px] uppercase transition-colors no-underline">
            Explore Our Collection
          </a>
        </div>
      </div>
    </section>
  );
}


// ── Seiko 5 Feature ───────────────────────────────────────






// ── Page ──────────────────────────────────────────────────
export default function Home() {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <div className="font-sans">
      <Navbar cartCount={2} />
      <Hero onShopNow={() => setShowAuth(true)} />
      <NewArrivals />
      <CategorySplit />
      <TrustBar />
      <ClientTestimonials/>
       <StyleBudgetBanner />
       <Featuredarticle />
      <EmailSubscription />
     
      
      
      <Footer />
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  );
}